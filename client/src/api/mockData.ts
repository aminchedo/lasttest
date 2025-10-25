// Mock Data for Testing
// داده‌های تستی واقعی‌تر برای توسعه

import {
  DashboardStats,
  SystemStatus,
  SystemMetrics,
  Activity,
  ModelInfo,
  DatasetInfo,
  TrainingJob,
  CheckpointInfo,
  ModelStatistics,
  PerformanceInsight,
  UserProfile
} from './types';

// Helper function to generate random data
const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(randomBetween(min, max));
};

const generateTimeAgo = (minutes: number): string => {
  const now = new Date();
  const past = new Date(now.getTime() - minutes * 60000);
  return past.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
};

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  runs: {
    active: 3,
    total: 156,
    completed: 142,
    failed: 11
  },
  assets: {
    ready: 45,
    total: 52,
    datasets: 28,
    models: 24
  },
  todayTrainings: 8,
  todayCompletions: 5,
  totalUsers: 23,
  activeUsers: 7
};

// System Status
export const mockSystemStatus: SystemStatus = {
  status: 'online',
  latency: 42,
  uptime: 2547896, // seconds
  version: '1.2.5',
  lastUpdate: new Date().toISOString()
};

// System Metrics - این تابع داده‌های جدید تولید می‌کنه
export const generateSystemMetrics = (): SystemMetrics => ({
  cpu: randomBetween(30, 85),
  memory: randomBetween(45, 90),
  gpu: randomBetween(20, 95),
  disk: randomBetween(55, 75),
  network: {
    upload: randomBetween(10, 100),
    download: randomBetween(50, 200)
  },
  timestamp: new Date().toISOString()
});

// Activities
export const mockActivities: Activity[] = [
  {
    id: 'act-1',
    type: 'complete',
    message: 'آموزش مدل "Persian-BERT-V2" با موفقیت کامل شد',
    timestamp: generateTimeAgo(5),
    metadata: { accuracy: 94.5 }
  },
  {
    id: 'act-2',
    type: 'training',
    message: 'شروع آموزش مدل "GPT2-Persian-Large" روی دیتاست اخبار',
    timestamp: generateTimeAgo(12),
  },
  {
    id: 'act-3',
    type: 'download',
    message: 'دانلود مدل "Llama-2-7B" از Hugging Face',
    timestamp: generateTimeAgo(25),
  },
  {
    id: 'act-4',
    type: 'upload',
    message: 'آپلود دیتاست "Persian-QA-10K" - 10,000 نمونه',
    timestamp: generateTimeAgo(35),
  },
  {
    id: 'act-5',
    type: 'complete',
    message: 'Fine-tuning مدل "BERT-Base" با accuracy 92.3% تکمیل شد',
    timestamp: generateTimeAgo(48),
    metadata: { accuracy: 92.3 }
  },
  {
    id: 'act-6',
    type: 'error',
    message: 'خطا در آموزش مدل "Custom-Transformer": Out of Memory',
    timestamp: generateTimeAgo(67),
  },
  {
    id: 'act-7',
    type: 'training',
    message: 'ادامه آموزش از checkpoint: epoch 15/30',
    timestamp: generateTimeAgo(82),
  },
  {
    id: 'act-8',
    type: 'complete',
    message: 'تولید 5 checkpoint برای مدل "T5-Persian"',
    timestamp: generateTimeAgo(95),
  },
  {
    id: 'act-9',
    type: 'download',
    message: 'دانلود دیتاست "Common Crawl Persian" - 2.5GB',
    timestamp: generateTimeAgo(120),
  },
  {
    id: 'act-10',
    type: 'training',
    message: 'شروع Auto-tuning با 20 trial برای بهینه‌سازی hyperparameters',
    timestamp: generateTimeAgo(145),
  }
];

// Models
export const mockModels: ModelInfo[] = [
  {
    id: 'model-1',
    name: 'GPT-2 Small',
    description: 'مدل زبانی 125M پارامتری برای تولید متن فارسی',
    type: 'text-generation',
    size: '125M',
    parameters: 125000000,
    downloads: 2453,
    lastUsed: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'model-2',
    name: 'BERT Base Persian',
    description: 'مدل BERT پایه برای پردازش زبان فارسی',
    type: 'classification',
    size: '110M',
    parameters: 110000000,
    downloads: 5621,
    lastUsed: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'model-3',
    name: 'Llama-2-7B',
    description: 'مدل قدرتمند 7 میلیارد پارامتری برای تولید متن',
    type: 'text-generation',
    size: '7B',
    parameters: 7000000000,
    downloads: 8932,
    lastUsed: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'model-4',
    name: 'T5-Base Persian',
    description: 'مدل Encoder-Decoder برای ترجمه و خلاصه‌سازی',
    type: 'translation',
    size: '220M',
    parameters: 220000000,
    downloads: 3421,
  },
  {
    id: 'model-5',
    name: 'ParsBERT',
    description: 'مدل BERT بهینه شده برای زبان فارسی',
    type: 'classification',
    size: '118M',
    parameters: 118000000,
    downloads: 7856,
    lastUsed: new Date(Date.now() - 10800000).toISOString()
  }
];

