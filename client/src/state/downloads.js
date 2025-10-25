import { clamp, num } from '../utils/sanitize';

class Emitter {
    constructor() {
        this.listeners = new Set();
    }
    on(fn) {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }
    emit(d) {
        for (const fn of [...this.listeners]) {
            try {
                fn(d);
            } catch (e) {
                console.error('Emitter error:', e);
            }
        }
    }
}

const state = {
    jobs: {},
    items: {
        datasets: [],
        models: [],
        tts: []
    },
    lastSync: 0
};

const emitter = new Emitter();

const setState = (mut) => {
    mut(state);
    emitter.emit(state);
};

let polling = false;
let pollTimer = null;

function sanitizeItem(it) {
    const progress = clamp(it?.progress ?? 0, 0, 100);
    const size = num(it?.size, null);
    return { ...it, progress, size };
}

function sanitizeItems(items) {
    return {
        datasets: Array.isArray(items?.datasets) ? items.datasets.map(sanitizeItem) : [],
        models: Array.isArray(items?.models) ? items.models.map(sanitizeItem) : [],
        tts: Array.isArray(items?.tts) ? items.tts.map(sanitizeItem) : [],
    };
}

export const API = {
    setItems(items) {
        setState(s => {
            s.items = sanitizeItems(items);
            s.lastSync = Date.now();
        });
    },

    upsertJob(id, patch) {
        setState(s => {
            const prev = s.jobs[id] || { id };
            const progress = clamp((patch?.progress ?? prev.progress ?? 0), 0, 100);
            s.jobs[id] = { ...prev, ...patch, progress };
        });
    },

    startPolling: async function loop(fn) {
        if (polling) return;
        polling = true;
        const tick = async () => {
            try {
                await fn();
            } catch (e) {
                console.error('Poll error:', e);
            }
            pollTimer = setTimeout(tick, 1000);
        };
        tick();
    },

    stopPolling() {
        polling = false;
        if (pollTimer) {
            clearTimeout(pollTimer);
            pollTimer = null;
        }
    }
};

export const subscribe = (l) => emitter.on(l);
export const getState = () => state;

