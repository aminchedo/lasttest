// MockDataService.js - Provides fallback data when backend is unavailable
import { format, subDays, subHours } from 'date-fns';

export class MockDataService {
  static getDashboardStats() {
    return {
      ok: true,
      data: {
        activeModels: 3,
        totalModels: 12,
        datasetCount: 8,
        trainingJobs: 2,
        successRate: 92.3,
        systemHealth: 'excellent',
        lastUpdate: new Date().toISOString()
      }
    };
  }

  static getRecentActivities(limit = 15) {
    const activities = [
      {
        id: 1,
        type: 'training_completed',
        title: 'آموزش مدل BERT فارسی تکمیل شد',
        description: 'مدل BERT با موفقیت آموزش داده شد و آماده استفاده است',
        timestamp: subHours(new Date(), 1).toISOString(),
        status: 'success',
        icon: 'CheckCircle'
      },
      {
        id: 2,
        type: 'model_downloaded',
        title: 'دانلود مدل GPT-2 فارسی',
        description: 'مدل GPT-2 فارسی با موفقیت دانلود شد',
        timestamp: subHours(new Date(), 3).toISOString(),
        status: 'success',
        icon: 'Download'
      },
      {
        id: 3,
        type: 'dataset_uploaded',
        title: 'آپلود دیتاست جدید',
        description: 'دیتاست متون فارسی با 50,000 نمونه آپلود شد',
        timestamp: subHours(new Date(), 5).toISOString(),
        status: 'success',
        icon: 'Upload'
      },
      {
        id: 4,
        type: 'training_started',
        title: 'شروع آموزش مدل جدید',
        description: 'آموزش مدل T5 فارسی آغاز شد',
        timestamp: subHours(new Date(), 8).toISOString(),
        status: 'running',
        icon: 'Play'
      },
      {
        id: 5,
        type: 'system_backup',
        title: 'پشتیبان‌گیری سیستم',
        description: 'پشتیبان‌گیری روزانه سیستم تکمیل شد',
        timestamp: subDays(new Date(), 1).toISOString(),
        status: 'success',
        icon: 'Shield'
      }
    ];

    return {
      ok: true,
      data: activities.slice(0, limit)
    };
  }

  static getSystemStatus() {
    return {
      ok: true,
      data: {
        database: {
          status: 'connected',
          responseTime: '12ms',
          lastCheck: new Date().toISOString()
        },
        server: {
          status: 'running',
          uptime: '99.9%',
          lastRestart: subDays(new Date(), 7).toISOString()
        },
        network: {
          status: 'online',
          latency: '8ms',
          bandwidth: '1000 Mbps'
        },
        storage: {
          status: 'healthy',
          used: '2.3 TB',
          available: '7.7 TB',
          total: '10 TB'
        }
      }
    };
  }

  static getSystemMetrics() {
    return {
      ok: true,
      data: {
        cpu: {
          current: 45.2,
          average: 42.1,
          peak: 78.5,
          cores: 8
        },
        memory: {
          used: 6.2,
          total: 16,
          percentage: 38.8,
          available: 9.8
        },
        disk: {
          used: 2.3,
          total: 10,
          percentage: 23,
          available: 7.7
        },
        network: {
          upload: 1.2,
          download: 4.8,
          total: 6.0
        }
      }
    };
  }

  static getModels() {
    return {
      ok: true,
      data: [
        {
          id: 'bert-persian-base',
          name: 'BERT Persian Base',
          description: 'مدل BERT پایه برای زبان فارسی',
          size: '440 MB',
          status: 'ready',
          downloaded: true,
          localPath: '/models/bert-persian-base',
          lastUpdated: subDays(new Date(), 5).toISOString(),
          accuracy: 94.2,
          category: 'language-model'
        },
        {
          id: 'gpt2-persian',
          name: 'GPT-2 Persian',
          description: 'مدل GPT-2 برای تولید متن فارسی',
          size: '500 MB',
          status: 'ready',
          downloaded: true,
          localPath: '/models/gpt2-persian',
          lastUpdated: subDays(new Date(), 3).toISOString(),
          accuracy: 91.8,
          category: 'text-generation'
        },
        {
          id: 't5-persian',
          name: 'T5 Persian',
          description: 'مدل T5 برای ترجمه و خلاصه‌سازی فارسی',
          size: '1.2 GB',
          status: 'downloading',
          downloaded: false,
          progress: 65,
          category: 'translation'
        }
      ]
    };
  }

