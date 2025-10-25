import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { runAsync, getAsync, allAsync } from '../db-adapter.js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Get all training jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await allAsync(
      'SELECT * FROM jobs WHERE kind = "training" ORDER BY created_at DESC'
    );

    const formattedJobs = await Promise.all(jobs.map(async (job) => {
      const run = await getAsync(
        'SELECT * FROM runs WHERE job_id = ? ORDER BY created_at DESC LIMIT 1',
        [job.id]
      );

      return {
        id: job.id,
        status: job.status,
        progress: job.progress,
        message: job.message,
        startedAt: job.started_at,
        finishedAt: job.finished_at,
        baseModel: run?.base_model || null,
        datasets: run?.datasets ? JSON.parse(run.datasets) : [],
        metrics: run ? {
          epoch: run.epoch,
          trainLoss: run.train_loss,
          valLoss: run.val_loss,
          learningRate: run.lr
        } : null
      };
    }));

    res.json({
      ok: true,
      data: formattedJobs
    });
  } catch (error) {
    console.error('Error fetching training jobs:', error);
    res.json({
      ok: true,
      data: []
    });
  }
});

// دریافت دارایی‌های آماده برای آموزش
router.get('/assets', async (req, res) => {
  try {
    const assets = await allAsync(
      'SELECT * FROM assets WHERE status = "ready" OR status = "completed" ORDER BY updated_at DESC'
    );
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// شروع آموزش (با اعتبارسنجی)
router.post('/start', async (req, res) => {
  try {
    const { baseModel, datasets, teacherModel, config } = req.body;
    console.log('🚀 درخواست شروع آموزش:', { baseModel, datasets, teacherModel, config });

    // اعتبارسنجی
    if (!baseModel) {
      console.log('❌ مدل پایه ارسال نشده');
      return res.status(400).json({ error: 'مدل پایه الزامی است' });
    }
    if (!datasets || !Array.isArray(datasets) || datasets.length === 0) {
      console.log('❌ دیتاست ارسال نشده');
      return res.status(400).json({ error: 'حداقل یک دیتاست الزامی است' });
    }

    // بررسی وجود Model و Dataset
    const baseModelId = baseModel.id || baseModel;
    
    // Try to find in assets table first
    let baseModelAsset = await getAsync('SELECT * FROM assets WHERE model_id = ? AND kind = "model"', [baseModelId]);
    
    // If not found in assets, it's a catalog model - that's OK
    if (!baseModelAsset) {
      console.log(`⚠️ مدل در دیتابیس یافت نشد، استفاده از کاتالوگ: ${baseModelId}`);
      baseModelAsset = {
        model_id: baseModelId,
        file_name: baseModel.name || baseModelId,
        kind: 'model',
        status: 'ready'
      };
    }

    // Validate datasets (also allow catalog datasets)
    const validatedDatasets = [];
    for (const dataset of datasets) {
      const dsId = dataset.id || dataset;
      let ds = await getAsync('SELECT * FROM assets WHERE model_id = ? AND kind = "dataset"', [dsId]);
      
      if (!ds) {
        console.log(`⚠️ دیتاست در دیتابیس یافت نشد، استفاده از کاتالوگ: ${dsId}`);
        ds = {
          model_id: dsId,
          file_name: dataset.name || dsId,
          kind: 'dataset',
          status: 'ready',
          size: dataset.size || 1000
        };
      }
      validatedDatasets.push(ds);
    }

    console.log(`✅ مدل پایه: ${baseModelAsset.file_name}`);
    console.log(`✅ دیتاست‌ها: ${validatedDatasets.length} مورد`);

    const jobId = uuidv4();
    const runId = uuidv4();

    // ایجاد کار آموزش
    await runAsync(
      `INSERT INTO jobs (id, kind, status, message, progress, started_at)
       VALUES (?, 'training', 'running', 'Training started...', 0, CURRENT_TIMESTAMP)`,
      [jobId]
    );

    // ایجاد Run برای متریکس
    const datasetIds = datasets.map(ds => ds.id || ds);
    const teacherModelId = teacherModel?.id || teacherModel || null;
    await runAsync(
      `INSERT INTO runs (id, job_id, status, base_model, datasets, teacher_model, started_at, updated_at)
       VALUES (?, ?, 'queued', ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [runId, jobId, baseModelId, JSON.stringify(datasetIds), teacherModelId]
    );

    // شروع آموزش بدون انتظار
    simulateTraining(jobId, runId, baseModelId, datasetIds, teacherModelId, config).catch(err => {
      console.error('Error in training:', err);
    });

    res.status(200).json({
      id: jobId,
      runId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// متوقف موقت آموزش
router.post('/pause/:id', async (req, res) => {
  try {
    await runAsync(
      'UPDATE jobs SET status = ?, message = ? WHERE id = ?',
      ['paused', 'Training paused', req.params.id]
    );
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// متوقف کردن آموزش
router.post('/stop/:id', async (req, res) => {
  try {
    await runAsync(
      'UPDATE jobs SET status = ?, message = ?, finished_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['stopped', 'Training stopped', req.params.id]
    );
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ادامه آموزش (Resume)
router.post('/resume/:id', async (req, res) => {
  try {
    const run = await getAsync(
      'SELECT * FROM runs WHERE job_id = ? ORDER BY created_at DESC LIMIT 1',
      [req.params.id]
    );

    if (!run || !run.last_ckpt) {
      return res.status(400).json({ error: 'No checkpoint to resume' });
    }

    const baseModel = run.base_model;
    const datasets = JSON.parse(run.datasets || '[]');
    const teacherModel = run.teacher_model;

    await runAsync(
      'UPDATE jobs SET status = ?, message = ?, progress = 0 WHERE id = ?',
      ['running', 'Resuming training...', req.params.id]
    );

    simulateTraining(req.params.id, run.id, baseModel, datasets, teacherModel, {}, true).catch(err => {
      console.error('Error resuming:', err);
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ذخیره مدل
router.post('/save/:jobId', async (req, res) => {
  try {
    const { modelName } = req.body;
    const storageRow = await getAsync(
      'SELECT value FROM settings WHERE key = ?',
      ['storage_root']
    );

    if (!storageRow) {
      return res.status(400).json({ error: 'مسیر ذخیره‌سازی تعریف نشده' });
    }

    const storageRoot = storageRow.value;
    const modelDir = path.join(storageRoot, `trained-${modelName || Date.now()}`);

    await fs.mkdir(modelDir, { recursive: true });

    const run = await getAsync(
      'SELECT * FROM runs WHERE job_id = ? ORDER BY created_at DESC LIMIT 1',
      [req.params.jobId]
    );

    const metadata = {
      jobId: req.params.jobId,
      modelName: modelName || 'trained-model',
      baseModel: run?.base_model || '',
      datasets: run?.datasets || '[]',
      teacherModel: run?.teacher_model || null,
      savedAt: new Date().toISOString(),
      status: 'ready',
      metrics: {
        trainLoss: run?.train_loss,
        valLoss: run?.val_loss,
        finalEpoch: run?.epoch
      }
    };

    await fs.writeFile(
      path.join(modelDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    res.json({
      success: true,
      modelPath: modelDir,
      message: `مدل در ${modelDir} ذخیره شد`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// بارگذاری مدل
router.post('/load', async (req, res) => {
  try {
    const { modelPath } = req.body;
    const metadataPath = path.join(modelPath, 'metadata.json');

    const metadata = await fs.readFile(metadataPath, 'utf-8');
    const config = JSON.parse(metadata);

    res.json({
      success: true,
      model: config,
      message: 'مدل بارگذاری شد'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// دریافت وضعیت کار
router.get('/status/:id', async (req, res) => {
  try {
    const job = await getAsync(
      'SELECT * FROM jobs WHERE id = ?',
      [req.params.id]
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const run = await getAsync(
      'SELECT * FROM runs WHERE job_id = ? ORDER BY created_at DESC LIMIT 1',
      [req.params.id]
    );

    res.status(200).json({
      ...job,
      metrics: run ? {
        epoch: run.epoch,
        trainLoss: run.train_loss,
        valLoss: run.val_loss,
        learningRate: run.lr,
        throughput: run.throughput,
        bestCheckpoint: run.best_ckpt,
        lastCheckpoint: run.last_ckpt
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// شبیه‌سازی آموزش با متریکس و Checkpoints
async function simulateTraining(jobId, runId, baseModel, datasets, teacherModel, config = {}, isResume = false) {
  try {
    const epochs = config.epochs || 10;
    const stepsPerEpoch = 50;
    const stepDuration = 100; // ms
    const warmupSteps = config.warmupSteps || 100;

    let bestValLoss = Infinity;
    let bestCheckpoint = null;
    let lastCheckpoint = null;
    let patienceCount = 0;
    const maxPatience = 3;

    const startEpoch = isResume ? await getRunEpoch(runId) : 0;

    for (let epoch = startEpoch; epoch < epochs; epoch++) {
      const baseDecay = 0.25;
      const distillationFactor = teacherModel ? 0.1 : 0;
      let trainLoss = 3.0 - (epoch * baseDecay) + Math.random() * 0.1 - distillationFactor;
      let valLoss = 2.9 - (epoch * (baseDecay - 0.01)) + Math.random() * 0.15 - distillationFactor;

      trainLoss = Math.max(0.1, trainLoss);
      valLoss = Math.max(0.1, valLoss);

      if (valLoss < bestValLoss) {
        bestValLoss = valLoss;
        bestCheckpoint = `checkpoint-epoch-${epoch}-val-loss-${valLoss.toFixed(3)}.pt`;
        patienceCount = 0;
      } else {
        patienceCount++;
      }

      lastCheckpoint = `checkpoint-epoch-${epoch}-val-loss-${valLoss.toFixed(3)}.pt`;

      let lr = 0.001;
      if (epoch < warmupSteps) {
        lr = 0.001 * (epoch / warmupSteps);
      } else {
        const progress = (epoch - warmupSteps) / (epochs - warmupSteps);
        lr = 0.001 * (1 + Math.cos(Math.PI * progress)) / 2;
      }

      const eta = (epochs - epoch - 1) * stepsPerEpoch * stepDuration / 1000;
      const throughput = (stepsPerEpoch / (stepsPerEpoch * stepDuration / 1000)).toFixed(2);

      await runAsync(
        `UPDATE runs SET epoch = ?, train_loss = ?, val_loss = ?, lr = ?, throughput = ?, best_ckpt = ?, last_ckpt = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [epoch + 1, trainLoss.toFixed(3), valLoss.toFixed(3), lr.toFixed(6), throughput, bestCheckpoint, lastCheckpoint, runId]
      );

      for (let step = 0; step < stepsPerEpoch; step++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        const progress = Math.round(((epoch * stepsPerEpoch + step) / (epochs * stepsPerEpoch)) * 100);
        const message = `Epoch ${epoch + 1}/${epochs} | Loss: ${trainLoss.toFixed(3)} | Val: ${valLoss.toFixed(3)}`;

        await runAsync(
          'UPDATE jobs SET progress = ?, message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [progress, message, jobId]
        );
      }

      if (patienceCount >= maxPatience) {
        console.log(`Early stopping at epoch ${epoch + 1} (patience: ${patienceCount})`);
        break;
      }
    }

    await runAsync(
      `UPDATE jobs SET status = ?, message = ?, finished_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      ['completed', `Training completed (Best Val Loss: ${bestValLoss.toFixed(3)})`, jobId]
    );

  } catch (error) {
    console.error('Error in simulateTraining:', error);
    await runAsync(
      'UPDATE jobs SET status = ?, message = ? WHERE id = ?',
      ['failed', error.message, jobId]
    );
  }
}

// Helper to get last epoch from run
async function getRunEpoch(runId) {
  const run = await getAsync('SELECT epoch FROM runs WHERE id = ?', [runId]);
  return run?.epoch || 0;
}

export default router;
