import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync, allAsync } from '../db.js';
import { HF_TOKEN } from '../config/hf.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

const router = express.Router();

// دریافت کاتالوگ پیش‌فرض
router.get('/catalog', async (req, res) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const catalogPath = path.join(__dirname, '../catalog/default.json');
    const catalogContent = await fs.readFile(catalogPath, 'utf-8');
    const catalog = JSON.parse(catalogContent);
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// دریافت وضعیت دانلود
router.get('/status/:jobId', async (req, res) => {
  try {
    const job = await getAsync(
      'SELECT * FROM jobs WHERE id = ?',
      [req.params.jobId]
    );

    if (!job) {
      return res.status(404).json({ error: 'کار پیدا نشد' });
    }

    const assets = await allAsync(
      'SELECT * FROM assets WHERE id LIKE ? ORDER BY updated_at DESC',
      [`${req.params.jobId}%`]
    );

    res.json({
      job,
      assets
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// شروع دانلود
router.post('/start', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'موارد دانلود تعیین نشده‌اند' });
    }

    // دریافت storage_root
    const storageRow = await getAsync(
      'SELECT value FROM settings WHERE key = ?',
      ['storage_root']
    );

    if (!storageRow) {
      return res.status(400).json({ error: 'ابتدا مسیر ذخیره‌سازی را تعریف کنید' });
    }

    const storageRoot = storageRow.value;
    const jobId = uuidv4();

    // ایجاد کار
    await runAsync(
      `INSERT INTO jobs (id, kind, status, message, progress, started_at)
       VALUES (?, 'download', 'running', 'دانلود شروع شد', 0, CURRENT_TIMESTAMP)`,
      [jobId]
    );

    // ایجاد دایرکتوری ذخیره‌سازی
    await fs.mkdir(storageRoot, { recursive: true });

    // ایجاد دارایی‌ها
    for (const item of items) {
      const assetId = `${jobId}-${item.model_id}-${item.file}`;
      await runAsync(
        `INSERT INTO assets (id, kind, model_id, file_name, source_url, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`,
        [assetId, item.type || 'model', item.model_id, item.file, item.url]
      );
    }

    // شروع دانلود بدون انتظار
    downloadAssets(jobId, items, storageRoot).catch(err => {
      console.error('خطا در دانلود:', err);
    });

    res.json({
      jobId,
      message: 'دانلود شروع شد'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint برای بررسی دیتابیس
router.get('/debug/assets', async (req, res) => {
  try {
    const allAssets = await allAsync('assets', {});
    res.json({
      count: allAssets.length,
      assets: allAssets
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint برای اضافه کردن دیتاست‌ها
router.post('/add-datasets', async (req, res) => {
  try {
    const { getAsync, runAsync } = await import('../db.js');

    const datasets = [
      {
        model_id: 'fartail',
        kind: 'dataset',
        file_name: 'FarsTail Dataset',
        description: 'مجموعه داده استنتاج زبان طبیعی فارسی با ۱۰,۳۶۷ نمونه',
        source_url: 'https://huggingface.co/datasets/HooshvareLab/fartail/resolve/main/train.json',
        status: 'ready',
        bytes_total: 25000000,
        local_path: '/datasets/fartail'
      },
      {
        model_id: 'persian-news',
        kind: 'dataset',
        file_name: 'Persian News Dataset',
        description: 'مجموعه داده اخبار فارسی برای آموزش مدل‌های زبانی',
        source_url: 'https://huggingface.co/datasets/HooshvareLab/persian-news/resolve/main/train.json',
        status: 'ready',
        bytes_total: 150000000,
        local_path: '/datasets/persian-news'
      },
      {
        model_id: 'persian-sentiment',
        kind: 'dataset',
        file_name: 'Persian Sentiment Dataset',
        description: 'مجموعه داده تحلیل احساسات فارسی',
        source_url: 'https://huggingface.co/datasets/HooshvareLab/persian-sentiment/resolve/main/train.json',
        status: 'ready',
        bytes_total: 50000000,
        local_path: '/datasets/persian-sentiment'
      }
    ];

    for (const dataset of datasets) {
      const existing = await getAsync('assets', { model_id: dataset.model_id, kind: 'dataset' });
      if (!existing) {
        await runAsync('assets', 'INSERT', dataset);
        console.log(`✅ Dataset added: ${dataset.file_name}`);
      }
    }

    res.json({ success: true, message: 'Datasets added successfully' });
  } catch (error) {
    console.error('Add datasets error:', error);
    res.status(500).json({ error: error.message });
  }
});

// دانلود مستقیم مدل
router.get('/model/:modelId', async (req, res) => {
  try {
    const { modelId } = req.params;
    console.log('Looking for model:', modelId);

    // پیدا کردن مدل در دیتابیس
    const model = await getAsync('assets', { model_id: modelId, kind: 'model' });
    console.log('Found model:', model);

    if (!model) {
      return res.status(404).json({ error: 'مدل یافت نشد' });
    }

    // اگر مدل در سیستم فایل موجود است، آن را ارسال کن
    if (model.local_path && await fs.access(model.local_path).then(() => true).catch(() => false)) {
      return res.download(model.local_path, model.file_name);
    }

    // اگر مدل موجود نیست، لینک دانلود را برگردان
    res.json({
      downloadUrl: model.source_url,
      fileName: model.file_name,
      size: model.bytes_total,
      message: 'برای دانلود مدل، از لینک زیر استفاده کنید'
    });
  } catch (error) {
    console.error('Download model error:', error);
    res.status(500).json({ error: error.message });
  }
});

// دانلود مستقیم دیتاست
router.get('/dataset/:datasetId', async (req, res) => {
  try {
    const { datasetId } = req.params;
    console.log('Looking for dataset:', datasetId);

    // ابتدا در دیتابیس جستجو کن
    const dataset = await getAsync('assets', { model_id: datasetId, kind: 'dataset' });
    console.log('Found dataset in DB:', dataset);

    if (dataset) {
      // اگر دیتاست در سیستم فایل موجود است، آن را ارسال کن
      if (dataset.local_path && await fs.access(dataset.local_path).then(() => true).catch(() => false)) {
        return res.download(dataset.local_path, dataset.file_name);
      }

      // اگر دیتاست موجود نیست، لینک دانلود را برگردان
      return res.json({
        downloadUrl: dataset.source_url,
        fileName: dataset.file_name,
        size: dataset.bytes_total,
        description: dataset.description,
        message: 'برای دانلود دیتاست، از لینک زیر استفاده کنید'
      });
    }

    // اگر در دیتابیس موجود نیست، دیتاست‌های پیش‌فرض را بررسی کن
    const predefinedDatasets = {
      // ===== LEGAL QA (پرسش و پاسخ حقوقی) =====
      'legal-qa': {
        id: 'legal-qa',
        name: 'Iran Legal Persian QA',
        nameFA: 'پرسش و پاسخ حقوقی ایران',
        downloadUrl: 'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_1.jsonl',
        alternativeUrls: [
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_2.jsonl',
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_3.jsonl',
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_4.jsonl',
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_5.jsonl',
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_6.jsonl',
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_7.jsonl',
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_8.jsonl',
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_9.jsonl',
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_10.jsonl',
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_11.jsonl',
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_12.jsonl',
          'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa/resolve/main/train_13.jsonl'
        ],
        viewUrl: 'https://huggingface.co/datasets/PerSets/iran-legal-persian-qa',
        fileName: 'iran-legal-qa.jsonl',
        size: '~50MB (per file)',
        sizeBytes: 52428800,
        format: 'JSONL',
        description: 'Iranian legal question-answering dataset with 13 parts',
        descriptionFA: 'مجموعه پرسش و پاسخ حقوقی ایران با ۱۳ بخش',
        source: 'PerSets',
        details: {
          files: 13,
          type: 'Legal QA',
          language: 'Persian'
        },
        message: 'مجموعه پرسش و پاسخ حقوقی ایران - ۱۳ فایل جداگانه'
      },

      // ===== LEGAL FAQ =====
      'legal-faq': {
        id: 'legal-faq',
        name: 'Iran Legal FAQ Dataset',
        nameFA: 'سؤالات متداول حقوقی ایران',
        downloadUrl: 'https://huggingface.co/datasets/sasanbarok/iran-legal-Faq-dataset/resolve/main/iran-legal-Faq-dataset.json',
        viewUrl: 'https://huggingface.co/datasets/sasanbarok/iran-legal-Faq-dataset',
        fileName: 'iran-legal-faq.json',
        size: '~5MB',
        sizeBytes: 5242880,
        format: 'JSON',
        description: 'Frequently asked legal questions in Persian',
        descriptionFA: 'سؤالات متداول حقوقی به زبان فارسی',
        source: 'sasanbarok',
        details: {
          type: 'FAQ',
          domain: 'Legal'
        },
        message: 'مجموعه سؤالات متداول حقوقی ایران'
      },

      // ===== PERSIAN NER =====
      'persian-ner-500k': {
        id: 'persian-ner-500k',
        name: 'Persian NER Dataset 500k',
        nameFA: 'شناسایی موجودیت‌های نام‌دار فارسی ۵۰۰ هزار',
        downloadUrl: 'https://huggingface.co/datasets/mansoorhamidzadeh/Persian-NER-Dataset-500k/resolve/main/data/train-00000-of-00001.parquet',
        alternativeUrls: [
          'https://huggingface.co/datasets/mansoorhamidzadeh/Persian-NER-Dataset-500k/resolve/main/data/validation-00000-of-00001.parquet',
          'https://huggingface.co/datasets/mansoorhamidzadeh/Persian-NER-Dataset-500k/resolve/main/data/test-00000-of-00001.parquet'
        ],
        viewUrl: 'https://huggingface.co/datasets/mansoorhamidzadeh/Persian-NER-Dataset-500k',
        fileName: 'persian-ner-500k.parquet',
        size: '~200MB',
        sizeBytes: 209715200,
        format: 'Parquet',
        description: 'Large Persian Named Entity Recognition dataset with 500k samples',
        descriptionFA: 'مجموعه بزرگ شناسایی موجودیت‌های نام‌دار فارسی با ۵۰۰ هزار نمونه',
        source: 'mansoorhamidzadeh',
        details: {
          samples: '500,000',
          splits: 'train, validation, test',
          entities: ['Person', 'Location', 'Organization', 'Date']
        },
        message: 'مجموعه شناسایی موجودیت‌های نام‌دار فارسی - 500K نمونه'
      },

      // ===== PERSIAN GENERAL CORPUS =====
      'persian-corpus-normalized': {
        id: 'persian-corpus-normalized',
        name: 'Persian General Corpus (Normalized)',
        nameFA: 'مجموعه متن عمومی فارسی (نرمال‌شده)',
        downloadUrl: 'https://huggingface.co/datasets/ali619/corpus-dataset-normalized-for-persian-farsi/resolve/main/data/train-00000-of-00005.parquet',
        alternativeUrls: [
          'https://huggingface.co/datasets/ali619/corpus-dataset-normalized-for-persian-farsi/resolve/main/data/train-00001-of-00005.parquet',
          'https://huggingface.co/datasets/ali619/corpus-dataset-normalized-for-persian-farsi/resolve/main/data/train-00002-of-00005.parquet',
          'https://huggingface.co/datasets/ali619/corpus-dataset-normalized-for-persian-farsi/resolve/main/data/train-00003-of-00005.parquet',
          'https://huggingface.co/datasets/ali619/corpus-dataset-normalized-for-persian-farsi/resolve/main/data/train-00004-of-00005.parquet'
        ],
        viewUrl: 'https://huggingface.co/datasets/ali619/corpus-dataset-normalized-for-persian-farsi',
        fileName: 'persian-corpus-normalized.parquet',
        size: '~850MB (total)',
        sizeBytes: 891289600,
        format: 'Parquet',
        description: 'Normalized Persian general text corpus with 5 parts',
        descriptionFA: 'مجموعه متن عمومی فارسی نرمال‌شده با ۵ بخش',
        source: 'ali619',
        details: {
          files: 5,
          samples: '385,000+',
          normalized: true
        },
        message: 'مجموعه متن عمومی فارسی نرمال‌شده - 5 فایل'
      },

      // ===== SYNTHETIC QA =====
      'synthetic-qa-law': {
        id: 'synthetic-qa-law',
        name: 'Persian Synthetic QA (Law)',
        nameFA: 'پرسش و پاسخ مصنوعی فارسی (حقوقی)',
        downloadUrl: 'https://huggingface.co/datasets/ParsBench/PersianSyntheticQA/resolve/main/Law/train-00000-of-00001.parquet',
        viewUrl: 'https://huggingface.co/datasets/ParsBench/PersianSyntheticQA',
        fileName: 'persian-synthetic-qa-law.parquet',
        size: '~45MB',
        sizeBytes: 47185920,
        format: 'Parquet',
        description: 'Synthetic Persian question-answer pairs for legal domain',
        descriptionFA: 'جفت پرسش و پاسخ مصنوعی فارسی برای حوزه حقوقی',
        source: 'ParsBench',
        details: {
          samples: '100,000',
          domain: 'Legal',
          generated: 'GPT-4'
        },
        message: 'مجموعه پرسش و پاسخ مصنوعی فارسی - حوزه حقوقی'
      },

      'poetry-fa': {
        id: 'poetry-fa',
        name: 'Ganjoor Persian Poetry',
        nameFA: 'مجموعه اشعار گنجور',
        downloadUrl: null, // No direct download available
        viewUrl: 'https://ganjoor.net',
        alternativeUrl: 'https://github.com/ganjoor/ganjoor',
        fileName: 'ganjoor-poetry.json',
        size: '~50MB',
        sizeBytes: 52428800,
        format: 'JSON',
        description: 'Complete collection of classical Persian poetry from Ganjoor project',
        descriptionFA: 'مجموعه کامل اشعار کلاسیک فارسی از پروژه گنجور',
        source: 'Ganjoor Project',
        details: {
          verses: '693,000+',
          poets: 74,
          timespan: '10+ centuries',
          categories: ['Epic', 'Mystical', 'Lyric', 'Quatrain']
        },
        message: 'مجموعه شعر فارسی گنجور - بیش از 693,000 بیت از 74 شاعر کلاسیک',
        instructions: 'برای دانلود این دیتاست، به وب‌سایت گنجور مراجعه کنید یا از GitHub repository استفاده کنید.'
      },
      'sentiment-fa': {
        id: 'sentiment-fa',
        name: 'Persian Sentiment Analysis',
        nameFA: 'تحلیل احساسات فارسی',
        downloadUrl: 'https://github.com/persiannlp/parsinlu/raw/main/datasets/sentiment/train.csv',
        viewUrl: 'https://github.com/persiannlp/parsinlu',
        fileName: 'persian-sentiment.csv',
        size: '~15MB',
        sizeBytes: 15728640,
        format: 'CSV',
        description: 'Persian sentiment analysis dataset with movie reviews',
        descriptionFA: 'مجموعه داده تحلیل احساسات با نقد فیلم‌های فارسی',
        source: 'PersianNLP',
        details: {
          samples: '25,000+',
          labels: 7,
          categories: ['very negative', 'negative', 'neutral', 'positive', 'very positive', 'mixed', 'no sentiment']
        },
        message: 'مجموعه تحلیل احساسات فارسی - 25,000+ نمونه نقد فیلم'
      },
      'qa-fa': {
        id: 'qa-fa',
        name: 'PersianQA Dataset',
        nameFA: 'مجموعه پرسش و پاسخ فارسی',
        downloadUrl: 'https://github.com/sajjjadayobi/PersianQA/raw/main/dataset/pqa_train.json',
        testUrl: 'https://github.com/sajjjadayobi/PersianQA/raw/main/dataset/pqa_test.json',
        viewUrl: 'https://github.com/sajjjadayobi/PersianQA',
        fileName: 'persian-qa.json',
        size: '~5MB',
        sizeBytes: 5242880,
        format: 'JSON',
        description: 'Reading comprehension dataset based on Persian Wikipedia',
        descriptionFA: 'مجموعه درک مطلب بر اساس ویکی‌پدیای فارسی',
        source: 'PersianQA',
        details: {
          samples: '9,000+',
          testSamples: 900,
          type: 'SQuAD-style',
          categories: ['History', 'Religion', 'Geography', 'Science']
        },
        message: 'مجموعه پرسش و پاسخ فارسی - 9,000+ نمونه درک مطلب'
      },
      'translation-fa': {
        id: 'translation-fa',
        name: 'ParsiNLU Translation',
        nameFA: 'ترجمه انگلیسی-فارسی',
        downloadUrl: 'https://huggingface.co/datasets/persiannlp/parsinlu_translation_en_fa/resolve/main/data/train.jsonl',
        viewUrl: 'https://huggingface.co/datasets/persiannlp/parsinlu_translation_en_fa',
        fileName: 'en-fa-translation.jsonl',
        size: '~280MB',
        sizeBytes: 293601280,
        format: 'JSONL',
        description: 'English-Persian translation pairs from multiple sources',
        descriptionFA: 'جفت جملات ترجمه انگلیسی-فارسی از منابع مختلف',
        source: 'ParsiNLU',
        details: {
          pairs: '1,621,666',
          devSet: '2,138',
          testSet: '48,360',
          sources: ['Mizan', 'TEP', 'Bible']
        },
        message: 'مجموعه ترجمه انگلیسی-فارسی - 1.6M+ جفت جمله'
      },
      'ner-fa': {
        id: 'ner-fa',
        name: 'Persian NER Dataset',
        nameFA: 'شناسایی موجودیت‌های نام‌دار فارسی',
        downloadUrl: 'https://raw.githubusercontent.com/HaniehP/PersianNER/master/Persian-NER-part1.txt',
        viewUrl: 'https://github.com/HaniehP/PersianNER',
        fileName: 'persian-ner.txt',
        size: '~2MB',
        sizeBytes: 2097152,
        format: 'TXT (CoNLL)',
        description: 'Named Entity Recognition dataset for Persian',
        descriptionFA: 'مجموعه داده برای شناسایی اسامی خاص در متن فارسی',
        source: 'PersianNER',
        details: {
          tokens: '250,000+',
          entities: ['Person', 'Location', 'Organization', 'Date', 'Time', 'Money', 'Percent'],
          format: 'CoNLL-2003'
        },
        message: 'مجموعه شناسایی موجودیت‌های نام‌دار فارسی - 250K+ توکن'
      },
      'wiki-fa': {
        id: 'wiki-fa',
        name: 'Wikipedia Persian',
        nameFA: 'ویکی‌پدیای فارسی',
        downloadUrl: 'https://huggingface.co/datasets/wikipedia/resolve/main/20220301.fa/train/00000.parquet',
        viewUrl: 'https://huggingface.co/datasets/wikipedia',
        fileName: 'wikipedia-fa.parquet',
        size: '4.5GB',
        sizeBytes: 4831838208,
        format: 'Parquet',
        description: 'Wikipedia Persian Articles',
        descriptionFA: 'مقالات ویکی‌پدیای فارسی',
        source: 'Wikipedia',
        details: {
          articles: '1.2M+',
          categories: 'All topics'
        },
        message: 'مقالات ویکی‌پدیای فارسی - 1.2M+ مقاله'
      },
      'news-fa': {
        id: 'news-fa',
        name: 'Persian News Corpus',
        nameFA: 'مجموعه اخبار فارسی',
        downloadUrl: 'https://raw.githubusercontent.com/hooshvare/parsinlu/main/datasets/news/train.json',
        viewUrl: 'https://github.com/hooshvare/parsinlu',
        fileName: 'persian-news.json',
        size: '2.1GB',
        sizeBytes: 2254850048,
        format: 'JSON',
        description: 'Persian News Corpus',
        descriptionFA: 'مجموعه اخبار فارسی',
        source: 'HooshvareLab',
        details: {
          articles: '800K+',
          categories: ['Politics', 'Sports', 'Economy', 'Culture']
        },
        message: 'مجموعه اخبار فارسی - 800K+ مقاله'
      },
      'farsim-fa': {
        id: 'farsim-fa',
        name: 'FarSSiM Dataset',
        nameFA: 'مجموعه شباهت متنی فارسی',
        downloadUrl: 'https://raw.githubusercontent.com/persiannlp/farsim/main/data/train.json',
        viewUrl: 'https://github.com/persiannlp/farsim',
        fileName: 'farsim.json',
        size: '~5MB',
        sizeBytes: 5242880,
        format: 'JSON',
        description: 'Persian textual similarity dataset with 1,123 sentence pairs',
        descriptionFA: 'مجموعه شباهت متنی فارسی با ۱۱۲۳ جفت جمله',
        source: 'FarSSiM',
        details: {
          pairs: '1,123',
          type: 'Textual Similarity',
          source: 'Twitter',
          labels: 'Semantic similarity and inference relations'
        },
        message: 'مجموعه شباهت متنی فارسی - ۱۱۲۳ جفت جمله از توییتر'
      },
      'stance-fa': {
        id: 'stance-fa',
        name: 'Persian Stance Detection',
        nameFA: 'تشخیص موضع‌گیری فارسی',
        downloadUrl: 'https://raw.githubusercontent.com/persiannlp/stance-detection/main/data/train.json',
        viewUrl: 'https://github.com/persiannlp/stance-detection',
        fileName: 'persian-stance.json',
        size: '~3MB',
        sizeBytes: 3145728,
        format: 'JSON',
        description: 'Persian stance detection dataset for opinion mining',
        descriptionFA: 'مجموعه تشخیص موضع‌گیری فارسی برای استخراج نظرات',
        source: 'PersianNLP',
        details: {
          samples: '5,000+',
          labels: ['Favor', 'Against', 'Neutral'],
          domains: ['Politics', 'Social', 'Economic']
        },
        message: 'مجموعه تشخیص موضع‌گیری فارسی - 5,000+ نمونه'
      },
      'persian-qa': {
        id: 'persian-qa',
        name: 'Persian QA Dataset',
        nameFA: 'پرسش و پاسخ فارسی',
        downloadUrl: null, // No direct download available
        viewUrl: 'https://huggingface.co/datasets/kakooch/persian-poetry-qa',
        alternativeUrl: 'https://github.com/kakooch/persian-poetry-qa',
        fileName: 'persian-qa.json',
        size: '~3MB',
        sizeBytes: 3145728,
        format: 'JSON',
        description: 'Persian Question Answering dataset with 1.37M samples',
        descriptionFA: 'مجموعه پرسش و پاسخ فارسی با 1.37 میلیون نمونه',
        source: 'Hugging Face',
        details: {
          samples: '1,370,000+',
          type: 'Question Answering',
          source: 'Persian Poetry',
          format: 'JSON'
        },
        message: 'مجموعه پرسش و پاسخ فارسی - 1.37M نمونه',
        instructions: 'برای دانلود این دیتاست، به Hugging Face یا GitHub repository مراجعه کنید.'
      },
      'sentiment-analysis': {
        id: 'sentiment-analysis',
        name: 'Persian Sentiment Analysis',
        nameFA: 'تحلیل احساسات فارسی',
        downloadUrl: null, // No direct download available
        viewUrl: 'https://huggingface.co/datasets/persiannlp/parsinlu_sentiment',
        alternativeUrl: 'https://github.com/persiannlp/parsinlu',
        fileName: 'persian-sentiment.csv',
        size: '~5MB',
        sizeBytes: 5242880,
        format: 'CSV',
        description: 'Persian sentiment analysis with 17,500 movie review samples',
        descriptionFA: 'تحلیل احساسات فارسی با 17,500 نمونه نقد فیلم',
        source: 'ParsiNLU',
        details: {
          samples: '17,500+',
          labels: 7,
          categories: ['very negative', 'negative', 'neutral', 'positive', 'very positive', 'mixed', 'no sentiment']
        },
        message: 'مجموعه تحلیل احساسات فارسی - 17,500+ نمونه',
        instructions: 'برای دانلود این دیتاست، به Hugging Face یا GitHub repository مراجعه کنید.'
      },
      'translation-en-fa': {
        id: 'translation-en-fa',
        name: 'English-Persian Translation',
        nameFA: 'ترجمه انگلیسی-فارسی',
        downloadUrl: null, // No direct download available
        viewUrl: 'https://huggingface.co/datasets/persiannlp/parsinlu_translation_en_fa',
        alternativeUrl: 'https://github.com/persiannlp/parsinlu',
        fileName: 'en-fa-translation.jsonl',
        size: '~180MB',
        sizeBytes: 188743680,
        format: 'JSONL',
        description: '1.6M English-Persian translation pairs from multiple sources',
        descriptionFA: '1.6 میلیون جفت جمله موازی انگلیسی-فارسی',
        source: 'ParsiNLU',
        details: {
          pairs: '1,621,666',
          devSet: '2,138',
          testSet: '48,360',
          sources: ['Mizan', 'TEP', 'Bible']
        },
        message: 'مجموعه ترجمه انگلیسی-فارسی - 1.6M+ جفت جمله',
        instructions: 'برای دانلود این دیتاست، به Hugging Face یا GitHub repository مراجعه کنید.'
      },
      'persian-sft-30k': {
        id: 'persian-sft-30k',
        name: 'Persian SFT 30K',
        nameFA: 'مکالمات فارسی',
        downloadUrl: null, // No direct download available
        viewUrl: 'https://huggingface.co/datasets/ashourzadeh7/aya_collection_1',
        alternativeUrl: 'https://github.com/ashourzadeh7/aya_collection',
        fileName: 'persian-sft-30k.json',
        size: '~25MB',
        sizeBytes: 26214400,
        format: 'JSON',
        description: '30K Persian conversations for AI model training',
        descriptionFA: '30 هزار مکالمه فارسی برای آموزش مدل‌های AI',
        source: 'Aya Collection',
        details: {
          conversations: '30,000+',
          type: 'Conversational AI',
          language: 'Persian',
          format: 'JSON'
        },
        message: 'مجموعه مکالمات فارسی - 30K+ مکالمه',
        instructions: 'برای دانلود این دیتاست، به Hugging Face یا GitHub repository مراجعه کنید.'
      },
      'persian-ner': {
        id: 'persian-ner',
        name: 'Persian NER Dataset',
        nameFA: 'شناسایی موجودیت‌های نام‌دار فارسی',
        downloadUrl: 'https://raw.githubusercontent.com/HaniehP/PersianNER/master/Persian-NER-part1.txt',
        viewUrl: 'https://github.com/HaniehP/PersianNER',
        fileName: 'persian-ner.txt',
        size: '~2MB',
        sizeBytes: 2097152,
        format: 'TXT (CoNLL)',
        description: 'Named Entity Recognition dataset for Persian with 23K samples',
        descriptionFA: '23 هزار نمونه شناسایی اسامی خاص در متن فارسی',
        source: 'PersianNER',
        details: {
          tokens: '250,000+',
          entities: ['Person', 'Location', 'Organization', 'Date', 'Time', 'Money', 'Percent'],
          format: 'CoNLL-2003'
        },
        message: 'مجموعه شناسایی موجودیت‌های نام‌دار فارسی - 23K+ نمونه'
      },
      'persian-wikipedia': {
        id: 'persian-wikipedia',
        name: 'Persian Wikipedia',
        nameFA: 'ویکی‌پدیای فارسی',
        downloadUrl: null, // No direct download available
        viewUrl: 'https://huggingface.co/datasets/wikipedia',
        alternativeUrl: 'https://dumps.wikimedia.org/fawiki/',
        fileName: 'wikipedia-fa.parquet',
        size: '~520MB',
        sizeBytes: 545259520,
        format: 'Parquet',
        description: '1.16M Persian Wikipedia articles',
        descriptionFA: '1.16 میلیون مقاله ویکی‌پدیای فارسی',
        source: 'Wikipedia',
        details: {
          articles: '1,160,000+',
          categories: 'All topics',
          language: 'Persian'
        },
        message: 'مقالات ویکی‌پدیای فارسی - 1.16M+ مقاله',
        instructions: 'برای دانلود این دیتاست، به Hugging Face یا Wikipedia dumps مراجعه کنید.'
      }
    };

    const predefinedDataset = predefinedDatasets[datasetId];

    if (!predefinedDataset) {
      return res.status(404).json({
        error: 'دیتاست یافت نشد',
        message: `Dataset '${datasetId}' not found`,
        availableDatasets: Object.keys(predefinedDatasets)
      });
    }

    // برگرداندن اطلاعات دیتاست پیش‌فرض
    res.json({
      success: true,
      ...predefinedDataset,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// تابع دانلود
async function downloadAssets(jobId, items, storageRoot) {
  try {
    for (const item of items) {
      const assetId = `${jobId}-${item.model_id}-${item.file}`;

      try {
        const sanitizedModelId = item.model_id.replace(/[/\\:*?"<>|]/g, '_');
        const localDir = path.join(storageRoot, sanitizedModelId);
        await fs.mkdir(localDir, { recursive: true });

        const filePath = path.join(localDir, item.file);

        // دانلود فایل با HF_TOKEN
        const headers = HF_TOKEN ? {
          'Authorization': `Bearer ${HF_TOKEN}`
        } : {};

        const response = await fetch(item.url, { headers });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const totalBytes = parseInt(response.headers.get('content-length') || '0', 10);

        // بروزرسانی دیتابیس
        await runAsync(
          'UPDATE assets SET bytes_total = ? WHERE id = ?',
          [totalBytes, assetId]
        );

        // دانلود با پیگیری پیشرفت
        let downloadedBytes = 0;
        const reader = response.body.getReader();
        const writeStream = createWriteStream(filePath);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          downloadedBytes += value.length;
          writeStream.write(value);

          const progress = totalBytes > 0
            ? Math.round((downloadedBytes / totalBytes) * 100)
            : 0;

          await runAsync(
            'UPDATE assets SET bytes_done = ?, progress = ? WHERE id = ?',
            [downloadedBytes, progress, assetId]
          );
        }

        writeStream.end();

        // بروزرسانی وضعیت
        await runAsync(
          'UPDATE assets SET status = ?, local_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          ['completed', filePath, assetId]
        );

        console.log(`✓ دانلود شد: ${item.file}`);
      } catch (err) {
        console.error(`✗ خطا در دانلود ${item.file}:`, err.message);
        await runAsync(
          'UPDATE assets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          ['failed', assetId]
        );
      }
    }

    // بروزرسانی کار
    const assets = await allAsync(
      'SELECT status FROM assets WHERE id LIKE ?',
      [`${jobId}%`]
    );

    const completed = assets.filter(a => a.status === 'completed').length;
    const progress = Math.round((completed / assets.length) * 100);

    await runAsync(
      `UPDATE jobs SET status = ?, progress = ?, finished_at = CURRENT_TIMESTAMP, 
       message = ? WHERE id = ?`,
      ['completed', progress, `${completed}/${assets.length} دانلود شد ✓`, jobId]
    );
  } catch (error) {
    console.error('خطا در downloadAssets:', error);
    await runAsync(
      'UPDATE jobs SET status = ?, message = ? WHERE id = ?',
      ['failed', error.message, jobId]
    );
  }
}

// لیست تمام دیتاست‌های موجود
router.get('/datasets/list', async (req, res) => {
  try {
    console.log(`[${new Date().toISOString()}] Listing all datasets`);

    const predefinedDatasets = {
      'poetry-fa': {
        id: 'poetry-fa',
        name: 'Ganjoor Persian Poetry',
        nameFA: 'مجموعه اشعار گنجور',
        size: '~50MB',
        format: 'JSON',
        description: 'Complete collection of classical Persian poetry from Ganjoor project',
        descriptionFA: 'مجموعه کامل اشعار کلاسیک فارسی از پروژه گنجور',
        details: { verses: '693,000+', poets: 74, timespan: '10+ centuries' }
      },
      'sentiment-fa': {
        id: 'sentiment-fa',
        name: 'ParsiNLU Sentiment Analysis',
        nameFA: 'تحلیل احساسات فارسی',
        size: '~15MB',
        format: 'CSV',
        description: 'Persian sentiment analysis dataset with movie reviews',
        descriptionFA: 'مجموعه داده تحلیل احساسات با نقد فیلم‌های فارسی',
        details: { samples: '25,000+', labels: 7 }
      },
      'qa-fa': {
        id: 'qa-fa',
        name: 'PersianQA Dataset',
        nameFA: 'مجموعه پرسش و پاسخ فارسی',
        size: '~5MB',
        format: 'JSON',
        description: 'Reading comprehension dataset based on Persian Wikipedia',
        descriptionFA: 'مجموعه درک مطلب بر اساس ویکی‌پدیای فارسی',
        details: { samples: '9,000+', testSamples: 900 }
      },
      'translation-fa': {
        id: 'translation-fa',
        name: 'ParsiNLU Translation',
        nameFA: 'ترجمه انگلیسی-فارسی',
        size: '~280MB',
        format: 'JSONL',
        description: 'English-Persian translation pairs from multiple sources',
        descriptionFA: 'جفت جملات ترجمه انگلیسی-فارسی از منابع مختلف',
        details: { pairs: '1,621,666' }
      },
      'ner-fa': {
        id: 'ner-fa',
        name: 'Persian NER Dataset',
        nameFA: 'شناسایی موجودیت‌های نام‌دار فارسی',
        size: '~2MB',
        format: 'TXT (CoNLL)',
        description: 'Named Entity Recognition dataset for Persian',
        descriptionFA: 'مجموعه داده برای شناسایی اسامی خاص در متن فارسی',
        details: { tokens: '250,000+' }
      },
      'wiki-fa': {
        id: 'wiki-fa',
        name: 'Wikipedia Persian',
        nameFA: 'ویکی‌پدیای فارسی',
        size: '4.5GB',
        format: 'Parquet',
        description: 'Wikipedia Persian Articles',
        descriptionFA: 'مقالات ویکی‌پدیای فارسی',
        details: { articles: '1.2M+' }
      },
      'news-fa': {
        id: 'news-fa',
        name: 'Persian News Corpus',
        nameFA: 'مجموعه اخبار فارسی',
        size: '2.1GB',
        format: 'JSON',
        description: 'Persian News Corpus',
        descriptionFA: 'مجموعه اخبار فارسی',
        details: { articles: '800K+' }
      },
      'farsim-fa': {
        id: 'farsim-fa',
        name: 'FarSSiM Dataset',
        nameFA: 'مجموعه شباهت متنی فارسی',
        size: '~5MB',
        format: 'JSON',
        description: 'Persian textual similarity dataset with 1,123 sentence pairs',
        descriptionFA: 'مجموعه شباهت متنی فارسی با ۱۱۲۳ جفت جمله',
        details: { pairs: '1,123' }
      },
      'stance-fa': {
        id: 'stance-fa',
        name: 'Persian Stance Detection',
        nameFA: 'تشخیص موضع‌گیری فارسی',
        size: '~3MB',
        format: 'JSON',
        description: 'Persian stance detection dataset for opinion mining',
        descriptionFA: 'مجموعه تشخیص موضع‌گیری فارسی برای استخراج نظرات',
        details: { samples: '5,000+' }
      },
      'persian-qa': {
        id: 'persian-qa',
        name: 'Persian QA Dataset',
        nameFA: 'پرسش و پاسخ فارسی',
        size: '~3MB',
        format: 'JSON',
        description: 'Persian Question Answering dataset with 1.37M samples',
        descriptionFA: 'مجموعه پرسش و پاسخ فارسی با 1.37 میلیون نمونه',
        details: { samples: '1,370,000+' }
      },
      'sentiment-analysis': {
        id: 'sentiment-analysis',
        name: 'Persian Sentiment Analysis',
        nameFA: 'تحلیل احساسات فارسی',
        size: '~5MB',
        format: 'CSV',
        description: 'Persian sentiment analysis with 17,500 movie review samples',
        descriptionFA: 'تحلیل احساسات فارسی با 17,500 نمونه نقد فیلم',
        details: { samples: '17,500+' }
      },
      'translation-en-fa': {
        id: 'translation-en-fa',
        name: 'English-Persian Translation',
        nameFA: 'ترجمه انگلیسی-فارسی',
        size: '~180MB',
        format: 'JSONL',
        description: '1.6M English-Persian translation pairs from multiple sources',
        descriptionFA: '1.6 میلیون جفت جمله موازی انگلیسی-فارسی',
        details: { pairs: '1,621,666' }
      },
      'persian-sft-30k': {
        id: 'persian-sft-30k',
        name: 'Persian SFT 30K',
        nameFA: 'مکالمات فارسی',
        size: '~25MB',
        format: 'JSON',
        description: '30K Persian conversations for AI model training',
        descriptionFA: '30 هزار مکالمه فارسی برای آموزش مدل‌های AI',
        details: { conversations: '30,000+' }
      },
      'persian-ner': {
        id: 'persian-ner',
        name: 'Persian NER Dataset',
        nameFA: 'شناسایی موجودیت‌های نام‌دار فارسی',
        size: '~2MB',
        format: 'TXT (CoNLL)',
        description: 'Named Entity Recognition dataset for Persian with 23K samples',
        descriptionFA: '23 هزار نمونه شناسایی اسامی خاص در متن فارسی',
        details: { tokens: '250,000+' }
      },
      'persian-wikipedia': {
        id: 'persian-wikipedia',
        name: 'Persian Wikipedia',
        nameFA: 'ویکی‌پدیای فارسی',
        size: '~520MB',
        format: 'Parquet',
        description: '1.16M Persian Wikipedia articles',
        descriptionFA: '1.16 میلیون مقاله ویکی‌پدیای فارسی',
        details: { articles: '1,160,000+' }
      }
    };

    const datasetsList = Object.values(predefinedDatasets);

    res.status(200).json({
      success: true,
      count: datasetsList.length,
      datasets: datasetsList,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error listing datasets:`, error);
    res.status(500).json({
      success: false,
      error: 'خطا در دریافت لیست دیتاست‌ها',
      message: 'Internal server error'
    });
  }
});

export default router;
