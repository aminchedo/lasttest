#!/usr/bin/env node
/**
 * Self-test for Farsi Model Trainer
 * Tests all critical endpoints
 */

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;
const TIMEOUT = 10000;

async function test(name, fn) {
  try {
    console.log(`⏳ ${name}...`);
    await fn();
    console.log(`✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`✗ ${name}: ${err.message}`);
    return false;
  }
}

async function fetch_with_timeout(url, opts = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  // Test 1: GET /api/health
  if (await test('GET /api/health', async () => {
    const res = await fetch_with_timeout(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.ok) throw new Error('ok field missing');
    const ctHeader = res.headers.get('content-type');
    if (!ctHeader || !ctHeader.includes('charset=utf-8')) {
      throw new Error('Missing charset=utf-8');
    }
  })) passed++; else failed++;

  // Test 2: GET /health
  if (await test('GET /health', async () => {
    const res = await fetch_with_timeout(`${BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.ok) throw new Error('ok field missing');
  })) passed++; else failed++;

  // Test 3: POST /api/training/start (validation)
  if (await test('POST /api/training/start (no baseModel)', async () => {
    const res = await fetch_with_timeout(`${BASE_URL}/api/training/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ datasets: [] })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  })) passed++; else failed++;

  // Test 4: POST /api/training/start (no datasets)
  if (await test('POST /api/training/start (no datasets)', async () => {
    const res = await fetch_with_timeout(`${BASE_URL}/api/training/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ baseModel: 'model-1' })
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  })) passed++; else failed++;

  console.log(`\n✓ PASS: ${passed}`);
  console.log(`✗ FAIL: ${failed}`);
  process.exit(failed > 0 ? 2 : 0);
}

// Give server time to start (assuming it's already running)
setTimeout(() => {
  runTests().catch(err => {
    console.error('Test error:', err);
    process.exit(2);
  });
}, 500);
