import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, Shield, Activity, Zap } from 'lucide-react';

function HealthBadge() {
    const [status, setStatus] = useState('checking'); // checking, healthy, degraded, unhealthy
    const [latency, setLatency] = useState(null);
    const [lastCheck, setLastCheck] = useState(null);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const checkHealth = async () => {
            const startTime = Date.now();

            try {
                const response = await fetch('http://localhost:30011/api/health', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                const endTime = Date.now();
                const responseTime = endTime - startTime;

                if (response.ok) {
                    setStatus('healthy');
                    setLatency(responseTime);
                    setError(null);
                } else {
                    setStatus('degraded');
                    setError(`HTTP ${response.status}`);
                }
            } catch (err) {
                setStatus('unhealthy');
                setError(err.message);
                setLatency(null);
            }

            setLastCheck(new Date());
        };

        // Initial check
        checkHealth();

        // Check every 10 seconds
        const interval = setInterval(checkHealth, 10000);

        return () => clearInterval(interval);
    }, []);

    const getStatusIcon = () => {
        switch (status) {
            case 'healthy':
                return <Shield className="w-4 h-4" />;
            case 'degraded':
                return <AlertTriangle className="w-4 h-4" />;
            case 'unhealthy':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Activity className="w-4 h-4 animate-pulse" />;
        }
    };

    const getStatusText = () => {
        switch (status) {
            case 'healthy':
                return 'آنلاین';
            case 'degraded':
                return 'مشکل جزئی';
            case 'unhealthy':
                return 'آفلاین';
            default:
                return 'بررسی...';
        }
    };

    const getStatusClass = () => {
        switch (status) {
            case 'healthy':
                return 'green';
            case 'degraded':
                return 'amber';
            case 'unhealthy':
                return 'red';
            default:
                return 'amber';
        }
    };

    const formatLastCheck = () => {
        if (!lastCheck) return '';

        const now = new Date();
        const diffMs = now - lastCheck;
        const diffSeconds = Math.floor(diffMs / 1000);

        if (diffSeconds < 60) {
            return `${diffSeconds} ثانیه پیش`;
        } else if (diffSeconds < 3600) {
            const minutes = Math.floor(diffSeconds / 60);
            return `${minutes} دقیقه پیش`;
        } else {
            return lastCheck.toLocaleTimeString('fa-IR', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const getStatusColor = () => {
        switch (status) {
            case 'healthy': return '#22c55e';
            case 'degraded': return '#f59e0b';
            case 'unhealthy': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getStatusGlow = () => {
        const color = getStatusColor();
        return `0 0 20px ${color}40, 0 0 40px ${color}20`;
    };

    return (
        <div className={`health-badge-modern ${getStatusClass()}`} onClick={() => setIsExpanded(!isExpanded)}>
            <div className="health-badge-main">
                <div 
                    className="health-icon-container"
                    style={{ 
                        color: getStatusColor(),
                        boxShadow: getStatusGlow()
                    }}
                >
                    {getStatusIcon()}
                </div>
                <div className="health-text">
                    <span className="health-status">{getStatusText()}</span>
                    {latency && (
                        <span className="health-latency">{latency}ms</span>
                    )}
                </div>
                <div className="health-indicator">
                    <div 
                        className="health-pulse"
                        style={{ 
                            backgroundColor: getStatusColor(),
                            boxShadow: getStatusGlow()
                        }}
                    />
                </div>
            </div>

            {isExpanded && (
                <div className="health-badge-expanded">
                    <div className="health-details">
                        <div className="health-detail-item">
                            <span className="detail-label">وضعیت:</span>
                            <span className="detail-value" style={{ color: getStatusColor() }}>
                                {getStatusText()}
                            </span>
                        </div>
                        {latency && (
                            <div className="health-detail-item">
                                <span className="detail-label">تأخیر:</span>
                                <span className="detail-value">{latency}ms</span>
                            </div>
                        )}
                        {error && (
                            <div className="health-detail-item">
                                <span className="detail-label">خطا:</span>
                                <span className="detail-value error">{error}</span>
                            </div>
                        )}
                        {lastCheck && (
                            <div className="health-detail-item">
                                <span className="detail-label">آخرین بررسی:</span>
                                <span className="detail-value">{formatLastCheck()}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default HealthBadge;
