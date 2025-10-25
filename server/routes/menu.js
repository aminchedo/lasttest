import express from 'express';
import { getAsync, allAsync } from '../db.js';

const router = express.Router();

// Get menu badge counts
router.get('/counts', async (req, res) => {
    try {
        // Get counts from database - جداول جدید
        const [
            modelsCount,
            trainingCount,
            datasetsCount,
            ttsCount,
            usersCount,
            exportsCount
        ] = await Promise.all([
            getAsync('SELECT COUNT(*) as count FROM models').catch(() => ({ count: 0 })),
            allAsync('SELECT COUNT(*) as count FROM jobs WHERE status = "running" OR status = "pending"').catch(() => [{ count: 0 }]),
            getAsync('SELECT COUNT(*) as count FROM datasets').catch(() => ({ count: 0 })),
            getAsync('SELECT COUNT(*) as count FROM tts_models').catch(() => ({ count: 0 })),
            getAsync('SELECT COUNT(*) as count FROM users').catch(() => ({ count: 0 })),
            getAsync('SELECT COUNT(*) as count FROM exports').catch(() => ({ count: 0 }))
        ]);

        const counts = {
            models: modelsCount?.count || 0,
            training: trainingCount[0]?.count || 0,
            datasets: datasetsCount?.count || 0,
            tts: ttsCount?.count || 0,
            users: usersCount?.count || 0,
            exports: exportsCount?.count || 0
        };

        console.log('📊 شمارنده‌های منو:', counts);

        res.json({
            ok: true,
            data: counts
        });
    } catch (error) {
        console.error('Error fetching menu counts:', error);
        // Return default counts on error
        res.json({
            ok: true,
            data: {
                models: 0,
                training: 0,
                datasets: 0,
                tts: 0,
                users: 0,
                exports: 0
            }
        });
    }
});

export default router;

