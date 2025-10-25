// simple-server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ================== Middleware Configuration ==================

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ================== Health & System Endpoints ==================

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'farsi-model-trainer-backend',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'Backend server is running successfully',
    version: '3.0.0',
    uptime: Math.floor(process.uptime()),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      unit: 'MB'
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// ================== Settings Endpoints ==================

app.get('/api/settings', (req, res) => {
  const data = {
    ok: true,
    settings: {
      general: {
        language: 'fa',
        theme: 'dark',
        autoSave: true,
        notifications: true,
        autoUpdate: false
      },
      training: {
        maxEpochs: 100,
        batchSize: 32,
        learningRate: 0.001,
        earlyStopping: true,
        validationSplit: 0.2,
        gpuAcceleration: true
      },
      storage: {
        maxStorage: '50GB',
        autoCleanup: true,
        backupInterval: '24h',
        compression: true
      },
      monitoring: {
        realTimeUpdates: true,
        logLevel: 'info',
        metricsCollection: true,
        alertThreshold: 80
      },
      exports: {
        defaultFormat: 'zip',
        includeMetadata: true,
        compressExports: true,
        keepExports: '7d'
      }
    },
    lastUpdated: new Date().toISOString()
  };
  
  res.json(data);
});

app.put('/api/settings', (req, res) => {
  const { settings } = req.body;
  
  res.json({
    ok: true,
    message: 'Settings updated successfully',
    settings: settings,
    timestamp: new Date().toISOString()
  });
});

// ================== Analysis & Metrics Endpoints ==================

app.get('/api/analysis/metrics', (req, res) => {
  const { metric = 'accuracy', timeRange = '7d' } = req.query;
  
  const data = {
    ok: true,
    accuracy: {
      current: 94.9,
      previous: 96,
      trend: 'down',
      change: -1.1
    },
    performance: {
      current: 90.3,
      previous: 84.7,
      trend: 'up',
      change: 5.6
    },
    throughput: {
      current: 875,
      previous: 690,
      trend: 'up',
      change: 185
    },
    users: {
      current: 4191,
      previous: 3500,
      trend: 'up',
      change: 691
    },
    chartData: [
      { name: 'Mon', date: '2024-01-01', accuracy: 92, performance: 88, throughput: 800, users: 3800, loss: 0.45 },
      { name: 'Tue', date: '2024-01-02', accuracy: 94, performance: 90, throughput: 850, users: 3900, loss: 0.32 },
      { name: 'Wed', date: '2024-01-03', accuracy: 93, performance: 89, throughput: 820, users: 3850, loss: 0.25 },
      { name: 'Thu', date: '2024-01-04', accuracy: 95, performance: 91, throughput: 875, users: 4000, loss: 0.21 },
      { name: 'Fri', date: '2024-01-05', accuracy: 94.9, performance: 90.3, throughput: 875, users: 4191, loss: 0.18 }
    ],
    insights: [
      {
        type: 'positive',
        icon: 'TrendingUp',
        title: 'دقت عالی',
        description: 'دقت مدل‌ها 94.9% است',
        value: 94.9
      },
      {
        type: 'positive',
        icon: 'Cpu',
        title: 'عملکرد مطلوب',
        description: 'عملکرد سیستم 90.3% است',
        value: 90.3
      },
      {
        type: 'warning',
        icon: 'AlertTriangle',
        title: 'کاهش دقت',
        description: 'دقت نسبت به هفته قبل 1.1% کاهش یافته',
        value: -1.1
      }
    ],
    lastUpdated: new Date().toISOString(),
    processingTime: '45ms',
    systemStats: {
      totalRuns: 150,
      completedRuns: 142,
      activeRuns: 3,
      failedRuns: 5,
      totalAssets: 25
    }
  };

  res.json(data);
});

// ================== Assets Endpoints ==================

