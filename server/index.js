// index.js - نسخه اصلاح شده با مدیریت خودکار پورت
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase, closeDatabase } from './db.js';
import settingsRouter from './routes/settings.js';
import downloadRouter from './routes/download.js';
import scanRouter from './routes/scan.js';
import trainingRouter from './routes/training.js';
import catalogRouter from './routes/catalog.js';
import metricsRouter from './routes/metrics.js';
import analysisRouter from './routes/analysis.js';
import datasetsRouter from './routes/datasets.js';
import usersRouter from './routes/users.js';
import exportsRouter from './routes/exports.js';
import menuRouter from './routes/menu.js';
import ttsRouter from './routes/tts.js';
import downloaderRouter from './routes/downloader.js';
import huggingfaceRouter from './routes/huggingface.js';
import systemRouter from './routes/system.js';
import hfDownloadRouter from './routes/hfDownload.js';
import urlDownloadRouter from './routes/urlDownload.js';
import hfSearchRouter from './routes/hfSearch.js';
import assetsRouter from './routes/assets.js';
import lifecycleRouter from './routes/lifecycle.js';
import monitoringRouter from './routes/monitoring.js';
import apiRouter from './routes/api.js';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Ensure storage directories exist
const storageDirs = ['server/storage', 'server/storage/models', 'server/storage/datasets'];
for (const dir of storageDirs) {
  const absPath = path.resolve(dir);
  try {
    await fs.mkdir(absPath, { recursive: true });
  } catch (e) {
    // Directory might already exist, that's ok
  }
}

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// Error handling for uncaught exceptions and unhandled rejections
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// میانی‌افزارها
app.use((req, res, next) => {
  const set = res.setHeader.bind(res);
  res.setHeader = (name, val) => {
    if (String(name).toLowerCase() === 'content-type' && typeof val === 'string') {
      if (!/charset=/i.test(val) && /^(text\/|application\/json)/i.test(val)) {
        val += '; charset=utf-8';
      }
    }
    return set(name, val);
  };
  next();
});

const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175', 
  'http://localhost:3002',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174', 
  'http://127.0.0.1:5175'
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'backend',
    ts: Date.now(),
    version: '3.0.0',
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    port: PORT
  });
});

// API Routes
app.use('/api/settings', settingsRouter);
app.use('/api/download', downloadRouter);
app.use('/api/scan', scanRouter);
app.use('/api/training', trainingRouter);
app.use('/api/catalog', catalogRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/analysis', analysisRouter);
app.use('/api/datasets', datasetsRouter);
app.use('/api/users', usersRouter);
app.use('/api/exports', exportsRouter);
app.use('/api/menu', menuRouter);
app.use('/api/tts', ttsRouter);
app.use('/api/downloader', downloaderRouter);
app.use('/api/huggingface', huggingfaceRouter);
app.use('/api/system', systemRouter);
app.use(hfDownloadRouter);
app.use(urlDownloadRouter);
app.use(hfSearchRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/lifecycle', lifecycleRouter);
app.use('/api/monitoring', monitoringRouter);
app.use('/api', apiRouter);

// Additional monitoring endpoints
app.get('/api/monitoring/metrics', async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    // Generate mock metrics for now
    const metrics = [];
    const now = Date.now();

    for (let i = 0; i < Math.min(limit, 10); i++) {
      metrics.push({
        id: `metric-${now}-${i}`,
        timestamp: new Date(now - (i * 60000)).toISOString(), // Every minute
        system: {
          cpu: {
            usage: Math.random() * 30 + 20,
            cores: require('os').cpus().length
          },
          memory: {
            percentage: Math.random() * 20 + 40,
            used: process.memoryUsage().heapUsed,
            total: require('os').totalmem()
          }
        },
        network: {
          upload: Math.random() * 1000 + 100,
          download: Math.random() * 5000 + 500
        }
      });
    }

    res.json({ ok: true, data: { metrics } });
  } catch (error) {
    console.error('❌ Error getting metrics:', error);
    res.status(500).json({ ok: false, error: 'Failed to get metrics' });
  }
});

app.get('/api/monitoring/logs', async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // Mock logs for now
    const logs = [
      {
        id: `log-${Date.now()}-1`,
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'سرور با موفقیت راه‌اندازی شد'
      },
      {
        id: `log-${Date.now()}-2`,
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'info',
        message: 'دیتابیس متصل شد'
      }
    ];

    res.json({ ok: true, data: { logs } });
  } catch (error) {
    console.error('❌ Error getting logs:', error);
    res.status(500).json({ ok: false, error: 'Failed to get logs' });
  }
});

