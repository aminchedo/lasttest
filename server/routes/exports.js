import express from 'express';
import { runAsync, getAsync, allAsync, getDatabase } from '../db.js';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs/promises';

const router = express.Router();

// Initialize exports table
async function initializeExportsTable() {
    // Wait for database to be ready
    const db = getDatabase();
    if (!db) {
        console.log('Database not ready yet, skipping exports table initialization');
        return;
    }
    try {
        await runAsync(`
      CREATE TABLE IF NOT EXISTS exports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        size TEXT,
        status TEXT DEFAULT 'processing',
        format TEXT,
        description TEXT,
        downloads INTEGER DEFAULT 0,
        file_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Add some sample exports if table is empty
        const exportCount = await getAsync('SELECT COUNT(*) as count FROM exports');
        if (exportCount.count === 0) {
            const sampleExports = [
                {
                    name: 'گزارش آموزش مدل GPT-2 فارسی',
                    type: 'report',
                    size: '2.5 MB',
                    status: 'ready',
                    format: 'PDF',
                    description: 'گزارش کامل آموزش مدل GPT-2 فارسی',
                    downloads: 0
                },
                {
                    name: 'مدل BERT فارسی آموزش دیده',
                    type: 'model',
                    size: '1.8 GB',
                    status: 'ready',
                    format: 'PTH',
                    description: 'مدل BERT بهینه‌شده برای زبان فارسی',
                    downloads: 0
                }
            ];

            for (const exp of sampleExports) {
                await runAsync(
                    `INSERT INTO exports (name, type, size, status, format, description, downloads)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [exp.name, exp.type, exp.size, exp.status, exp.format, exp.description, exp.downloads]
                );
            }
        }
    } catch (error) {
        console.error('Error initializing exports table:', error);
    }
}

// Don't initialize on module load
export { initializeExportsTable };

// Initialize table on first request
let tableInitialized = false;
async function ensureTableInitialized() {
    if (!tableInitialized) {
        await initializeExportsTable();
        tableInitialized = true;
    }
}

// Get all exports
router.get('/', async (req, res) => {
    await ensureTableInitialized();
    try {
        const exports = await allAsync('SELECT * FROM exports ORDER BY created_at DESC');

        const formattedExports = exports.map(exp => ({
            id: exp.id,
            name: exp.name,
            type: exp.type,
            size: exp.size,
            status: exp.status,
            format: exp.format,
            description: exp.description,
            downloads: exp.downloads,
            createdAt: new Date(exp.created_at).toISOString().split('T')[0]
        }));

        res.json(formattedExports);
    } catch (error) {
        console.error('Error fetching exports:', error);
        res.status(500).json({ error: 'خطا در دریافت خروجی‌ها' });
    }
});

// Create new export
router.post('/', async (req, res) => {
    try {
        const { name, type, description, format } = req.body;

        if (!name || !type) {
            return res.status(400).json({ error: 'نام و نوع الزامی هستند' });
        }

        const result = await runAsync(
            `INSERT INTO exports (name, type, size, status, format, description, downloads)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                type,
                '0 MB',
                'processing',
                format || 'ZIP',
                description || '',
                0
            ]
        );

        // Simulate export processing
        setTimeout(async () => {
            try {
                await runAsync(
                    `UPDATE exports SET status = ?, size = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                    ['ready', '15.2 MB', result.id]
                );
            } catch (err) {
                console.error('Error updating export status:', err);
            }
        }, 5000);

        res.json({
            success: true,
            message: 'خروجی در حال ایجاد است',
            export: {
                id: result.id,
                name,
                type,
                status: 'processing'
            }
        });
    } catch (error) {
        console.error('Error creating export:', error);
        res.status(500).json({ error: 'خطا در ایجاد خروجی' });
    }
});

// Download export
router.get('/:id/download', async (req, res) => {
    try {
        const exportData = await getAsync('SELECT * FROM exports WHERE id = ?', [req.params.id]);

        if (!exportData) {
            return res.status(404).json({ error: 'خروجی پیدا نشد' });
        }

        // Update download count
        await runAsync(
            'UPDATE exports SET downloads = downloads + 1 WHERE id = ?',
            [req.params.id]
        );

        // If file exists, send it
        if (exportData.file_path) {
            try {
                await fs.access(exportData.file_path);
                return res.download(exportData.file_path);
            } catch (err) {
                // File doesn't exist, create a dummy archive
            }
        }

        // Create a dummy archive on the fly
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${exportData.name}.zip"`);

        const archive = archiver('zip', { zlib: { level: 9 } });

        archive.on('error', (err) => {
            console.error('Archive error:', err);
            res.status(500).json({ error: 'خطا در ایجاد فایل' });
        });

        archive.pipe(res);

        // Add a dummy file to the archive
        archive.append(`Export: ${exportData.name}\n\nDescription: ${exportData.description}\n\nType: ${exportData.type}\nFormat: ${exportData.format}\nCreated: ${exportData.created_at}`, {
            name: 'info.txt'
        });

        await archive.finalize();
    } catch (error) {
        console.error('Error downloading export:', error);
        res.status(500).json({ error: 'خطا در دانلود خروجی' });
    }
});

// Delete export
router.delete('/:id', async (req, res) => {
    try {
        const exportData = await getAsync('SELECT * FROM exports WHERE id = ?', [req.params.id]);

        if (!exportData) {
            return res.status(404).json({ error: 'خروجی پیدا نشد' });
        }

        // Delete file if exists
        if (exportData.file_path) {
            try {
                await fs.unlink(exportData.file_path);
            } catch (err) {
                console.error('Error deleting file:', err);
            }
        }

        await runAsync('DELETE FROM exports WHERE id = ?', [req.params.id]);

        res.json({ success: true, message: 'خروجی حذف شد' });
    } catch (error) {
        console.error('Error deleting export:', error);
        res.status(500).json({ error: 'خطا در حذف خروجی' });
    }
});

export default router;

