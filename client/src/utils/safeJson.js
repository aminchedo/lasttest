// safeJson.js - Safe JSON parsing utility to prevent crashes
export async function safeJson(res) {
    try {
        const text = await res.text();
        if (!text) return null;
        return JSON.parse(text);
    } catch {
        return null;
    }
}

// Alternative for direct response handling
export function safeJsonSync(text) {
    try {
        if (!text) return null;
        return JSON.parse(text);
    } catch {
        return null;
    }
}

// Safe fetch wrapper
export async function safeFetch(url, options = {}) {
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                'Accept': 'application/json',
                ...options.headers
            }
        });

        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                error: `Request failed (${res.status})`,
                data: null
            };
        }

        const data = await safeJson(res);
        return {
            ok: true,
            status: res.status,
            data,
            error: null
        };
    } catch (error) {
        return {
            ok: false,
            status: null,
            error: 'Network error',
            data: null,
            networkError: true
        };
    }
}
