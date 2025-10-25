import { Router } from 'express';
import fetch from 'node-fetch';
import LRUCache from 'lru-cache';

const router = Router();
const HF_TOKEN = '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'; // one-time; do not log

const cache = new LRUCache({
    max: 200,              // up to 200 distinct queries
    ttl: 60 * 1000,        // 60s cache per key
    allowStale: false,
});

function keyFrom({ q, type, lang, limit, page }) {
    return `hf:${q || ''}:${type || 'all'}:${lang || ''}:${limit || 24}:${page || 0}`;
}

async function fetchWithRetry(url, opts = {}, retries = 2, backoff = 600) {
    let lastErr;
    for (let i = 0; i <= retries; i++) {
        try {
            const ctrl = new AbortController();
            const to = setTimeout(() => ctrl.abort(), 12000); // 12s hard timeout
            const r = await fetch(url, { ...opts, signal: ctrl.signal });
            clearTimeout(to);
            if (r.status === 429 || (r.status >= 500 && r.status < 600)) {
                lastErr = new Error(`upstream ${r.status}`);
                if (i < retries) await new Promise(res => setTimeout(res, backoff * (i + 1)));
                else throw lastErr;
            } else if (!r.ok) {
                const t = await r.text().catch(() => '');
                throw new Error(`hf bad ${r.status} ${t}`);
            } else {
                return r;
            }
        } catch (e) {
            lastErr = e;
            if (i === retries) throw e;
            await new Promise(res => setTimeout(res, backoff * (i + 1)));
        }
    }
    throw lastErr;
}

function detectLang(tags = [], fallback = 'other') {
    if (Array.isArray(tags) && tags.includes('fa')) return 'fa';
    return fallback;
}

function toNum(v, d = 0) { const n = Number(v); return Number.isFinite(n) ? n : d; }

function normalize(m) {
    const tags = m.tags || [];
    const pipeline = m.pipeline_tag || 'text';
    return {
        id: m.id,
        name: m.id,
        publisher: m.author || pipeline || 'Hugging Face',
        type: pipeline,
        language: tags.includes('fa') ? 'fa' : 'other',
        downloads: toNum(m.downloads, 0),
        likes: toNum(m.likes, 0),
    };
}

router.get('/api/huggingface/models', async (req, res) => {
    try {
        const q = (req.query.q || '').toString().trim();
        const type = (req.query.type || 'all').toString();
        const lang = (req.query.lang || '').toString(); // 'fa' or ''
        const limit = Math.min(Number(req.query.limit) || 24, 60);
        const page = Math.max(Number(req.query.page) || 0, 0);
        const fresh = req.query.fresh === '1';

        const cacheKey = keyFrom({ q, type, lang, limit, page });
        if (!fresh && cache.has(cacheKey)) return res.json(cache.get(cacheKey));

        // HF API supports paging via `full` listing or search; basic search:
        const base = `https://huggingface.co/api/models?search=${encodeURIComponent(q)}&limit=${limit}&sort=downloads&direction=-1&full=0&cursor=${page}`;
        const headers = HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {};
        const r = await fetchWithRetry(base, { headers });

        const data = await r.json();
        let mapped = (Array.isArray(data) ? data : []).map(normalize);

        if (type !== 'all') mapped = mapped.filter(m => m.type === type);
        if (lang === 'fa') mapped = mapped.filter(m => m.language === 'fa');

        cache.set(cacheKey, mapped);
        return res.json(mapped);
    } catch (e) {
        return res.status(500).json({ error: 'hf search error' });
    }
});

export default router;
