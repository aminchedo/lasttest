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

// Rate limiting: track active downloads per IP
const activeDownloads = new Map();

// POST /api/models/download/start - Start model download
router.post('/start', async (req, res) => {
  try {
    const { modelId } = req.body;
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';

    if (!modelId) {
      return res.status(400).json({
        ok: false,
        error: 'MODEL_ID_REQUIRED',
        message: 'modelId parameter is required'
      });
    }

    // Rate limiting: only one active download per IP
    if (activeDownloads.has(clientIP)) {
      console.warn('[DOWNLOAD] Rate limited request from IP:', clientIP);
      return res.status(429).json({
        ok: false,
        error: 'rate_limited',
        message: 'Only one active download allowed at a time'
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
        error: 'invalid_model',
        message: 'Model ID not permitted'
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

    // Track active download for rate limiting
    activeDownloads.set(clientIP, {
      modelId,
      assetId,
      startTime: new Date().toISOString()
    });

    // Start download simulation (replace with real HF download logic)
    simulateDownload(assetId, modelId, modelMeta, clientIP).catch(err => {
      console.error('[DOWNLOAD] Error in download:', err);
      // Clean up rate limiting on error
      activeDownloads.delete(clientIP);
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
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  downloadSessions.set(sessionId, { res, modelId, assetId: asset.id, clientIP });

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
    activeDownloads.delete(clientIP);
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
    activeDownloads.delete(clientIP);
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
        activeDownloads.delete(clientIP);
      }
    } catch (err) {
      console.error('[SSE] Poll error:', err);
      clearInterval(pollInterval);
      res.end();
      downloadSessions.delete(sessionId);
      activeDownloads.delete(clientIP);
    }
  }, 500);

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(pollInterval);
    downloadSessions.delete(sessionId);
    activeDownloads.delete(clientIP);
  });

  // Cleanup on response close
  res.on('close', () => {
    clearInterval(pollInterval);
    downloadSessions.delete(sessionId);
    activeDownloads.delete(clientIP);
  });
});

// Simulate download (replace with real HuggingFace download)
async function simulateDownload(assetId, modelId, modelMeta, clientIP) {
  try {
    const totalBytes = modelMeta.sizeBytes || 418000000;
    const chunkSize = Math.floor(totalBytes / 50); // 50 updates
    let downloadedBytes = 0;

    // Check disk space before starting (simplified check)
    try {
      const fs = await import('fs/promises');
      const stats = await fs.statfs('/tmp'); // Check available space
      const availableBytes = stats.bavail * stats.bsize;
      if (availableBytes < totalBytes * 1.1) { // Need 10% buffer
        throw new Error('ENOSPC: No space left on device');
      }
    } catch (spaceError) {
      if (spaceError.code === 'ENOSPC' || spaceError.message.includes('ENOSPC')) {
        console.error(`❌ Insufficient disk space for ${modelId}:`, spaceError.message);
        await runAsync(
          'UPDATE assets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          ['failed', assetId]
        );
        activeDownloads.delete(clientIP);
        return;
      }
    }

    for (let i = 0; i < 50; i++) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

      downloadedBytes += chunkSize;
      const progress = Math.min(100, Math.round((downloadedBytes / totalBytes) * 100));

      try {
        await runAsync(
          'UPDATE assets SET bytes_done = ?, progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [downloadedBytes, progress, assetId]
        );
      } catch (dbError) {
        if (dbError.message.includes('ENOSPC') || dbError.code === 'ENOSPC') {
          throw new Error('ENOSPC: No space left on device');
        }
        throw dbError;
      }

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
    
    let errorStatus = 'failed';
    let errorMessage = error.message;
    
    if (error.message.includes('ENOSPC') || error.code === 'ENOSPC') {
      errorStatus = 'error';
      errorMessage = 'No space left on device';
    }
    
    await runAsync(
      'UPDATE assets SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [errorStatus, assetId]
    );
  } finally {
    // Always clean up rate limiting
    activeDownloads.delete(clientIP);
  }
}

export default router;