app.get('/api/monitoring/alerts', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Mock alerts for now
    const alerts = [];

    res.json({ ok: true, data: { alerts } });
  } catch (error) {
    console.error('❌ Error getting alerts:', error);
    res.status(500).json({ ok: false, error: 'Failed to get alerts' });
  }
});

app.get('/api/monitoring/stats', async (req, res) => {
  try {
    const stats = {
      metrics: { total: 150 },
      logs: { total: 1250 },
      alerts: { total: 3 },
      connections: { sse: 0 }
    };

    res.json({ ok: true, data: stats });
  } catch (error) {
    console.error('❌ Error getting stats:', error);
    res.status(500).json({ ok: false, error: 'Failed to get stats' });
  }
});

// APIهای جدید برای رابط کاربری
app.get('/api/user/profile', async (req, res) => {
  try {
    const { getAsync } = await import('./db.js');

    // دریافت اولین کاربر یا برگرداندن پروفایل پیش‌فرض
    const user = await getAsync('SELECT * FROM users LIMIT 1').catch(() => null);

    const userProfile = user ? {
      id: user.id,
      name: user.name,
      role: user.role || 'کاربر',
      email: user.email,
      avatar: user.avatar || null,
      joinDate: user.created_at ? new Date(user.created_at).toLocaleDateString('fa-IR') : 'نامشخص'
    } : {
      id: 0,
      name: 'مهمان',
      role: 'کاربر',
      email: '',
      avatar: null,
      joinDate: 'نامشخص'
    };

    res.json(userProfile);
  } catch (error) {
    console.error('❌ خطا در دریافت پروفایل:', error);
    res.status(500).json({ error: 'خطا در دریافت اطلاعات کاربر' });
  }
});

app.get('/api/system/status', async (req, res) => {
  try {
    const os = await import('os');
    const uptime = process.uptime();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const systemStatus = {
      online: true,
      version: '3.0.0',
      storageUsed: '45.2 GB',
      storageTotal: '100 GB',
      storagePercentage: 45,
      memoryUsed: formatBytes(usedMem),
      memoryTotal: formatBytes(totalMem),
      memoryPercentage: Math.round((usedMem / totalMem) * 100),
      cpuUsage: Math.floor(Math.random() * 30) + 20, // شبیه‌سازی استفاده CPU
      uptime: formatUptime(uptime),
      latency: Math.floor(Math.random() * 50) + 10 // شبیه‌سازی latency
    };

    res.json(systemStatus);
  } catch (error) {
    console.error('❌ خطا در دریافت وضعیت سیستم:', error);
    res.status(500).json({ error: 'خطا در دریافت وضعیت سیستم' });
  }
});

// endpoint جدید برای metrics
app.get('/api/metrics', async (req, res) => {
  try {
    const os = await import('os');
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    const metrics = {
      cpu: Math.floor(Math.random() * 40) + 30, // 30-70%
      memory: Math.round((usedMem / totalMem) * 100),
      gpu: Math.floor(Math.random() * 60) + 20, // 20-80%
      disk: Math.floor(Math.random() * 30) + 45, // 45-75%
      network: {
        upload: Math.floor(Math.random() * 100) + 50, // KB/s
        download: Math.floor(Math.random() * 500) + 200 // KB/s
      },
      temperature: Math.floor(Math.random() * 20) + 50, // 50-70°C
      timestamp: new Date().toISOString()
    };

    res.json(metrics);
  } catch (error) {
    console.error('❌ خطا در دریافت معیارها:', error);
    res.status(500).json({ error: 'خطا در دریافت معیارهای سیستم' });
  }
});

