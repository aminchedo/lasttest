import express from 'express';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync, allAsync } from '../db.js';

const router = express.Router();

// منابع مختلف برای دانلود
const DOWNLOAD_SOURCES = {
  datasets: {
    persian_news: {
      name: 'Persian News Dataset',
      url: 'https://raw.githubusercontent.com/persiannlp/persian-news-dataset/main/sample.txt',
      type: 'text',
      language: 'fa',
      description: 'مجموعه داده اخبار فارسی'
    },
    persian_wikipedia: {
      name: 'Persian Wikipedia Sample',
      url: 'https://raw.githubusercontent.com/persiannlp/persian-wikipedia/main/sample.txt',
      type: 'text',
      language: 'fa',
      description: 'نمونه ویکی‌پدیا فارسی'
    },
    english_tech: {
      name: 'English Tech Articles',
      url: 'https://raw.githubusercontent.com/tech-articles/english-tech/main/sample.txt',
      type: 'text',
      language: 'en',
      description: 'مقالات فناوری انگلیسی'
    }
  },
  models: {
    bert_persian: {
      name: 'HooshvareLab/bert-fa-base-uncased',
      url: 'huggingface',
      type: 'transformer',
      language: 'fa',
      description: 'مدل BERT فارسی - Fill Mask'
    },
    gpt2_persian: {
      name: 'HooshvareLab/gpt2-fa',
      url: 'huggingface',
      type: 'generative',
      language: 'fa',
      description: 'مدل GPT-2 فارسی - تولید متن'
    },
    t5_persian: {
      name: 'persiannlp/mt5-base-parsinlu-translation_fa_en',
      url: 'huggingface',
      type: 'text-to-text',
      language: 'fa',
      description: 'مدل ترجمه فارسی-انگلیسی'
    },
    bert_base: {
      name: 'bert-base-uncased',
      url: 'huggingface',
      type: 'transformer',
      language: 'en',
      description: 'BERT Base Model'
    },
    gpt2_base: {
      name: 'gpt2',
      url: 'huggingface',
      type: 'generative',
      language: 'en',
      description: 'GPT-2 Base Model'
    }
  },
  tts: {
    persian_female: {
      name: 'Persian Female Voice',
      url: 'https://huggingface.co/m3hrdadfi/tts-fa-female/resolve/main/model.bin',
      type: 'voice',
      language: 'fa',
      description: 'صدای زن فارسی'
    },
    persian_male: {
      name: 'Persian Male Voice',
      url: 'https://huggingface.co/m3hrdadfi/tts-fa-male/resolve/main/model.bin',
      type: 'voice',
      language: 'fa',
      description: 'صدای مرد فارسی'
    },
    english_female: {
      name: 'English Female Voice',
      url: 'https://huggingface.co/facebook/tts-en-female/resolve/main/model.bin',
      type: 'voice',
      language: 'en',
      description: 'English Female Voice'
    }
  }
};

// دریافت لیست منابع قابل دانلود
router.get('/sources', (req, res) => {
  try {
    res.json({
      success: true,
      sources: DOWNLOAD_SOURCES
    });
  } catch (error) {
    console.error('❌ خطا در دریافت منابع:', error);
    res.status(500).json({ error: 'خطا در دریافت منابع دانلود' });
  }
});

