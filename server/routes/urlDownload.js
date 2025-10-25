// server/routes/urlDownload.js
import express from 'express';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import fetch from 'node-fetch';

const router = express.Router();
const JOBS = new Map();

async function headLen(url) {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    if (!r.ok) return 0;
    const l = r.headers.get('content-length');
    return l ? parseInt(l, 10) : 0;
  } catch {
    return 0;
  }
}

async function downloadOne(url, dest, job) {
  const total = await headLen(url);
  const res = await fetch(url);
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

router.post('/api/url/download', async (req, res) => {
  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items required' });
  }

  const jobId = Math.random().toString(36).slice(2);
  const job = {
    id: jobId,
    status: 'queued',
    progress: 0,
    files: {}
  };
  JOBS.set(jobId, job);
  res.json({ jobId });

  job.status = 'downloading';
  try {
    for (const it of items) {
      const url = it.url;
      const destDir = it.destDir || 'downloads';
      const filename = it.filename || String(Date.now());
      const dest = path.join(destDir, filename);
      await downloadOne(url, dest, job);
    }
    job.progress = 100;
    job.status = 'done';
  } catch (e) {
    job.status = 'error';
    job.error = String(e?.message || e);
  }
});

router.get('/api/url/status/:jobId', (req, res) => {
  const j = JOBS.get(req.params.jobId);
  if (!j) return res.status(404).json({ error: 'not_found' });
  res.json(j);
});

export default router;
