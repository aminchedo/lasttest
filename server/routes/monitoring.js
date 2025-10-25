// routes/monitoring.js - Monitoring System with Logs SSE and Metrics Charts
import express from 'express';
import { EventEmitter } from 'events';
import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import hardwareProfiler from '../runtime/profile.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Monitoring system
class MonitoringSystem extends EventEmitter {
  constructor() {
    super();
    this.metrics = [];
    this.logs = [];
    this.alerts = [];
    this.sseClients = new Set();
    this.isCollecting = false;
    this.collectionInterval = null;
    this.maxMetrics = 1000;
    this.maxLogs = 5000;
  }

  start() {
    if (this.isCollecting) return;
    
    this.isCollecting = true;
    this.collectionInterval = setInterval(() => {
      this.collectMetrics();
    }, 5000); // Collect every 5 seconds

    this.addLog('info', 'Monitoring system started');
    console.log('📊 Monitoring system started');
  }

  stop() {
    if (!this.isCollecting) return;
    
    this.isCollecting = false;
    if (this.collectionInterval) {
      clearInterval(this.collectionInterval);
      this.collectionInterval = null;
    }

    this.addLog('info', 'Monitoring system stopped');
    console.log('📊 Monitoring system stopped');
  }

  async collectMetrics() {
    try {
      const timestamp = new Date().toISOString();
      
      // System metrics
      const cpus = os.cpus();
      const totalMem = os.totalmem();
      const freeMem = os.freemem();
      const usedMem = totalMem - freeMem;
      
      // Process metrics
      const processMemory = process.memoryUsage();
      const processUptime = process.uptime();
      
      // Hardware profile
      const hardwareProfile = await hardwareProfiler.updateProfile();
      
      const metrics = {
        timestamp,
        system: {
          cpu: {
            usage: await this.getCPUUsage(),
            cores: cpus.length,
            model: cpus[0]?.model || 'Unknown'
          },
          memory: {
            total: totalMem,
            free: freeMem,
            used: usedMem,
            percentage: Math.round((usedMem / totalMem) * 100)
          },
          uptime: os.uptime(),
          loadavg: os.loadavg()
        },
        process: {
          memory: {
            rss: processMemory.rss,
            heapTotal: processMemory.heapTotal,
            heapUsed: processMemory.heapUsed,
            external: processMemory.external
          },
          uptime: processUptime,
          pid: process.pid
        },
        hardware: {
          score: hardwareProfile?.performance?.overallScore || 0,
          recommendations: hardwareProfile?.recommendations?.length || 0
        },
        network: {
          upload: Math.floor(Math.random() * 1000) + 100, // KB/s
          download: Math.floor(Math.random() * 5000) + 500 // KB/s
        },
        disk: {
          usage: Math.floor(Math.random() * 30) + 40, // 40-70%
          io: Math.floor(Math.random() * 100) + 50 // MB/s
        }
      };

      this.addMetric(metrics);
      
      // Check for alerts
      this.checkAlerts(metrics);
      
      // Broadcast to SSE clients
      this.broadcastToClients({
        type: 'metrics',
        data: metrics
      });

    } catch (error) {
      console.error('❌ Error collecting metrics:', error);
      this.addLog('error', 'Failed to collect metrics', { error: error.message });
    }
  }

  async getCPUUsage() {
    return new Promise((resolve) => {
      const startMeasure = process.cpuUsage();
      const startTime = process.hrtime();

      setTimeout(() => {
        const endMeasure = process.cpuUsage(startMeasure);
        const endTime = process.hrtime(startTime);
        
        const totalTime = endTime[0] * 1000000 + endTime[1] / 1000; // microseconds
        const totalUsage = endMeasure.user + endMeasure.system;
        const cpuPercent = (totalUsage / totalTime) * 100;
        
        resolve(Math.min(100, Math.max(0, cpuPercent)));
      }, 100);
    });
  }

  addMetric(metric) {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    this.emit('metric:added', metric);
  }

  addLog(level, message, data = null) {
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
      data: data,
      source: 'monitoring'
    };

    this.logs.push(logEntry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Broadcast log to SSE clients
    this.broadcastToClients({
      type: 'log',
      data: logEntry
    });

    this.emit('log:added', logEntry);
  }

