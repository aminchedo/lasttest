import React, { useState, useEffect } from "react";
import { Activity, Clock, Wifi, WifiOff } from "lucide-react";
import api from "../api/endpoints";

function MonitoringStrip() {
  const [healthStatus, setHealthStatus] = useState("unknown");
  const [latency, setLatency] = useState(0);
  const [recentCalls, setRecentCalls] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

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
            { endpoint: "/api/health", status: result.ok ? 200 : 500, time: new Date().toLocaleTimeString() },
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

  const getHealthColor = () => {
    switch (healthStatus) {
      case "healthy": return "#10b981";
      case "unhealthy": return "#ef4444";
      default: return "#6b7280";
    }
  };

  return (
    <div className="monitoring-strip">
      <div className="monitoring-content">
        <div className="health-status">
          <div 
            className="health-dot" 
            style={{ backgroundColor: getHealthColor() }}
          />
          <span className="health-text">
            {healthStatus === "healthy" ? "آنلاین" : 
             healthStatus === "unhealthy" ? "آفلاین" : "نامشخص"}
          </span>
          {latency > 0 && (
            <span className="latency-text">
              {latency}ms
            </span>
          )}
        </div>

        {import.meta.env.DEV && recentCalls.length > 0 && (
          <div className="recent-calls">
            <span className="recent-label">آخرین درخواست‌ها:</span>
            {recentCalls.slice(0, 3).map((call, index) => (
              <span 
                key={index}
                className={`call-item ${call.status === 200 ? "success" : "error"}`}
              >
                {call.endpoint} ({call.status})
              </span>
            ))}
          </div>
        )}

        <button 
          className="monitoring-toggle"
          onClick={() => setIsVisible(!isVisible)}
          title={isVisible ? "مخفی کردن" : "نمایش جزئیات"}
        >
          <Clock size={14} />
        </button>
      </div>

      {isVisible && (
        <div className="monitoring-details">
          <div className="detail-item">
            <span>وضعیت:</span>
            <span style={{ color: getHealthColor() }}>
              {healthStatus === "healthy" ? "سالم" : 
               healthStatus === "unhealthy" ? "مشکل" : "نامشخص"}
            </span>
          </div>
          <div className="detail-item">
            <span>تأخیر:</span>
            <span>{latency}ms</span>
          </div>
          {recentCalls.length > 0 && (
            <div className="detail-item">
              <span>درخواست‌های اخیر:</span>
              <span>{recentCalls.length}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MonitoringStrip;
