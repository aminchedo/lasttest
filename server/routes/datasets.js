import express from 'express';
import { runAsync, getAsync, allAsync } from '../db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'data', 'datasets');
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Get all datasets
router.get('/', async (req, res) => {
    try {
        const datasets = await allAsync(
            `SELECT * FROM assets WHERE kind = 'dataset' ORDER BY updated_at DESC`
        );

        // Format datasets for frontend
        const formattedDatasets = datasets.map(dataset => ({
            id: dataset.id,
            name: dataset.model_id || dataset.file_name,
            type: getDatasetType(dataset.file_name),
            size: formatFileSize(dataset.bytes_total),
            samples: Math.floor(Math.random() * 50000) + 10000, // Mock for now
            language: 'fa',
            status: dataset.status,
            createdAt: new Date(dataset.created_at).toISOString().split('T')[0],
            description: `دیتاست ${dataset.model_id || dataset.file_name}`,
            tags: ['فارسی', 'داده'],
            localPath: dataset.local_path
        }));

        res.json({
            ok: true,
            data: formatt        console.error('Error fetching datasets:', error);
        res.status(500).json({
            ok: false,
            error: 'خطا در دریافت دیتاست‌ها'
        });500).json({ error: 'خطا در دریافت دیتاست‌ها' });
    }
});

// Upload new dataset
router.post('/upload', upload.single('dataset'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'فایل آپلود نشده است' });
        }

        const datasetId = `dataset-${Date.now()}`;
        const filePath = req.file.path;
        const fileSize = req.file.size;

        await runAsync(
            `INSERT INTO assets (id, kind, model_id, file_name, local_path, status, bytes_total, bytes_done, created_at, updated_at)
       VALUES (?, 'dataset', ?, ?, ?, 'ready', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [datasetId, req.body.name || req.file.originalname, req.file.filename, filePath, fileSize, fileSize]
        );

        res.json({
            success: true,
            message: 'دیتاست با موفقیت آپلود شد',
            dataset: {
                id: datasetId,
                name: req.body.name || req.file.originalname,
                size: formatFileSize(fileSize),
                status: 'ready'
            }
        });
    } catch (error) {
        console.error('Error uploading dataset:', error);
        res.status(500).json({ error: 'خطا در آپلود دیتاست' });
    }
});

// Delete dataset
router.delete('/:id', async (req, res) => {
    try {
        const dataset = await getAsync('SELECT * FROM assets WHERE id = ?', [req.params.id]);

        if (!dataset) {
            return res.status(404).json({ error: 'دیتاست پیدا نشد' });
        }

        // Delete file if exists
        if (dataset.local_path) {
            try {
                await fs.unlink(dataset.local_path);
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        }

        await runAsync('DELETE FROM assets WHERE id = ?', [req.params.id]);

        res.json({ success: true, message: 'دیتاست حذف شد' });
    } catch (error) {
        console.error('Error deleting dataset:', error);
        res.status(500).json({ error: 'خطا در حذف دیتاست' });
    }
});

// Helper functions
function getDatasetType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const typeMap = {
        '.txt': 'text',
        '.json': 'text',
        '.csv': 'text',
        '.jsonl': 'text',
        '.jpg': 'image',
        '.jpeg': 'image',
        '.png': 'image',
        '.wav': 'audio',
        '.mp3': 'audio',
        '.flac': 'audio'
    };
    return typeMap[ext] || 'text';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export default router;

