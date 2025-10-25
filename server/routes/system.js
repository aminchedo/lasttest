// System Metrics API - Real System Data (No Mock Data)
import express from 'express';
import os from 'os';
import { exec } from 'child_process';
import util from 'util';

const router = express.Router();
const execPromise = util.promisify(exec);

/**
 * Get real CPU usage
 */
async function getCPUUsage() {
  return new Promise((resolve) => {
    const startMeasure = cpuAverage();
    
    setTimeout(() => {
      const endMeasure = cpuAverage();
      const idleDifference = endMeasure.idle - startMeasure.idle;
      const totalDifference = endMeasure.total - startMeasure.total;
      const percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);
      resolve(percentageCPU);
    }, 100);
  });
}

function cpuAverage() {
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;

  cpus.forEach(cpu => {
    for (let type in cpu.times) {
      totalMs += cpu.times[type];
    }
    idleMs += cpu.times.idle;
  });

  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length
  };
}

/**
 * Get real memory usage
 */
function getMemoryUsage() {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const memoryUsagePercent = (usedMemory / totalMemory) * 100;
  
  return {
    total: totalMemory,
    used: usedMemory,
    free: freeMemory,
    percentage: memoryUsagePercent
  };
}

/**
 * Get real GPU usage (NVIDIA only for now)
 */
async function getGPUUsage() {
  try {
    // Try to get NVIDIA GPU stats
    const { stdout } = await execPromise('nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total --format=csv,noheader,nounits');
    
    const [gpuUtil, memUsed, memTotal] = stdout.trim().split(',').map(s => parseFloat(s.trim()));
    
    return {
      available: true,
      utilization: gpuUtil,
      memoryUsed: memUsed,
      memoryTotal: memTotal,
      memoryPercent: (memUsed / memTotal) * 100
    };
  } catch (error) {
    // GPU not available or nvidia-smi not installed
    return {
      available: false,
      utilization: 0,
      memoryUsed: 0,
      memoryTotal: 0,
      memoryPercent: 0
    };
  }
}

/**
 * Get real disk usage
 */
async function getDiskUsage() {
  try {
    const platform = os.platform();
    let command;

    if (platform === 'win32') {
      // Windows: Use wmic
      command = 'wmic logicaldisk get size,freespace,caption';
    } else {
      // Linux/Mac: Use df
      command = 'df -k /';
    }

    const { stdout } = await execPromise(command);
    
    if (platform === 'win32') {
      // Parse Windows output
      const lines = stdout.trim().split('\n').slice(1);
      const drives = lines.map(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 3) {
          const caption = parts[0];
          const freeSpace = parseInt(parts[1]) || 0;
          const totalSpace = parseInt(parts[2]) || 0;
          return {
            drive: caption,
            total: totalSpace,
            free: freeSpace,
            used: totalSpace - freeSpace,
            percentage: totalSpace > 0 ? ((totalSpace - freeSpace) / totalSpace * 100) : 0
          };
        }
        return null;
      }).filter(d => d !== null);

      // Return C: drive or first available drive
      const cDrive = drives.find(d => d.drive.startsWith('C:')) || drives[0];
      return cDrive || { total: 0, free: 0, used: 0, percentage: 0 };
    } else {
      // Parse Unix output
      const lines = stdout.trim().split('\n');
      const data = lines[1].trim().split(/\s+/);
      const total = parseInt(data[1]) * 1024; // Convert KB to bytes
      const used = parseInt(data[2]) * 1024;
      const free = parseInt(data[3]) * 1024;
      
      return {
        total: total,
        used: used,
        free: free,
        percentage: (used / total) * 100
      };
    }
  } catch (error) {
    console.error('Error getting disk usage:', error.message);
    return { total: 0, free: 0, used: 0, percentage: 0 };
  }
}

/**
 * GET /api/system/metrics
 * Get REAL system metrics (CPU, Memory, GPU, Disk)
 */
router.get('/metrics', async (req, res) => {
  try {
    const [cpuUsage, memoryUsage, gpuUsage, diskUsage] = await Promise.all([
      getCPUUsage(),
      Promise.resolve(getMemoryUsage()),
      getGPUUsage(),
      getDiskUsage()
    ]);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      cpu: cpuUsage,
      memory: memoryUsage.percentage,
      memoryDetails: {
        total: memoryUsage.total,
        used: memoryUsage.used,
        free: memoryUsage.free,
        totalGB: (memoryUsage.total / 1024 / 1024 / 1024).toFixed(2),
        usedGB: (memoryUsage.used / 1024 / 1024 / 1024).toFixed(2)
      },
      gpu: gpuUsage.utilization,
      gpuDetails: gpuUsage,
      disk: diskUsage.percentage,
      diskDetails: {
        total: diskUsage.total,
        used: diskUsage.used,
        free: diskUsage.free,
        totalGB: (diskUsage.total / 1024 / 1024 / 1024).toFixed(2),
        usedGB: (diskUsage.used / 1024 / 1024 / 1024).toFixed(2),
        freeGB: (diskUsage.free / 1024 / 1024 / 1024).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error getting system metrics:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get system metrics',
      message: error.message
    });
  }
});

/**
 * GET /api/system/info
 * Get system information
 */
router.get('/info', (req, res) => {
  try {
    const systemInfo = {
      platform: os.platform(),
      arch: os.arch(),
      hostname: os.hostname(),
      cpus: os.cpus().length,
      cpuModel: os.cpus()[0]?.model || 'Unknown',
      totalMemory: os.totalmem(),
      totalMemoryGB: (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
      uptime: os.uptime(),
      uptimeFormatted: formatUptime(os.uptime()),
      nodeVersion: process.version,
      processUptime: process.uptime(),
      processUptimeFormatted: formatUptime(process.uptime())
    };

    res.json({
      success: true,
      info: systemInfo
    });
  } catch (error) {
    console.error('Error getting system info:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get system info',
      message: error.message
    });
  }
});

/**
 * Helper: Format uptime
 */
function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  
  return parts.join(' ') || '< 1m';
}

/**
 * GET /api/system/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    const cpuUsage = await getCPUUsage();
    const memoryUsage = getMemoryUsage();
    
    const health = {
      status: 'healthy',
      cpu: cpuUsage < 80 ? 'good' : 'warning',
      memory: memoryUsage.percentage < 80 ? 'good' : 'warning',
      uptime: process.uptime()
    };

    res.json({
      success: true,
      health: health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      message: error.message
    });
  }
});

export default router;
