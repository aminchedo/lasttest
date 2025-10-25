
/* Final real backend (no mocks) */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { pipeline } = require('stream');
const fetch = require('node-fetch');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const API = express.Router();

// --- Simple job queue with concurrency limit ---
const MAX_CONCURRENT = parseInt(process.env.MAX_CONCURRENT_DOWNLOADS || '2', 10);
let activeCount = 0;
const queue = []; // array of functions

function enqueue(fn) {
  queue.push(fn);
  processQueue();
}
function processQueue() {
  while (activeCount < MAX_CONCURRENT && queue.length > 0) {
    const fn = queue.shift();
    activeCount++;
    fn().finally(() => {
      activeCount--;
      processQueue();
    });
  }
}

// --- In-memory job state ---
const jobs = new Map(); // jobId -> state

// --- Helpers ---
function safeName(name) { return String(name || 'file').replace(/[\\/:*?"<>|]/g, '_'); }
function nowSec() { return Math.floor(Date.now() / 1000); }

// Health
API.get('/health', (_req, res) => res.json({ ok: true, message: 'API is up', concurrent: MAX_CONCURRENT }));

// SSE
API.get('/huggingface/download/progress/:jobId', (req, res) => {
  const { jobId } = req.params;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const timer = setInterval(() => {
    const job = jobs.get(jobId);
    if (!job) return;
    if (job.status === 'error') {
      res.write(`data: ${JSON.stringify({ type: 'error', error: job.error })}\n\n`);
      clearInterval(timer);
      return;
    }
    if (job.status === 'done') {
      res.write(`data: ${JSON.stringify({ type: 'done', filePath: job.filePath, bytes: job.bytes, sha256: job.sha256, durationSec: job.durationSec, avgSpeedMbps: job.avgSpeedMbps })}\n\n`);
      clearInterval(timer);
      return;
    }
    const pct = job.total ? (job.received / job.total) * 100 : 0;
    res.write(`data: ${JSON.stringify({ type: 'progress', pct, speedMbps: job.speedMbps || 0, etaSec: job.etaSec || 0, message: job.message || '' })}\n\n`);
  }, 500);

  req.on('close', () => clearInterval(timer));
});

// Start download job with optional resume and URL override
API.post('/huggingface/download/start', async (req, res) => {
  try {
    const { modelId, revision='main', url=null, filename=null, resume=true } = req.body || {};
    const jobId = crypto.randomUUID();
    const modelsDir = path.join(process.cwd(), 'models');
    fs.mkdirSync(modelsDir, { recursive: true });

    // Guess default URL if not provided (pytorch_model.bin is common; user can change)
    const guessedUrl = url || `https://huggingface.co/${modelId}/resolve/${revision}/pytorch_model.bin`;
    const outPath = path.join(modelsDir, safeName(filename || (modelId ? `${modelId}.bin` : 'model.bin')));

    const info = {
      jobId, status: 'queued', sourceUrl: guessedUrl, filePath: outPath,
      startedAt: 0, finishedAt: 0,
      received: 0, total: 0, bytes: 0,
      speedMbps: 0, etaSec: 0, sha256: null, error: null, message: 'در صف دانلود...'
    };
    jobs.set(jobId, info);

    enqueue(async () => {
      info.status = 'starting';
      info.message = 'در حال اتصال...';
      info.startedAt = nowSec();

      // Resume support
      let startByte = 0;
      let headers = {};
      if (resume && fs.existsSync(outPath)) {
        try {
          const stat = fs.statSync(outPath);
          if (stat.size > 0) {
            startByte = stat.size;
            headers.Range = `bytes=${startByte}-`;
          }
        } catch {}
      }

      let response;
      try {
        response = await fetch(guessedUrl, { headers });
      } catch (e) {
        info.status = 'error';
        info.error = `اتصال ناموفق: ${e.message}`;
        return;
      }

      if (!response.ok || !response.body) {
        info.status = 'error';
        info.error = `HTTP ${response.status}`;
        return;
      }

      const contentLength = Number(response.headers.get('content-length')) || 0;
      const total = startByte + contentLength;
      info.total = total;
      info.status = 'downloading';
      info.message = startByte ? `از بایت ${startByte} ادامه می‌دهد` : 'در حال دریافت...';

      // Write mode: append if resumed, else write new
      const writeStream = fs.createWriteStream(outPath, { flags: startByte ? 'a' : 'w' });

      // Progress & speed
      const startedMs = Date.now();
      let received = startByte;

      response.body.on('data', (chunk) => {
        received += chunk.length;
        const dt = (Date.now() - startedMs) / 1000;
        const speedMbps = dt > 0 ? (received * 8) / (dt * 1e6) : 0;
        const remaining = total ? (total - received) : 0;
        const etaSec = speedMbps > 0 ? (remaining * 8) / (speedMbps * 1e6) : 0;
        Object.assign(info, { received, speedMbps, etaSec });
      });

      await new Promise((resolvePipe) => pipeline(response.body, writeStream, () => resolvePipe()));

      // Compute SHA256 over the final file (ensures correct hash even with resume)
      info.message = 'در حال محاسبهٔ هش...';
      const hash = crypto.createHash('sha256');
      await new Promise((resolveHash, rejectHash) => {
        const rs = fs.createReadStream(outPath);
        rs.on('data', (d) => hash.update(d));
        rs.on('error', rejectHash);
        rs.on('end', resolveHash);
      });
      info.sha256 = hash.digest('hex');

      info.finishedAt = nowSec();
      info.bytes = received;
      info.durationSec = Math.max(1, info.finishedAt - info.startedAt);
      info.avgSpeedMbps = (info.bytes * 8) / (info.durationSec * 1e6);
      info.status = 'done';
      info.message = 'دانلود کامل شد';

      // Write report JSON next to file
      const report = {
        modelId: modelId || null,
        url: guessedUrl,
        filePath: outPath,
        bytes: info.bytes,
        total: info.total,
        startedAt: info.startedAt,
        finishedAt: info.finishedAt,
        durationSec: info.durationSec,
        avgSpeedMbps: Number(info.avgSpeedMbps.toFixed(3)),
        sha256: info.sha256,
        resumedFromByte: startByte,
        status: info.status
      };
      try {
        fs.writeFileSync(outPath + '.report.json', JSON.stringify(report, null, 2));
      } catch {}
    });

    res.json({ ok: true, data: { jobId, outPath } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// HF list/search proxy (no token required; supports optional HF_TOKEN)
async function hfFetch(url) {
  const headers = {};
  if (process.env.HF_TOKEN) headers['Authorization'] = `Bearer ${process.env.HF_TOKEN}`;
  return fetch(url, { headers });
}

API.get('/huggingface/list', async (req, res) => {
  try {
    const { limit=50, author='', tag='' } = req.query;
    const qs = new URLSearchParams();
    if (author) qs.set('author', author);
    if (tag) qs.set('tag', tag);
    // Hugging Face simple feed
    const url = `https://huggingface.co/api/models?${qs.toString()}`;
    const r = await hfFetch(url);
    const data = await r.json();
    const models = Array.isArray(data) ? data.slice(0, Number(limit)).map(m => ({
      modelId: m.modelId || m.id || (m.author && m.model && `${m.author}/${m.model}`) || m.id,
      downloads: m.downloads || 0,
      likes: m.likes || 0,
      pipeline_tag: m.pipeline_tag || m.tags?.[0] || '',
      tags: m.tags || [],
      author: m.author || '',
      sha: m.sha || '',
      description: m.cardData?.language ? `lang: ${m.cardData.language}` : (m.cardData?.license || ''),
      url: `https://huggingface.co/${m.modelId || m.id}`
    })) : [];
    res.json({ ok: true, data: { models } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

API.get('/huggingface/search', async (req, res) => {
  try {
    const { q='', limit=30 } = req.query;
    const url = `https://huggingface.co/api/models?search=${encodeURIComponent(q)}`;
    const r = await hfFetch(url);
    const data = await r.json();
    const models = Array.isArray(data) ? data.slice(0, Number(limit)).map(m => ({
      modelId: m.modelId || m.id || (m.author && m.model && `${m.author}/${m.model}`) || m.id,
      downloads: m.downloads || 0,
      likes: m.likes || 0,
      pipeline_tag: m.pipeline_tag || m.tags?.[0] || '',
      tags: m.tags || [],
      author: m.author || '',
      sha: m.sha || '',
      url: `https://huggingface.co/${m.modelId || m.id}`
    })) : [];
    res.json({ ok: true, data: { models } });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});


// Quick status endpoint (polling)
API.get('/huggingface/download/status/:jobId', (req, res) => {
  try {
    const { jobId } = req.params;
    if (!global.__jobs || !global.__jobs.has(jobId)) return res.json({ ok: false, error: 'not-found' });
    const j = global.__jobs.get(jobId);
    res.json({ ok: true, data: j });
  } catch (e) { res.status(500).json({ ok: false, error: e.message }); }
});

// Training route (TFJS-node) - expects datasets/train.csv
API.post('/train/start', async (req, res) => {
  try {
    const tf = require('@tensorflow/tfjs-node');
    const path = require('path'); const fs = require('fs');
    const dsPath = path.join(process.cwd(), 'datasets', 'train.csv');
    if (!fs.existsSync(dsPath)) return res.status(400).json({ ok:false, error:'datasets/train.csv not found' });
    const raw = fs.readFileSync(dsPath,'utf-8').trim().split(/\r?\n/);
    const rows = raw.map(r=>r.split(',').map(Number)).filter(r=>r.every(x=>Number.isFinite(x)));
    if (rows.length < 10) return res.status(400).json({ ok:false, error:'Not enough rows (>=10)'});
    const feat = rows[0].length - 1;
    const xs = rows.map(r=>r.slice(0,feat)); const ys = rows.map(r=>r[feat]);
    const tfXs = tf.tensor2d(xs); const tfYs = tf.tensor2d(ys,[ys.length,1]);
    const model = tf.sequential();
    model.add(tf.layers.dense({units:32,inputShape:[feat],activation:'relu'}));
    model.add(tf.layers.dense({units:16,activation:'relu'}));
    model.add(tf.layers.dense({units:1}));
    model.compile({optimizer: tf.train.adam(0.001), loss:'meanSquaredError', metrics:['mse']});
    const hist = await model.fit(tfXs, tfYs, {epochs:5,batchSize:16,verbose:0});
    const outDir = path.join(process.cwd(),'models','local_model'); fs.mkdirSync(outDir,{recursive:true});
    await model.save(`file://${outDir}`);
    const metrics = { loss: hist.history.loss.at(-1), mse: hist.history.mse.at(-1), samples: rows.length, features: feat };
    fs.writeFileSync(path.join(outDir,'metrics.json'), JSON.stringify(metrics,null,2));
    res.json({ ok:true, data:{ outDir, metrics } });
  } catch(e){ res.status(500).json({ ok:false, error:e.message }); }
});
app.use('/api', API);


app.listen(PORT, () => console.log('API on :' + PORT));