app.get('/api/assets/roots', (req, res) => {
  const data = {
    ok: true,
    roots: [
      {
        id: 'root-1',
        name: 'مدل‌های آموزشی',
        path: '/models',
        type: 'directory',
        size: '2.4GB',
        items: 15,
        lastModified: new Date(Date.now() - 86400000).toISOString(),
        permissions: 'rwx'
      },
      {
        id: 'root-2',
        name: 'دیتاست‌ها',
        path: '/datasets',
        type: 'directory',
        size: '8.7GB',
        items: 8,
        lastModified: new Date(Date.now() - 172800000).toISOString(),
        permissions: 'rwx'
      },
      {
        id: 'root-3',
        name: 'لاگ‌ها',
        path: '/logs',
        type: 'directory',
        size: '1.2GB',
        items: 45,
        lastModified: new Date(Date.now() - 3600000).toISOString(),
        permissions: 'rwx'
      }
    ],
    total: 3
  };
  
  res.json(data);
});

app.get('/api/assets/list/models', (req, res) => {
  const data = {
    ok: true,
    assets: [
      {
        id: 'asset-1',
        name: 'مدل-طبقه‌بندی-فارسی-v2.1.0',
        path: '/models/classification/persian-v2.1.0',
        type: 'file',
        size: '450MB',
        format: 'h5',
        created: new Date(Date.now() - 86400000 * 7).toISOString(),
        modified: new Date(Date.now() - 86400000 * 2).toISOString(),
        metadata: {
          accuracy: 0.945,
          epochs: 20,
          version: '2.1.0',
          language: 'fa'
        }
      },
      {
        id: 'asset-2',
        name: 'مدل-تحلیل-احساسات-v1.5.0',
        path: '/models/sentiment/analysis-v1.5.0',
        type: 'file',
        size: '180MB',
        format: 'h5',
        created: new Date(Date.now() - 86400000 * 14).toISOString(),
        modified: new Date(Date.now() - 3600000).toISOString(),
        metadata: {
          accuracy: 0.873,
          epochs: 15,
          version: '1.5.0',
          language: 'fa'
        }
      }
    ],
    total: 2
  };
  
  res.json(data);
});

// ================== Exports Endpoints ==================

app.get('/api/exports', (req, res) => {
  const data = {
    ok: true,
    exports: [
      {
        id: 'export-1',
        name: 'مدل-طبقه‌بندی-نهایی',
        englishName: 'Final Classification Model',
        type: 'model',
        format: 'h5',
        status: 'completed',
        size: '450MB',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        completedAt: new Date(Date.now() - 86300000).toISOString(),
        downloadUrl: '/api/exports/download/export-1',
        metadata: {
          accuracy: 0.945,
          version: '2.1.0',
          language: 'fa',
          samples: 50000
        }
      },
      {
        id: 'export-2',
        name: 'گزارش-آموزش-مدل',
        englishName: 'Model Training Report',
        type: 'report',
        format: 'pdf',
        status: 'completed',
        size: '15MB',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        completedAt: new Date(Date.now() - 171800000).toISOString(),
        downloadUrl: '/api/exports/download/export-2',
        metadata: {
          pages: 45,
          generatedBy: 'training-system',
          period: '2024-Q1'
        }
      },
      {
        id: 'export-3',
        name: 'دیتاست-آموزشی',
        englishName: 'Training Dataset',
        type: 'dataset',
        format: 'zip',
        status: 'processing',
        size: '1.2GB',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        progress: 65,
        estimatedCompletion: new Date(Date.now() + 1800000).toISOString(),
        metadata: {
          samples: 100000,
          features: 250,
          format: 'csv'
        }
      }
    ],
    total: 3,
    completed: 2,
    processing: 1,
    queued: 0
  };
  
  res.json(data);
});

app.get('/api/exports/download/:exportId', (req, res) => {
  const { exportId } = req.params;
  
  res.json({
    ok: true,
    message: 'Export download started',
    exportId,
    downloadUrl: `http://localhost:${PORT}/api/exports/files/${exportId}.zip`,
    expiresAt: new Date(Date.now() + 3600000).toISOString()
  });
});

