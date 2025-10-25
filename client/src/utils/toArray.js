// client/src/utils/toArray.js
export function toArray(d) {
    if (Array.isArray(d)) return d;
    if (Array.isArray(d?.items)) return d.items;
    if (Array.isArray(d?.data)) return d.data;
    if (d && typeof d === 'object') return Object.values(d);
    return [];
}
