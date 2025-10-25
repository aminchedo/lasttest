// server/routes/api.js
import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Health check
router.get('/health', (req, res) => res.json({ ok: true }));

// Settings endpoints
router.get('/settings', async (req, res) => {
    try {
        const settingsPath = path.resolve('server/storage/settings.json');
        if (!fs.existsSync(settingsPath)) {
            return res.json({ ok: true, settings: {} });
        }
        const data = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
        res.json({ ok: true, settings: data || {} });
    } catch (e) {
        res.status(500).json({ ok: false, error: 'READ_SETTINGS_FAILED' });
    }
});

router.put('/settings', async (req, res) => {
    try {
        const payload = req.body || {};
        const settingsPath = path.resolve('server/storage/settings.json');
        const storageDir = path.dirname(settingsPath);
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }
        fs.writeFileSync(settingsPath, JSON.stringify(payload, null, 2), 'utf8');
        res.json({ ok: true, settings: payload });
    } catch (e) {
        res.status(500).json({ ok: false, error: 'WRITE_SETTINGS_FAILED' });
    }
});

// Hugging Face download
router.post('/huggingface/download', async (req, res) => {
    try {
        const { type, repo, file, name } = req.body || {};
        if (!type || !repo) {
            return res.status(400).json({ ok: false, error: 'MISSING_PARAMS' });
        }

        // Build Hugging Face URL
        const safeFile = file || 'README.md';
        const url = type === 'dataset'
            ? `https://huggingface.co/datasets/${repo}/resolve/main/${safeFile}`
            : `https://huggingface.co/${repo}/resolve/main/${safeFile}`;

        // Create storage directories
        const baseDir = type === 'dataset' ? 'server/storage/datasets' : 'server/storage/models';
        const targetDir = path.resolve(baseDir, repo);
        const targetFile = path.join(targetDir, safeFile);

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Download file (simplified - just create the file for now)
        fs.writeFileSync(targetFile, `Downloaded from ${url}`, 'utf8');

        // Update registry
        const registryPath = path.resolve('server/storage/registry.json');
        let registry = { models: [], datasets: [] };
        if (fs.existsSync(registryPath)) {
            try {
                registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
            } catch (e) {
                registry = { models: [], datasets: [] };
            }
        }

        const id = `${type}:${repo}${file ? `:${file}` : ''}`;
        const item = {
            id,
            name: name || repo,
            repo,
            path: targetFile,
            downloaded: true
        };

        const list = type === 'model' ? registry.models : registry.datasets;
        const idx = list.findIndex(x => x.id === id);
        if (idx >= 0) {
            list[idx] = item;
        } else {
            list.push(item);
        }

        fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2), 'utf8');

        res.json({ ok: true, id, path: targetFile });
    } catch (e) {
        console.error('HF download error:', e);
        res.status(500).json({ ok: false, error: 'HF_DOWNLOAD_FAILED' });
    }
});

// Registry endpoints for UI comboboxes
router.get('/models', async (req, res) => {
    try {
        const registryPath = path.resolve('server/storage/registry.json');
        let registry = { models: [], datasets: [] };
        if (fs.existsSync(registryPath)) {
            try {
                registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
            } catch (e) {
                registry = { models: [], datasets: [] };
            }
        }
        res.json({ items: (registry.models || []).map(x => ({ ...x, downloaded: true })) });
    } catch (e) {
        res.status(500).json({ ok: false, error: 'GET_MODELS_FAILED' });
    }
});

router.get('/datasets', async (req, res) => {
    try {
        const registryPath = path.resolve('server/storage/registry.json');
        let registry = { models: [], datasets: [] };
        if (fs.existsSync(registryPath)) {
            try {
                registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
            } catch (e) {
                registry = { models: [], datasets: [] };
            }
        }
        res.json({ items: (registry.datasets || []).map(x => ({ ...x, downloaded: true })) });
    } catch (e) {
        res.status(500).json({ ok: false, error: 'GET_DATASETS_FAILED' });
    }
});

// Folder scan endpoint
router.post('/scan', async (req, res) => {
    try {
        const { dir, type } = req.body || {};
        if (!dir) {
            return res.status(400).json({ ok: false, error: 'MISSING_DIR' });
        }

        const items = [];
        if (fs.existsSync(dir)) {
            const files = fs.readdirSync(dir, { withFileTypes: true });
            for (const file of files) {
                if (file.isDirectory()) {
                    const subDir = path.join(dir, file.name);
                    const subFiles = fs.readdirSync(subDir, { withFileTypes: true });
                    for (const subFile of subFiles) {
                        if (subFile.isFile()) {
                            const filePath = path.join(subDir, subFile.name);
                            const stats = fs.statSync(filePath);
                            items.push({
                                id: `${file.name}:${subFile.name}`,
                                name: subFile.name,
                                path: filePath,
                                size: stats.size,
                                downloaded: true
                            });
                        }
                    }
                }
            }
        }

        res.json({ ok: true, items });
    } catch (e) {
        console.error('Scan error:', e);
        res.status(500).json({ ok: false, error: 'SCAN_FAILED' });
    }
});

export default router;