// دانلود dataset
router.post('/dataset', async (req, res) => {
  try {
    const { source, customUrl, name, description } = req.body;
    
    let downloadInfo;
    if (source && DOWNLOAD_SOURCES.datasets[source]) {
      downloadInfo = DOWNLOAD_SOURCES.datasets[source];
    } else if (customUrl) {
      downloadInfo = {
        name: name || 'Custom Dataset',
        url: customUrl,
        type: 'text',
        language: 'fa',
        description: description || 'دیتاست سفارشی'
      };
    } else {
      return res.status(400).json({ error: 'منبع یا URL سفارشی الزامی است' });
    }

    console.log(`📥 شروع دانلود dataset: ${downloadInfo.name}`);
    
    // ایجاد ID منحصر به فرد
    const datasetId = `dataset-${Date.now()}-${uuidv4().slice(0, 8)}`;
    const fileName = `${datasetId}.txt`;
    const filePath = path.join(process.cwd(), 'data', 'datasets', fileName);
    
    // اطمینان از وجود پوشه
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    // دانلود فایل
    const response = await axios.get(downloadInfo.url, {
      responseType: 'stream',
      timeout: 30000
    });
    
    // ذخیره فایل
    const writer = require('fs').createWriteStream(filePath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', async () => {
        try {
          // دریافت اطلاعات فایل
          const stats = await fs.stat(filePath);
          const fileSize = stats.size;
          
          // ذخیره در دیتابیس
          await runAsync(
            `INSERT INTO assets (id, kind, model_id, file_name, file_size, bytes_total, local_path, status, created_at, updated_at)
             VALUES (?, 'dataset', ?, ?, ?, ?, ?, 'ready', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [datasetId, downloadInfo.name, fileName, fileSize, fileSize, filePath]
          );
          
          console.log(`✅ Dataset دانلود شد: ${downloadInfo.name}`);
          resolve(res.json({
            success: true,
            message: 'Dataset با موفقیت دانلود شد',
            dataset: {
              id: datasetId,
              name: downloadInfo.name,
              size: formatFileSize(fileSize),
              type: downloadInfo.type,
              language: downloadInfo.language,
              status: 'ready',
              localPath: filePath
            }
          }));
        } catch (error) {
          console.error('❌ خطا در ذخیره dataset:', error);
          reject(res.status(500).json({ error: 'خطا در ذخیره dataset' }));
        }
      });
      
      writer.on('error', (error) => {
        console.error('❌ خطا در دانلود dataset:', error);
        reject(res.status(500).json({ error: 'خطا در دانلود dataset' }));
      });
    });
    
  } catch (error) {
    console.error('❌ خطا در دانلود dataset:', error);
    res.status(500).json({ error: 'خطا در دانلود dataset' });
  }
});

// دانلود مدل
router.post('/model', async (req, res) => {
  try {
    const { source, customUrl, name, description, modelType } = req.body;
    
    let downloadInfo;
    if (source && DOWNLOAD_SOURCES.models[source]) {
      downloadInfo = DOWNLOAD_SOURCES.models[source];
    } else if (customUrl) {
      downloadInfo = {
        name: name || 'Custom Model',
        url: customUrl,
        type: modelType || 'transformer',
        language: 'fa',
        description: description || 'مدل سفارشی'
      };
    } else {
      return res.status(400).json({ error: 'منبع یا URL سفارشی الزامی است' });
    }

    console.log(`📥 شروع دانلود مدل: ${downloadInfo.name}`);
    
    // ایجاد ID منحصر به فرد
    const modelId = `model-${Date.now()}-${uuidv4().slice(0, 8)}`;
    const fileName = `${modelId}.bin`;
    const filePath = path.join(process.cwd(), 'data', 'models', fileName);
    
    // اطمینان از وجود پوشه
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    // دانلود فایل
    const response = await axios.get(downloadInfo.url, {
      responseType: 'stream',
      timeout: 60000
    });
    
    // ذخیره فایل
    const writer = require('fs').createWriteStream(filePath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', async () => {
        try {
          // دریافت اطلاعات فایل
          const stats = await fs.stat(filePath);
          const fileSize = stats.size;
          
          // ذخیره در دیتابیس
          await runAsync(
            `INSERT INTO models (id, name, type, language, file_path, file_size, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, 'ready', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [modelId, downloadInfo.name, downloadInfo.type, downloadInfo.language, filePath, fileSize]
          );
          
          console.log(`✅ مدل دانلود شد: ${downloadInfo.name}`);
          resolve(res.json({
            success: true,
            message: 'مدل با موفقیت دانلود شد',
            model: {
              id: modelId,
              name: downloadInfo.name,
              type: downloadInfo.type,
              language: downloadInfo.language,
              size: formatFileSize(fileSize),
              status: 'ready',
              filePath: filePath
            }
          }));
        } catch (error) {
          console.error('❌ خطا در ذخیره مدل:', error);
          reject(res.status(500).json({ error: 'خطا در ذخیره مدل' }));
        }
      });
      
      writer.on('error', (error) => {
        console.error('❌ خطا در دانلود مدل:', error);
        reject(res.status(500).json({ error: 'خطا در دانلود مدل' }));
      });
    });
    
  } catch (error) {
    console.error('❌ خطا در دانلود مدل:', error);
    res.status(500).json({ error: 'خطا در دانلود مدل' });
  }
});