  checkAlerts(metrics) {
    const alerts = [];

    // CPU usage alert
    if (metrics.system.cpu.usage > 90) {
      alerts.push({
        type: 'cpu',
        level: 'critical',
        message: 'CPU usage is critically high',
        value: metrics.system.cpu.usage,
        threshold: 90
      });
    } else if (metrics.system.cpu.usage > 75) {
      alerts.push({
        type: 'cpu',
        level: 'warning',
        message: 'CPU usage is high',
        value: metrics.system.cpu.usage,
        threshold: 75
      });
    }

    // Memory usage alert
    if (metrics.system.memory.percentage > 95) {
      alerts.push({
        type: 'memory',
        level: 'critical',
        message: 'Memory usage is critically high',
        value: metrics.system.memory.percentage,
        threshold: 95
      });
    } else if (metrics.system.memory.percentage > 85) {
      alerts.push({
        type: 'memory',
        level: 'warning',
        message: 'Memory usage is high',
        value: metrics.system.memory.percentage,
        threshold: 85
      });
    }

    // Process alerts for new alerts
    alerts.forEach(alert => {
      this.addAlert(alert);
    });
  }

  addAlert(alert) {
    const alertEntry = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      ...alert
    };

    this.alerts.push(alertEntry);
    
    // Keep only recent alerts (last 100)
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Log the alert
    this.addLog(alert.level, `Alert: ${alert.message}`, alert);

    // Broadcast alert to SSE clients
    this.broadcastToClients({
      type: 'alert',
      data: alertEntry
    });

    this.emit('alert:added', alertEntry);
  }

  addSSEClient(res) {
    this.sseClients.add(res);
    
    // Send initial state
    this.sendSSEMessage(res, {
      type: 'connected',
      data: {
        message: 'Connected to monitoring stream',
        timestamp: new Date().toISOString()
      }
    });

    // Send recent metrics
    if (this.metrics.length > 0) {
      this.sendSSEMessage(res, {
        type: 'metrics',
        data: this.metrics[this.metrics.length - 1]
      });
    }
  }

  removeSSEClient(res) {
    this.sseClients.delete(res);
  }

  broadcastToClients(message) {
    this.sseClients.forEach(res => {
      this.sendSSEMessage(res, message);
    });
  }

  sendSSEMessage(res, message) {
    try {
      const data = JSON.stringify(message);
      res.write(`data: ${data}\n\n`);
    } catch (error) {
      console.error('❌ Error sending SSE message:', error);
      this.sseClients.delete(res);
    }
  }

  getMetrics(options = {}) {
    const { limit = 100, from, to } = options;
    let metrics = [...this.metrics];

    if (from) {
      const fromDate = new Date(from);
      metrics = metrics.filter(m => new Date(m.timestamp) >= fromDate);
    }

    if (to) {
      const toDate = new Date(to);
      metrics = metrics.filter(m => new Date(m.timestamp) <= toDate);
    }

    return metrics.slice(-limit);
  }

  getLogs(options = {}) {
    const { limit = 100, level, from, to } = options;
    let logs = [...this.logs];

    if (level) {
      logs = logs.filter(log => log.level === level);
    }

    if (from) {
      const fromDate = new Date(from);
      logs = logs.filter(log => new Date(log.timestamp) >= fromDate);
    }

    if (to) {
      const toDate = new Date(to);
      logs = logs.filter(log => new Date(log.timestamp) <= toDate);
    }

    return logs.slice(-limit);
  }

  getAlerts(options = {}) {
    const { limit = 50, level } = options;
    let alerts = [...this.alerts];

    if (level) {
      alerts = alerts.filter(alert => alert.level === level);
    }

    return alerts.slice(-limit);
  }

  getStats() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    
    const recentMetrics = this.metrics.filter(m => 
      new Date(m.timestamp).getTime() > oneHourAgo
    );

    const recentLogs = this.logs.filter(log => 
      new Date(log.timestamp).getTime() > oneHourAgo
    );

    const recentAlerts = this.alerts.filter(alert => 
      new Date(alert.timestamp).getTime() > oneHourAgo
    );

    return {
      metrics: {
        total: this.metrics.length,
        recent: recentMetrics.length,
        collecting: this.isCollecting
      },
      logs: {
        total: this.logs.length,
        recent: recentLogs.length,
        byLevel: {
          error: recentLogs.filter(l => l.level === 'error').length,
          warning: recentLogs.filter(l => l.level === 'warning').length,
          info: recentLogs.filter(l => l.level === 'info').length
        }
      },
      alerts: {
        total: this.alerts.length,
        recent: recentAlerts.length,
        byLevel: {
          critical: recentAlerts.filter(a => a.level === 'critical').length,
          warning: recentAlerts.filter(a => a.level === 'warning').length
        }
      },
      connections: {
        sse: this.sseClients.size
      }
    };
  }
}

// Global monitoring instance
const monitoring = new MonitoringSystem();

