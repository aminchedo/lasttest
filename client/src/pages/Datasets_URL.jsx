// client/src/pages/Datasets_URL.jsx - URL download for datasets
import React, { useEffect, useRef, useState } from 'react';
import api from '../api/endpoints';
import { useDownloadsContext } from '../context/DownloadsProvider';
export default function DatasetsURL() {
    const { upsertJob } = useDownloadsContext();
    const [url, setUrl] = useState('https://example.com/file.zip');
    const [destDir, setDestDir] = useState('data/datasets');
    const [filename, setFilename] = useState('dataset.zip');
    const [job, setJob] = useState({ id: null, status: null, progress: 0 });
    const pollRef = useRef(null);

    async function start() {
        try {
            const r = await api.startUrlDownload([{ url, destDir, filename }]);
            const id = r.data.jobId;
            setJob({ id, status: 'queued', progress: 0 });
            upsertJob(id, { id, type: 'url', status: 'queued', progress: 0, meta: { url, destDir, filename, category: 'datasets' } });

            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = setInterval(async () => {
                const s = await api.getUrlStatus(id);
                const { status, progress } = s.data || {};
                setJob({ id, status, progress: progress || 0 });
                upsertJob(id, { status, progress: progress || 0 });
                if (status === 'done' || status === 'error') {
                    clearInterval(pollRef.current);
                    pollRef.current = null;
                }
            }, 1000);
        } catch (error) {
            console.error('URL download error:', error);
        }
    }

    useEffect(() => () => {
        if (pollRef.current) clearInterval(pollRef.current);
    }, []);

    return (
        <div className="container" dir="rtl">
            <div className="header">
                <h1>دانلود دیتاست</h1>
            </div>
            <div className="glass" style={{ padding: 12 }}>
                <div className="row">
                    <input
                        className="input"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://…"
                        style={{ minWidth: 340 }}
                    />
                    <input
                        className="input"
                        value={destDir}
                        onChange={e => setDestDir(e.target.value)}
                        placeholder="data/datasets"
                    />
                    <input
                        className="input"
                        value={filename}
                        onChange={e => setFilename(e.target.value)}
                        placeholder="dataset.zip"
                    />
                    <button className="btn" onClick={start}>دانلود</button>
                </div>
                {job.id && (
                    <div style={{ marginTop: 12 }}>
                        <div>Job: <span className="kbd">{job.id}</span> — وضعیت: <b>{job.status}</b></div>
                        <div className="progress" style={{ marginTop: 8 }}>
                            <div style={{ width: `${job.progress}%` }} />
                        </div>
                        <div style={{ marginTop: 6, fontSize: 12, color: '#9ca3af' }}>{job.progress}%</div>
                    </div>
                )}
            </div>
        </div>
    );
}

