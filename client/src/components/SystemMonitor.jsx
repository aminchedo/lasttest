import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, MemoryStick, Wifi, Thermometer, Zap, Activity } from 'lucide-react';

function SystemMonitor() {
  const [systemStats, setSystemStats] = useState({
    cpu: { usage: 0, cores: 8, temperature: 45 },
    memory: { usage: 0, total: 16, used: 0 },
    disk: { usage: 0, total: 500, used: 0 },
    network: { upload: 0, download: 0, latency: 0 },
    gpu: { usage: 0, temperature: 35 }
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate real-time system monitoring
    const updateStats = () => {
      setSystemStats(prev => ({
        cpu: {
          ...prev.cpu,
          usage: Math.random() * 100,
          temperature: 40 + Math.random() * 20
        },
        memory: {
          ...prev.memory,
          usage: Math.random() * 100,
          used: prev.memory.total * Math.random()
        },
        disk: {
          ...prev.disk,
          usage: Math.random() * 100,
          used: prev.disk.total * Math.random()
        },
        network: {
          ...prev.network,
          upload: Math.random() * 100,
          download: Math.random() * 100,
          latency: 10 + Math.random() * 50
        },
        gpu: {
          ...prev.gpu,
          usage: Math.random() * 100,
          temperature: 30 + Math.random() * 15
        }
      }));
    };

    // Initial update
    updateStats();

    // Update every 2 seconds
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, []);

  const getUsageColor = (usage) => {
    if (usage < 50) return '#22c55e'; // green
    if (usage < 80) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const getTemperatureColor = (temp) => {
    if (temp < 50) return '#22c55e'; // green
    if (temp < 70) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const CircularProgress = ({ percentage, color, size = 40, strokeWidth = 3, icon: Icon }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="circular-progress-container" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="circular-progress-svg">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="circular-progress-circle"
            style={{
              transition: 'stroke-dashoffset 0.5s ease-in-out',
              filter: 'drop-shadow(0 0 8px currentColor)'
            }}
          />
        </svg>
        <div className="circular-progress-content">
          {Icon && <Icon size={size * 0.3} />}
          <span className="circular-progress-text">{Math.round(percentage)}%</span>
        </div>
      </div>
    );
  };

  const MetricCard = ({ title, value, unit, color, icon: Icon, trend }) => (
    <div className="unified-metric-card">
      <div className="metric-header">
        <div className="metric-icon" style={{ color }}>
          {Icon && <Icon size={16} />}
        </div>
        <span className="unified-metric-card__title">{title}</span>
        {trend && (
          <span className={`metric-trend ${trend > 0 ? 'trend-up' : 'trend-down'}`}>
            {trend > 0 ? '↗' : '↘'}
          </span>
        )}
      </div>
      <div className="metric-value">
        <span style={{ color }}>{value}</span>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className={`system-monitor ${isExpanded ? 'expanded' : ''}`}>
      <div className="system-monitor-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="system-status">
          <Activity size={16} className="pulse-icon" />
          <span>سیستم</span>
        </div>
        <div className="system-summary">
          <CircularProgress 
            percentage={systemStats.cpu.usage} 
            color={getUsageColor(systemStats.cpu.usage)}
            size={24}
            strokeWidth={2}
            icon={Cpu}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="system-monitor-content">
          <div className="system-metrics-grid">
            <div className="system-metric-large">
              <div className="unified-metric-card__title">CPU</div>
              <CircularProgress 
                percentage={systemStats.cpu.usage} 
                color={getUsageColor(systemStats.cpu.usage)}
                size={60}
                icon={Cpu}
              />
              <div className="metric-details">
                <span>{systemStats.cpu.cores} هسته</span>
                <span style={{ color: getTemperatureColor(systemStats.cpu.temperature) }}>
                  {Math.round(systemStats.cpu.temperature)}°C
                </span>
              </div>
            </div>

            <div className="system-metric-large">
              <div className="unified-metric-card__title">RAM</div>
              <CircularProgress 
                percentage={systemStats.memory.usage} 
                color={getUsageColor(systemStats.memory.usage)}
                size={60}
                icon={MemoryStick}
              />
              <div className="metric-details">
                <span>{Math.round(systemStats.memory.used)}GB / {systemStats.memory.total}GB</span>
              </div>
            </div>

            <div className="system-metric-large">
              <div className="unified-metric-card__title">GPU</div>
              <CircularProgress 
                percentage={systemStats.gpu.usage} 
                color={getUsageColor(systemStats.gpu.usage)}
                size={60}
                icon={Zap}
              />
              <div className="metric-details">
                <span style={{ color: getTemperatureColor(systemStats.gpu.temperature) }}>
                  {Math.round(systemStats.gpu.temperature)}°C
                </span>
              </div>
            </div>
          </div>

          <div className="system-metrics-row">
            <MetricCard
              title="دیسک"
              value={`${Math.round(systemStats.disk.used)}GB`}
              unit={`/ ${systemStats.disk.total}GB`}
              color={getUsageColor(systemStats.disk.usage)}
              icon={HardDrive}
            />
            <MetricCard
              title="آپلود"
              value={Math.round(systemStats.network.upload)}
              unit="Mbps"
              color="#3b82f6"
              icon={Wifi}
            />
            <MetricCard
              title="دانلود"
              value={Math.round(systemStats.network.download)}
              unit="Mbps"
              color="#8b5cf6"
              icon={Wifi}
            />
            <MetricCard
              title="تأخیر"
              value={Math.round(systemStats.network.latency)}
              unit="ms"
              color={systemStats.network.latency < 30 ? '#22c55e' : '#f59e0b'}
              icon={Thermometer}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SystemMonitor;
