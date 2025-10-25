// routes/lifecycle.js - Training Lifecycle with SSE Controls and Artifacts
import express from 'express';
import { EventEmitter } from 'events';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import hardwareProfiler from '../runtime/profile.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Training job management
class TrainingLifecycleManager extends EventEmitter {
  constructor() {
    super();
    this.jobs = new Map();
    this.artifacts = new Map();
    this.sseClients = new Map();
    this.maxRetainedJobs = 100;
  }

  createJob(config) {
    const jobId = uuidv4();
    const job = {
      id: jobId,
      status: 'created',
      config: config,
      progress: 0,
      stage: 'initializing',
      startTime: null,
      endTime: null,
      duration: null,
      artifacts: [],
      logs: [],
      metrics: {},
      error: null,
      created: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.jobs.set(jobId, job);
    this.emit('job:created', job);
    
    // Clean up old jobs if needed
    this.cleanupOldJobs();
    
    return job;
  }

  updateJob(jobId, updates) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    Object.assign(job, updates, { updatedAt: new Date().toISOString() });
    this.jobs.set(jobId, job);
    
    // Emit to SSE clients
    this.broadcastToClients(jobId, {
      type: 'job:updated',
      jobId: jobId,
      data: job
    });

    this.emit('job:updated', job);
    return job;
  }

  addLog(jobId, level, message, data = null) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level,
      message: message,
      data: data
    };

    job.logs.push(logEntry);
    
    // Keep only last 1000 log entries
    if (job.logs.length > 1000) {
      job.logs = job.logs.slice(-1000);
    }

    this.updateJob(jobId, { logs: job.logs });
    
    // Emit log to SSE clients
    this.broadcastToClients(jobId, {
      type: 'log',
      jobId: jobId,
      data: logEntry
    });
  }

  addArtifact(jobId, artifact) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    const artifactId = uuidv4();
    const artifactData = {
      id: artifactId,
      jobId: jobId,
      ...artifact,
      created: new Date().toISOString()
    };

    job.artifacts.push(artifactId);
    this.artifacts.set(artifactId, artifactData);
    
    this.updateJob(jobId, { artifacts: job.artifacts });
    
    // Emit artifact to SSE clients
    this.broadcastToClients(jobId, {
      type: 'artifact:created',
      jobId: jobId,
      data: artifactData
    });

    return artifactData;
  }

  updateMetrics(jobId, metrics) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.metrics = { ...job.metrics, ...metrics };
    this.updateJob(jobId, { metrics: job.metrics });
    
    // Emit metrics to SSE clients
    this.broadcastToClients(jobId, {
      type: 'metrics:updated',
      jobId: jobId,
      data: metrics
    });
  }

  addSSEClient(jobId, res) {
    if (!this.sseClients.has(jobId)) {
      this.sseClients.set(jobId, new Set());
    }
    this.sseClients.get(jobId).add(res);

    // Send initial job state
    const job = this.jobs.get(jobId);
    if (job) {
      this.sendSSEMessage(res, {
        type: 'job:state',
        jobId: jobId,
        data: job
      });
    }
  }

  removeSSEClient(jobId, res) {
    const clients = this.sseClients.get(jobId);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        this.sseClients.delete(jobId);
      }
    }
  }

  broadcastToClients(jobId, message) {
    const clients = this.sseClients.get(jobId);
    if (!clients) return;

    clients.forEach(res => {
      this.sendSSEMessage(res, message);
    });
  }

  sendSSEMessage(res, message) {
    try {
      const data = JSON.stringify(message);
      res.write(`data: ${data}\n\n`);
    } catch (error) {
      console.error('❌ Error sending SSE message:', error);
    }
  }

  cleanupOldJobs() {
    const jobs = Array.from(this.jobs.values());
    if (jobs.length <= this.maxRetainedJobs) return;

    // Sort by creation date and remove oldest
    jobs.sort((a, b) => new Date(a.created) - new Date(b.created));
    const toRemove = jobs.slice(0, jobs.length - this.maxRetainedJobs);

    toRemove.forEach(job => {
      this.jobs.delete(job.id);
      // Clean up artifacts
      job.artifacts.forEach(artifactId => {
        this.artifacts.delete(artifactId);
      });
    });
  }

  getJob(jobId) {
    return this.jobs.get(jobId);
  }

  getAllJobs() {
    return Array.from(this.jobs.values());
  }

  getArtifact(artifactId) {
    return this.artifacts.get(artifactId);
  }

  getJobArtifacts(jobId) {
    const job = this.jobs.get(jobId);
    if (!job) return [];
    
    return job.artifacts.map(id => this.artifacts.get(id)).filter(Boolean);
  }
}

// Global lifecycle manager
const lifecycleManager = new TrainingLifecycleManager();

