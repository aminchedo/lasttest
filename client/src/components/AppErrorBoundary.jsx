import React, { useState } from 'react';

export default function AppErrorBoundary({ children }) {
    const [err, setErr] = useState(null);

    return (
        <ErrorCatcher onError={setErr}>
            {err ? (
                <div
                    role="alert"
                    dir="rtl"
                    style={{
                        padding: 16,
                        background: '#fff',
                        color: '#b00020',
                        border: '1px solid #b00020',
                        borderRadius: '8px',
                        margin: '16px',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                >
                    <strong>Something went wrong.</strong>
                    <div style={{ marginTop: 8, direction: 'ltr', fontSize: '14px', opacity: 0.8 }}>
                        {String(err?.message || err)}
                    </div>
                    <button
                        onClick={() => setErr(null)}
                        style={{
                            marginTop: 12,
                            padding: '8px 16px',
                            background: '#b00020',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            ) : children}
        </ErrorCatcher>
    );
}

function ErrorCatcher({ children, onError }) {
    try {
        return children;
    } catch (e) {
        onError?.(e);
        return null;
    }
}
