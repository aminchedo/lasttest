import express from 'express';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import fetch from 'node-fetch';
import { pipeline } from 'stream/promises';

const router = express.Router();

// توکن Hugging Face - جایگزین کنید با توکن واقعی
const HF_TOKEN = process.env.HF_TOKEN || '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';
const JOBS = new Map();

// تابع برای دریافت لیست فایل‌های مدل
async function getModelFiles(modelId) {
  try {
    const headers = HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {};
    const response = await fetch(
      `https://huggingface.co/api/models/${modelId}`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch model info: ${response.status}`);
    }
    
    const modelInfo = await response.json();
    return modelInfo;
  } catch (error) {
    console.error('Error fetching model files:', error);
    throw error;
  }
}

// تابع برای دانلود فایل
async function downloadFile(modelId, filename, destPath, job) {
  const headers = HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {};
  const url = `https://huggingface.co/${modelId}/resolve/main/${filename}`;
  
  try {
    console.log(`📥 Downloading: ${url}`);
    
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }
    
    const contentLength = response.headers.get('content-length');
    const totalSize = contentLength ? parseInt(contentLength, 10) : 0;
    
    // ایجاد دایرکتوری مقصد
    const dir = path.dirname(destPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    const writer = createWriteStream(destPath);
    let downloadedSize = 0;
    
    // مدیریت جریان دانلود
    if (!response.body) {
      throw new Error('No response body');
    }
    
    for await (const chunk of response.body) {
      downloadedSize += chunk.length;
      writer.write(chunk);
      
      // بروزرسانی پیشرفت
      if (totalSize > 0) {
        const fileProgress = (downloadedSize / totalSize) * 100;
        job.files[filename] = {
          progress: Math.round(fileProgress),
          downloaded: downloadedSize,
          total: totalSize
        };
        
        // محاسبه پیشرفت کلی
        updateOverallProgress(job);
      }
    }
    
    writer.end();
    console.log(`✅ Downloaded: ${filename}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error downloading ${filename}:`, error);
    throw error;
  }
}

// تابع بروزرسانی پیشرفت کلی
function updateOverallProgress(job) {
  const files = Object.values(job.files);
  if (files.length === 0) return;
  
  const totalProgress = files.reduce((sum, file) => sum + file.progress, 0) / files.length;
  job.progress = Math.round(totalProgress);
}

// تابع اصلی دانلود مدل
async function downloadModel(modelId, targetDir, jobId) {
  const job = JOBS.get(jobId);
  if (!job) return;
  
  try {
    job.status = 'fetching_model_info';
    job.progress = 5;
    
    // دریافت اطلاعات مدل
    const modelInfo = await getModelFiles(modelId);
    job.status = 'downloading_files';
    job.progress = 10;
    
    // فایل‌های ضروری برای دانلود
    const essentialFiles = [
      'config.json',
      'pytorch_model.bin',
      'model.safetensors',
      'tokenizer.json',
      'vocab.json',
      'tokenizer_config.json',
      'special_tokens_map.json'
    ];
    
    // فیلتر فایل‌های موجود
    const filesToDownload = essentialFiles.filter(file => {
      // در اینجا می‌توانید بررسی کنید که فایل واقعاً وجود دارد
      return true; // برای سادگی همه فایل‌ها را دانلود می‌کنیم
    });
    
    job.totalFiles = filesToDownload.length;
    job.downloadedFiles = 0;
    job.files = {};
    
    // دانلود هر فایل
    for (const filename of filesToDownload) {
      if (job.status === 'cancelled') break;
      
      const destPath = path.join(targetDir, modelId.replace('/', '_'), filename);
      job.currentFile = filename;
      
      try {
        await downloadFile(modelId, filename, destPath, job);
        job.downloadedFiles++;
        
        // بروزرسانی پیشرفت بر اساس تعداد فایل‌ها
        const fileProgress = (job.downloadedFiles / job.totalFiles) * 80; // 80% برای فایل‌ها
        job.progress = 10 + Math.round(fileProgress);
        
      } catch (error) {
        console.error(`Failed to download ${filename}:`, error);
        job.errors = job.errors || [];
        job.errors.push(`Failed to download ${filename}: ${error.message}`);
      }
    }
    
    if (job.errors && job.errors.length > 0) {
      job.status = 'error';
      job.error = `Failed to download ${job.errors.length} files`;
    } else {
      job.status = 'completed';
      job.progress = 100;
      job.completedAt = new Date().toISOString();
    }
    
  } catch (error) {
    console.error('Download failed:', error);
    job.status = 'error';
    job.error = error.message;
    job.progress = 0;
  }
}

// Route شروع دانلود
router.post('/api/hf/download', async (req, res) => {
  try {
    const { modelId, targetDir = './models' } = req.body;
    
    if (!modelId) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Model ID is required' 
      });
    }
    
    const jobId = randomUUID();
    const job = {
      id: jobId,
      modelId,
      targetDir,
      status: 'queued',
      progress: 0,
      files: {},
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      error: null
    };
    
    JOBS.set(jobId, job);
    
    // شروع دانلود در پس‌زمینه
    setTimeout(() => {
      job.status = 'downloading';
      job.startedAt = new Date().toISOString();
      downloadModel(modelId, targetDir, jobId);
    }, 1000);
    
    res.json({ 
      ok: true, 
      jobId,
      message: `Download started for model: ${modelId}`
    });
    
  } catch (error) {
    console.error('Error starting download:', error);
    res.status(500).json({ 
      ok: false, 
      error: 'Failed to start download' 
    });
  }
});

// Route بررسی وضعیت
router.get('/api/hf/status/:jobId', (req, res) => {
  const job = JOBS.get(req.params.jobId);
  
  if (!job) {
    return res.status(404).json({ 
      ok: false, 
      error: 'Job not found' 
    });
  }
  
  res.json({
    ok: true,
    data: {
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      modelId: job.modelId,
      currentFile: job.currentFile,
      downloadedFiles: job.downloadedFiles,
      totalFiles: job.totalFiles,
      files: job.files,
      error: job.error,
      createdAt: job.createdAt,
      startedAt: job.startedAt,
      completedAt: job.completedAt
    }
  });
});

// Route لیست جاب‌ها
router.get('/api/hf/jobs', (req, res) => {
  const jobs = Array.from(JOBS.values());
  res.json({ 
    ok: true, 
    data: jobs 
  });
});

// Route لغو دانلود
router.post('/api/hf/cancel/:jobId', (req, res) => {
  const job = JOBS.get(req.params.jobId);
  
  if (!job) {
    return res.status(404).json({ 
      ok: false, 
      error: 'Job not found' 
    });
  }
  
  if (job.status === 'downloading') {
    job.status = 'cancelled';
    job.progress = 0;
    job.error = 'Download cancelled by user';
  }
  
  res.json({ 
    ok: true, 
    message: 'Download cancelled' 
  });
});

export default router;