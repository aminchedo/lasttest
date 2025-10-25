// server.js - Simple Express Backend Server
import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Basic health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    ok: true, 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Backend server is running successfully',
    version: '1.0.0'
  });
});

// Training status endpoint with realistic mock data
app.get('/api/training/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  
  // Realistic mock training status with valid progress numbers
  const mockStatus = {
    jobId,
    status: 'training',
    progress: 65.7, // Valid number for testing
    accuracy: 0.823,
    loss: 0.234,
    currentEpoch: 7,
    totalEpochs: 10,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    estimatedCompletion: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour from now
    metrics: {
      training_loss: 0.234,
      validation_loss: 0.287,
      learning_rate: 0.001
    }
  };
  
  res.json({ ok: true, data: mockStatus });
});

// Models endpoint
app.get('/api/models', (req, res) => {
  const mockModels = [
    {
      id: 'model-1',
      name: 'Persian Text Classification',
      type: 'text',
      status: 'ready',
      size: '450MB',
      accuracy: 0.89
    },
    {
      id: 'model-2', 
      name: 'Image Recognition',
      type: 'vision',
      status: 'ready',
      size: '780MB',
      accuracy: 0.92
    }
  ];
  
  res.json({ ok: true, data: mockModels });
});

// Analysis metrics endpoint
app.get('/api/analysis/metrics', (req, res) => {
  const { metric = 'accuracy', timeRange = '7d' } = req.query;
  
  const mockMetrics = [
    { date: '2024-01-01', accuracy: 0.75, loss: 0.45 },
    { date: '2024-01-02', accuracy: 0.82, loss: 0.32 },
    { date: '2024-01-03', accuracy: 0.85, loss: 0.25 },
    { date: '2024-01-04', accuracy: 0.87, loss: 0.21 },
    { date: '2024-01-05', accuracy: 0.89, loss: 0.18 }
  ];
  
  res.json({ ok: true, data: mockMetrics });
});

// Training jobs endpoint
app.get('/api/training/jobs', (req, res) => {
  const mockJobs = [
    {
      id: 'job-1',
      name: 'Text Classification Training',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'job-2',
      name: 'Image Model Fine-tuning',
      status: 'training',
      progress: 65.7,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  res.json({ ok: true, data: mockJobs });
});

// Dashboard stats endpoint
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    ok: true,
    data: {
      totalModels: 15,
      activeDownloads: 2,
      storageUsed: '4.2GB',
      availableStorage: '15.8GB',
      systemStatus: 'active',
      activeTrainings: 1,
      completedJobs: 24
    }
  });
});

// Start training endpoint
app.post('/api/training/start', (req, res) => {
  const { modelName, dataset, epochs } = req.body;
  
  const jobId = `job-${Date.now()}`;
  
  res.json({
    ok: true,
    jobId,
    message: 'Training started successfully',
    estimatedDuration: '2 hours'
  });
});

// 404 handler for undefined routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    ok: false,
    error: `Endpoint ${req.originalUrl} not found`,
    status: 404
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    ok: false,
    error: 'Internal server error',
    status: 500
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🤖 Training status: http://localhost:${PORT}/api/training/status/test-job`);
  console.log(`📈 API is ready to receive requests!`);
});

export default app;
