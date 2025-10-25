// runtime/profile.js - Hardware Auto-Adaptation System
import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class HardwareProfiler {
  constructor() {
    this.profile = null;
    this.lastUpdate = null;
    this.updateInterval = 30000; // 30 seconds
  }

  async detectHardware() {
    try {
      const cpus = os.cpus();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const platform = os.platform();
      const arch = os.arch();

      // GPU Detection (basic)
      let gpuInfo = await this.detectGPU();

      // Storage Detection
      let storageInfo = await this.detectStorage();

      const profile = {
        cpu: {
          model: cpus[0]?.model || 'Unknown',
          cores: cpus.length,
          speed: cpus[0]?.speed || 0,
          architecture: arch
        },
        memory: {
          total: totalMem,
          free: freeMem,
          used: totalMem - freeMem,
          percentage: Math.round(((totalMem - freeMem) / totalMem) * 100)
        },
        gpu: gpuInfo,
        storage: storageInfo,
        platform: {
          os: platform,
          arch: arch,
          nodeVersion: process.version,
          uptime: os.uptime()
        },
        performance: await this.benchmarkSystem(),
        recommendations: this.generateRecommendations({
          cpu: { cores: cpus.length, speed: cpus[0]?.speed },
          memory: { total: totalMem },
          gpu: gpuInfo
        }),
        timestamp: new Date().toISOString()
      };

      this.profile = profile;
      this.lastUpdate = Date.now();

      // Save profile to disk
      await this.saveProfile(profile);

      return profile;
    } catch (error) {
      console.error('❌ Hardware detection error:', error);
      return this.getDefaultProfile();
    }
  }

  async detectGPU() {
    try {
      // Basic GPU detection - can be enhanced with nvidia-ml-py equivalent
      const platform = os.platform();
      
      if (platform === 'win32') {
        // Windows GPU detection
        return {
          available: false,
          type: 'unknown',
          memory: 0,
          compute: 'cpu-only',
          driver: 'unknown'
        };
      } else if (platform === 'linux') {
        // Linux GPU detection
        try {
          const { exec } = await import('child_process');
          const { promisify } = await import('util');
          const execAsync = promisify(exec);
          
          const { stdout } = await execAsync('nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits');
          const lines = stdout.trim().split('\n');
          
          if (lines.length > 0 && lines[0] !== '') {
            const [name, memory] = lines[0].split(', ');
            return {
              available: true,
              type: 'nvidia',
              name: name.trim(),
              memory: parseInt(memory) * 1024 * 1024, // Convert MB to bytes
              compute: 'cuda',
              driver: 'nvidia'
            };
          }
        } catch (error) {
          // NVIDIA not available, try other detection methods
        }
      }

      return {
        available: false,
        type: 'integrated',
        memory: 0,
        compute: 'cpu-only',
        driver: 'system'
      };
    } catch (error) {
      return {
        available: false,
        type: 'unknown',
        memory: 0,
        compute: 'cpu-only',
        driver: 'unknown'
      };
    }
  }

  async detectStorage() {
    try {
      const stats = await fs.stat(process.cwd());
      
      return {
        type: 'local',
        available: true,
        speed: 'standard', // Could be enhanced with actual speed tests
        path: process.cwd()
      };
    } catch (error) {
      return {
        type: 'unknown',
        available: false,
        speed: 'unknown',
        path: process.cwd()
      };
    }
  }

  async benchmarkSystem() {
    const start = process.hrtime.bigint();
    
    // Simple CPU benchmark
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += Math.sqrt(i);
    }
    
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds

    return {
      cpuScore: Math.max(1, Math.round(10000 / duration)), // Higher is better
      memoryScore: Math.round(os.totalmem() / (1024 * 1024 * 1024)), // GB
      overallScore: this.calculateOverallScore(duration, os.totalmem())
    };
  }

  calculateOverallScore(cpuTime, totalMem) {
    const cpuScore = Math.max(1, Math.round(10000 / cpuTime));
    const memScore = Math.round(totalMem / (1024 * 1024 * 1024));
    return Math.round((cpuScore * 0.6) + (memScore * 0.4));
  }

  generateRecommendations(hardware) {
    const recommendations = [];

    // CPU recommendations
    if (hardware.cpu.cores < 4) {
      recommendations.push({
        type: 'cpu',
        level: 'warning',
        message: 'کم بودن تعداد هسته‌های پردازنده ممکن است سرعت آموزش را کاهش دهد',
        suggestion: 'استفاده از batch size کوچکتر توصیه می‌شود'
      });
    }

    // Memory recommendations
    const memoryGB = hardware.memory.total / (1024 * 1024 * 1024);
    if (memoryGB < 8) {
      recommendations.push({
        type: 'memory',
        level: 'error',
        message: 'حافظه سیستم کمتر از حد مطلوب است',
        suggestion: 'افزایش RAM یا استفاده از مدل‌های کوچکتر'
      });
    } else if (memoryGB < 16) {
      recommendations.push({
        type: 'memory',
        level: 'warning',
        message: 'حافظه سیستم برای مدل‌های بزرگ کافی نیست',
        suggestion: 'محدود کردن اندازه مدل یا batch size'
      });
    }

    // GPU recommendations
    if (!hardware.gpu.available) {
      recommendations.push({
        type: 'gpu',
        level: 'info',
        message: 'GPU در دسترس نیست - آموزش بر روی CPU انجام می‌شود',
        suggestion: 'برای سرعت بیشتر، استفاده از GPU توصیه می‌شود'
      });
    }

    return recommendations;
  }

  async saveProfile(profile) {
    try {
      const profileDir = path.join(__dirname, '../data/profiles');
      await fs.mkdir(profileDir, { recursive: true });
      
      const profilePath = path.join(profileDir, 'hardware-profile.json');
      await fs.writeFile(profilePath, JSON.stringify(profile, null, 2));
      
      console.log('✅ Hardware profile saved:', profilePath);
    } catch (error) {
      console.error('❌ Failed to save hardware profile:', error);
    }
  }

  async loadProfile() {
    try {
      const profilePath = path.join(__dirname, '../data/profiles/hardware-profile.json');
      const data = await fs.readFile(profilePath, 'utf8');
      const profile = JSON.parse(data);
      
      // Check if profile is recent (less than 1 hour old)
      const profileAge = Date.now() - new Date(profile.timestamp).getTime();
      if (profileAge < 3600000) { // 1 hour
        this.profile = profile;
        return profile;
      }
    } catch (error) {
      // Profile doesn't exist or is invalid
    }
    
    // Generate new profile
    return await this.detectHardware();
  }

  getDefaultProfile() {
    return {
      cpu: {
        model: 'Unknown',
        cores: 1,
        speed: 0,
        architecture: os.arch()
      },
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: 0,
        percentage: 0
      },
      gpu: {
        available: false,
        type: 'unknown',
        memory: 0,
        compute: 'cpu-only'
      },
      storage: {
        type: 'local',
        available: true,
        speed: 'standard'
      },
      platform: {
        os: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version
      },
      performance: {
        cpuScore: 50,
        memoryScore: 4,
        overallScore: 30
      },
      recommendations: [],
      timestamp: new Date().toISOString()
    };
  }

  async getOptimalSettings() {
    const profile = this.profile || await this.loadProfile();
    
    const settings = {
      training: {
        batchSize: this.calculateOptimalBatchSize(profile),
        workers: this.calculateOptimalWorkers(profile),
        memoryLimit: this.calculateMemoryLimit(profile),
        useGPU: profile.gpu.available,
        precision: profile.memory.total > 16 * 1024 * 1024 * 1024 ? 'float32' : 'float16'
      },
      inference: {
        batchSize: Math.max(1, Math.floor(profile.cpu.cores / 2)),
        cacheSize: Math.floor(profile.memory.free / (1024 * 1024 * 100)), // 100MB chunks
        useOptimization: profile.performance.overallScore > 50
      },
      system: {
        maxConcurrentJobs: Math.max(1, Math.floor(profile.cpu.cores / 2)),
        memoryThreshold: 0.8, // 80% memory usage threshold
        autoCleanup: profile.storage.available
      }
    };

    return settings;
  }

  calculateOptimalBatchSize(profile) {
    const memoryGB = profile.memory.total / (1024 * 1024 * 1024);
    const cores = profile.cpu.cores;
    
    if (profile.gpu.available) {
      const gpuMemoryGB = profile.gpu.memory / (1024 * 1024 * 1024);
      return Math.max(1, Math.min(32, Math.floor(gpuMemoryGB * 4)));
    }
    
    // CPU-only calculation
    if (memoryGB >= 32) return 16;
    if (memoryGB >= 16) return 8;
    if (memoryGB >= 8) return 4;
    return 2;
  }

  calculateOptimalWorkers(profile) {
    return Math.max(1, Math.min(profile.cpu.cores, 8));
  }

  calculateMemoryLimit(profile) {
    // Reserve 20% of memory for system
    return Math.floor(profile.memory.total * 0.8);
  }

  async updateProfile() {
    if (!this.lastUpdate || (Date.now() - this.lastUpdate) > this.updateInterval) {
      return await this.detectHardware();
    }
    return this.profile;
  }

  getCurrentProfile() {
    return this.profile;
  }

  getRecommendations() {
    return this.profile?.recommendations || [];
  }
}

// Singleton instance
const hardwareProfiler = new HardwareProfiler();

export default hardwareProfiler;
export { HardwareProfiler };