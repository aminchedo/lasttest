import React from 'react';

export default function ProgressBar({ value = 0, speedMbps = 0, eta = '', message = '' }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="hf-progress">
      <div className="hf-progress-header">
        <span className="hf-progress-label">پیشرفت دانلود</span>
        <span className="hf-progress-percent">{pct.toFixed(1)}%</span>
      </div>
      <div className="hf-progress-bar-container" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} role="progressbar">
        <div className="hf-progress-bar-fill" style={{ width: pct + '%' }} />
      </div>
      <div className="hf-progress-info">
        <span className="hf-progress-speed">{speedMbps ? speedMbps.toFixed(2) + ' Mbps' : ''}</span>
        <span className="hf-progress-eta">{eta}</span>
      </div>
      {message ? <div className="hf-progress-message" title={message}>{message}</div> : null}
    </div>
  );
}
