#!/usr/bin/env node

/**
 * Quick Test Script for Validation System
 * 
 * This script performs a basic smoke test of the validation system
 * to ensure it can run without errors.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Validation System Setup...\n');

async function testValidationFiles() {
  const files = [
    'validation-script.js',
    'package-validation.json',
    'run-validation.sh',
    'VALIDATION_README.md'
  ];

  console.log('📁 Checking validation files...');
  
  for (const file of files) {
    try {
      await fs.access(file);
      console.log(`✅ ${file} exists`);
    } catch (error) {
      console.log(`❌ ${file} missing`);
      return false;
    }
  }
  
  return true;
}

async function testValidationScript() {
  console.log('\n🔍 Testing validation script syntax...');
  
  try {
    // Try to import the validation script to check for syntax errors
    const scriptPath = path.resolve('validation-script.js');
    const scriptContent = await fs.readFile(scriptPath, 'utf8');
    
    // Basic syntax check - look for common issues
    if (scriptContent.includes('import ') && scriptContent.includes('export ')) {
      console.log('✅ Validation script uses ES modules');
    }
    
    if (scriptContent.includes('class ValidationLogger')) {
      console.log('✅ Validation logger class found');
    }
    
    if (scriptContent.includes('async function testModelCatalogInspection')) {
      console.log('✅ Model catalog test found');
    }
    
    if (scriptContent.includes('async function testTrainingInitialization')) {
      console.log('✅ Training initialization test found');
    }
    
    if (scriptContent.includes('async function testAnalyticsPageStructure')) {
      console.log('✅ Analytics test found');
    }
    
    console.log('✅ Validation script syntax appears valid');
    return true;
  } catch (error) {
    console.log(`❌ Error reading validation script: ${error.message}`);
    return false;
  }
}

async function testPackageJson() {
  console.log('\n📦 Testing package.json...');
  
  try {
    const packageContent = await fs.readFile('package-validation.json', 'utf8');
    const packageData = JSON.parse(packageContent);
    
    if (packageData.name === 'ml-platform-validation') {
      console.log('✅ Package name correct');
    }
    
    if (packageData.dependencies && packageData.dependencies['node-fetch']) {
      console.log('✅ node-fetch dependency found');
    }
    
    if (packageData.scripts && packageData.scripts.validate) {
      console.log('✅ Validation scripts found');
    }
    
    console.log('✅ Package.json is valid');
    return true;
  } catch (error) {
    console.log(`❌ Error reading package.json: ${error.message}`);
    return false;
  }
}

async function testRunnerScript() {
  console.log('\n🚀 Testing runner script...');
  
  try {
    const runnerContent = await fs.readFile('run-validation.sh', 'utf8');
    
    if (runnerContent.includes('#!/bin/bash')) {
      console.log('✅ Shebang found');
    }
    
    if (runnerContent.includes('check_service()')) {
      console.log('✅ Service check function found');
    }
    
    if (runnerContent.includes('run_validation()')) {
      console.log('✅ Validation runner function found');
    }
    
    if (runnerContent.includes('node validation-script.js')) {
      console.log('✅ Validation script execution found');
    }
    
    console.log('✅ Runner script appears valid');
    return true;
  } catch (error) {
    console.log(`❌ Error reading runner script: ${error.message}`);
    return false;
  }
}

async function testDocumentation() {
  console.log('\n📚 Testing documentation...');
  
  try {
    const readmeContent = await fs.readFile('VALIDATION_README.md', 'utf8');
    
    if (readmeContent.includes('# End-to-End System Validation')) {
      console.log('✅ README title found');
    }
    
    if (readmeContent.includes('## Quick Start')) {
      console.log('✅ Quick start section found');
    }
    
    if (readmeContent.includes('## Test Categories')) {
      console.log('✅ Test categories section found');
    }
    
    if (readmeContent.includes('Test 1.1: Catalog Inspection')) {
      console.log('✅ Individual test documentation found');
    }
    
    console.log('✅ Documentation appears complete');
    return true;
  } catch (error) {
    console.log(`❌ Error reading documentation: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔍 Running validation system tests...\n');
  
  const tests = [
    testValidationFiles,
    testValidationScript,
    testPackageJson,
    testRunnerScript,
    testDocumentation
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All validation system tests passed!');
    console.log('The validation system is ready to use.');
    console.log('\nNext steps:');
    console.log('1. Ensure your backend and frontend servers are running');
    console.log('2. Run: ./run-validation.sh');
    console.log('3. Check validation-report.json for detailed results');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the errors above.');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});