// Datasets
export const mockDatasets: DatasetInfo[] = [
  {
    id: 'dataset-1',
    name: 'Persian News',
    description: 'مجموعه 50,000 خبر فارسی از منابع مختلف',
    size: 524288000, // 500MB
    type: 'text',
    rows: 50000,
    uploadedAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'ready'
  },
  {
    id: 'dataset-2',
    name: 'Persian Q&A Pairs',
    description: 'جفت سوال-جواب فارسی برای آموزش مدل‌های پرسش و پاسخ',
    size: 209715200, // 200MB
    type: 'text',
    rows: 15000,
    uploadedAt: new Date(Date.now() - 172800000).toISOString(),
    status: 'ready'
  },
  {
    id: 'dataset-3',
    name: 'Sentiment Analysis Persian',
    description: 'دیتاست تحلیل احساسات فارسی - مثبت، منفی، خنثی',
    size: 104857600, // 100MB
    type: 'text',
    rows: 25000,
    uploadedAt: new Date(Date.now() - 259200000).toISOString(),
    status: 'ready'
  },
  {
    id: 'dataset-4',
    name: 'Persian Text Classification',
    description: 'دسته‌بندی متن فارسی - 10 دسته مختلف',
    size: 314572800, // 300MB
    type: 'text',
    rows: 35000,
    uploadedAt: new Date(Date.now() - 432000000).toISOString(),
    status: 'ready'
  },
  {
    id: 'dataset-5',
    name: 'Persian Poetry Dataset',
    description: 'مجموعه اشعار فارسی از شاعران کلاسیک',
    size: 52428800, // 50MB
    type: 'text',
    rows: 8000,
    uploadedAt: new Date(Date.now() - 604800000).toISOString(),
    status: 'processing'
  }
];

// Training Jobs - این تابع jobs جدید تولید می‌کنه
export const generateTrainingJobs = (): TrainingJob[] => {
  const jobs: TrainingJob[] = [
    {
      id: 'job-1',
      name: 'Persian-BERT-Fine-tune',
      modelId: 'model-2',
      datasetIds: ['dataset-1', 'dataset-3'],
      status: 'training',
      progress: randomBetween(45, 75),
      currentEpoch: randomInt(5, 12),
      totalEpochs: 20,
      metrics: {
        trainLoss: randomBetween(0.2, 0.5),
        valLoss: randomBetween(0.25, 0.55),
        trainAccuracy: randomBetween(85, 95),
        valAccuracy: randomBetween(82, 92),
        learningRate: 2e-5,
        throughput: randomBetween(120, 150),
        gradientNorm: randomBetween(0.3, 0.8)
      },
      startTime: new Date(Date.now() - 3600000).toISOString(),
      elapsed: '1س 23د',
      estimatedTimeRemaining: '48 دقیقه',
      config: {
        datasets: ['dataset-1', 'dataset-3'],
        modelName: 'Persian-BERT-Fine-tune',
        epochs: 20,
        batchSize: 32,
        learningRate: 2e-5,
        optimizer: 'adamw',
        lrScheduler: 'cosine',
        mixedPrecision: true,
        enableAutoRecovery: true,
        saveCheckpointEvery: 100
      },
      checkpoints: ['ckpt-1', 'ckpt-2']
    },
    {
      id: 'job-2',
      name: 'GPT2-Persian-Large',
      modelId: 'model-1',
      datasetIds: ['dataset-1', 'dataset-4'],
      status: 'training',
      progress: randomBetween(20, 40),
      currentEpoch: randomInt(2, 5),
      totalEpochs: 15,
      metrics: {
        trainLoss: randomBetween(0.8, 1.2),
        valLoss: randomBetween(0.85, 1.25),
        trainAccuracy: randomBetween(75, 85),
        valAccuracy: randomBetween(72, 82),
        learningRate: 5e-5,
        throughput: randomBetween(90, 120),
        gradientNorm: randomBetween(0.5, 1.2)
      },
      startTime: new Date(Date.now() - 7200000).toISOString(),
      elapsed: '2س 15د',
      estimatedTimeRemaining: '3س 45د',
      config: {
        datasets: ['dataset-1', 'dataset-4'],
        modelName: 'GPT2-Persian-Large',
        epochs: 15,
        batchSize: 16,
        learningRate: 5e-5,
        optimizer: 'adam',
        lrScheduler: 'linear',
        mixedPrecision: true,
        gradientAccumulationSteps: 4
      },
      checkpoints: ['ckpt-3']
    },
    {
      id: 'job-3',
      name: 'Sentiment-Analyzer-v2',
      modelId: 'model-5',
      datasetIds: ['dataset-3'],
      status: 'training',
      progress: randomBetween(80, 95),
      currentEpoch: randomInt(16, 19),
      totalEpochs: 20,
      metrics: {
        trainLoss: randomBetween(0.15, 0.25),
        valLoss: randomBetween(0.18, 0.28),
        trainAccuracy: randomBetween(92, 97),
        valAccuracy: randomBetween(90, 95),
        learningRate: 1e-5,
        throughput: randomBetween(150, 180),
        gradientNorm: randomBetween(0.2, 0.5)
      },
      startTime: new Date(Date.now() - 1800000).toISOString(),
      elapsed: '45 دقیقه',
      estimatedTimeRemaining: '8 دقیقه',
      config: {
        datasets: ['dataset-3'],
        modelName: 'Sentiment-Analyzer-v2',
        epochs: 20,
        batchSize: 64,
        learningRate: 1e-5,
        optimizer: 'adamw',
        lrScheduler: 'cosine_with_restarts',
        mixedPrecision: true
      },
      checkpoints: ['ckpt-4', 'ckpt-5', 'ckpt-6']
    }
  ];

  return jobs;
};

