import express from 'express';
import { runAsync, getAsync, allAsync } from '../db.js';

const router = express.Router();

// Get all TTS models
router.get('/', async (req, res) => {
    try {
        const ttsModels = await allAsync(
            `SELECT * FROM tts_models ORDER BY updated_at DESC`
        );

        // Format TTS models for frontend
        const formattedModels = ttsModels.map(model => ({
            id: model.id,
            name: model.name,
            type: 'tts',
            size: model.size || '0',
            status: model.status,
            language: model.language || 'fa',
            gender: model.gender || 'neutral',
            createdAt: model.created_at,
            description: `مدل تبدیل متن به گفتار ${model.name}`,
            localPath: model.local_path || model.path
        }));

        res.json({
            ok: true,
            data: formattedModels
        });
    } catch (error) {
        console.error('Error fetching TTS models:', error);
        res.status(500).json({ ok: false, error: 'خطا در دریافت مدل‌های TTS' });
    }
});

// Helper function
function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

export default router;

