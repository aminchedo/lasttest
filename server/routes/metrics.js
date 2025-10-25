import express from 'express';
import { allAsync } from '../db.js';

const router = express.Router();

// دریافت آخرین معیارهای آموزش
router.get('/runs/latest', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const runs = await allAsync(
            `SELECT 
        id,
        base_model,
        datasets,
        status,
        progress,
        message,
        started_at,
        finished_at,
        created_at,
        updated_at
       FROM runs 
       ORDER BY created_at DESC 
       LIMIT ?`,
            [limit]
        );

        // تبدیل datasets از JSON string به array
        const formattedRuns = runs.map(run => ({
            ...run,
            datasets: run.datasets ? JSON.parse(run.datasets) : [],
            duration: run.finished_at && run.started_at
                ? new Date(run.finished_at) - new Date(run.started_at)
                : null
        }));

        res.json(formattedRuns);
    } catch (error) {
        console.error('خطا در دریافت معیارها:', error);
        res.status(500).json({ error: 'خطا در دریافت معیارهای آموزش' });
    }
});

// دریافت معیارهای یک آموزش خاص
router.get('/runs/:runId', async (req, res) => {
    try {
        const runId = req.params.runId;

        const run = await allAsync(
            `SELECT 
        id,
        base_model,
        datasets,
        status,
        progress,
        message,
        started_at,
        finished_at,
        created_at,
        updated_at
       FROM runs 
       WHERE id = ?`,
            [runId]
        );

        if (run.length === 0) {
            return res.status(404).json({ error: 'آموزش پیدا نشد' });
        }

        const formattedRun = {
            ...run[0],
            datasets: run[0].datasets ? JSON.parse(run[0].datasets) : [],
            duration: run[0].finished_at && run[0].started_at
                ? new Date(run[0].finished_at) - new Date(run[0].started_at)
                : null
        };

        res.json(formattedRun);
    } catch (error) {
        console.error('خطا در دریافت معیار آموزش:', error);
        res.status(500).json({ error: 'خطا در دریافت معیار آموزش' });
    }
});

// دریافت آمار کلی سیستم
router.get('/system', async (req, res) => {
    try {
        const [totalRuns, activeRuns, completedRuns, totalAssets, readyAssets] = await Promise.all([
            allAsync('SELECT COUNT(*) as count FROM runs'),
            allAsync('SELECT COUNT(*) as count FROM runs WHERE status = "running"'),
            allAsync('SELECT COUNT(*) as count FROM runs WHERE status = "completed"'),
            allAsync('SELECT COUNT(*) as count FROM assets'),
            allAsync('SELECT COUNT(*) as count FROM assets WHERE status = "ready"')
        ]);

        const stats = {
            runs: {
                total: totalRuns[0].count,
                active: activeRuns[0].count,
                completed: completedRuns[0].count
            },
            assets: {
                total: totalAssets[0].count,
                ready: readyAssets[0].count
            },
            timestamp: new Date().toISOString()
        };

        res.json(stats);
    } catch (error) {
        console.error('خطا در دریافت آمار سیستم:', error);
        res.status(500).json({ error: 'خطا در دریافت آمار سیستم' });
    }
});

export default router;