// Checkpoints
export const mockCheckpoints: CheckpointInfo[] = [
  {
    id: 'ckpt-1',
    name: 'Persian-BERT-epoch-5',
    path: '/checkpoints/persian-bert-epoch-5.pt',
    jobId: 'job-1',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    size: 524288000,
    metrics: {
      epoch: 5,
      step: 500,
      trainLoss: 0.42,
      valLoss: 0.45,
      valAccuracy: 88.5
    },
    isBest: false
  },
  {
    id: 'ckpt-2',
    name: 'Persian-BERT-epoch-10-best',
    path: '/checkpoints/persian-bert-epoch-10.pt',
    jobId: 'job-1',
    createdAt: new Date(Date.now() - 900000).toISOString(),
    size: 524288000,
    metrics: {
      epoch: 10,
      step: 1000,
      trainLoss: 0.28,
      valLoss: 0.32,
      valAccuracy: 91.2
    },
    isBest: true
  },
  {
    id: 'ckpt-3',
    name: 'GPT2-Persian-epoch-3',
    path: '/checkpoints/gpt2-persian-epoch-3.pt',
    jobId: 'job-2',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    size: 629145600,
    metrics: {
      epoch: 3,
      step: 300,
      trainLoss: 1.05,
      valLoss: 1.12,
      valAccuracy: 78.3
    },
    isBest: false
  }
];

// Model Statistics
export const mockModelStatistics: ModelStatistics[] = [
  {
    name: 'GPT-2',
    usage: 35,
    trainings: 45,
    avgAccuracy: 87.2,
    color: '#8b5cf6'
  },
  {
    name: 'BERT',
    usage: 30,
    trainings: 52,
    avgAccuracy: 91.5,
    color: '#3b82f6'
  },
  {
    name: 'Llama',
    usage: 20,
    trainings: 28,
    avgAccuracy: 89.8,
    color: '#10b981'
  },
  {
    name: 'T5',
    usage: 10,
    trainings: 15,
    avgAccuracy: 85.3,
    color: '#f59e0b'
  },
  {
    name: 'Others',
    usage: 5,
    trainings: 16,
    avgAccuracy: 82.1,
    color: '#ef4444'
  }
];

// Performance Insights
export const mockPerformanceInsights: PerformanceInsight[] = [
  {
    id: 'insight-1',
    type: 'success',
    title: 'سرعت آموزش افزایش یافت',
    description: 'نسبت به هفته قبل',
    value: '+25%',
    change: 25,
    timestamp: new Date().toISOString()
  },
  {
    id: 'insight-2',
    type: 'info',
    title: 'دقت مدل‌ها بهبود یافت',
    description: 'میانگین accuracy در این ماه',
    value: '94.5%',
    change: 2.3,
    timestamp: new Date().toISOString()
  },
  {
    id: 'insight-3',
    type: 'warning',
    title: 'استفاده از GPU بالا است',
    description: 'توصیه: افزایش منابع یا بهینه‌سازی',
    value: '85%',
    timestamp: new Date().toISOString()
  },
  {
    id: 'insight-4',
    type: 'success',
    title: 'تعداد آموزش‌های موفق',
    description: 'در 7 روز گذشته',
    value: '42',
    change: 15,
    timestamp: new Date().toISOString()
  }
];

// User Profile
export const mockUserProfile: UserProfile = {
  id: 'user-1',
  name: 'علی محمدی',
  email: 'ali@example.com',
  role: 'admin',
  createdAt: new Date(Date.now() - 31536000000).toISOString(),
  lastLogin: new Date().toISOString(),
  statistics: {
    totalTrainings: 156,
    totalModels: 24,
    totalDatasets: 28
  }
};

// Export all mock data
export const mockData = {
  dashboardStats: mockDashboardStats,
  systemStatus: mockSystemStatus,
  activities: mockActivities,
  models: mockModels,
  datasets: mockDatasets,
  checkpoints: mockCheckpoints,
  modelStatistics: mockModelStatistics,
  performanceInsights: mockPerformanceInsights,
  userProfile: mockUserProfile,
  
  // Functions to generate dynamic data
  generateSystemMetrics,
  generateTrainingJobs
};
