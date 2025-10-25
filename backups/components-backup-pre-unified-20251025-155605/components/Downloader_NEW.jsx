// client/src/components/Downloader_NEW.jsx - Global downloads view
import React from 'react';
import useDownloads from '../hooks/useDownloads';
export default function DownloaderNEW() {
    const { items } = useDownloads(s => s);
    const [active, setActive] = React.useState('datasets');
    const [q, setQ] = React.useState('');
    const [filter, setFilter] = React.useState('all');

    function list() {
        let L = items[active] || [];
        if (q) L = L.filter(i => (i.name || '').toLowerCase().includes(q.toLowerCase()));
        if (filter !== 'all') L = L.filter(i => i.status === filter);
        return L;
    }

    return (
        <div className="container" dir="rtl">
            <div className="header">
                <h1>دانلودها</h1>
                <div className="row">
                    <input
                        className="input"
                        placeholder="جستجو…"
                        value={q}
                        onChange={e => setQ(e.target.value)}
                    />
                    <select className="select" value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="all">همه</option>
                        <option value="ready">آماده</option>
                        <option value="downloading">در حال دانلود</option>
                        <option value="error">خطا</option>
                    </select>
                </div>
            </div>

            <div className="row" style={{ marginBottom: 12 }}>
                {['datasets', 'models', 'tts'].map(t => (
                    <button
                        key={t}
                        className="btn"
                        onClick={() => setActive(t)}
                        style={{ opacity: active === t ? 1 : 0.7 }}
                    >
                        {t === 'datasets' ? 'Dataset‌ها' : t === 'models' ? 'مدل‌ها' : 'TTS'}
                    </button>
                ))}
            </div>

            <div className="grid cols-3">
                {list().map((it, idx) => (
                    <div key={it.id || idx} className="glass" style={{ padding: 12 }}>
                        <div style={{ fontWeight: 700 }}>{it.name}</div>
                        <div style={{ display: 'flex', gap: 10, color: '#9ca3af', fontSize: 12, flexWrap: 'wrap', marginTop: 6 }}>
                            <span>{it.size || '—'}</span>
                            <span>{it.status || '—'}</span>
                            <span>{it.createdAt || ''}</span>
                        </div>
                        {typeof it.progress === 'number' && (
                            <div className="progress" style={{ marginTop: 8 }}>
                                <div style={{ width: `${it.progress}%` }} />
                            </div>
                        )}
                        <div className="row" style={{ marginTop: 10 }}>
                            <a className="btn" href={it.path || '#'} target="_blank" rel="noreferrer">نمایش</a>
                            <button className="btn">حذف</button>
                        </div>
                    </div>
                ))}
                {list().length === 0 && (
                    <div className="glass" style={{ padding: 12 }}>موردی یافت نشد</div>
                )}
            </div>
        </div>
    );
}

