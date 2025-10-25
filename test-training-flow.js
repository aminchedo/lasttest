/**
 * Test script for training flow
 * Tests: Model selection → Dataset selection → Teacher model → Start training
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, url, options = {}) {
  try {
    log(`\n🔍 Testing: ${name}`, 'cyan');
    log(`   URL: ${url}`, 'blue');
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      log(`✅ ${name} - SUCCESS`, 'green');
      return { success: true, data };
    } else {
      log(`❌ ${name} - FAILED (${response.status})`, 'red');
      log(`   Error: ${JSON.stringify(data)}`, 'red');
      return { success: false, data };
    }
  } catch (error) {
    log(`❌ ${name} - ERROR`, 'red');
    log(`   ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runTests() {
  log('═══════════════════════════════════════════════════════', 'cyan');
  log('  Training Flow Test Suite', 'cyan');
  log('═══════════════════════════════════════════════════════', 'cyan');

  // Test 1: Health Check
  const health = await testEndpoint(
    'Health Check',
    `${API_BASE}/health`
  );
  
  if (!health.success) {
    log('\n❌ Server is not running!', 'red');
    log('   Please start the server first: npm run dev:server', 'yellow');
    process.exit(1);
  }

  // Test 2: Get Models
  const models = await testEndpoint(
    'Get Models',
    `${API_BASE}/catalog/models`
  );

  if (!models.success || !models.data || models.data.length === 0) {
    log('   ⚠️  No models available', 'yellow');
    return;
  }

  log(`   Found ${models.data.length} models`, 'green');
  const selectedModel = models.data[0];
  log(`   Selected Model: ${selectedModel.name} (${selectedModel.id})`, 'blue');

  // Test 3: Get Datasets
  const datasets = await testEndpoint(
    'Get Datasets',
    `${API_BASE}/download/datasets/list`
  );

  if (!datasets.success || !datasets.data || !datasets.data.datasets || datasets.data.datasets.length === 0) {
    log('   ⚠️  No datasets available', 'yellow');
    return;
  }

  log(`   Found ${datasets.data.datasets.length} datasets`, 'green');
  const selectedDataset = datasets.data.datasets[0];
  log(`   Selected Dataset: ${selectedDataset.name} (${selectedDataset.id})`, 'blue');

  // Test 4: Get Teacher Model (optional)
  const teacherModel = models.data.length > 1 ? models.data[1] : null;
  if (teacherModel) {
    log(`   Teacher Model: ${teacherModel.name} (${teacherModel.id})`, 'blue');
  }

  // Test 5: Start Training
  const trainingConfig = {
    baseModel: selectedModel.id,
    datasets: [selectedDataset.id],
    teacherModel: teacherModel ? teacherModel.id : null,
    config: {
      epochs: 3,
      batchSize: 16,
      learningRate: 0.001,
      optimizer: 'adamw',
      lrScheduler: 'cosine',
      warmupSteps: 100,
      weightDecay: 0.01,
      gradientAccumulationSteps: 2,
      maxGradNorm: 1.0,
      enableEarlyStopping: true,
      earlyStoppingPatience: 2,
      earlyStoppingThreshold: 0.0001,
      mixedPrecision: true,
      saveCheckpointEvery: 50,
      keepTopCheckpoints: 3,
      enableDistillation: !!teacherModel,
      distillationAlpha: 0.5,
      distillationTemperature: 2.0,
      validationSplit: 0.2,
      evaluateEvery: 25
    }
  };

  log('\n📋 Training Configuration:', 'cyan');
  log(JSON.stringify(trainingConfig, null, 2), 'blue');

  const training = await testEndpoint(
    'Start Training',
    `${API_BASE}/training/start`,
    {
      method: 'POST',
      body: JSON.stringify(trainingConfig)
    }
  );

  if (!training.success) {
    log('\n❌ Training failed to start!', 'red');
    return;
  }

  const jobId = training.data.id;
  log(`   Job ID: ${jobId}`, 'green');

  // Test 6: Get Training Status
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const status = await testEndpoint(
    'Get Training Status',
    `${API_BASE}/training/status/${jobId}`
  );

  if (status.success) {
    log(`   Status: ${status.data.status}`, 'green');
    log(`   Progress: ${status.data.progress}%`, 'green');
    log(`   Message: ${status.data.message}`, 'blue');
  }

  // Test 7: Pause Training
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const pause = await testEndpoint(
    'Pause Training',
    `${API_BASE}/training/pause/${jobId}`,
    { method: 'POST', body: '{}' }
  );

  // Test 8: Resume Training
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const resume = await testEndpoint(
    'Resume Training',
    `${API_BASE}/training/resume/${jobId}`,
    { method: 'POST', body: '{}' }
  );

  // Test 9: Stop Training
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const stop = await testEndpoint(
    'Stop Training',
    `${API_BASE}/training/stop/${jobId}`,
    { method: 'POST', body: '{}' }
  );

  // Summary
  log('\n═══════════════════════════════════════════════════════', 'cyan');
  log('  Test Summary', 'cyan');
  log('═══════════════════════════════════════════════════════', 'cyan');
  
  const tests = [health, models, datasets, training, status, pause, resume, stop];
  const passed = tests.filter(t => t.success).length;
  const total = tests.length;
  
  log(`\n✅ Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All tests passed! Training flow is working correctly.', 'green');
  } else {
    log(`\n⚠️  ${total - passed} test(s) failed. Please check the errors above.`, 'yellow');
  }
}

// Run tests
runTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'red');
  process.exit(1);
});
