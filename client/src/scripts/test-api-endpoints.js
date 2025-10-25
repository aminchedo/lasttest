#!/usr/bin/env node
// scripts/test-api-endpoints.js - Comprehensive API Testing Script

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
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class APITester {
  constructor() {
    this.results = [];
    this.totalTests = 0;
    this.passedTests = 0;
    this.failedTests = 0;
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
    this.log('🚀 Starting API Endpoint Tests', 'bold');
    this.log(`📍 API Base URL: ${API_BASE}`, 'yellow');

    // Health Check Tests
    await this.test('Health Check', async () => {
      const response = await this.makeRequest('/api/health');
      return {
        success: response.ok && response.data.ok,
        data: response.data
      };
    });

    // Hardware Profile Tests
    await this.test('Hardware Profile Detection', async () => {
      const response = await this.makeRequest('/api/system/hardware-profile');
      return {
        success: response.ok,
        data: response.data
      };
    });

    // Assets Registry Tests
    await this.test('Assets Roots', async () => {
      const response = await this.makeRequest('/api/assets/roots');
      return {
        success: response.ok && response.data.ok,
        data: response.data.data
      };
    });

    await this.test('Assets List - Models', async () => {
      const response = await this.makeRequest('/api/assets/list/models');
      return {
        success: response.ok && response.data.ok,
        data: response.data.data
      };
    });

    await this.test('Assets Registry', async () => {
      const response = await this.makeRequest('/api/assets/registry');
      return {
        success: response.ok && response.data.ok,
        data: response.data.data
      };
    });

    // Lifecycle Management Tests
    await this.test('Lifecycle Jobs List', async () => {
      const response = await this.makeRequest('/api/lifecycle/jobs');
      return {
        success: response.ok && response.data.ok,
        data: response.data.data
      };
    });

    await this.test('Lifecycle Stats', async () => {
      const response = await this.makeRequest('/api/lifecycle/stats');
      return {
        success: response.ok && response.data.ok,
        data: response.data.data
      };
    });

    // Create a test training job
    let testJobId = null;
    await this.test('Create Training Job', async () => {
      const response = await this.makeRequest('/api/lifecycle/jobs', {
        method: 'POST',
        body: JSON.stringify({
          modelType: 'test-model',
          datasetPath: '/datasets/test.csv',
          epochs: 1,
          batchSize: 4
        })
      });
      
      if (response.ok && response.data.ok) {
        testJobId = response.data.data.id;
      }
      
      return {
        success: response.ok && response.data.ok,
        data: response.data.data
      };
    });

    // Test job control if we have a job ID
    if (testJobId) {
      await this.test('Job Control - Pause', async () => {
        const response = await this.makeRequest(`/api/lifecycle/jobs/${testJobId}/control`, {
          method: 'POST',
          body: JSON.stringify({ action: 'pause' })
        });
        return {
          success: response.ok && response.data.ok,
          data: response.data.data
        };
      });

      await this.test('Job Logs', async () => {
        const response = await this.makeRequest(`/api/lifecycle/jobs/${testJobId}/logs`);
        return {
          success: response.ok && response.data.ok,
          data: response.data.data
        };
      });

      await this.test('Job Artifacts', async () => {
        const response = await this.makeRequest(`/api/lifecycle/jobs/${testJobId}/artifacts`);
        return {
          success: response.ok && response.data.ok,
          data: response.data.data
        };
      });
    }

    // Monitoring System Tests
    await this.test('Monitoring Stats', async () => {
      const response = await this.makeRequest('/api/monitoring/stats');
      return {
        success: response.ok && response.data.ok,
        data: response.data.data
      };
    });

    await this.test('Monitoring Metrics', async () => {
      const response = await this.makeRequest('/api/monitoring/metrics?limit=10');
      return {
        success: response.ok && response.data.ok,
        data: response.data.data
      };
    });

    await this.test('Monitoring Logs', async () => {
      const response = await this.makeRequest('/api/monitoring/logs?limit=10');
      return {
        success: response.ok && response.data.ok,
        data: response.data.data
      };
    });

    await this.test('Monitoring Alerts', async () => {
      const response = await this.makeRequest('/api/monitoring/alerts?limit=10');
      return {
        success: response.ok && response.data.ok,
        data: response.data.data
      };
    });

    await this.test('Monitoring Health', async () => {
      const response = await this.makeRequest('/api/monitoring/health');
      return {
        success: response.ok && response.data.ok,
        data: response.data.data
      };
    });

    // Dashboard API Tests
    await this.test('Dashboard Stats', async () => {
      const response = await this.makeRequest('/api/dashboard/stats');
      return {
        success: response.ok,
        data: response.data
      };
    });

    await this.test('System Status', async () => {
      const response = await this.makeRequest('/api/system/status');
      return {
        success: response.ok,
        data: response.data
      };
    });

    await this.test('User Profile', async () => {
      const response = await this.makeRequest('/api/user/profile');
      return {
        success: response.ok,
        data: response.data
      };
    });

    await this.test('Recent Activities', async () => {
      const response = await this.makeRequest('/api/activities/recent');
      return {
        success: response.ok,
        data: response.data
      };
    });

    await this.test('Models List', async () => {
      const response = await this.makeRequest('/api/models');
      return {
        success: response.ok,
        data: response.data
      };
    });

    // Test SSE endpoints (just check if they respond)
    await this.test('Monitoring SSE Endpoint', async () => {
      try {
        const response = await fetch(`${API_BASE}/api/monitoring/stream`, {
          method: 'GET',
          headers: {
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache'
          }
        });
        
        // For SSE, we just check if the connection is established
        return {
          success: response.ok && response.headers.get('content-type')?.includes('text/event-stream'),
          data: { status: response.status, contentType: response.headers.get('content-type') }
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });

    // Generate report
    this.generateReport();
  }

  generateReport() {
    this.log('\n📊 Test Results Summary', 'bold');
    this.log('═'.repeat(50), 'yellow');
    
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

    // Save detailed report
    this.saveDetailedReport();
  }

  async saveDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      apiBase: API_BASE,
      summary: {
        total: this.totalTests,
        passed: this.passedTests,
        failed: this.failedTests,
        successRate: ((this.passedTests / this.totalTests) * 100).toFixed(1)
      },
      results: this.results
    };

    try {
      const reportPath = path.join(__dirname, '../reports/api-test-report.json');
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
  const tester = new APITester();
  
  tester.runAllTests().catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

export default APITester;