import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync, allAsync } from '../db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load allowed models catalog
let ALLOWED_MODELS = [];
let ALLOWED_DATASETS = [];

async function loadCatalogs() {
  try {
    const modelsPath = path.join(__dirname, '../catalog/models.json');
    const datasetsPath = path.join(__dirname, '../catalog/datasets.json');
    
    const modelsContent = await fs.readFile(modelsPath, 'utf-8');
    const datasetsContent = await fs.readFile(datasetsPath, 'utf-8');
    
    ALLOWED_MODELS = JSON.parse(modelsContent);
    ALLOWED_DATASETS = JSON.parse(datasetsContent);
    
    console.log(`✅ Loaded ${ALLOWED_MODELS.length} allowed models`);
    console.log(`✅ Loaded ${ALLOWED_DATASETS.length} allowed datasets`);
  } catch (error) {
    console.error('Error loading catalogs:', error);
    // Fallback to default allowed models
    ALLOWED_MODELS = [
      { id: 'HooshvareLab/bert-fa-base-uncased', name: 'BERT Persian', sizeBytes: 418000000 },
      { id: 'HooshvareLab/gpt2-fa', name: 'GPT-2 Persian', sizeBytes: 1200000000 },
      { id: 'HooshvareLab/roberta-fa-base', name: 'RoBERTa Persian', sizeBytes: 480000000 },
    ];
  }
}

// Initialize catalogs on startup
loadCatalogs().catch(console.error);

// Active download sessions (in-memory for simplicity)
const downloadSessions = new Map();

// POST /api/models/download/start - Start model download
router.post('/start', async (req, res) => {
  try {
    const { modelId } = req.body;

    if (!modelId) {
      return res.status(400).json({
        ok: false,
        error: 'MODEL_ID_REQUIRED',
        message: 'modelId parameter is required'
      });
    }

    // Validate against catalog
    const modelMeta = ALLOWED_MODELS.find(m => 
      m.id === modelId || m.huggingfaceId === modelId
    );

    if (!modelMeta) {
      console.warn('[DOWNLOAD] Blocked request for unknown modelId:', modelId);
      return res.status(400).json({
        ok: false,
        error: 'MODEL_NOT_ALLOWED',
        message: 'Requested model is not in approved catalog.',
        allowedModels: ALLOWED_MODELS.map(m => m.id)
      });
    }

    // Check if already downloaded
    const existing = await getAsync(
      'SELECT * FROM assets WHERE model_id = ? AND kind = "model"',
      [modelId]
    );

    if (existing && existing.status === 'ready') {
      return res.json({
        ok: true,
        started: false,
        message: 'Model already downloaded',
        modelId: modelId
      });
    }

    // Create or update asset entry
    const assetId = existing?.id || uuidv4();
    
    if (existing) {
      await runAsync(
        'UPDATE assets SET status = ?, progress = 0, bytes_done = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['downloading', assetId]
      );
    } else {
      await runAsync(
        `INSERT INTO assets (id, model_id, kind, file_name, status, bytes_total, bytes_done, progress, source_url)
         VALUES (?, ?, 'model', ?, 'downloading', ?, 0, 0, ?)`,
        [assetId, modelId, modelMeta.name, modelMeta.sizeBytes || 0, modelMeta.huggingfaceId || modelId]
      );
    }

    // Start download simulation (replace with real HF download logic)
    simulateDownload(assetId, modelId, modelMeta).catch(err => {
      console.error('[DOWNLOAD] Error in download:', err);
    });

    res.json({
      ok: true,
      started: true,
      modelId: modelId,
      assetId: assetId,
      message: `Download started for ${modelMeta.name}`
    });
  } catch (error) {
    console.error('[DOWNLOAD] Error starting download:', error);
    res.status(500).json({
      ok: false,
      error: 'DOWNLOAD_START_FAILED',
      message: error.message
    });
  }
});

