// Enhanced Dashboard - با کارت‌های کامپکت و اطلاعات جامع
import React, { useState, useEffect } from 'react';
import {
  Brain, Database, ChartLine, Clock, CheckCircle,
  Activity, TrendingUp, AlertCircle, Zap, Server,
  Download, RefreshCw, Cpu, HardDrive, Wifi,
  PlayCircle, PauseCircle, StopCircle, Award,
  Users, Calendar, Settings, BarChart3, PieChart,
  Target, Rocket, Shield, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns-jalali';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import apiClient from '../api/client';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [models, setModels] = useState([]);
  const [trainingJobs, setTrainingJobs] = useState([]);
  const [resourceHistory, setResourceHistory] = useState([]);
  const [modelStats, setModelStats] = useState([]);

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadMetrics, 5000);

    // Subscribe to real-time updates
    const unsubscribeMetrics = apiClient.subscribeToMetrics(updateMetrics);

    return () => {
      clearInterval(interval);
      unsubscribeMetrics();
    };
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        statsRes,
        activitiesRes,
        statusRes,
        modelsRes,
        metricsRes,
        jobsRes
      ] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getRecentActivities(10),
        apiClient.getSystemStatus(),
        apiClient.getModels(),
        apiClient.getSystemMetrics().catch(() => null),
        apiClient.getTrainingJobs().catch(() => [])
      ]);

      setStats(statsRes);
      setActivities(activitiesRes);
      setSystemStatus(statusRes);
      setModels(modelsRes);
      setTrainingJobs(jobsRes);
      if (metricsRes) setMetrics(metricsRes);

      // Mock model statistics
      setModelStats([
        { name: 'GPT-2', usage: 45, color: '#8b5cf6' },
        { name: 'BERT', usage: 30, color: '#3b82f6' },
        { name: 'Llama', usage: 15, color: '#10b981' },
        { name: 'Others', usage: 10, color: '#f59e0b' }
      ]);

    } catch (error) {
      console.error('Dashboard load error:', error);
      toast.error('خطا در بارگذاری داشبورد');
    } finally {
      setLoading(false);
    }
  };

  const loadMetrics = async () => {
    try {
      const metricsRes = await apiClient.getSystemMetrics();
      updateMetrics(metricsRes);
      
      // Add to history
      setResourceHistory(prev => [
        ...prev.slice(-29),
        {
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          cpu: metricsRes.cpu || Math.random() * 100,
          memory: metricsRes.memory || Math.random() * 100,
          gpu: metricsRes.gpu || Math.random() * 100
        }
      ]);
    } catch (error) {
      console.error('Metrics load error:', error);
    }
  };

  const updateMetrics = (data) => {
    setMetrics(data);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
    toast.success('داشبورد به‌روزرسانی شد');
  };

  const formatSize = (size) => {
    if (typeof size === 'string') return size;
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let index = 0;
    let num = size;
    while (num >= 1024 && index < units.length - 1) {
      num /= 1024;
      index++;
    }
    return `${num.toFixed(1)} ${units[index]}`;
  };

  const getPercentage = (used, total) => {
    if (!used || !total) return 0;
    const usedNum = parseFloat(used);
    const totalNum = parseFloat(total);
    return Math.round((usedNum / totalNum) * 100);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-content">
          <div className="loading-spinner" />
          <p>در حال بارگذاری داشبورد...</p>
        </div>
      </div>
    );
  }

  const activeRuns = stats?.runs?.active ?? 0;
  const totalRuns = stats?.runs?.total ?? 0;
  const assetsReady = stats?.assets?.ready ?? 0;
  const assetsTotal = stats?.assets?.total ?? 0;
  const todayTrainings = stats?.todayTrainings ?? 0;
  const avgLatency = systemStatus?.latency ?? 0;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-icon">
            <Activity size={28} />
          </div>
          <div className="header-text">
            <h1>داشبورد مدیریت</h1>
            <p>نمای کلی سیستم آموزش مدل‌های هوش مصنوعی</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          className="refresh-button"
          disabled={refreshing}
        >
          <RefreshCw className={refreshing ? 'spinning' : ''} size={18} />
          <span>{refreshing ? 'در حال بروزرسانی...' : 'بروزرسانی'}</span>
        </motion.button>
      </div>

      {/* Quick Stats - Compact Cards */}
      <div className="quick-stats">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-card purple"
        >
          <div className="stat-icon">
            <Brain size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">مدل‌های فعال</span>
            <div className="stat-value-row">
              <span className="stat-value">{activeRuns}</span>
              <span className="stat-total">/ {totalRuns}</span>
            </div>
            <div className="stat-change positive">
              <TrendingUp size={12} />
              <span>+12%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card blue"
        >
          <div className="stat-icon">
            <Database size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">دیتاست‌های آماده</span>
            <div className="stat-value-row">
              <span className="stat-value">{assetsReady}</span>
              <span className="stat-total">/ {assetsTotal}</span>
            </div>
            <div className="stat-change positive">
              <TrendingUp size={12} />
              <span>+8%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card green"
        >
          <div className="stat-icon">
            <Zap size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">آموزش‌های امروز</span>
            <div className="stat-value-row">
              <span className="stat-value">{todayTrainings}</span>
              <span className="stat-total">کامل</span>
            </div>
            <div className="stat-change positive">
              <TrendingUp size={12} />
              <span>+5%</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stat-card orange"
        >
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-label">میانگین زمان</span>
            <div className="stat-value-row">
              <span className="stat-value">{avgLatency}</span>
              <span className="stat-total">ms</span>
            </div>
            <div className="stat-change negative">
              <TrendingUp size={12} style={{ transform: 'rotate(180deg)' }} />
              <span>-3%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        {/* Left Column */}
        <div className="left-column">
          {/* System Resources */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="panel resources-panel"
          >
            <div className="panel-header">
              <Server size={20} />
              <h3>منابع سیستم</h3>
              <span className="status-badge online">آنلاین</span>
            </div>

            <div className="resources-list">
              <div className="resource-item">
                <div className="resource-header">
                  <Cpu size={18} />
                  <span>CPU</span>
                  <span className="resource-percentage">{metrics?.cpu || 0}%</span>
                </div>
                <div className="resource-bar">
                  <motion.div
                    className="resource-fill purple"
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics?.cpu || 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="resource-item">
                <div className="resource-header">
                  <HardDrive size={18} />
                  <span>Memory</span>
                  <span className="resource-percentage">{metrics?.memory || 0}%</span>
                </div>
                <div className="resource-bar">
                  <motion.div
                    className="resource-fill blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics?.memory || 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="resource-item">
                <div className="resource-header">
                  <Zap size={18} />
                  <span>GPU</span>
                  <span className="resource-percentage">{metrics?.gpu || 0}%</span>
                </div>
                <div className="resource-bar">
                  <motion.div
                    className="resource-fill green"
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics?.gpu || 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>

            {resourceHistory.length > 0 && (
              <div className="resource-chart">
                <ResponsiveContainer width="100%" height={150}>
                  <AreaChart data={resourceHistory}>
                    <defs>
                      <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="gpuGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: '2px solid #8b5cf6',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Area type="monotone" dataKey="cpu" stroke="#8b5cf6" fillOpacity={1} fill="url(#cpuGradient)" />
                    <Area type="monotone" dataKey="memory" stroke="#3b82f6" fillOpacity={1} fill="url(#memGradient)" />
                    <Area type="monotone" dataKey="gpu" stroke="#10b981" fillOpacity={1} fill="url(#gpuGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Training Jobs in Progress */}
          {trainingJobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="panel jobs-panel"
            >
              <div className="panel-header">
                <Rocket size={20} />
                <h3>آموزش‌های در حال اجرا</h3>
                <span className="count-badge">{trainingJobs.length}</span>
              </div>

              <div className="jobs-list">
                {trainingJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="job-item"
                  >
                    <div className="job-header">
                      <div className="job-title">
                        <Brain size={16} />
                        <span>{job.name}</span>
                      </div>
                      <span className={`job-status ${job.status}`}>
                        {job.status === 'training' && <PlayCircle size={12} />}
                        {job.status}
                      </span>
                    </div>

                    <div className="job-progress">
                      <div className="progress-info">
                        <span>{job.progress}%</span>
                        <span className="progress-eta">{job.elapsed}</span>
                      </div>
                      <div className="progress-bar">
                        <motion.div
                          className="progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${job.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    <div className="job-metrics">
                      <div className="metric">
                        <TrendingUp size={12} />
                        <span>Loss: {job.loss?.toFixed(4)}</span>
                      </div>
                      <div className="metric">
                        <Target size={12} />
                        <span>Acc: {job.accuracy?.toFixed(2)}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Model Usage Statistics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="panel chart-panel"
          >
            <div className="panel-header">
              <PieChart size={20} />
              <h3>آمار استفاده از مدل‌ها</h3>
            </div>

            <div className="pie-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <RePieChart>
                  <Pie
                    data={modelStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="usage"
                  >
                    {modelStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                {modelStats.map((stat, index) => (
                  <div key={index} className="legend-item">
                    <div className="legend-color" style={{ background: stat.color }} />
                    <span>{stat.name}</span>
                    <span className="legend-value">{stat.usage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="panel activities-panel"
          >
            <div className="panel-header">
              <Clock size={20} />
              <h3>فعالیت‌های اخیر</h3>
              <button className="view-all">مشاهده همه</button>
            </div>

            <div className="activities-list">
              <AnimatePresence>
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`activity-item ${activity.type}`}
                  >
                    <div className="activity-icon">
                      {activity.type === 'training' && <Brain size={16} />}
                      {activity.type === 'download' && <Download size={16} />}
                      {activity.type === 'complete' && <CheckCircle size={16} />}
                      {activity.type === 'error' && <AlertCircle size={16} />}
                    </div>
                    <div className="activity-content">
                      <p className="activity-message">{activity.message}</p>
                      <p className="activity-time">{activity.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {activities.length === 0 && (
                <div className="empty-state">
                  <Activity size={40} />
                  <p>هیچ فعالیتی یافت نشد</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="panel actions-panel"
          >
            <div className="panel-header">
              <Zap size={20} />
              <h3>عملیات سریع</h3>
            </div>

            <div className="actions-grid">
              <button className="action-btn purple">
                <PlayCircle size={20} />
                <span>شروع آموزش جدید</span>
              </button>
              <button className="action-btn blue">
                <Download size={20} />
                <span>دانلود مدل</span>
              </button>
              <button className="action-btn green">
                <Database size={20} />
                <span>آپلود دیتاست</span>
              </button>
              <button className="action-btn orange">
                <Settings size={20} />
                <span>تنظیمات</span>
              </button>
            </div>
          </motion.div>

          {/* Performance Insights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="panel insights-panel"
          >
            <div className="panel-header">
              <Award size={20} />
              <h3>بینش‌های عملکرد</h3>
            </div>

            <div className="insights-list">
              <div className="insight-item success">
                <div className="insight-icon">
                  <TrendingUp size={16} />
                </div>
                <div className="insight-content">
                  <p>سرعت آموزش 25% افزایش یافت</p>
                  <span>نسبت به هفته قبل</span>
                </div>
              </div>

              <div className="insight-item info">
                <div className="insight-icon">
                  <Target size={16} />
                </div>
                <div className="insight-content">
                  <p>دقت مدل‌ها به 94.5% رسید</p>
                  <span>بهبود 2.3% در این ماه</span>
                </div>
              </div>

              <div className="insight-item warning">
                <div className="insight-icon">
                  <Shield size={16} />
                </div>
                <div className="insight-content">
                  <p>استفاده از GPU به 85% رسیده</p>
                  <span>توصیه: افزایش منابع</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .dashboard-container {
          padding: 24px;
          background: linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
          min-height: 100vh;
        }

        .dashboard-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
        }

        .loading-content {
          text-align: center;
          color: #6b7280;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e5e7eb;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Header */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 20px 24px;
          border-radius: 16px;
          margin-bottom: 24px;
          box-shadow: 0 2px 12px rgba(139, 92, 246, 0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .header-text h1 {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .header-text p {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .refresh-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        /* Quick Stats - Compact */
        .quick-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          opacity: 0.1;
          filter: blur(20px);
        }

        .stat-card.purple::before { background: #8b5cf6; }
        .stat-card.blue::before { background: #3b82f6; }
        .stat-card.green::before { background: #10b981; }
        .stat-card.orange::before { background: #f59e0b; }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.15);
        }

        .stat-card .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .stat-card.purple .stat-icon { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); }
        .stat-card.blue .stat-icon { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
        .stat-card.green .stat-icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .stat-card.orange .stat-icon { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }

        .stat-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
        }

        .stat-value-row {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
        }

        .stat-total {
          font-size: 14px;
          color: #9ca3af;
        }

        .stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
        }

        .stat-change.positive {
          color: #10b981;
        }

        .stat-change.negative {
          color: #ef4444;
        }

        /* Main Grid */
        .main-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
        }

        .left-column,
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Panel Styles */
        .panel {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid #f3f4f6;
        }

        .panel-header svg {
          color: #8b5cf6;
        }

        .panel-header h3 {
          flex: 1;
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .status-badge {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-badge.online {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }

        .count-badge {
          padding: 4px 10px;
          background: linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%);
          color: #8b5cf6;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
        }

        .view-all {
          padding: 4px 12px;
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 12px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-all:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
          background: #f5f3ff;
        }

        /* Resources */
        .resources-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 16px;
        }

        .resource-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .resource-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .resource-header svg {
          color: #8b5cf6;
        }

        .resource-percentage {
          margin-left: auto;
          color: #6b7280;
          font-size: 12px;
        }

        .resource-bar {
          height: 8px;
          background: #f3f4f6;
          border-radius: 999px;
          overflow: hidden;
        }

        .resource-fill {
          height: 100%;
          border-radius: 999px;
        }

        .resource-fill.purple { background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%); }
        .resource-fill.blue { background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%); }
        .resource-fill.green { background: linear-gradient(90deg, #10b981 0%, #059669 100%); }

        .resource-chart {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 2px solid #f3f4f6;
        }

        /* Jobs */
        .jobs-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .job-item {
          padding: 14px;
          background: #f9fafb;
          border-radius: 10px;
          border-left: 3px solid #8b5cf6;
          transition: all 0.2s;
        }

        .job-item:hover {
          background: #f3f4f6;
          transform: translateX(-4px);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .job-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .job-status {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1e40af;
          text-transform: capitalize;
        }

        .job-progress {
          margin-bottom: 8px;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 6px;
          font-weight: 600;
        }

        .progress-bar {
          height: 6px;
          background: #e5e7eb;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
          border-radius: 999px;
        }

        .job-metrics {
          display: flex;
          gap: 12px;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #6b7280;
        }

        .metric svg {
          color: #8b5cf6;
        }

        /* Chart Panel */
        .pie-chart-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .chart-legend {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #374151;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .legend-value {
          margin-left: auto;
          font-weight: 600;
          color: #6b7280;
        }

        /* Activities */
        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 400px;
          overflow-y: auto;
        }

        .activity-item {
          display: flex;
          gap: 10px;
          padding: 10px;
          background: #f9fafb;
          border-radius: 8px;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .activity-item:hover {
          background: #f3f4f6;
          transform: translateX(-4px);
        }

        .activity-item.training { border-left-color: #8b5cf6; }
        .activity-item.complete { border-left-color: #10b981; }
        .activity-item.error { border-left-color: #ef4444; }
        .activity-item.download { border-left-color: #3b82f6; }

        .activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-message {
          font-size: 13px;
          color: #374151;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .activity-time {
          font-size: 11px;
          color: #9ca3af;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #9ca3af;
        }

        .empty-state svg {
          margin-bottom: 12px;
          opacity: 0.5;
        }

        /* Actions Panel */
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 12px;
          font-weight: 600;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .action-btn.purple:hover { border-color: #8b5cf6; color: #8b5cf6; background: #f5f3ff; }
        .action-btn.blue:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
        .action-btn.green:hover { border-color: #10b981; color: #10b981; background: #ecfdf5; }
        .action-btn.orange:hover { border-color: #f59e0b; color: #f59e0b; background: #fffbeb; }

        /* Insights */
        .insights-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .insight-item {
          display: flex;
          gap: 10px;
          padding: 12px;
          border-radius: 8px;
        }

        .insight-item.success { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); }
        .insight-item.info { background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); }
        .insight-item.warning { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); }

        .insight-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          flex-shrink: 0;
        }

        .insight-item.success .insight-icon { color: #10b981; }
        .insight-item.info .insight-icon { color: #3b82f6; }
        .insight-item.warning .insight-icon { color: #f59e0b; }

        .insight-content p {
          font-size: 13px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .insight-item.success .insight-content p { color: #065f46; }
        .insight-item.info .insight-content p { color: #1e40af; }
        .insight-item.warning .insight-content p { color: #92400e; }

        .insight-content span {
          font-size: 11px;
          opacity: 0.8;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .main-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 16px;
          }

          .quick-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .quick-stats {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .refresh-button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
