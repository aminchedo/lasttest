import express from 'express';
import { allAsync } from '../db.js';

const router = express.Router();

// GET /api/training/assets - Get training outputs/checkpoints
router.get('/', async (req, res) => {
  try {
    // Get completed training runs with checkpoints
    const runs = await allAsync(
      `SELECT id, job_id, base_model, datasets, status, best_ckpt, last_ckpt, 
              epoch, train_loss, val_loss, started_at, finished_at, updated_at
       FROM runs 
       WHERE status IN ('completed', 'stopped') AND (best_ckpt IS NOT NULL OR last_ckpt IS NOT NULL)
       ORDER BY updated_at DESC`
    );

    // Format as assets
    const assets = [];
    
    for (const run of runs) {
      // Add best checkpoint as asset
      if (run.best_ckpt) {
        assets.push({
          id: `${run.id}-best`,
          name: `Best Checkpoint - ${run.base_model} (Run ${run.id.slice(0, 8)})`,
          kind: 'checkpoint',
          size: estimateCheckpointSize(run.base_model),
          sizeGb: estimateCheckpointSizeGb(run.base_model),
          sizeLabel: estimateCheckpointSizeLabel(run.base_model),
          status: 'ready',
          source: 'training',
          downloadedAt: run.finished_at || run.updated_at,
          metadata: {
            runId: run.id,
            jobId: run.job_id,
            baseModel: run.base_model,
            datasets: run.datasets ? JSON.parse(run.datasets) : [],
            epoch: run.epoch,
            trainLoss: run.train_loss,
            valLoss: run.val_loss,
            checkpointFile: run.best_ckpt
          }
        });
      }

      // Add last checkpoint as asset
      if (run.last_ckpt && run.last_ckpt !== run.best_ckpt) {
        assets.push({
          id: `${run.id}-last`,
          name: `Latest Checkpoint - ${run.base_model} (Run ${run.id.slice(0, 8)})`,
          kind: 'checkpoint',
          size: estimateCheckpointSize(run.base_model),
          sizeGb: estimateCheckpointSizeGb(run.base_model),
          sizeLabel: estimateCheckpointSizeLabel(run.base_model),
          status: 'ready',
          source: 'training',
          downloadedAt: run.finished_at || run.updated_at,
          metadata: {
            runId: run.id,
            jobId: run.job_id,
            baseModel: run.base_model,
            datasets: run.datasets ? JSON.parse(run.datasets) : [],
            epoch: run.epoch,
            trainLoss: run.train_loss,
            valLoss: run.val_loss,
            checkpointFile: run.last_ckpt
          }
        });
      }
    }

    res.json({
      ok: true,
      data: assets
    });
  } catch (error) {
    console.error('Error fetching training assets:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to fetch training assets'
    });
  }
});

// Estimate checkpoint size based on model
function estimateCheckpointSize(modelId) {
  // Rough estimates in bytes
  const sizeMap = {
    'bert-fa': 418000000,
    'gpt2-persian': 1200000000,
    'roberta-fa': 480000000,
    't5-fa': 900000000,
    'albert-fa': 180000000
  };

  // Check if any key is in the modelId string
  for (const [key, size] of Object.entries(sizeMap)) {
    if (modelId && modelId.toLowerCase().includes(key.toLowerCase())) {
      return size;
    }
  }

  // Default estimate
  return 500000000; // 500MB
}

function estimateCheckpointSizeGb(modelId) {
  return (estimateCheckpointSize(modelId) / (1024 * 1024 * 1024)).toFixed(2);
}

function estimateCheckpointSizeLabel(modelId) {
  const bytes = estimateCheckpointSize(modelId);
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
  }
}

export default router;
