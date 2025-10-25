import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { safeJson } from '../utils/safeJson';

function NetworkMonitor({ isVisible, onToggle }) {
    const [apiCalls, setApiCalls] = useState([]);
    const [isEnabled, setIsEnabled] = useState(process.env.NODE_ENV === 'development');

    useEffect(() => {
        if (!isEnabled) return;

        // Intercept fetch calls
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const startTime = Date.now();
            const url = args[0];

            try {
                const response = await originalFetch(...args);
                const endTime = Date.now();
                const duration = endTime - startTime;

                addApiCall({
                    id: Date.now() + Math.random(),
                    url: typeof url === 'string' ? url : url.toString(),
                    method: args[1]?.method || 'GET',
                    status: response.status,
                    duration,
                    success: response.ok,
                    timestamp: new Date()
                });

                return response;
            } catch (error) {
                const endTime = Date.now();
                const duration = endTime - startTime;

                addApiCall({
                    id: Date.now() + Math.random(),
                    url: typeof url === 'string' ? url : url.toString(),
                    method: args[1]?.method || 'GET',
                    status: 0,
                    duration,
                    success: false,
                    error: error.message,
                    timestamp: new Date()
                });

                throw error;
            }
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, [isEnabled]);

    const addApiCall = (call) => {
        setApiCalls(prev => {
            const newCalls = [call, ...prev.slice(0, 9)]; // Keep last 10 calls
            return newCalls;
        });
    };

    const handleRetry = async (call) => {
        try {
            const response = await fetch(call.url, {
                method: call.method,
                headers: { 'Content-Type': 'application/json' }
            });

            addApiCall({
                id: Date.now() + Math.random(),
                ...call,
                status: response.status,
                success: response.ok,
                timestamp: new Date()
            });
        } catch (error) {
            addApiCall({
                id: Date.now() + Math.random(),
                ...call,
                status: 0,
                success: false,
                error: error.message,
                timestamp: new Date()
            });
        }
    };

    const formatUrl = (url) => {
        try {
            const urlObj = new URL(url, window.location.origin);
            return urlObj.pathname + urlObj.search;
        } catch {
            return url;
        }
    };

    const formatDuration = (ms) => {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(1)}s`;
    };

    const formatTime = (timestamp) => {
        return timestamp.toLocaleTimeString('fa-IR', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    if (!isEnabled) {
        return null;
    }

    return (
        <>
            <button
                className={`monitor-dock ${isVisible ? 'active' : ''}`}
                onClick={onToggle}
                title={isVisible ? "مخفی کردن مانیتور شبکه" : "نمایش مانیتور شبکه"}
            >
                <Activity className="w-4 h-4" />
                {apiCalls.length > 0 && (
                    <span className="call-count">{apiCalls.length}</span>
                )}
            </button>

            {isVisible && (
                <div className="network-monitor-dock">
                    <div className="monitor-header">
                        <h3>مانیتور شبکه</h3>
                        <button
                            onClick={() => setIsEnabled(false)}
                            className="close-button"
                        >
                            ×
                        </button>
                    </div>

                    <div className="api-calls-list">
                        {apiCalls.length === 0 ? (
                            <p className="no-calls">هیچ درخواست API ثبت نشده</p>
                        ) : (
                            apiCalls.map((call) => (
                                <div key={call.id} className="api-call-item">
                                    <div className="api-call-info">
                                        <div className="api-call-url">
                                            <span className="method-badge">{call.method}</span>
                                            <span className="url-text">{formatUrl(call.url)}</span>
                                        </div>
                                        <div className="api-call-meta">
                                            <span className="api-call-time">{formatTime(call.timestamp)}</span>
                                            <span className="api-call-duration">{formatDuration(call.duration)}</span>
                                        </div>
                                    </div>

                                    <div className="api-call-status">
                                        {call.success ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}

                                        {!call.success && (
                                            <button
                                                onClick={() => handleRetry(call)}
                                                className="retry-button"
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    padding: '0.25rem'
                                                }}
                                                title="تلاش مجدد"
                                            >
                                                <RefreshCw className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="monitor-footer">
                        <small>
                            {apiCalls.filter(c => !c.success).length} خطا از {apiCalls.length} درخواست
                        </small>
                    </div>
                </div>
            )}
        </>
    );
}

export default NetworkMonitor;