// Simulate training process
async function simulateTraining(jobId, config) {
  const stages = [
    { name: 'preparing', duration: 2000, progress: 10 },
    { name: 'loading_data', duration: 3000, progress: 25 },
    { name: 'initializing_model', duration: 2000, progress: 35 },
    { name: 'training', duration: 15000, progress: 90 },
    { name: 'evaluating', duration: 2000, progress: 95 },
    { name: 'saving', duration: 1000, progress: 100 }
  ];

  lifecycleManager.updateJob(jobId, {
    status: 'running',
    startTime: new Date().toISOString(),
    stage: 'preparing'
  });

  lifecycleManager.addLog(jobId, 'info', 'Training started', { config });

  try {
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      
      lifecycleManager.updateJob(jobId, {
        stage: stage.name,
        progress: stage.progress
      });

      lifecycleManager.addLog(jobId, 'info', `Stage: ${stage.name}`, { 
        stage: i + 1, 
        total: stages.length 
      });

      // Simulate stage work
      await new Promise(resolve => setTimeout(resolve, stage.duration));

      // Add some metrics during training
      if (stage.name === 'training') {
        for (let epoch = 1; epoch <= 5; epoch++) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const loss = 1.0 - (epoch * 0.15) + (Math.random() * 0.1);
          const accuracy = 0.5 + (epoch * 0.08) + (Math.random() * 0.05);
          
          lifecycleManager.updateMetrics(jobId, {
            epoch: epoch,
            loss: loss.toFixed(4),
            accuracy: accuracy.toFixed(4),
            learning_rate: 0.001
          });

          lifecycleManager.addLog(jobId, 'info', `Epoch ${epoch}/5 completed`, {
            epoch,
            loss: loss.toFixed(4),
            accuracy: accuracy.toFixed(4)
          });

          // Create training artifact
          if (epoch % 2 === 0) {
            lifecycleManager.addArtifact(jobId, {
              type: 'checkpoint',
              name: `checkpoint_epoch_${epoch}.json`,
              path: `/artifacts/${jobId}/checkpoint_epoch_${epoch}.json`,
              size: Math.floor(Math.random() * 1000000) + 500000,
              metadata: {
                epoch: epoch,
                loss: loss.toFixed(4),
                accuracy: accuracy.toFixed(4)
              }
            });
          }
        }
      }
    }

    // Create final artifacts
    lifecycleManager.addArtifact(jobId, {
      type: 'model',
      name: 'final_model.bin',
      path: `/artifacts/${jobId}/final_model.bin`,
      size: Math.floor(Math.random() * 5000000) + 2000000,
      metadata: {
        final_accuracy: '0.94',
        model_type: config.modelType || 'transformer'
      }
    });

    lifecycleManager.addArtifact(jobId, {
      type: 'report',
      name: 'training_report.json',
      path: `/artifacts/${jobId}/training_report.json`,
      size: 15420,
      metadata: {
        total_epochs: 5,
        final_loss: '0.25',
        training_time: '15 minutes'
      }
    });

    lifecycleManager.updateJob(jobId, {
      status: 'completed',
      endTime: new Date().toISOString(),
      progress: 100,
      stage: 'completed'
    });

    lifecycleManager.addLog(jobId, 'success', 'Training completed successfully');

  } catch (error) {
    lifecycleManager.updateJob(jobId, {
      status: 'failed',
      endTime: new Date().toISOString(),
      error: error.message
    });

    lifecycleManager.addLog(jobId, 'error', 'Training failed', { error: error.message });
  }
}

// Routes

// POST /api/lifecycle/jobs - Create new training job
router.post('/jobs', async (req, res) => {
  try {
    const config = req.body;
    
    // Validate config
    if (!config.modelType || !config.datasetPath) {
      return res.status(400).json({
        ok: false,
        error: 'modelType and datasetPath are required'
      });
    }

    // Get optimal settings from hardware profiler
    const optimalSettings = await hardwareProfiler.getOptimalSettings();
    
    // Merge with user config
    const finalConfig = {
      ...config,
      hardwareOptimized: true,
      optimalSettings: optimalSettings
    };

    const job = lifecycleManager.createJob(finalConfig);
    
    // Start training asynchronously
    simulateTraining(job.id, finalConfig).catch(error => {
      console.error('❌ Training simulation error:', error);
    });

    res.json({
      ok: true,
      data: job
    });
  } catch (error) {
    console.error('❌ Error creating training job:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to create training job'
    });
  }
});

// GET /api/lifecycle/jobs - List all jobs
router.get('/jobs', (req, res) => {
  try {
    const { status, limit = 50 } = req.query;
    let jobs = lifecycleManager.getAllJobs();
    
    if (status) {
      jobs = jobs.filter(job => job.status === status);
    }
    
    // Sort by creation date (newest first)
    jobs.sort((a, b) => new Date(b.created) - new Date(a.created));
    
    // Apply limit
    jobs = jobs.slice(0, parseInt(limit));

    res.json({
      ok: true,
      data: {
        jobs: jobs,
        total: jobs.length
      }
    });
  } catch (error) {
    console.error('❌ Error listing jobs:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to list jobs'
    });
  }
});