app.post('/api/exports/generate', (req, res) => {
  const { type, format, name, parameters } = req.body;
  
  if (!type || !name) {
    return res.status(400).json({
      ok: false,
      error: 'Missing required fields: type and name',
      status: 400
    });
  }
  
  const exportId = `export-${Date.now()}`;
  
  res.json({
    ok: true,
    exportId,
    message: 'Export generation started',
    type,
    format: format || 'zip',
    name,
    status: 'queued',
    createdAt: new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + 300000).toISOString()
  });
});

// ================== Kitchen Endpoints ==================

app.get('/api/kitchen/jobs', (req, res) => {
  const data = {
    ok: true,
    trainingJobs: [
      {
        id: 'kitchen-job-1',
        name: 'آموزش مدل فارسی - دسته‌بندی',
        englishName: 'Persian Model Training - Classification',
        modelId: 'model-1',
        status: 'running',
        progress: 65.7,
        epoch: 13,
        totalEpochs: 20,
        loss: 0.234,
        accuracy: 0.891,
        startTime: new Date(Date.now() - 3600000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 1800000).toISOString(),
        gpu: 'NVIDIA GTX 1660 Ti',
        batchSize: 32,
        learningRate: 0.001
      },
      {
        id: 'kitchen-job-2',
        name: 'آموزش مدل احساسات',
        englishName: 'Sentiment Model Training',
        modelId: 'model-2',
        status: 'queued',
        progress: 0,
        epoch: 0,
        totalEpochs: 15,
        loss: null,
        accuracy: null,
        startTime: null,
        estimatedCompletion: null,
        gpu: null,
        batchSize: 64,
        learningRate: 0.0005
      },
      {
        id: 'kitchen-job-3',
        name: 'پیش‌پردازش داده‌ها',
        englishName: 'Data Preprocessing',
        modelId: null,
        status: 'completed',
        progress: 100,
        epoch: null,
        totalEpochs: null,
        loss: null,
        accuracy: null,
        startTime: new Date(Date.now() - 7200000).toISOString(),
        endTime: new Date(Date.now() - 3600000).toISOString(),
        gpu: null,
        batchSize: null,
        learningRate: null
      }
    ],
    total: 3,
    running: 1,
    queued: 1,
    completed: 1
  };
  
  res.json(data);
});

// ================== Monitoring Endpoints ==================

app.get('/api/monitoring/metrics', (req, res) => {
  const memUsage = process.memoryUsage();
  const totalMem = 17014120448; // 16GB in bytes
  
  const data = {
    ok: true,
    metrics: [
      {
        timestamp: new Date().toISOString(),
        system: {
          cpu: {
            usage: Math.round(Math.random() * 30 + 20),
            cores: 4,
            model: 'Intel Core i5-1135G7',
            temperature: Math.round(Math.random() * 20 + 50)
          },
          memory: {
            total: totalMem,
            free: totalMem - memUsage.heapUsed,
            used: memUsage.heapUsed,
            usage: Math.round((memUsage.heapUsed / totalMem) * 100),
            cached: Math.round(Math.random() * 2000000000)
          },
          network: {
            bytesIn: Math.floor(Math.random() * 1000000 + 500000),
            bytesOut: Math.floor(Math.random() * 500000 + 250000),
            packetsIn: Math.floor(Math.random() * 1000 + 1000),
            packetsOut: Math.floor(Math.random() * 800 + 800),
            errors: 0
          },
          disk: {
            total: 512000000000,
            used: 256000000000,
            free: 256000000000,
            usage: 50,
            readSpeed: Math.round(Math.random() * 100 + 50),
            writeSpeed: Math.round(Math.random() * 80 + 30)
          }
        }
      }
    ],
    total: 1
  };
  
  res.json(data);
});