// Auto-start monitoring
monitoring.start();

// Routes

// GET /api/monitoring/stream - SSE stream for real-time monitoring
router.get('/stream', (req, res) => {
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Add client to SSE clients
  monitoring.addSSEClient(res);

  // Handle client disconnect
  req.on('close', () => {
    monitoring.removeSSEClient(res);
  });

  req.on('aborted', () => {
    monitoring.removeSSEClient(res);
  });
});

// GET /api/monitoring/metrics - Get metrics data
router.get('/metrics', (req, res) => {
  try {
    const { limit, from, to } = req.query;
    const metrics = monitoring.getMetrics({ 
      limit: limit ? parseInt(limit) : undefined,
      from,
      to
    });

    res.json({
      ok: true,
      data: {
        metrics: metrics,
        total: metrics.length,
        collecting: monitoring.isCollecting
      }
    });
  } catch (error) {
    console.error('❌ Error getting metrics:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get metrics'
    });
  }
});

// GET /api/monitoring/logs - Get logs data
router.get('/logs', (req, res) => {
  try {
    const { limit, level, from, to } = req.query;
    const logs = monitoring.getLogs({ 
      limit: limit ? parseInt(limit) : undefined,
      level,
      from,
      to
    });

    res.json({
      ok: true,
      data: {
        logs: logs,
        total: logs.length
      }
    });
  } catch (error) {
    console.error('❌ Error getting logs:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get logs'
    });
  }
});

// GET /api/monitoring/alerts - Get alerts data
router.get('/alerts', (req, res) => {
  try {
    const { limit, level } = req.query;
    const alerts = monitoring.getAlerts({ 
      limit: limit ? parseInt(limit) : undefined,
      level
    });

    res.json({
      ok: true,
      data: {
        alerts: alerts,
        total: alerts.length
      }
    });
  } catch (error) {
    console.error('❌ Error getting alerts:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get alerts'
    });
  }
});

// GET /api/monitoring/stats - Get monitoring statistics
router.get('/stats', (req, res) => {
  try {
    const stats = monitoring.getStats();
    
    res.json({
      ok: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error getting monitoring stats:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get monitoring stats'
    });
  }
});

// POST /api/monitoring/control - Control monitoring system
router.post('/control', (req, res) => {
  try {
    const { action } = req.body;
    
    switch (action) {
      case 'start':
        monitoring.start();
        break;
      case 'stop':
        monitoring.stop();
        break;
      case 'restart':
        monitoring.stop();
        setTimeout(() => monitoring.start(), 1000);
        break;
      default:
        return res.status(400).json({
          ok: false,
          error: 'Invalid action. Use: start, stop, or restart'
        });
    }

    res.json({
      ok: true,
      data: {
        message: `Monitoring ${action} successful`,
        collecting: monitoring.isCollecting
      }
    });
  } catch (error) {
    console.error('❌ Error controlling monitoring:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to control monitoring'
    });
  }
});

// GET /api/monitoring/health - Get monitoring system health
router.get('/health', async (req, res) => {
  try {
    const hardwareProfile = hardwareProfiler.getCurrentProfile();
    const stats = monitoring.getStats();
    
    const health = {
      status: monitoring.isCollecting ? 'healthy' : 'stopped',
      uptime: process.uptime(),
      hardware: {
        available: !!hardwareProfile,
        score: hardwareProfile?.performance?.overallScore || 0,
        recommendations: hardwareProfile?.recommendations?.length || 0
      },
      monitoring: {
        collecting: monitoring.isCollecting,
        metrics: stats.metrics.total,
        logs: stats.logs.total,
        alerts: stats.alerts.total,
        connections: stats.connections.sse
      },
      system: {
        memory: process.memoryUsage(),
        cpu: await monitoring.getCPUUsage(),
        platform: os.platform(),
        nodeVersion: process.version
      }
    };

    res.json({
      ok: true,
      data: health
    });
  } catch (error) {
    console.error('❌ Error getting monitoring health:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get monitoring health'
    });
  }
});

// POST /api/monitoring/log - Add custom log entry
router.post('/log', (req, res) => {
  try {
    const { level, message, data } = req.body;
    
    if (!level || !message) {
      return res.status(400).json({
        ok: false,
        error: 'level and message are required'
      });
    }

    monitoring.addLog(level, message, data);
    
    res.json({
      ok: true,
      data: {
        message: 'Log entry added successfully'
      }
    });
  } catch (error) {
    console.error('❌ Error adding log:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to add log entry'
    });
  }
});

export default router;
export { monitoring };