// GET /api/lifecycle/jobs/:id - Get specific job
router.get('/jobs/:id', (req, res) => {
  try {
    const jobId = req.params.id;
    const job = lifecycleManager.getJob(jobId);
    
    if (!job) {
      return res.status(404).json({
        ok: false,
        error: 'Job not found'
      });
    }

    res.json({
      ok: true,
      data: job
    });
  } catch (error) {
    console.error('❌ Error getting job:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get job'
    });
  }
});

// GET /api/lifecycle/jobs/:id/stream - SSE stream for job updates
router.get('/jobs/:id/stream', (req, res) => {
  const jobId = req.params.id;
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  // Add client to SSE clients
  lifecycleManager.addSSEClient(jobId, res);

  // Handle client disconnect
  req.on('close', () => {
    lifecycleManager.removeSSEClient(jobId, res);
  });

  req.on('aborted', () => {
    lifecycleManager.removeSSEClient(jobId, res);
  });
});

// POST /api/lifecycle/jobs/:id/control - Control job (pause/resume/stop)
router.post('/jobs/:id/control', (req, res) => {
  try {
    const jobId = req.params.id;
    const { action } = req.body;
    
    const job = lifecycleManager.getJob(jobId);
    if (!job) {
      return res.status(404).json({
        ok: false,
        error: 'Job not found'
      });
    }

    switch (action) {
      case 'pause':
        if (job.status === 'running') {
          lifecycleManager.updateJob(jobId, { status: 'paused' });
          lifecycleManager.addLog(jobId, 'info', 'Job paused by user');
        }
        break;
        
      case 'resume':
        if (job.status === 'paused') {
          lifecycleManager.updateJob(jobId, { status: 'running' });
          lifecycleManager.addLog(jobId, 'info', 'Job resumed by user');
        }
        break;
        
      case 'stop':
        if (['running', 'paused'].includes(job.status)) {
          lifecycleManager.updateJob(jobId, { 
            status: 'stopped',
            endTime: new Date().toISOString()
          });
          lifecycleManager.addLog(jobId, 'warning', 'Job stopped by user');
        }
        break;
        
      default:
        return res.status(400).json({
          ok: false,
          error: 'Invalid action. Use: pause, resume, or stop'
        });
    }

    res.json({
      ok: true,
      data: {
        message: `Job ${action} successful`,
        job: lifecycleManager.getJob(jobId)
      }
    });
  } catch (error) {
    console.error('❌ Error controlling job:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to control job'
    });
  }
});

// GET /api/lifecycle/jobs/:id/logs - Get job logs
router.get('/jobs/:id/logs', (req, res) => {
  try {
    const jobId = req.params.id;
    const { level, limit = 100 } = req.query;
    
    const job = lifecycleManager.getJob(jobId);
    if (!job) {
      return res.status(404).json({
        ok: false,
        error: 'Job not found'
      });
    }

    let logs = job.logs;
    
    if (level) {
      logs = logs.filter(log => log.level === level);
    }
    
    // Get latest logs
    logs = logs.slice(-parseInt(limit));

    res.json({
      ok: true,
      data: {
        jobId: jobId,
        logs: logs,
        total: logs.length
      }
    });
  } catch (error) {
    console.error('❌ Error getting job logs:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get job logs'
    });
  }
});

// GET /api/lifecycle/jobs/:id/artifacts - Get job artifacts
router.get('/jobs/:id/artifacts', (req, res) => {
  try {
    const jobId = req.params.id;
    const artifacts = lifecycleManager.getJobArtifacts(jobId);
    
    res.json({
      ok: true,
      data: {
        jobId: jobId,
        artifacts: artifacts,
        total: artifacts.length
      }
    });
  } catch (error) {
    console.error('❌ Error getting job artifacts:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get job artifacts'
    });
  }
});

// GET /api/lifecycle/artifacts/:id - Get specific artifact
router.get('/artifacts/:id', (req, res) => {
  try {
    const artifactId = req.params.id;
    const artifact = lifecycleManager.getArtifact(artifactId);
    
    if (!artifact) {
      return res.status(404).json({
        ok: false,
        error: 'Artifact not found'
      });
    }

    res.json({
      ok: true,
      data: artifact
    });
  } catch (error) {
    console.error('❌ Error getting artifact:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get artifact'
    });
  }
});

// GET /api/lifecycle/stats - Get lifecycle statistics
router.get('/stats', (req, res) => {
  try {
    const jobs = lifecycleManager.getAllJobs();
    
    const stats = {
      total: jobs.length,
      running: jobs.filter(j => j.status === 'running').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      failed: jobs.filter(j => j.status === 'failed').length,
      paused: jobs.filter(j => j.status === 'paused').length,
      stopped: jobs.filter(j => j.status === 'stopped').length,
      totalArtifacts: lifecycleManager.artifacts.size,
      activeSSEConnections: Array.from(lifecycleManager.sseClients.values())
        .reduce((sum, clients) => sum + clients.size, 0)
    };

    res.json({
      ok: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error getting lifecycle stats:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to get lifecycle stats'
    });
  }
});

export default router;
export { lifecycleManager };