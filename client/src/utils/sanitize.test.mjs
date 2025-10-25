import { num, clamp, pct, text, humanBytes, fmtInt } from './sanitize.js';

const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

assert(num('10') === 10, 'num string');
assert(num(NaN, 5) === 5, 'num fallback');
assert(num(undefined, 0) === 0, 'num undefined fallback');
assert(num(null, 0) === 0, 'num null fallback');
assert(num(42) === 42, 'num valid number');

assert(clamp(150, 0, 100) === 100, 'clamp high');
assert(clamp(-10, 0, 100) === 0, 'clamp low');
assert(clamp(50, 0, 100) === 50, 'clamp middle');
assert(clamp(NaN, 0, 100) === 0, 'clamp NaN falls to min');

assert(pct(50) === '50%', 'pct normal');
assert(pct(0) === '0%', 'pct zero');
assert(pct(100) === '100%', 'pct hundred');
assert(pct(150) === '100%', 'pct clamped');

assert(text(0) === '0', 'text zero shows');
assert(text(false) === 'false', 'text false shows');
assert(text(true) === 'true', 'text true shows');
assert(text(NaN, '—') === '—', 'text NaN fallback');
assert(text(undefined, '—') === '—', 'text undefined fallback');
assert(text(null, '—') === '—', 'text null fallback');
assert(text(42) === '42', 'text number');
assert(text('hello') === 'hello', 'text string');

assert(humanBytes(0) === '0 B', 'humanBytes zero');
assert(humanBytes(500) === '500 B', 'humanBytes bytes');
assert(humanBytes(1024) === '1.0 KB', 'humanBytes KB');
assert(humanBytes(1048576) === '1.0 MB', 'humanBytes MB');
assert(humanBytes(NaN) === '—', 'humanBytes NaN fallback');
assert(humanBytes(undefined) === '—', 'humanBytes undefined fallback');

assert(fmtInt(0) === '0', 'fmtInt zero');
assert(fmtInt(1000) === '1,000', 'fmtInt thousands');
assert(fmtInt(1000000) === '1,000,000', 'fmtInt millions');
assert(fmtInt(NaN) === '0', 'fmtInt NaN fallback');
assert(fmtInt(undefined) === '0', 'fmtInt undefined fallback');

console.log('✅ All sanitize tests passed (31 assertions)');

