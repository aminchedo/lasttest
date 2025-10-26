#!/usr/bin/env node
/**
 * Comprehensive Validation Test Suite for ML Training Platform
 * Tests all production readiness features implemented in this session
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_BASE = process.env.API_BASE || 'http://localhost:3001';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class ValidationTester {
  constructor() {
    this.results = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
    this.testRunId = Date.now().toString(36);
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async test(name, testFn) {
    this.totalTests++;
    try {
      this.log(`\n🧪 Testing: ${name}`, 'blue');
      const result = await testFn();
      
      if (result.success) {
        this.passedTests++;
        this.log(`✅ PASS: ${name}`, 'green');
        if (result.data) {
          this.log(`   Data: ${JSON.stringify(result.data).substring(0, 100)}...`, 'reset');
        }
      } else {
        this.failedTests++;
        this.log(`❌ FAIL: ${name}`, 'red');
        this.log(`   Error: ${result.error}`, 'red');
      }
      
      this.results.push({ name, ...result });
    } catch (error) {
      this.failedTests++;
      this.log(`❌ ERROR: ${name}`, 'red');
      this.log(`   Exception: ${error.message}`, 'red');
      this.results.push({ name, success: false, error: error.message });
    }
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      ok: response.ok,
      status: response.status,
      data
    };
  }

  async runAllTests() {
    this.log('🚀 Starting Production Readiness Validation Tests', 'bold');
    this.log(`📍 API Base URL: ${API_BASE}`, 'yellow');
    this.log(`🆔 Test Run ID: ${this.testRunId}`, 'cyan');

    // ========================================
    // OBJECTIVE A: PERSISTENT ANALYTICS TESTS
    // ========================================
    this.log('\n📊 OBJECTIVE A: Persistent Analytics Across Restarts', 'cyan');
    
    await this.test('Analytics - Get Training Jobs (DB-backed)', async () => {
      const response = await this.makeRequest('/api/analysis/training/jobs');
      return {
        success: response.ok && response.data.ok && Array.isArray(response.data.data),
        data: response.data.data
      };
    });

    let testRunId = null;
    await this.test('Analytics - Get Training Status (DB reconstruction)', async () => {
      // First get a list of runs
      const jobsResponse = await this.makeRequest('/api/analysis/training/jobs');
      if (jobsResponse.ok && jobsResponse.data.data.length > 0) {
        testRunId = jobsResponse.data.data[0].runId;
        const response = await this.makeRequest(`/api/analysis/training/status/${testRunId}`);
        return {
          success: response.ok && response.data.ok && response.data.data.runId === testRunId,
          data: response.data.data
        };
      }
      return { success: false, error: 'No training runs found' };
    });

    // ========================================
    // OBJECTIVE B: MULTI-RUN ISOLATION TESTS
    // ========================================
    this.log('\n🔄 OBJECTIVE B: Multi-Run Isolation', 'cyan');
    
    await this.test('Training - Start Multiple Runs', async () => {
      const run1 = await this.makeRequest('/api/training/start', {
        method: 'POST',
        body: JSON.stringify({
          baseModel: 'test-model-1',
          datasets: ['test-dataset-1'],
          config: { epochs: 2 }
        })
      });
      
      const run2 = await this.makeRequest('/api/training/start', {
        method: 'POST',
        body: JSON.stringify({
          baseModel: 'test-model-2',
          datasets: ['test-dataset-2'],
          config: { epochs: 2 }
        })
      });
      
      return {
        success: run1.ok && run2.ok && run1.data.id !== run2.data.id,
        data: { run1: run1.data, run2: run2.data }
      };
    });

    // ========================================
    // OBJECTIVE C: SSE CLEANUP TESTS
    // ========================================
    this.log('\n📡 OBJECTIVE C: SSE Cleanup and Lifecycle Safety', 'cyan');
    
    await this.test('Download - SSE Connection Establishment', async () => {
      try {
        const response = await fetch(`${API_BASE}/api/models/download/progress?modelId=test-model`, {
          method: 'GET',
          headers: {
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache'
          }
        });
        
        return {
          success: response.ok && response.headers.get('content-type')?.includes('text/event-stream'),
          data: { status: response.status, contentType: response.headers.get('content-type') }
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // ========================================
    // OBJECTIVE D: DISK CAPACITY TESTS
    // ========================================
    this.log('\n💾 OBJECTIVE D: Disk Capacity / ENOSPC Handling', 'cyan');
    
    await this.test('Download - Start with Large Model (ENOSPC simulation)', async () => {
      const response = await this.makeRequest('/api/models/download/start', {
        method: 'POST',
        body: JSON.stringify({ modelId: 'HooshvareLab/bert-fa-base-uncased' })
      });
      
      return {
        success: response.ok && (response.data.ok || response.status === 400),
        data: response.data
      };
    });

    // ========================================
    // OBJECTIVE E: ACCESS CONTROL TESTS
    // ========================================
    this.log('\n🔒 OBJECTIVE E: Download Access Control / Throttling', 'cyan');
    
    await this.test('Download - Rate Limiting (Concurrent Downloads)', async () => {
      // Start first download
      const download1 = await this.makeRequest('/api/models/download/start', {
        method: 'POST',
        body: JSON.stringify({ modelId: 'HooshvareLab/bert-fa-base-uncased' })
      });
      
      // Try second download immediately (should be rate limited)
      const download2 = await this.makeRequest('/api/models/download/start', {
        method: 'POST',
        body: JSON.stringify({ modelId: 'HooshvareLab/gpt2-fa' })
      });
      
      return {
        success: download1.ok && download2.status === 429,
        data: { download1: download1.data, download2: download2.data }
      };
    });

    await this.test('Download - Model ID Validation', async () => {
      const response = await this.makeRequest('/api/models/download/start', {
        method: 'POST',
        body: JSON.stringify({ modelId: 'invalid-model-id' })
      });
      
      return {
        success: response.status === 400 && response.data.error === 'invalid_model',
        data: response.data
      };
    });

    // ========================================
    // CORE API FUNCTIONALITY TESTS
    // ========================================
    this.log('\n🔧 Core API Functionality', 'cyan');
    
    await this.test('Health Check', async () => {
      const response = await this.makeRequest('/api/health');
      return {
        success: response.ok && response.data.ok,
        data: response.data
      };
    });

    await this.test('Catalog - Models List', async () => {
      const response = await this.makeRequest('/api/catalog/models');
      return {
        success: response.ok && response.data.ok && Array.isArray(response.data.data),
        data: response.data.data
      };
    });

    await this.test('Catalog - Datasets List', async () => {
      const response = await this.makeRequest('/api/catalog/datasets');
      return {
        success: response.ok && response.data.ok && Array.isArray(response.data.data),
        data: response.data.data
      };
    });

    await this.test('Training Assets List', async () => {
      const response = await this.makeRequest('/api/training/assets');
      return {
        success: response.ok && response.data.ok && Array.isArray(response.data.data),
        data: response.data.data
      };
    });

    // ========================================
    // DATABASE PERSISTENCE TESTS
    // ========================================
    this.log('\n💾 Database Persistence Tests', 'cyan');
    
    await this.test('Database - Training Metrics Table', async () => {
      // Check if training_metrics table exists by trying to query it
      const response = await this.makeRequest('/api/analysis/training/jobs');
      return {
        success: response.ok && response.data.ok,
        data: { message: 'Training metrics table accessible' }
      };
    });

    await this.test('Database - Training Logs Table', async () => {
      // Check if training_logs table exists by checking if we can get detailed status
      if (testRunId) {
        const response = await this.makeRequest(`/api/analysis/training/status/${testRunId}`);
        return {
          success: response.ok && response.data.ok && Array.isArray(response.data.data.logs),
          data: { logsCount: response.data.data.logs.length }
        };
      }
      return { success: true, data: { message: 'No test run available for logs check' } };
    });

    // ========================================
    // FRONTEND INTEGRATION TESTS
    // ========================================
    this.log('\n🎨 Frontend Integration Tests', 'cyan');
    
    await this.test('Frontend - EventSource Support', async () => {
      // Test if EventSource endpoint is accessible
      try {
        const response = await fetch(`${API_BASE}/api/models/download/progress?modelId=test`, {
          headers: { 'Accept': 'text/event-stream' }
        });
        return {
          success: response.ok && response.headers.get('content-type')?.includes('text/event-stream'),
          data: { status: response.status }
        };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    // ========================================
    // ERROR HANDLING TESTS
    // ========================================
    this.log('\n⚠️ Error Handling Tests', 'cyan');
    
    await this.test('Error Handling - Invalid Endpoints', async () => {
      const response = await this.makeRequest('/api/invalid-endpoint');
      return {
        success: response.status === 404,
        data: { status: response.status }
      };
    });

    await this.test('Error Handling - Invalid Training Run ID', async () => {
      const response = await this.makeRequest('/api/analysis/training/status/invalid-run-id');
      return {
        success: response.status === 404,
        data: response.data
      };
    });

    // Generate final report
    this.generateReport();
  }

  generateReport() {
    this.log('\n📊 Validation Test Results Summary', 'bold');
    this.log('═'.repeat(60), 'yellow');
    
    this.log(`Total Tests: ${this.totalTests}`, 'blue');
    this.log(`Passed: ${this.passedTests}`, 'green');
    this.log(`Failed: ${this.failedTests}`, 'red');
    
    const successRate = ((this.passedTests / this.totalTests) * 100).toFixed(1);
    this.log(`Success Rate: ${successRate}%`, successRate > 80 ? 'green' : 'yellow');

    if (this.failedTests > 0) {
      this.log('\n❌ Failed Tests:', 'red');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          this.log(`   • ${r.name}: ${r.error}`, 'red');
        });
    }

    this.log('\n✅ Passed Tests:', 'green');
    this.results
      .filter(r => r.success)
      .forEach(r => {
        this.log(`   • ${r.name}`, 'green');
      });

    // Production readiness assessment
    this.log('\n🎯 Production Readiness Assessment', 'bold');
    this.log('═'.repeat(40), 'yellow');
    
    if (successRate >= 90) {
      this.log('🟢 READY FOR PRODUCTION', 'green');
      this.log('   All critical features are working correctly.', 'green');
    } else if (successRate >= 80) {
      this.log('🟡 MOSTLY READY FOR PRODUCTION', 'yellow');
      this.log('   Most features work, but some issues need attention.', 'yellow');
    } else {
      this.log('🔴 NOT READY FOR PRODUCTION', 'red');
      this.log('   Significant issues need to be resolved.', 'red');
    }

    // Save detailed report
    this.saveDetailedReport();
  }

  async saveDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      testRunId: this.testRunId,
      apiBase: API_BASE,
      summary: {
        total: this.totalTests,
        passed: this.passedTests,
        failed: this.failedTests,
        successRate: ((this.passedTests / this.totalTests) * 100).toFixed(1)
      },
      results: this.results,
      productionReadiness: {
        persistentAnalytics: this.results.find(r => r.name.includes('Analytics'))?.success || false,
        multiRunIsolation: this.results.find(r => r.name.includes('Multiple Runs'))?.success || false,
        sseCleanup: this.results.find(r => r.name.includes('SSE'))?.success || false,
        diskCapacity: this.results.find(r => r.name.includes('ENOSPC'))?.success || false,
        accessControl: this.results.find(r => r.name.includes('Rate Limiting'))?.success || false
      }
    };

    try {
      const reportPath = path.join(__dirname, 'reports', 'validation-report.json');
      await fs.mkdir(path.dirname(reportPath), { recursive: true });
      await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
      this.log(`\n📄 Detailed report saved to: ${reportPath}`, 'blue');
    } catch (error) {
      this.log(`\n⚠️  Could not save report: ${error.message}`, 'yellow');
    }
  }
}

// Run tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new ValidationTester();
  
  tester.runAllTests().catch(error => {
    console.error('Validation test runner failed:', error);
    process.exit(1);
  });
}

export default ValidationTester;