// GET /api/models/download/progress - SSE progress stream
router.get('/progress', async (req, res) => {
  const { modelId } = req.query;

  if (!modelId) {
    return res.status(400).json({
      ok: false,
      error: 'modelId query parameter required'
    });
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Find asset
  const asset = await getAsync(
    'SELECT * FROM assets WHERE model_id = ? AND kind = "model"',
    [modelId]
  );

  if (!asset) {
    res.write(`data: ${JSON.stringify({
      modelId,
      status: 'error',
      error: 'Asset not found'
    })}\n\n`);
    res.end();
    return;
  }

  const sessionId = uuidv4();
  downloadSessions.set(sessionId, { res, modelId, assetId: asset.id });

  // Send initial state
  res.write(`data: ${JSON.stringify({
    modelId,
    status: asset.status,
    progress: asset.progress || 0,
    bytesDownloaded: asset.bytes_done || 0,
    totalBytes: asset.bytes_total || 0
  })}\n\n`);

  // If already complete, send done and close
  if (asset.status === 'ready' || asset.status === 'completed') {
    res.write(`data: ${JSON.stringify({
      modelId,
      status: 'done',
      progress: 100,
      bytesDownloaded: asset.bytes_total,
      totalBytes: asset.bytes_total
    })}\n\n`);
    res.end();
    downloadSessions.delete(sessionId);
    return;
  }

  // If failed, send error and close
  if (asset.status === 'failed' || asset.status === 'error') {
    res.write(`data: ${JSON.stringify({
      modelId,
      status: 'error',
      progress: asset.progress || 0,
      error: 'Download failed'
    })}\n\n`);
    res.end();
    downloadSessions.delete(sessionId);
    return;
  }

  // Poll for updates every 500ms
  const pollInterval = setInterval(async () => {
    try {
      const updatedAsset = await getAsync(
        'SELECT * FROM assets WHERE id = ?',
        [asset.id]
      );

      if (!updatedAsset) {
        clearInterval(pollInterval);
        res.end();
        downloadSessions.delete(sessionId);
        return;
      }

      res.write(`data: ${JSON.stringify({
        modelId,
        status: updatedAsset.status === 'ready' ? 'done' : 
                updatedAsset.status === 'failed' ? 'error' : 'downloading',
        progress: updatedAsset.progress || 0,
        bytesDownloaded: updatedAsset.bytes_done || 0,
        totalBytes: updatedAsset.bytes_total || 0
      })}\n\n`);

      // Close if terminal state
      if (updatedAsset.status === 'ready' || updatedAsset.status === 'completed' || 
          updatedAsset.status === 'failed' || updatedAsset.status === 'error') {
        clearInterval(pollInterval);
        res.end();
        downloadSessions.delete(sessionId);
      }
    } catch (err) {
      console.error('[SSE] Poll error:', err);
      clearInterval(pollInterval);
      res.end();
      downloadSessions.delete(sessionId);
    }
  }, 500);

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(pollInterval);
    downloadSessions.delete(sessionId);
  });
});

// Simulate download (replace with real HuggingFace download)
async function simulateDownload(assetId, modelId, modelMeta) {
  try {
    const totalBytes = modelMeta.sizeBytes || 418000000;
    const chunkSize = Math.floor(totalBytes / 50); // 50 updates
    let downloadedBytes = 0;

    for (let i = 0; i < 50; i++) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

      downloadedBytes += chunkSize;
      const progress = Math.min(100, Math.round((downloadedBytes / totalBytes) * 100));

      await runAsync(
        'UPDATE assets SET bytes_done = ?, progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [downloadedBytes, progress, assetId]
      );

      // Random failure simulation (1% chance)
      if (Math.random() < 0.01 && i > 10) {
        throw new Error('Network error: connection timeout');
      }
    }

    // Mark as complete
    await runAsync(
      'UPDATE assets SET status = ?, progress = 100, bytes_done = ?, local_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['ready', totalBytes, `/models/${modelId}`, assetId]
    );

    console.log(`✅ Download completed: ${modelId}`);
  } catch (error) {
    console.error(`❌ Download failed for ${modelId}:`, error);
    await runAsync(
      'UPDATE assets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['failed', assetId]
    );
  }
}

export default router;