// دانلود TTS
router.post('/tts', async (req, res) => {
  try {
    const { source, customUrl, name, description, voiceType } = req.body;
    
    let downloadInfo;
    if (source && DOWNLOAD_SOURCES.tts[source]) {
      downloadInfo = DOWNLOAD_SOURCES.tts[source];
    } else if (customUrl) {
      downloadInfo = {
        name: name || 'Custom TTS',
        url: customUrl,
        type: 'voice',
        language: 'fa',
        description: description || 'TTS سفارشی'
      };
    } else {
      return res.status(400).json({ error: 'منبع یا URL سفارشی الزامی است' });
    }

    console.log(`📥 شروع دانلود TTS: ${downloadInfo.name}`);
    
    // ایجاد ID منحصر به فرد
    const ttsId = `tts-${Date.now()}-${uuidv4().slice(0, 8)}`;
    const fileName = `${ttsId}.bin`;
    const filePath = path.join(process.cwd(), 'data', 'tts', fileName);
    
    // اطمینان از وجود پوشه
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    
    // دانلود فایل
    const response = await axios.get(downloadInfo.url, {
      responseType: 'stream',
      timeout: 60000
    });
    
    // ذخیره فایل
    const writer = require('fs').createWriteStream(filePath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', async () => {
        try {
          // دریافت اطلاعات فایل
          const stats = await fs.stat(filePath);
          const fileSize = stats.size;
          
          // ذخیره در دیتابیس
          await runAsync(
            `INSERT INTO tts_models (id, name, type, language, file_path, file_size, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, 'ready', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [ttsId, downloadInfo.name, downloadInfo.type, downloadInfo.language, filePath, fileSize]
          );
          
          console.log(`✅ TTS دانلود شد: ${downloadInfo.name}`);
          resolve(res.json({
            success: true,
            message: 'TTS با موفقیت دانلود شد',
            tts: {
              id: ttsId,
              name: downloadInfo.name,
              type: downloadInfo.type,
              language: downloadInfo.language,
              size: formatFileSize(fileSize),
              status: 'ready',
              filePath: filePath
            }
          }));
        } catch (error) {
          console.error('❌ خطا در ذخیره TTS:', error);
          reject(res.status(500).json({ error: 'خطا در ذخیره TTS' }));
        }
      });
      
      writer.on('error', (error) => {
        console.error('❌ خطا در دانلود TTS:', error);
        reject(res.status(500).json({ error: 'خطا در دانلود TTS' }));
      });
    });
    
  } catch (error) {
    console.error('❌ خطا در دانلود TTS:', error);
    res.status(500).json({ error: 'خطا در دانلود TTS' });
  }
});

// دریافت وضعیت دانلودها
router.get('/status', async (req, res) => {
  try {
    const [datasets, models, ttsModels] = await Promise.all([
      allAsync("SELECT * FROM assets WHERE kind = 'dataset' ORDER BY created_at DESC"),
      allAsync("SELECT * FROM models ORDER BY created_at DESC"),
      allAsync("SELECT * FROM tts_models ORDER BY created_at DESC")
    ]);

    res.json({
      success: true,
      status: {
        datasets: datasets.length,
        models: models.length,
        tts: ttsModels.length,
        total: datasets.length + models.length + ttsModels.length
      },
      items: {
        datasets: datasets.map(ds => ({
          id: ds.id,
          name: ds.model_id || ds.file_name,
          size: formatFileSize(ds.bytes_total),
          status: ds.status,
          createdAt: ds.created_at
        })),
        models: models.map(m => ({
          id: m.id,
          name: m.name,
          type: m.type,
          size: formatFileSize(m.file_size),
          status: m.status,
          createdAt: m.created_at
        })),
        tts: ttsModels.map(t => ({
          id: t.id,
          name: t.name,
          type: t.type,
          size: formatFileSize(t.file_size),
          status: t.status,
          createdAt: t.created_at
        }))
      }
    });
  } catch (error) {
    console.error('❌ خطا در دریافت وضعیت:', error);
    res.status(500).json({ error: 'خطا در دریافت وضعیت دانلودها' });
  }
});

// تابع کمکی برای فرمت کردن اندازه فایل
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default router;
