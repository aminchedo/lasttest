// server/routes/hfDownload.js
import express from 'express';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const router = express.Router();
// 🔐 HARD-CODED HF TOKEN
const HF_TOKEN = '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';

const JOBS = new Map();
const CANDIDATES = [
  'pytorch_model.bin', 'model.safetensors', 'config.json', 'tokenizer.json',
  'tokenizer.model', 'merges.txt', 'vocab.json', 'special_tokens_map.json',
  'tokenizer_config.json', 'generation_config.json'
];

const sanitizeId = (id) => id.replace(/[^\w.\-\/]+/g, '_');
const hfUrl = (modelId, file) => `https://huggingface.co/${modelId}/resolve/main/${file}`;

async function headLen(url, headers) {
  try {
    const r = await fetch(url, { method: 'HEAD', headers });
    if (!r.ok) return 0;
    const l = r.headers.get('content-length');
    return l ? parseInt(l, 10) : 0;
  } catch {
    return 0;
  }
}

async function downloadOne(url, dest, job, headers) {
  const total = await headLen(url, headers);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);

  const dir = path.dirname(dest);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const ws = createWriteStream(dest);
  job.files[dest] = { done: 0, total };

  return new Promise((resolve, reject) => {
    res.body.on('data', (chunk) => {
      ws.write(chunk);
      job.files[dest].done += chunk.length;

      let done = 0, sum = 0;
      for (const k of Object.keys(job.files)) {
        done += job.files[k].done;
        sum += job.files[k].total || 0;
      }
      job.progress = sum > 0 ? Math.min(100, Math.floor((done / sum) * 100)) : job.progress;
    });
    res.body.on('end', () => {
      ws.end();
      resolve();
    });
    res.body.on('error', (e) => reject(e));
  });
}

router.post('/api/hf/download', async (req, res) => {
  try {
    const { modelId, targetDir } = req.body || {};
    if (!modelId || !targetDir) {
      return res.status(400).json({ error: 'modelId and targetDir required' });
    }

    const jobId = Math.random().toString(36).slice(2);
    const job = {
      id: jobId,
      status: 'queued',
      modelId,
      targetDir,
      progress: 0,
      files: {}
    };
    JOBS.set(jobId, job);
    res.json({ jobId });

    const headers = HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {};
    const safeId = sanitizeId(modelId);
    const baseDir = path.join(targetDir, safeId);

    job.status = 'downloading';
    const existings = [];

    for (const f of CANDIDATES) {
      const head = await fetch(hfUrl(modelId, f), { method: 'HEAD', headers });
      if (head.ok) existings.push(f);
    }

    if (existings.length === 0) {
      job.status = 'error';
      job.error = 'no_files_found';
      return;
    }

    for (const f of existings) {
      await downloadOne(hfUrl(modelId, f), path.join(baseDir, f), job, headers);
    }

    job.progress = 100;
    job.status = 'done';
  } catch (e) {
    const running = [...JOBS.values()].find(j => j.status === 'downloading' || j.status === 'queued');
    if (running) {
      running.status = 'error';
      running.error = String(e?.message || e);
    }
  }
});

router.get('/api/hf/status/:jobId', (req, res) => {
  const j = JOBS.get(req.params.jobId);
  if (!j) return res.status(404).json({ error: 'not_found' });
  res.json(j);
});

export default router;
