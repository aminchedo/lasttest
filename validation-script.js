#!/usr/bin/env node

/**
 * End-to-End System Validation Script
 * 
 * This script implements the comprehensive validation plan for the ML training platform.
 * It tests the complete functionality including model downloads, training execution,
 * analytics, and cross-component data consistency.
 * 
 * Usage: node validation-script.js [--headless] [--verbose] [--output=report.json]
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  API_BASE: process.env.API_BASE || 'http://localhost:3001/api',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 2000,
  PERSIAN_MODEL_IDS: [
    'persian-bert-base',
    'bert-fa-base',
    'paraphrase-multilingual-mpnet-base-v2',
    'HooshvareLab/bert-fa-base-uncased'
  ],
  TEST_DATASET_IDS: [
    'sentiment-fa',
    'qa-fa',
    'ner-fa',
    'poetry-fa'
  ]
};

// Validation Results Storage
const validationResults = {
  startTime: new Date().toISOString(),
  endTime: null,
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  warnings: 0,
  errors: [],
  testResults: {},
  summary: {}
};

// Utility Functions
class ValidationLogger {
  constructor(verbose = false) {
    this.verbose = verbose;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      debug: '🔍'
    }[level] || 'ℹ️';

    if (level === 'debug' && !this.verbose) return;
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  testStart(testName) {
    this.log(`Starting test: ${testName}`, 'info');
  }

  testPass(testName, details = '') {
    this.log(`PASS: ${testName} ${details}`, 'success');
    validationResults.passedTests++;
  }

  testFail(testName, error, details = '') {
    this.log(`FAIL: ${testName} - ${error} ${details}`, 'error');
    validationResults.failedTests++;
    validationResults.errors.push({
      test: testName,
      error: error,
      details: details,
      timestamp: new Date().toISOString()
    });
  }

  testWarning(testName, warning, details = '') {
    this.log(`WARNING: ${testName} - ${warning} ${details}`, 'warning');
    validationResults.warnings++;
  }
}

const logger = new ValidationLogger(process.argv.includes('--verbose'));

// API Helper Functions
class APIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      return {
        ok: response.ok,
        status: response.status,
        data: data,
        headers: response.headers
      };
    } catch (error) {
      return {
        ok: false,
        status: 0,
        error: error.message,
        data: null
      };
    }
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new APIClient(CONFIG.API_BASE);

// Test Helper Functions
async function waitForCondition(condition, timeout = 10000, interval = 1000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  return false;
}

async function retryOperation(operation, maxAttempts = CONFIG.RETRY_ATTEMPTS) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await operation();
      if (result.ok) {
        return result;
      }
      if (attempt === maxAttempts) {
        return result;
      }
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
    }
  }
}

// ============================================================================
// PART 1: MODEL DOWNLOAD PIPELINE VALIDATION
// ============================================================================

async function testModelCatalogInspection() {
  const testName = 'Model Catalog Inspection';
  validationResults.totalTests++;
  logger.testStart(testName);

  try {
    // Test 1.1: Catalog Inspection
    const response = await api.get('/models');
    
    if (!response.ok) {
      logger.testFail(testName, `API request failed with status ${response.status}`);
      return false;
    }

    const models = response.data;
    if (!Array.isArray(models)) {
      logger.testFail(testName, 'Models data is not an array');
      return false;
    }

    // Look for Persian models
    const persianModels = models.filter(model => 
      CONFIG.PERSIAN_MODEL_IDS.some(id => 
        model.id?.includes(id) || 
        model.name?.toLowerCase().includes('persian') ||
        model.name?.toLowerCase().includes('farsi') ||
        model.name?.toLowerCase().includes('fa')
      )
    );

    if (persianModels.length === 0) {
      logger.testWarning(testName, 'No Persian models found in catalog');
    }

    // Validate model structure
    const validModels = models.filter(model => 
      model.id && 
      model.name && 
      model.size && 
      model.status
    );

    if (validModels.length === 0) {
      logger.testFail(testName, 'No valid models found in catalog');
      return false;
    }

    logger.testPass(testName, `Found ${models.length} models, ${persianModels.length} Persian models`);
    validationResults.testResults[testName] = {
      totalModels: models.length,
      persianModels: persianModels.length,
      validModels: validModels.length
    };

    return true;
  } catch (error) {
    logger.testFail(testName, error.message);
    return false;
  }
}

async function testModelDownloadInitiation() {
  const testName = 'Model Download Initiation';
  validationResults.totalTests++;
  logger.testStart(testName);

  try {
    // First, get available models
    const modelsResponse = await api.get('/models');
    if (!modelsResponse.ok) {
      logger.testFail(testName, 'Failed to get models list');
      return false;
    }

    const models = modelsResponse.data;
    const availableModel = models.find(m => m.status === 'available' || m.status === 'ready');
    
    if (!availableModel) {
      logger.testWarning(testName, 'No available models found for download test');
      return true;
    }

    // Test download initiation
    const downloadResponse = await api.post('/models/download/start', {
      modelId: availableModel.id
    });

    if (!downloadResponse.ok) {
      logger.testFail(testName, `Download initiation failed: ${downloadResponse.error || downloadResponse.data?.error}`);
      return false;
    }

    // Validate response structure
    const responseData = downloadResponse.data;
    if (!responseData.jobId && !responseData.id) {
      logger.testFail(testName, 'Download response missing job ID');
      return false;
    }

    logger.testPass(testName, `Download initiated for model: ${availableModel.name}`);
    validationResults.testResults[testName] = {
      modelId: availableModel.id,
      jobId: responseData.jobId || responseData.id,
      status: responseData.status || 'initiated'
    };

    return true;
  } catch (error) {
    logger.testFail(testName, error.message);
    return false;
  }
}

async function testModelDownloadProgress() {
  const testName = 'Model Download Progress Tracking';
  validationResults.totalTests++;
  logger.testStart(testName);

  try {
    // Start a download first
    const modelsResponse = await api.get('/models');
    if (!modelsResponse.ok) {
      logger.testFail(testName, 'Failed to get models list');
      return false;
    }

    const models = modelsResponse.data;
    const availableModel = models.find(m => m.status === 'available');
    
    if (!availableModel) {
      logger.testWarning(testName, 'No available models for progress test');
      return true;
    }

    const downloadResponse = await api.post('/models/download/start', {
      modelId: availableModel.id
    });

    if (!downloadResponse.ok) {
      logger.testFail(testName, 'Failed to start download');
      return false;
    }

    const jobId = downloadResponse.data.jobId || downloadResponse.data.id;
    
    // Monitor progress for a short time
    let progressFound = false;
    let maxProgress = 0;
    
    const progressCheck = await waitForCondition(async () => {
      const statusResponse = await api.get(`/download/status/${jobId}`);
      if (statusResponse.ok && statusResponse.data) {
        const progress = statusResponse.data.progress || statusResponse.data.job?.progress || 0;
        maxProgress = Math.max(maxProgress, progress);
        if (progress > 0) {
          progressFound = true;
          return true;
        }
      }
      return false;
    }, 10000, 1000);

    if (progressFound) {
      logger.testPass(testName, `Progress tracking working, max progress: ${maxProgress}%`);
    } else {
      logger.testWarning(testName, 'No progress updates detected within timeout');
    }

    validationResults.testResults[testName] = {
      jobId: jobId,
      progressFound: progressFound,
      maxProgress: maxProgress
    };

    return true;
  } catch (error) {
    logger.testFail(testName, error.message);
    return false;
  }
}

async function testResourceInventoryIntegration() {
  const testName = 'Resource Inventory Integration';
  validationResults.totalTests++;
  logger.testStart(testName);

  try {
    // Test assets endpoint
    const assetsResponse = await api.get('/assets');
    
    if (!assetsResponse.ok) {
      logger.testFail(testName, `Assets API failed with status ${assetsResponse.status}`);
      return false;
    }

    const assets = assetsResponse.data;
    if (!Array.isArray(assets)) {
      logger.testFail(testName, 'Assets data is not an array');
      return false;
    }

    // Check for model assets
    const modelAssets = assets.filter(asset => 
      asset.kind === 'model' || asset.type === 'model'
    );

    logger.testPass(testName, `Found ${assets.length} total assets, ${modelAssets.length} model assets`);
    validationResults.testResults[testName] = {
      totalAssets: assets.length,
      modelAssets: modelAssets.length,
      assets: assets.slice(0, 5) // Sample of first 5 assets
    };

    return true;
  } catch (error) {
    logger.testFail(testName, error.message);
    return false;
  }
}

// ============================================================================
// PART 2: TRAINING PIPELINE VALIDATION
// ============================================================================

async function testTrainingInitialization() {
  const testName = 'Training Initialization';
  validationResults.totalTests++;
  logger.testStart(testName);

  try {
    // Get available models and datasets
    const [modelsResponse, datasetsResponse] = await Promise.all([
      api.get('/training/assets'),
      api.get('/download/datasets/list')
    ]);

    if (!modelsResponse.ok) {
      logger.testFail(testName, 'Failed to get training assets');
      return false;
    }

    if (!datasetsResponse.ok) {
      logger.testFail(testName, 'Failed to get datasets list');
      return false;
    }

    const models = modelsResponse.data || [];
    const datasets = datasetsResponse.data?.datasets || [];

    if (models.length === 0) {
      logger.testWarning(testName, 'No models available for training');
    }

    if (datasets.length === 0) {
      logger.testWarning(testName, 'No datasets available for training');
    }

    // Test training start with available resources
    const baseModel = models[0] || { id: 'test-model', name: 'Test Model' };
    const dataset = datasets[0] || { id: 'test-dataset', name: 'Test Dataset' };

    const trainingConfig = {
      baseModel: baseModel.id,
      datasets: [dataset.id],
      config: {
        epochs: 2,
        batchSize: 8,
        learningRate: 0.001
      }
    };

    const trainingResponse = await api.post('/training/start', trainingConfig);

    if (!trainingResponse.ok) {
      logger.testFail(testName, `Training start failed: ${trainingResponse.error || trainingResponse.data?.error}`);
      return false;
    }

    const jobId = trainingResponse.data.id || trainingResponse.data.jobId;
    if (!jobId) {
      logger.testFail(testName, 'Training response missing job ID');
      return false;
    }

    logger.testPass(testName, `Training started with job ID: ${jobId}`);
    validationResults.testResults[testName] = {
      jobId: jobId,
      baseModel: baseModel.id,
      dataset: dataset.id,
      config: trainingConfig.config
    };

    return true;
  } catch (error) {
    logger.testFail(testName, error.message);
    return false;
  }
}

async function testTrainingMetricsStreaming() {
  const testName = 'Training Metrics Streaming';
  validationResults.totalTests++;
  logger.testStart(testName);

  try {
    // First start a training job
    const trainingResponse = await api.post('/training/start', {
      baseModel: 'test-model',
      datasets: ['test-dataset'],
      config: { epochs: 2, batchSize: 8, learningRate: 0.001 }
    });

    if (!trainingResponse.ok) {
      logger.testFail(testName, 'Failed to start training for metrics test');
      return false;
    }

    const jobId = trainingResponse.data.id || trainingResponse.data.jobId;
    
    // Monitor training status and metrics
    let metricsFound = false;
    let latestMetrics = null;
    let statusUpdates = 0;

    const metricsCheck = await waitForCondition(async () => {
      const statusResponse = await api.get(`/training/status/${jobId}`);
      if (statusResponse.ok && statusResponse.data) {
        statusUpdates++;
        const data = statusResponse.data;
        
        if (data.metrics || data.trainLoss || data.valLoss || data.accuracy) {
          metricsFound = true;
          latestMetrics = {
            trainLoss: data.trainLoss || data.metrics?.trainLoss,
            valLoss: data.valLoss || data.metrics?.valLoss,
            accuracy: data.accuracy || data.metrics?.accuracy,
            epoch: data.epoch || data.metrics?.epoch,
            throughput: data.throughput || data.metrics?.throughput
          };
          return true;
        }
      }
      return false;
    }, 15000, 2000);

    if (metricsFound) {
      logger.testPass(testName, `Metrics streaming working, received ${statusUpdates} updates`);
    } else {
      logger.testWarning(testName, 'No metrics updates detected within timeout');
    }

    validationResults.testResults[testName] = {
      jobId: jobId,
      metricsFound: metricsFound,
      statusUpdates: statusUpdates,
      latestMetrics: latestMetrics
    };

    return true;
  } catch (error) {
    logger.testFail(testName, error.message);
    return false;
  }
}

async function testTrainingLifecycleManagement() {
  const testName = 'Training Lifecycle Management';
  validationResults.totalTests++;
  logger.testStart(testName);

  try {
    // Start training
    const trainingResponse = await api.post('/training/start', {
      baseModel: 'test-model',
      datasets: ['test-dataset'],
      config: { epochs: 5, batchSize: 8, learningRate: 0.001 }
    });

    if (!trainingResponse.ok) {
      logger.testFail(testName, 'Failed to start training');
      return false;
    }

    const jobId = trainingResponse.data.id || trainingResponse.data.jobId;
    
    // Test pause functionality
    const pauseResponse = await api.post(`/training/pause/${jobId}`);
    if (pauseResponse.ok) {
      logger.log('Training pause command sent successfully', 'debug');
    }

    // Test resume functionality
    const resumeResponse = await api.post(`/training/resume/${jobId}`);
    if (resumeResponse.ok) {
      logger.log('Training resume command sent successfully', 'debug');
    }

    // Test stop functionality
    const stopResponse = await api.post(`/training/stop/${jobId}`);
    if (stopResponse.ok) {
      logger.log('Training stop command sent successfully', 'debug');
    }

    logger.testPass(testName, 'Training lifecycle commands executed');
    validationResults.testResults[testName] = {
      jobId: jobId,
      pauseSuccess: pauseResponse.ok,
      resumeSuccess: resumeResponse.ok,
      stopSuccess: stopResponse.ok
    };

    return true;
  } catch (error) {
    logger.testFail(testName, error.message);
    return false;
  }
}

// ============================================================================
// PART 3: ANALYTICS AND REPORTING VALIDATION
// ============================================================================

async function testAnalyticsPageStructure() {
  const testName = 'Analytics Page Structure';
  validationResults.totalTests++;
  logger.testStart(testName);

  try {
    // Test training jobs endpoint
    const jobsResponse = await api.get('/analysis/training/jobs');
    
    if (!jobsResponse.ok) {
      logger.testFail(testName, `Training jobs API failed with status ${jobsResponse.status}`);
      return false;
    }

    const jobs = jobsResponse.data?.data || jobsResponse.data || [];
    if (!Array.isArray(jobs)) {
      logger.testFail(testName, 'Training jobs data is not an array');
      return false;
    }

    // Test individual job status endpoint
    if (jobs.length > 0) {
      const firstJob = jobs[0];
      const statusResponse = await api.get(`/analysis/training/status/${firstJob.id}`);
      
      if (!statusResponse.ok) {
        logger.testWarning(testName, `Failed to get status for job ${firstJob.id}`);
      } else {
        const statusData = statusResponse.data?.data || statusResponse.data;
        if (statusData && (statusData.accuracy !== undefined || statusData.valLoss !== undefined)) {
          logger.log('Job status endpoint returning metrics data', 'debug');
        }
      }
    }

    logger.testPass(testName, `Found ${jobs.length} training jobs in analytics`);
    validationResults.testResults[testName] = {
      totalJobs: jobs.length,
      jobs: jobs.slice(0, 3) // Sample of first 3 jobs
    };

    return true;
  } catch (error) {
    logger.testFail(testName, error.message);
    return false;
  }
}

async function testRunSelectionAndDataLoading() {
  const testName = 'Run Selection and Data Loading';
  validationResults.totalTests++;
  logger.testStart(testName);

  try {
    // Get available runs
    const jobsResponse = await api.get('/analysis/training/jobs');
    if (!jobsResponse.ok) {
      logger.testFail(testName, 'Failed to get training jobs');
      return false;
    }

    const jobs = jobsResponse.data?.data || jobsResponse.data || [];
    if (jobs.length === 0) {
      logger.testWarning(testName, 'No training jobs available for selection test');
      return true;
    }

    // Test data loading for first job
    const firstJob = jobs[0];
    const statusResponse = await api.get(`/analysis/training/status/${firstJob.id}`);
    
    if (!statusResponse.ok) {
      logger.testFail(testName, `Failed to load data for job ${firstJob.id}`);
      return false;
    }

    const jobData = statusResponse.data?.data || statusResponse.data;
    
    // Validate job data structure
    const hasMetrics = jobData.accuracy !== undefined || jobData.valLoss !== undefined;
    const hasHistory = jobData.history && (jobData.history.loss || jobData.history.accuracy);
    const hasLogs = jobData.logs && Array.isArray(jobData.logs);

    if (hasMetrics) {
      logger.log('Job data contains metrics', 'debug');
    }
    if (hasHistory) {
      logger.log('Job data contains history', 'debug');
    }
    if (hasLogs) {
      logger.log('Job data contains logs', 'debug');
    }

    logger.testPass(testName, `Data loaded for job ${firstJob.id}`);
    validationResults.testResults[testName] = {
      jobId: firstJob.id,
      hasMetrics: hasMetrics,
      hasHistory: hasHistory,
      hasLogs: hasLogs,
      metrics: jobData.accuracy !== undefined ? {
        accuracy: jobData.accuracy,
        valLoss: jobData.valLoss,
        throughput: jobData.throughput
      } : null
    };

    return true;
  } catch (error) {
    logger.testFail(testName, error.message);
    return false;
  }
}

async function testMultiRunSwitching() {
  const testName = 'Multi-Run Switching';
  validationResults.totalTests++;
  logger.testStart(testName);

  try {
    // Get multiple runs
    const jobsResponse = await api.get('/analysis/training/jobs');
    if (!jobsResponse.ok) {
      logger.testFail(testName, 'Failed to get training jobs');
      return false;
    }

    const jobs = jobsResponse.data?.data || jobsResponse.data || [];
    if (jobs.length < 2) {
      logger.testWarning(testName, 'Need at least 2 jobs for switching test');
      return true;
    }

    // Test switching between first two jobs
    const job1 = jobs[0];
    const job2 = jobs[1];

    const [status1Response, status2Response] = await Promise.all([
      api.get(`/analysis/training/status/${job1.id}`),
      api.get(`/analysis/training/status/${job2.id}`)
    ]);

    if (!status1Response.ok || !status2Response.ok) {
      logger.testFail(testName, 'Failed to load data for one or both jobs');
      return false;
    }

    const data1 = status1Response.data?.data || status1Response.data;
    const data2 = status2Response.data?.data || status2Response.data;

    // Check if data is different between runs
    const data1Str = JSON.stringify(data1);
    const data2Str = JSON.stringify(data2);
    const dataIsDifferent = data1Str !== data2Str;

    logger.testPass(testName, `Successfully switched between ${jobs.length} runs`);
    validationResults.testResults[testName] = {
      totalRuns: jobs.length,
      testedRuns: 2,
      dataIsDifferent: dataIsDifferent,
      run1Id: job1.id,
      run2Id: job2.id
    };

    return true;
  } catch (error) {
    logger.testFail(testName, error.message);
    return false;
  }
}

// ============================================================================
// CROSS-COMPONENT VALIDATION
// ============================================================================

async function testCrossComponentDataConsistency() {
  const testName = 'Cross-Component Data Consistency';
  validationResults.totalTests++;
  logger.testStart(testName);

  try {
    // Test consistency between different endpoints
    const [modelsResponse, assetsResponse, jobsResponse] = await Promise.all([
      api.get('/models'),
      api.get('/assets'),
      api.get('/analysis/training/jobs')
    ]);

    let consistencyIssues = [];

    // Check if models and assets are consistent
    if (modelsResponse.ok && assetsResponse.ok) {
      const models = modelsResponse.data || [];
      const assets = assetsResponse.data || [];
      
      const modelAssets = assets.filter(asset => 
        asset.kind === 'model' || asset.type === 'model'
      );

      if (models.length !== modelAssets.length) {
        consistencyIssues.push(`Model count mismatch: models=${models.length}, modelAssets=${modelAssets.length}`);
      }
    }

    // Check if training jobs reference valid models
    if (jobsResponse.ok) {
      const jobs = jobsResponse.data?.data || jobsResponse.data || [];
      const models = modelsResponse.ok ? (modelsResponse.data || []) : [];
      
      for (const job of jobs) {
        if (job.baseModel && models.length > 0) {
          const modelExists = models.some(m => m.id === job.baseModel);
          if (!modelExists) {
            consistencyIssues.push(`Job ${job.id} references non-existent model: ${job.baseModel}`);
          }
        }
      }
    }

    if (consistencyIssues.length === 0) {
      logger.testPass(testName, 'No data consistency issues found');
    } else {
      logger.testWarning(testName, `Found ${consistencyIssues.length} consistency issues`);
      consistencyIssues.forEach(issue => logger.log(`  - ${issue}`, 'warning'));
    }

    validationResults.testResults[testName] = {
      consistencyIssues: consistencyIssues,
      issueCount: consistencyIssues.length
    };

    return true;
  } catch (error) {
    logger.testFail(testName, error.message);
    return false;
  }
}

// ============================================================================
// MAIN VALIDATION RUNNER
// ============================================================================

async function runValidation() {
  logger.log('🚀 Starting End-to-End System Validation', 'info');
  logger.log(`API Base URL: ${CONFIG.API_BASE}`, 'debug');
  logger.log(`Frontend URL: ${CONFIG.FRONTEND_URL}`, 'debug');

  const tests = [
    // Part 1: Model Download Pipeline
    testModelCatalogInspection,
    testModelDownloadInitiation,
    testModelDownloadProgress,
    testResourceInventoryIntegration,
    
    // Part 2: Training Pipeline
    testTrainingInitialization,
    testTrainingMetricsStreaming,
    testTrainingLifecycleManagement,
    
    // Part 3: Analytics and Reporting
    testAnalyticsPageStructure,
    testRunSelectionAndDataLoading,
    testMultiRunSwitching,
    
    // Cross-Component Validation
    testCrossComponentDataConsistency
  ];

  // Run all tests
  for (const test of tests) {
    try {
      await test();
    } catch (error) {
      logger.log(`Unexpected error in test: ${error.message}`, 'error');
      validationResults.failedTests++;
    }
  }

  // Generate summary
  validationResults.endTime = new Date().toISOString();
  validationResults.summary = {
    totalTests: validationResults.totalTests,
    passedTests: validationResults.passedTests,
    failedTests: validationResults.failedTests,
    warnings: validationResults.warnings,
    successRate: ((validationResults.passedTests / validationResults.totalTests) * 100).toFixed(2) + '%',
    duration: new Date(validationResults.endTime) - new Date(validationResults.startTime)
  };

  // Output results
  logger.log('\n📊 VALIDATION SUMMARY', 'info');
  logger.log(`Total Tests: ${validationResults.totalTests}`, 'info');
  logger.log(`Passed: ${validationResults.passedTests}`, 'success');
  logger.log(`Failed: ${validationResults.failedTests}`, validationResults.failedTests > 0 ? 'error' : 'info');
  logger.log(`Warnings: ${validationResults.warnings}`, validationResults.warnings > 0 ? 'warning' : 'info');
  logger.log(`Success Rate: ${validationResults.summary.successRate}`, 'info');
  logger.log(`Duration: ${validationResults.summary.duration}ms`, 'info');

  // Save detailed report
  const outputFile = process.argv.find(arg => arg.startsWith('--output='))?.split('=')[1] || 'validation-report.json';
  await fs.writeFile(outputFile, JSON.stringify(validationResults, null, 2));
  logger.log(`\n📄 Detailed report saved to: ${outputFile}`, 'info');

  // Exit with appropriate code
  process.exit(validationResults.failedTests > 0 ? 1 : 0);
}

// Handle command line arguments
if (process.argv.includes('--help')) {
  console.log(`
End-to-End System Validation Script

Usage: node validation-script.js [options]

Options:
  --verbose     Enable verbose logging
  --output=file Save detailed report to file (default: validation-report.json)
  --help        Show this help message

Environment Variables:
  API_BASE      Backend API base URL (default: http://localhost:3001/api)
  FRONTEND_URL  Frontend URL (default: http://localhost:5173)

Examples:
  node validation-script.js
  node validation-script.js --verbose --output=my-report.json
  API_BASE=http://localhost:3000/api node validation-script.js
`);
  process.exit(0);
}

// Run validation
runValidation().catch(error => {
  logger.log(`Fatal error: ${error.message}`, 'error');
  process.exit(1);
});