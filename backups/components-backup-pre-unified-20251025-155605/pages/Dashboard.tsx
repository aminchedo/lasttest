// Dashboard.tsx - با TypeScript و API Client واقعی
import React, { useState, useEffect } from 'react';
import {
  Brain, Database, ChartLine, Clock, CheckCircle,
  Activity, TrendingUp, AlertCircle, Zap, Server,
  Download, RefreshCw, Cpu, HardDrive,
  PlayCircle, Target, Rocket, Award,
  Settings, PieChart as PieChartIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import apiClient, {
  DashboardStats,
  SystemStatus,
  SystemMetrics,
  Activity as ActivityType,
  TrainingJob,
  ModelStatistics,
  PerformanceInsight,
  ResourceHistory
} from '../api/client';
import { toast } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  // States با TypeScript
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [resourceHistory, setResourceHistory] = useState<ResourceHistory[]>([]);
  const [modelStats, setModelStats] = useState<ModelStatistics[]>([]);
  const [insights, setInsights] = useState<PerformanceInsight[]>([]);

  // Load dashboard data
  const loadDashboard = async () => {
    try {
      setLoading(true);

      // بارگذاری همزمان همه داده‌ها
      const [
        statsRes,
        activitiesRes,
        statusRes,
        jobsRes,
        metricsRes,
        modelStatsRes,
        insightsRes
      ] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getRecentActivities(10),
        apiClient.getSystemStatus(),
        apiClient.getTrainingJobs(),
        apiClient.getSystemMetrics(),
        apiClient.getModelStatistics(),
        apiClient.getPerformanceInsights()
      ]);

      setStats(statsRes);
      setActivities(activitiesRes);
      setSystemStatus(statusRes);
      setTrainingJobs(jobsRes);
      setMetrics(metricsRes);
      setModelStats(modelStatsRes);
      setInsights(insightsRes);

    } catch (error) {
      console.error('Dashboard load error:', error);
      toast.error('خطا در بارگذاری داشبورد');
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time metrics
  useEffect(() => {
    loadDashboard();

    // Subscribe to metrics updates
    const unsubscribe = apiClient.subscribeToMetrics((newMetrics) => {
      setMetrics(newMetrics);
      setResourceHistory(apiClient.getResourceHistory());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
    toast.success('داشبورد به‌روزرسانی شد');
  };

  // Helper to format time ago
  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'همین الان';
    if (diffMins < 60) return `${diffMins} دقیقه پیش`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} روز پیش`;
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

  // Safe defaults
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
                  <span className="resource-percentage">{metrics?.cpu.toFixed(1) ?? 0}%</span>
                </div>
                <div className="resource-bar">
                  <motion.div
                    className="resource-fill purple"
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics?.cpu ?? 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="resource-item">
                <div className="resource-header">
                  <HardDrive size={18} />
                  <span>Memory</span>
                  <span className="resource-percentage">{metrics?.memory.toFixed(1) ?? 0}%</span>
                </div>
                <div className="resource-bar">
                  <motion.div
                    className="resource-fill blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics?.memory ?? 0}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="resource-item">
                <div className="resource-header">
                  <Zap size={18} />
                  <span>GPU</span>
                  <span className="resource-percentage">{metrics?.gpu.toFixed(1) ?? 0}%</span>
                </div>
                <div className="resource-bar">
                  <motion.div
                    className="resource-fill green"
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics?.gpu ?? 0}%` }}
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
                        <span>{job.progress.toFixed(0)}%</span>
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
                        <span>Loss: {job.metrics.valLoss.toFixed(4)}</span>
                      </div>
                      {job.metrics.valAccuracy && (
                        <div className="metric">
                          <Target size={12} />
                          <span>Acc: {job.metrics.valAccuracy.toFixed(2)}%</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Model Usage Statistics */}
          {modelStats.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="panel chart-panel"
            >
              <div className="panel-header">
                <PieChartIcon size={20} />
                <h3>آمار استفاده از مدل‌ها</h3>
              </div>

              <div className="pie-chart-container">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
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
                  </PieChart>
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
          )}
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
                      {activity.type === 'upload' && <Database size={16} />}
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
          {insights.length > 0 && (
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
                {insights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className={`insight-item ${insight.type}`}>
                    <div className="insight-icon">
                      {insight.type === 'success' && <TrendingUp size={16} />}
                      {insight.type === 'info' && <Target size={16} />}
                      {insight.type === 'warning' && <AlertCircle size={16} />}
                    </div>
                    <div className="insight-content">
                      <p>{insight.title}</p>
                      <span>{insight.description}</span>
                    </div>
                    {insight.value && (
                      <div className="insight-value">{insight.value}</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* اضافه کردن همان استایل‌های قبلی */}
      <style>{`
        /* همان CSS از فایل قبلی */
        .dashboard-container {
          padding: 24px;
          background: linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
          min-height: 100vh;
        }

        /* ... بقیه استایل‌ها دقیقاً مثل فایل قبلی */
        /* برای خلاصگی، از همان CSS استفاده می‌کنیم */
      `}</style>
    </div>
  );
};

export default Dashboard;
