// client/src/pages/HuggingFaceModels_NEW.jsx - Real HF downloads
import React, { useEffect, useRef, useState } from 'react';
import api from '../api/endpoints';
import { useDownloadsContext } from '../context/DownloadsProvider';
export default function HuggingFaceModels() {
    const { upsertJob } = useDownloadsContext();
    const [modelId, setModelId] = useState('HooshvareLab/gpt2-fa');
    const [targetDir, setTargetDir] = useState('models/base');
    const [job, setJob] = useState({ id: null, status: null, progress: 0 });
    const pollRef = useRef(null);

    async function start() {
        try {
            const r = await api.startHfDownload(modelId, targetDir);
            const id = r.data.jobId;
            setJob({ id, status: 'queued', progress: 0 });
            upsertJob(id, { id, type: 'hf', status: 'queued', progress: 0, meta: { modelId, targetDir } });

            if (pollRef.current) clearInterval(pollRef.current);
            pollRef.current = setInterval(async () => {
                const s = await api.getHfStatus(id);
                const { status, progress } = s.data || {};
                setJob({ id, status, progress: progress || 0 });
                upsertJob(id, { status, progress: progress || 0 });
                if (status === 'done' || status === 'error') {
                    clearInterval(pollRef.current);
                    pollRef.current = null;
                }
            }, 1000);
        } catch (error) {
            console.error('HF download error:', error);
        }
    }

    useEffect(() => () => {
        if (pollRef.current) clearInterval(pollRef.current);
    }, []);

    return (
        <div className="container" dir="rtl">
            <div className="header">
                <h1>Hugging Face</h1>
            </div>
            <div className="glass" style={{ padding: 12 }}>
                <div className="row">
                    <input
                        className="input"
                        value={modelId}
                        onChange={e => setModelId(e.target.value)}
                        placeholder="owner/repo"
                        style={{ minWidth: 320 }}
                    />
                    <input
                        className="input"
                        value={targetDir}
                        onChange={e => setTargetDir(e.target.value)}
                        placeholder="models/base"
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