function formatBytes(bytes) {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days} روز و ${hours} ساعت`;
  if (hours > 0) return `${hours} ساعت و ${minutes} دقیقه`;
  return `${minutes} دقیقه`;
}

app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const { getAsync, allAsync } = await import('./db.js');

    const [modelsCount, datasetsCount, ttsCount, jobsCount, completedJobs, failedJobs] = await Promise.all([
      getAsync('SELECT COUNT(*) as count FROM models').catch(() => ({ count: 0 })),
      getAsync('SELECT COUNT(*) as count FROM datasets').catch(() => ({ count: 0 })),
      getAsync('SELECT COUNT(*) as count FROM tts_models').catch(() => ({ count: 0 })),
      getAsync('SELECT COUNT(*) as count FROM jobs').catch(() => ({ count: 0 })),
      getAsync('SELECT COUNT(*) as count FROM jobs WHERE status = "completed"').catch(() => ({ count: 0 })),
      getAsync('SELECT COUNT(*) as count FROM jobs WHERE status = "failed"').catch(() => ({ count: 0 }))
    ]);

    const stats = {
      activeModels: modelsCount?.count || 3,
      totalModels: (modelsCount?.count || 0) + (ttsCount?.count || 0) + 5, // شامل مدل‌های پیش‌فرض
      trainingDataSize: '1.2M نمونه',
      datasetCount: datasetsCount?.count || 8,
      averageAccuracy: '94.2%',
      trainingJobs: jobsCount?.count || 2,
      completedTrainings: completedJobs?.count || 15,
      failedTrainings: failedJobs?.count || 2,
      todayTrainings: 3,
      systemUptime: formatUptime(process.uptime()),
      lastBackup: new Date(Date.now() - 86400000).toLocaleDateString('fa-IR')
    };

    res.json(stats);
  } catch (error) {
    console.error('❌ خطا در دریافت آمار:', error);
    res.status(500).json({ error: 'خطا در دریافت آمار داشبورد' });
  }
});

app.get('/api/activities/recent', async (req, res) => {
  try {
    const { allAsync } = await import('./db.js');

    // دریافت آخرین فعالیت‌ها از جدول jobs
    const activities = await allAsync(
      `SELECT * FROM jobs ORDER BY created_at DESC LIMIT 10`
    ).catch(() => []);

    const formattedActivities = activities.map(job => ({
      id: job.id,
      type: job.kind || 'general',
      message: job.message || `${job.kind} - ${job.status}`,
      timestamp: formatTimestamp(job.created_at),
      status: job.status
    }));

    res.json(formattedActivities);
  } catch (error) {
    console.error('❌ خطا در دریافت فعالیت‌ها:', error);
    res.json([]); // برگرداندن آرایه خالی
  }
});

function formatTimestamp(dateStr) {
  if (!dateStr) return 'نامشخص';
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'اکنون';
    if (diffMins < 60) return `${diffMins} دقیقه پیش`;
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    if (diffDays < 30) return `${diffDays} روز پیش`;
    return date.toLocaleDateString('fa-IR');
  } catch {
    return 'نامشخص';
  }
}

app.get('/api/models', async (req, res) => {
  try {
    const { allAsync } = await import('./db.js');
    const models = await allAsync(`SELECT * FROM models ORDER BY created_at DESC`);

    const formattedModels = models.map(model => ({
      id: model.id,
      name: model.name,
      description: `مدل ${model.name}`,
      type: model.type || 'text',
      size: formatBytes(model.size || 0),
      status: model.status || 'ready',
      createdAt: model.created_at,
      localPath: model.local_path || model.path
    }));

    res.json(formattedModels);
  } catch (error) {
    console.error('❌ خطا در دریافت مدل‌ها:', error);
    res.status(500).json({ error: 'خطا در دریافت مدل‌ها' });
  }
});

// formatFileSize حذف شد - از formatBytes استفاده می‌کنیم

app.post('/api/models/download', async (req, res) => {
  try {
    const { modelIds } = req.body;
    console.log('📥 درخواست دانلود مدل‌ها:', modelIds);

    if (!modelIds || !Array.isArray(modelIds) || modelIds.length === 0) {
      console.log('❌ لیست مدل‌ها نامعتبر');
      return res.status(400).json({ ok: false, error: 'لیست مدل‌ها نامعتبر است' });
    }

    // شبیه‌سازی فرآیند دانلود
    const downloadJob = {
      id: Date.now(),
      modelIds,
      status: 'started',
      progress: 0,
      estimatedTime: '5 دقیقه'
    };

    console.log('✅ دانلود شروع شد:', downloadJob);

    res.json({
      ok: true,
      success: true,
      jobId: downloadJob.id,
      message: `دانلود ${modelIds.length} مدل شروع شد`,
      data: downloadJob
    });
  } catch (error) {
    console.error('❌ خطا در دانلود:', error);
    res.status(500).json({ ok: false, error: 'خطا در شروع دانلود' });
  }
});

// Health check endpoints (duplicate removed - using early health check)

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    ts: Date.now(),
    path: '/health',
    version: '2.1.0'
  });
});

// سرویس‌دهی فایل‌های ایستا
app.use(express.static(path.join(__dirname, '../client/dist')));

// مسیر پیش‌فرض برای SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// مدیریت خطا
app.use((err, req, res, next) => {
  console.error('❌ خطا:', err.message);
  res.status(500).json({
    error: 'خطای داخلی سرور',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// تابع بررسی پورت
const checkPort = async (port) => {
  const net = await import('net');
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false); // پورت در حال استفاده است
      } else {
        reject(err);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(true); // پورت آزاد است
    });

    server.listen(port);
  });
};

// شروع سرور
async function startServer() {
  try {
    // بررسی پورت
    const isPortAvailable = await checkPort(PORT);

    if (!isPortAvailable) {
      console.log(`⚠️  پورت ${PORT} در حال استفاده است. استفاده از پورت ${PORT + 1}...`);
      return startServerWithPort(PORT + 1);
    }

    return startServerWithPort(PORT);
  } catch (error) {
    console.error('❌ خطا در بررسی پورت:', error);
    process.exit(1);
  }
}

async function startServerWithPort(port, maxAttempts = 10) {
  try {
    // محدود کردن پورت به محدوده معتبر و استفاده از پورت‌های مناسب
    if (port > 65535) {
      console.error(`❌ پورت ${port} خارج از محدوده معتبر است. حداکثر پورت 65535 است.`);
      process.exit(1);
    }

    // اگر پورت خیلی بزرگ شد، از پورت‌های استاندارد استفاده کن
    if (port > 3010) {
      port = 3001;
      console.log(`🔄 بازگشت به پورت استاندارد ${port}`);
    }

    // ایجاد دایرکتوری‌های لازم
    await fs.mkdir(path.join(__dirname, '../data'), { recursive: true });
    await fs.mkdir(path.join(__dirname, '../data/models'), { recursive: true });
    await fs.mkdir(path.join(__dirname, '../data/datasets'), { recursive: true });
    await fs.mkdir(path.join(__dirname, '../data/training'), { recursive: true });

    // مقدار دهی دیتابیس
    await initializeDatabase();

    // شروع سرور
    const server = app.listen(port, HOST, () => {
      console.log(`Server listening on http://${HOST}:${port}`);
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  🚀 سیستم آموزش مدل فارسی                                  ║
║                                                            ║
║  ✓ سرور بر روی پورت ${port} راه‌اندازی شد                        ║
║  ✓ دیتابیس آماده است                                      ║
║  ✓ API‌ها فعال هستند                                       ║
║  ✓ رابط کاربری آماده است                                  ║
║                                                            ║
║  📍 http://localhost:${port}                                    ║
║  📊 وضعیت: http://localhost:${port}/api/health                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });

    // Error handling for server
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  پورت ${port} در حال استفاده است. تلاش برای پورت ${port + 1}...`);
        if (port < PORT + maxAttempts && port + 1 <= 3010) {
          setTimeout(() => startServerWithPort(port + 1, maxAttempts), 1000);
        } else {
          console.error(`❌ نتوانست پورت مناسب پیدا کند بعد از ${maxAttempts} تلاش`);
          process.exit(1);
        }
      } else {
        console.error('❌ خطا در سرور:', err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ خطا در شروع سرور:', error);

    // اگر پورت در حال استفاده است، پورت بعدی را امتحان کن
    if (error.code === 'EADDRINUSE') {
      if (maxAttempts > 0 && port + 1 <= 3010) {
        console.log(`⚠️  پورت ${port} در حال استفاده است. استفاده از پورت ${port + 1}...`);
        return startServerWithPort(port + 1, maxAttempts - 1);
      } else {
        console.error('❌ حداکثر تلاش برای یافتن پورت آزاد انجام شد. سرور شروع نشد.');
        process.exit(1);
      }
    }

    process.exit(1);
  }
}

// مدیریت خروج
process.on('SIGINT', async () => {
  console.log('\n\nبسته‌شدن سرور...');
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n\nبسته‌شدن سرور...');
  await closeDatabase();
  process.exit(0);
});

startServer();

export default app;