app.get('/api/monitoring/logs', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const level = req.query.level || 'all';
  
  const logLevels = ['info', 'warning', 'error', 'debug'];
  const logMessages = {
    info: [
      'Monitoring system started successfully',
      'Health check completed',
      'API request processed',
      'Database connection established',
      'Cache cleared successfully'
    ],
    warning: [
      'High memory usage detected (>80%)',
      'Slow response time detected',
      'Connection timeout warning',
      'Disk space running low',
      'API rate limit approaching'
    ],
    error: [
      'Database connection failed',
      'API endpoint error',
      'Authentication failed',
      'File upload failed',
      'Service temporarily unavailable'
    ],
    debug: [
      'Debug mode enabled',
      'Processing request',
      'Cache hit',
      'Query executed in 25ms',
      'Worker thread spawned'
    ]
  };
  
  const logs = Array.from({ length: Math.min(limit, 10) }, (_, i) => {
    const lvl = level === 'all' 
      ? logLevels[Math.floor(Math.random() * logLevels.length)] 
      : level;
    const messages = logMessages[lvl] || logMessages.info;
    
    return {
      id: `log-${Date.now()}-${i}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      level: lvl,
      message: messages[Math.floor(Math.random() * messages.length)],
      data: null,
      source: 'monitoring',
      module: ['api', 'database', 'auth', 'cache'][Math.floor(Math.random() * 4)]
    };
  });
  
  res.json({
    ok: true,
    logs,
    total: logs.length,
    hasMore: limit < 100
  });
});

app.get('/api/monitoring/alerts', (req, res) => {
  const data = {
    ok: true,
    alerts: [
      {
        id: 'alert-1',
        type: 'warning',
        title: 'استفاده بالای CPU',
        message: 'استفاده از CPU به 85% رسیده است',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        severity: 'medium',
        acknowledged: false,
        source: 'system-monitor'
      },
      {
        id: 'alert-2',
        type: 'info',
        title: 'به‌روزرسانی موجود',
        message: 'نسخه جدید سیستم منتشر شده است',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        severity: 'low',
        acknowledged: true,
        source: 'update-service'
      }
    ],
    total: 2,
    unacknowledged: 1
  };
  
  res.json(data);
});

app.get('/api/monitoring/stats', (req, res) => {
  const data = {
    ok: true,
    stats: {
      uptime: Math.floor(process.uptime()),
      requests: Math.floor(Math.random() * 500 + 100),
      errors: Math.floor(Math.random() * 10),
      avgResponseTime: Math.floor(Math.random() * 50 + 30),
      successRate: 98.5,
      activeConnections: Math.floor(Math.random() * 50 + 10),
      totalDataTransferred: '2.4 GB',
      cacheHitRate: 87.3
    }
  };
  
  res.json(data);
});

// Server-Sent Events endpoint for real-time monitoring
app.get('/api/monitoring/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Accel-Buffering', 'no');

  const sendData = (data) => {
    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (error) {
      console.error('Error sending SSE data:', error);
    }
  };

  // Send initial connection message
  sendData({
    type: 'connected',
    message: 'Monitoring stream connected',
    timestamp: new Date().toISOString()
  });

  // Send periodic metrics updates
  const interval = setInterval(() => {
    const memUsage = process.memoryUsage();
    sendData({
      type: 'metrics',
      data: {
        cpu: Math.round(Math.random() * 30 + 20),
        memory: Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100),
        network: Math.round(Math.random() * 1000 + 500),
        timestamp: new Date().toISOString()
      }
    });
  }, 5000);

  // Clean up on disconnect
  req.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected from monitoring stream');
  });
});

// ================== Lifecycle Endpoints ==================

app.get('/api/lifecycle/jobs', (req, res) => {
  const data = {
    ok: true,
    jobs: [
      {
        id: 'lifecycle-1',
        name: 'Data Processing Pipeline',
        status: 'running',
        type: 'processing',
        progress: 45,
        startTime: new Date(Date.now() - 1800000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 1200000).toISOString()
      },
      {
        id: 'lifecycle-2',
        name: 'Model Optimization',
        status: 'queued',
        type: 'optimization',
        progress: 0,
        startTime: null,
        estimatedCompletion: null
      }
    ],
    total: 2
  };
  
  res.json(data);
});

// ================== Menu & Navigation Endpoints ==================

app.get('/api/menu/counts', (req, res) => {
  res.json({
    ok: true,
    notifications: Math.floor(Math.random() * 5),
    messages: Math.floor(Math.random() * 3),
    downloads: Math.floor(Math.random() * 2),
    training: Math.floor(Math.random() * 4),
    alerts: Math.floor(Math.random() * 2),
    updates: Math.floor(Math.random() * 1)
  });
});

// ================== Models Endpoints ==================

app.get('/api/models', (req, res) => {
  const data = {
    ok: true,
    models: [
      {
        id: 'model-1',
        name: 'طبقه‌بندی متن فارسی',
        englishName: 'Persian Text Classification',
        type: 'classification',
        status: 'ready',
        accuracy: 0.945,
        version: '2.1.0',
        size: '450MB',
        language: 'fa',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        lastTrained: new Date(Date.now() - 86400000 * 2).toISOString(),
        trainedSamples: 50000
      },
      {
        id: 'model-2', 
        name: 'تحلیل احساسات فارسی',
        englishName: 'Persian Sentiment Analysis',
        type: 'sentiment',
        status: 'training',
        accuracy: 0.873,
        version: '1.5.0',
        size: '180MB',
        language: 'fa',
        createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
        lastTrained: new Date(Date.now() - 3600000).toISOString(),
        trainedSamples: 35000
      }
    ],
    total: 2
  };
  
  res.json(data);
});

// ================== Training Endpoints ==================

app.get('/api/training/jobs', (req, res) => {
  const data = {
    ok: true,
    jobs: [
      {
        id: 'job-1',
        name: 'آموزش مدل فارسی - دسته‌بندی',
        englishName: 'Persian Model Training - Classification',
        modelId: 'model-1',
        status: 'running',
        progress: 65.7,
        epoch: 13,
        totalEpochs: 20,
        loss: 0.234,
        accuracy: 0.891,
        startTime: new Date(Date.now() - 3600000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 1800000).toISOString(),
        gpu: 'NVIDIA GTX 1660 Ti',
        batchSize: 32,
        learningRate: 0.001
      },
      {
        id: 'job-2',
        name: 'آموزش مدل احساسات',
        englishName: 'Sentiment Model Training',
        modelId: 'model-2',
        status: 'queued',
        progress: 0,
        epoch: 0,
        totalEpochs: 15,
        loss: null,
        accuracy: null,
        startTime: null,
        estimatedCompletion: null,
        gpu: null,
        batchSize: 64,
        learningRate: 0.0005
      }
    ],
    total: 2
  };
  
  res.json(data);
});

// Training status by job ID
app.get('/api/training/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  
  const mockStatus = {
    ok: true,
    data: {
      jobId,
      status: 'training',
      progress: 65.7,
      accuracy: 0.823,
      loss: 0.234,
      currentEpoch: 7,
      totalEpochs: 10,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      estimatedCompletion: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      metrics: {
        training_loss: 0.234,
        validation_loss: 0.287,
        learning_rate: 0.001,
        batch_processed: 450,
        total_batches: 686
      }
    }
  };
  
  res.json(mockStatus);
});

// Start new training job
app.post('/api/training/start', (req, res) => {
  const { modelName, dataset, epochs, batchSize } = req.body;
  
  if (!modelName || !dataset) {
    return res.status(400).json({
      ok: false,
      error: 'Missing required fields: modelName and dataset',
      status: 400
    });
  }
  
  const jobId = `job-${Date.now()}`;
  
  res.json({
    ok: true,
    jobId,
    message: 'Training started successfully',
    modelName,
    dataset,
    epochs: epochs || 10,
    batchSize: batchSize || 32,
    estimatedDuration: '2 hours',
    startTime: new Date().toISOString()
  });
});

// ================== Downloader Endpoints ==================

app.get('/api/downloader/status', (req, res) => {
  const isActive = Math.random() > 0.5;
  
  const data = {
    ok: true,
    active: isActive,
    status: isActive ? 'downloading' : 'idle',
    downloads: isActive ? [
      {
        id: 'download-1',
        name: 'Persian_Dataset_v2.zip',
        url: 'https://example.com/dataset.zip',
        progress: Math.floor(Math.random() * 100),
        size: '1.2GB',
        downloaded: '750MB',
        speed: '5.2 MB/s',
        status: 'downloading',
        startTime: new Date(Date.now() - 300000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 180000).toISOString()
      }
    ] : [],
    queue: [],
    lastUpdate: new Date().toISOString(),
    totalDownloaded: '8.4 GB',
    totalFiles: 15
  };
  
  res.json(data);
});

// ================== Dashboard Endpoints ==================

app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    ok: true,
    data: {
      totalModels: 15,
      activeModels: 12,
      trainingModels: 2,
      activeDownloads: 1,
      queuedDownloads: 0,
      storageUsed: '4.2GB',
      storageTotal: '20GB',
      availableStorage: '15.8GB',
      storagePercentage: 21,
      systemStatus: 'active',
      activeTrainings: 1,
      completedJobs: 24,
      failedJobs: 2,
      successRate: 92.3,
      averageAccuracy: 0.89,
      lastUpdated: new Date().toISOString()
    }
  });
});

// ================== Active Jobs Endpoints ==================

app.get('/api/active-jobs', (req, res) => {
  const data = {
    ok: true,
    jobs: [
      {
        id: 'active-job-1',
        name: 'Data Preprocessing Pipeline',
        type: 'processing',
        status: 'running',
        progress: 75,
        startTime: new Date(Date.now() - 3600000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 900000).toISOString(),
        resourceUsage: {
          cpu: 45,
          memory: 62,
          gpu: 0
        }
      },
      {
        id: 'active-job-2',
        name: 'Model Training - Classification',
        type: 'training',
        status: 'running',
        progress: 32,
        startTime: new Date(Date.now() - 7200000).toISOString(),
        estimatedCompletion: new Date(Date.now() + 14400000).toISOString(),
        resourceUsage: {
          cpu: 25,
          memory: 78,
          gpu: 85
        }
      }
    ],
    total: 2,
    running: 2,
    completed: 0
  };
  
  res.json(data);
});

// ================== Error Handling ==================

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  console.warn(`⚠️  404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    ok: false,
    error: 'Resource not found',
    status: 404,
    type: 'NOT_FOUND',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    message: `Endpoint ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  res.status(err.status || 500).json({
    ok: false,
    error: err.message || 'Internal server error',
    status: err.status || 500,
    type: err.type || 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
});

// ================== Server Startup ==================

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  🚀 سیستم آموزش مدل فارسی                                  ║
║     Farsi Model Trainer Backend                            ║
║                                                            ║
║  ✓ سرور بر روی پورت ${PORT} راه‌اندازی شد                        ║
║  ✓ دیتابیس آماده است                                      ║
║  ✓ API‌ها فعال هستند                                       ║
║  ✓ رابط کاربری آماده است                                  ║
║                                                            ║
║  🌐 Server: http://localhost:${PORT}                        ║
║  📊 Health: http://localhost:${PORT}/api/health             ║
║  📝 Models: http://localhost:${PORT}/api/models             ║
║  🎯 Status: http://localhost:${PORT}/api/training/status/test║
║                                                            ║
║  📚 Available Endpoints (${18} groups):                     ║
║     • Health & System                                      ║
║     • Settings Management                                  ║
║     • Analysis & Metrics                                   ║
║     • Assets Management                                    ║
║     • Exports Management                                   ║
║     • Kitchen Jobs                                         ║
║     • Monitoring (+ SSE Stream)                            ║
║     • Lifecycle Jobs                                       ║
║     • Menu & Navigation                                    ║
║     • Models Management                                    ║
║     • Training Jobs                                        ║
║     • Downloader Status                                    ║
║     • Dashboard Stats                                      ║
║     • Active Jobs                                          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
  
  console.log('🎯 Quick Test URLs:');
  console.log(`   curl http://localhost:${PORT}/api/health`);
  console.log(`   curl http://localhost:${PORT}/api/settings`);
  console.log(`   curl http://localhost:${PORT}/api/exports`);
  console.log(`   curl http://localhost:${PORT}/api/kitchen/jobs`);
  console.log(`   curl http://localhost:${PORT}/api/models\n`);
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('⚠️  SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT signal received: closing HTTP server');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

export default app;