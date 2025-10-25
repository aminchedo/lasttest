import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import { allAsync } from '../db.js';

const router = express.Router();

// دریافت مدل‌های موجود
router.get('/models', async (req, res) => {
    try {
        // ابتدا از دیتابیس بخوان
        const dbModels = await allAsync(
            'SELECT * FROM assets WHERE kind = "model" AND status = "ready" ORDER BY updated_at DESC'
        );

        if (dbModels.length > 0) {
            const models = dbModels.map(asset => ({
                id: asset.model_id,
                name: asset.file_name,
                type: asset.kind,
                size: formatFileSize(asset.bytes_total || 0),
                localPath: asset.local_path
            }));

            return res.json(models);
        }

        // اگر دیتابیس خالی است، از فایل پیش‌فرض استفاده کن
        const defaultModels = await getDefaultModels();
        res.json(defaultModels);
    } catch (error) {
        console.error('خطا در دریافت مدل‌ها:', error);
        // در صورت خطا، مدل‌های پیش‌فرض را برگردان
        try {
            const defaultModels = await getDefaultModels();
            res.json(defaultModels);
        } catch (fallbackError) {
            res.status(500).json({ error: 'خطا در دریافت مدل‌ها' });
        }
    }
});

// دریافت دیتاست‌های موجود
router.get('/datasets', async (req, res) => {
    try {
        // ابتدا از دیتابیس بخوان
        const dbDatasets = await allAsync(
            'SELECT * FROM assets WHERE kind = "dataset" AND status = "ready" ORDER BY updated_at DESC'
        );

        if (dbDatasets.length > 0) {
            const datasets = dbDatasets.map(asset => ({
                id: asset.model_id,
                name: asset.file_name,
                samples: 'نامشخص',
                size: formatFileSize(asset.bytes_total || 0),
                localPath: asset.local_path
            }));

            return res.json(datasets);
        }

        // اگر دیتابیس خالی است، از فایل پیش‌فرض استفاده کن
        const defaultDatasets = await getDefaultDatasets();
        res.json(defaultDatasets);
    } catch (error) {
        console.error('خطا در دریافت دیتاست‌ها:', error);
        // در صورت خطا، دیتاست‌های پیش‌فرض را برگردان
        try {
            const defaultDatasets = await getDefaultDatasets();
            res.json(defaultDatasets);
        } catch (fallbackError) {
            res.status(500).json({ error: 'خطا در دریافت دیتاست‌ها' });
        }
    }
});

// دریافت کاتالوگ کامل
router.get('/', async (req, res) => {
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

// توابع کمکی
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function getDefaultModels() {
    return [
        { id: 'gpt2-persian', name: 'GPT-2 Persian', type: 'text-generation', size: '1.2GB' },
        { id: 'bert-fa', name: 'BERT Persian', type: 'classification', size: '420MB' },
        { id: 'roberta-fa', name: 'RoBERTa Persian', type: 'token-classification', size: '480MB' }
    ];
}

async function getDefaultDatasets() {
    return [
        { id: 'wiki-fa', name: 'Wikipedia Persian', samples: '1.2M', size: '4.5GB' },
        { id: 'news-fa', name: 'Persian News Corpus', samples: '800K', size: '2.1GB' },
        { id: 'poetry-fa', name: 'Classical Persian Poetry', samples: '150K', size: '320MB' }
    ];
}

export default router;