  static getDatasets() {
    return {
      ok: true,
      data: [
        {
          id: 'persian-news-corpus',
          name: 'پیکره اخبار فارسی',
          description: 'مجموعه‌ای از اخبار فارسی برای آموزش مدل‌ها',
          size: '2.1 GB',
          status: 'ready',
          downloaded: true,
          localPath: '/datasets/persian-news',
          lastUpdated: subDays(new Date(), 2).toISOString(),
          samples: 50000,
          category: 'news'
        },
        {
          id: 'persian-poetry',
          name: 'شعر فارسی',
          description: 'مجموعه‌ای از اشعار کلاسیک و معاصر فارسی',
          size: '850 MB',
          status: 'ready',
          downloaded: true,
          localPath: '/datasets/persian-poetry',
          lastUpdated: subDays(new Date(), 1).toISOString(),
          samples: 15000,
          category: 'poetry'
        },
        {
          id: 'persian-conversations',
          name: 'مکالمات فارسی',
          description: 'مجموعه‌ای از مکالمات روزمره فارسی',
          size: '1.5 GB',
          status: 'downloading',
          downloaded: false,
          progress: 30,
          category: 'conversation'
        }
      ]
    };
  }

  static getTrainingJobs() {
    return {
      ok: true,
      data: [
        {
          id: 'job-001',
          name: 'آموزش BERT فارسی',
          status: 'running',
          progress: 75,
          startTime: subHours(new Date(), 2).toISOString(),
          estimatedCompletion: subHours(new Date(), 1).toISOString(),
          model: 'bert-persian-base',
          dataset: 'persian-news-corpus',
          metrics: {
            epoch: 8,
            loss: 0.234,
            accuracy: 0.942
          }
        },
        {
          id: 'job-002',
          name: 'آموزش GPT-2 فارسی',
          status: 'completed',
          progress: 100,
          startTime: subDays(new Date(), 1).toISOString(),
          completionTime: subHours(new Date(), 3).toISOString(),
          model: 'gpt2-persian',
          dataset: 'persian-poetry',
          metrics: {
            epoch: 12,
            loss: 0.156,
            accuracy: 0.918
          }
        }
      ]
    };
  }

  static getAnalysisMetrics(metricType = 'accuracy', timeRange = '7d') {
    const baseValue = metricType === 'accuracy' ? 85 : 
                     metricType === 'performance' ? 78 : 
                     metricType === 'throughput' ? 1200 : 45;
    
    const data = Array.from({ length: 7 }, (_, i) => ({
      date: format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'),
      value: baseValue + (Math.random() - 0.5) * 10,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    }));

    return {
      ok: true,
      data: {
        metricType,
        timeRange,
        current: data[data.length - 1].value,
        previous: data[0].value,
        trend: data[data.length - 1].value > data[0].value ? 'up' : 'down',
        data
      }
    };
  }

  static getMenuCounts() {
    return {
      ok: true,
      data: {
        models: 12,
        datasets: 8,
        trainingJobs: 2,
        activeJobs: 1,
        completedJobs: 1,
        errors: 0
      }
    };
  }

  static getDownloaderStatus() {
    return {
      ok: true,
      data: {
        status: 'idle',
        activeDownloads: 0,
        completedDownloads: 0,
        failedDownloads: 0,
        items: {
          models: [],
          datasets: [],
          tts: []
        }
      }
    };
  }
}

export default MockDataService;

