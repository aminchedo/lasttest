import React, { useState, useEffect } from "react";
import { Activity, Clock, Wifi, WifiOff, TrendingUp, Zap, Target, AlertCircle } from "lucide-react";
import api from "../api/endpoints";

function MonitoringStrip({ trainingStatus, trainingMetrics }) {
  const [healthStatus, setHealthStatus] = useState("unknown");
  const [latency, setLatency] = useState(0);
  const [recentCalls, setRecentCalls] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      const startTime = Date.now();
      try {
        const result = await api.checkHealth();
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        setLatency(responseTime);
        setHealthStatus(result.ok ? "healthy" : "unhealthy");
        
        // Add to recent calls (dev only)
        if (import.meta.env.DEV) {
          setRecentCalls(prev => [
            { 
              endpoint: "/api/health", 
              status: result.ok ? 200 : 500, 
              time: new Date().toLocaleTimeString('fa-IR') 
            },
            ...prev.slice(0, 4)
          ]);
        }
      } catch (error) {
        setHealthStatus("unhealthy");
        setLatency(0);
      }
    };

    // Initial check
    checkHealth();
    
    // Check every 10 seconds
    const interval = setInterval(checkHealth, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Auto-show when training starts
  useEffect(() => {
    if (trainingStatus === 'training') {
      setIsVisible(true);
      setIsExpanded(true);
    } else if (trainingStatus === 'idle') {
      setIsExpanded(false);
    }
  }, [trainingStatus]);

  const getHealthColor = () => {
    switch (healthStatus) {
      case "healthy": return "#10b981";
      case "unhealthy": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getTrainingStatusColor = () => {
    switch (trainingStatus) {
      case "training": return "#3b82f6";
      case "paused": return "#f59e0b";
      case "completed": return "#10b981";
      case "failed": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getTrainingStatusText = () => {
    switch (trainingStatus) {
      case "idle": return "آماده";
      case "initializing": return "در حال آماده‌سازی";
      case "training": return "در حال آموزش";
      case "paused": return "متوقف شده";
      case "completed": return "تکمیل شده";
      case "failed": return "با خطا مواجه شد";
      default: return "نامشخص";
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Don't show if not training and not visible
  if (!isVisible && trainingStatus === 'idle') {
    return null;
  }

  return (
    <div className={`monitoring-strip ${isExpanded ? 'expanded' : ''}`}>
      <div className="monitoring-content">
        {/* System Health Status */}
        <div className="health-status">
          <div 
            className="status-dot" 
            style={{ backgroundColor: getHealthColor() }}
            title={`System Health: ${healthStatus}`}
          />
          {healthStatus === "healthy" ? (
            <Wifi size={16} color={getHealthColor()} />
          ) : (
            <WifiOff size={16} color={getHealthColor()} />
          )}
          <span className="health-text">
            {healthStatus === "healthy" ? "آنلاین" : 
             healthStatus === "unhealthy" ? "آفلاین" : "نامشخص"}
          </span>
          {latency > 0 && (
            <span className="latency-text" title="API Latency">
              {latency}ms
            </span>
          )}
        </div>

        {/* Training Status */}
        {trainingStatus && trainingStatus !== 'idle' && (
          <>
            <div className="divider" />
            
            <div className="training-status">
              <div 
                className="status-dot pulse" 
                style={{ backgroundColor: getTrainingStatusColor() }}
              />
              <Activity size={16} color={getTrainingStatusColor()} />
              <span className="status-text">
                {getTrainingStatusText()}
              </span>
            </div>

            {/* Quick Metrics */}
            {trainingMetrics && isExpanded && (
              <>
                <div className="divider" />
                
                <div className="quick-metrics">
                  {trainingMetrics.progress !== undefined && (
                    <div className="metric-item" title="پیشرفت">
                      <TrendingUp size={14} />
                      <span>{trainingMetrics.progress.toFixed(1)}%</span>
                    </div>
                  )}
                  
                  {trainingMetrics.trainLoss !== undefined && (
                    <div className="metric-item" title="Train Loss">
                      <Target size={14} />
                      <span>{trainingMetrics.trainLoss.toFixed(4)}</span>
                    </div>
                  )}
                  
                  {trainingMetrics.throughput !== undefined && trainingMetrics.throughput > 0 && (
                    <div className="metric-item" title="Throughput">
                      <Zap size={14} />
                      <span>{trainingMetrics.throughput.toFixed(1)} it/s</span>
                    </div>
                  )}
                  
                  {trainingMetrics.timeElapsed !== undefined && trainingMetrics.timeElapsed > 0 && (
                    <div className="metric-item" title="زمان سپری شده">
                      <Clock size={14} />
                      <span>{formatTime(trainingMetrics.timeElapsed)}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Recent API Calls (Dev only) */}
        {import.meta.env.DEV && recentCalls.length > 0 && isExpanded && (
          <>
            <div className="divider" />
            <div className="recent-calls">
              <span className="recent-label">آخرین درخواست‌ها:</span>
              {recentCalls.slice(0, 3).map((call, index) => (
                <span 
                  key={index}
                  className={`call-item ${call.status === 200 ? "success" : "error"}`}
                  title={`${call.endpoint} - ${call.time}`}
                >
                  {call.endpoint} ({call.status})
                </span>
              ))}
            </div>
          </>
        )}

        {/* Toggle Button */}
        <button 
          className="monitoring-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "مخفی کردن" : "نمایش جزئیات"}
        >
          {isExpanded ? <AlertCircle size={14} /> : <Clock size={14} />}
        </button>

        {/* Close Button (when idle) */}
        {trainingStatus === 'idle' && (
          <button 
            className="monitoring-close"
            onClick={() => setIsVisible(false)}
            title="بستن"
          >
            ✕
          </button>
        )}
      </div>

      <style jsx>{`
        .monitoring-strip {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(249, 250, 251, 0.98) 100%);
          backdrop-filter: blur(10px);
          border-bottom: 2px solid #e5e7eb;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: all 0.3s ease;
          animation: slideDown 0.4s ease-out;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .monitoring-strip.expanded {
          padding: 12px 20px;
        }

        .monitoring-strip:not(.expanded) {
          padding: 8px 20px;
        }

        .monitoring-content {
          display: flex;
          align-items: center;
          gap: 16px;
          max-width: 1400px;
          margin: 0 auto;
          flex-wrap: wrap;
        }

        .health-status,
        .training-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
          animation: breathe 2s ease-in-out infinite;
        }

        .status-dot.pulse {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(0.9);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            box-shadow: 0 0 8px currentColor;
          }
          50% {
            opacity: 0.8;
            box-shadow: 0 0 16px currentColor;
          }
        }

        .health-text,
        .status-text {
          color: #374151;
          font-weight: 600;
        }

        .latency-text {
          color: #6b7280;
          font-size: 11px;
          font-weight: 500;
          padding: 2px 6px;
          background: #f3f4f6;
          border-radius: 4px;
          font-family: monospace;
        }

        .divider {
          width: 1px;
          height: 20px;
          background: #d1d5db;
        }

        .quick-metrics {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .metric-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
          padding: 4px 8px;
          background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
          border-radius: 6px;
          border: 1px solid #e5e7eb;
        }

        .metric-item svg {
          color: #8b5cf6;
        }

        .recent-calls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .recent-label {
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
        }

        .call-item {
          font-size: 10px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          font-family: monospace;
        }

        .call-item.success {
          background: #d1fae5;
          color: #065f46;
        }

        .call-item.error {
          background: #fee2e2;
          color: #991b1b;
        }

        .monitoring-toggle,
        .monitoring-close {
          margin-left: auto;
          background: transparent;
          border: 2px solid #e5e7eb;
          border-radius: 6px;
          padding: 6px 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
          transition: all 0.2s;
        }

        .monitoring-toggle:hover,
        .monitoring-close:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
          background: rgba(139, 92, 246, 0.05);
        }

        .monitoring-close {
          font-size: 14px;
          font-weight: bold;
          padding: 4px 10px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .monitoring-strip {
            padding: 8px 12px;
          }

          .monitoring-content {
            gap: 12px;
          }

          .quick-metrics {
            gap: 8px;
          }

          .recent-calls {
            display: none;
          }

          .divider {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default MonitoringStrip;
