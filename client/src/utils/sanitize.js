export const num = (v, d = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : d;
};

export const clamp = (v, min = 0, max = 100) => {
    const n = num(v, min);
    return Math.min(max, Math.max(min, n));
};

export const pct = (v) => `${clamp(v, 0, 100)}%`;

export const text = (v, d = '—') => {
    if (v === 0) return '0';
    if (v === false) return 'false';
    if (v === true) return 'true';
    if (v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v))) return d;
    return String(v);
};

export const humanBytes = (b) => {
    const n = num(b, NaN);
    if (!Number.isFinite(n)) return '—';
    if (n < 1024) return `${n} B`;
    const u = ['KB', 'MB', 'GB', 'TB'];
    let i = -1, v = n;
    do { v /= 1024; i++; } while (v >= 1024 && i < u.length - 1);
    return `${v.toFixed(1)} ${u[i]}`;
};

export const fmtInt = (v) => num(v, 0).toLocaleString('en-US');

