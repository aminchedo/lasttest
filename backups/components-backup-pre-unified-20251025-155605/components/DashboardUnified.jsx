// Unified Modern Dashboard - داشبورد مدرن و کامل
import React, { useState, useEffect, useCallback } from 'react';
import {
  Brain, Database, ChartLine, Clock, CheckCircle,
  Activity, TrendingUp, AlertCircle, Zap, Server,
  Download, RefreshCw, Cpu, HardDrive, Wifi,
  PlayCircle, PauseCircle, Target, Rocket, Award,
  Users, Calendar, Settings, BarChart3, PieChart,
  Shield, Globe, Eye, FileText, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import apiClient from '../api/endpoints';
import { toast } from 'react-hot-toast';

const DashboardUnified = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);
  const [systemMetrics, setSystemMetrics] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [models, setModels] = useState([]);
  const [trainingJobs, setTrainingJobs] = useState([]);
  const [resourceHistory, setResourceHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Load all dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        statsResult,
        metricsResult,
        modelsResult,
        trainingJobsResult
      ] = await Promise.all([
        apiClient.checkHealth().catch(() => ({ ok: false })),
        apiClient.getAnalysisMetrics('accuracy', '7d').catch(() => ({ ok: false })),
        apiClient.getModels().catch(() => ({ ok: false })),
        apiClient.getTrainingJobs().catch(() => ({ ok: false }))
      ]);

      // Mock dashboard stats from API responses
      const stats = {
        activeModels: modelsResult.ok ? (modelsResult.data?.length || 0) : 0,
        totalModels: modelsResult.ok ? (modelsResult.data?.length || 0) : 0,
        datasetCount: 5,
        completedTrainings: 12,
        failedTrainings: 1
      };

      setDashboardStats(stats);
      setSystemStatus(statsResult.ok ? statsResult.data : null);
      setModels(modelsResult.ok ? (modelsResult.data || []) : []);
      setTrainingJobs(trainingJobsResult.ok ? (trainingJobsResult.data || []) : []);
      setRecentActivities([
        { id: 1, type: 'training', message: 'شروع آموزش مدل جدید', timestamp: new Date() },
        { id: 2, type: 'complete', message: 'آموزش مدل با موفقیت تکمیل شد', timestamp: new Date(Date.now() - 300000) },
        { id: 3, type: 'download', message: 'دانلود مدل از Hugging Face', timestamp: new Date(Date.now() - 600000) }
      ]);
      setLastUpdate(new Date());

    } catch (error) {
      console.error('خطا در بارگذاری داشبورد:', error);
      toast.error('خطا در بارگذاری اطلاعات داشبورد');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load metrics and update resource history
  const loadMetrics = useCallback(async () => {
    try {
      // Generate mock metrics for now
      const metrics = {
        cpu: Math.random() * 70 + 20,
        memory: Math.random() * 60 + 30,
        gpu: Math.random() * 80 + 10
      };

      setSystemMetrics(metrics);

      // Update resource history
      setResourceHistory(prev => [
        ...prev.slice(-29), // Keep last 30 points
        {
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          cpu: metrics.cpu,
          memory: metrics.memory,
          gpu: metrics.gpu,
          disk: Math.random() * 50 + 20
        }
      ]);
    } catch (error) {
      console.error('خطا در بارگذاری معیارها:', error);
    }
  }, []);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    await loadMetrics();
    setRefreshing(false);
    toast.success('داشبورد به‌روزرسانی شد');
  };

  // Initial load and periodic updates
  useEffect(() => {
    loadDashboardData();

    // Set up intervals for real-time updates
    const metricsInterval = setInterval(loadMetrics, 5000);
    const dashboardInterval = setInterval(loadDashboardData, 30000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(dashboardInterval);
    };
  }, [loadDashboardData, loadMetrics]);

  // Format helper functions
  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'نامشخص';
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'اکنون';
    if (diffMins < 60) return `${diffMins} دقیقه پیش`;
    if (diffHours < 24) return `${diffHours} ساعت پیش`;
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

  // Calculate KPIs
  const activeModels = dashboardStats?.activeModels || 0;
  const totalModels = dashboardStats?.totalModels || 0;
  const datasetCount = dashboardStats?.datasetCount || 0;
  const completedTrainings = dashboardStats?.completedTrainings || 0;
  const failedTrainings = dashboardStats?.failedTrainings || 0;
  const trainingSuccessRate = totalModels > 0 ? ((completedTrainings / (completedTrainings + failedTrainings)) * 100).toFixed(1) : 0;

  return (
    <div className="unified-dashboard">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-header"
      >
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <Activity size={32} />
            </div>
            <div className="header-text">
              <h1>داشبورد مدیریت</h1>
              <p>سیستم آموزش مدل‌های هوش مصنوعی فارسی</p>
              <small>آخرین بروزرسانی: {lastUpdate.toLocaleTimeString('fa-IR')}</small>
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
            <span>{refreshing ? 'بروزرسانی...' : 'بروزرسانی'}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {[
          {
            title: 'مدل‌های فعال',
            value: activeModels,
            total: totalModels,
            icon: Brain,
            color: 'purple',
            trend: '+12%',
            trendUp: true,
            description: 'مدل‌های در حال استفاده'
          },
          {
            title: 'دیتاست‌ها',
            value: datasetCount,
            total: '',
            icon: Database,
            color: 'blue',
            trend: '+5%',
            trendUp: true,
            description: 'مجموعه داده‌های آماده'
          },
          {
            title: 'آموزش‌های موفق',
            value: completedTrainings,
            total: `${trainingSuccessRate}%`,
            icon: CheckCircle,
            color: 'green',
            trend: '+8%',
            trendUp: true,
            description: 'نرخ موفقیت آموزش'
          },
          {
            title: 'آموزش‌های جاری',
            value: trainingJobs.length,
            total: 'فعال',
            icon: Zap,
            color: 'orange',
            trend: '0%',
            trendUp: false,
            description: 'آموزش‌های در حال اجرا'
          }
        ].map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`kpi-card kpi-${kpi.color}`}
          >
            <div className="kpi-header">
              <div className="kpi-icon">
                <kpi.icon size={20} />
              </div>
              <div className={`kpi-trend ${kpi.trendUp ? 'up' : 'neutral'}`}>
                <TrendingUp size={12} style={!kpi.trendUp ? { transform: 'rotate(90deg)' } : {}} />
                <span>{kpi.trend}</span>
              </div>
            </div>
            <div className="kpi-content">
              <div className="kpi-value-row">
                <h3 className="kpi-value">{kpi.value}</h3>
                {kpi.total && <span className="kpi-total">{kpi.total}</span>}
              </div>
              <p className="kpi-title">{kpi.title}</p>
              <small className="kpi-description">{kpi.description}</small>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="main-content">
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
              <div className="status-indicator online">آنلاین</div>
            </div>

            <div className="resources-grid">
              {[
                { name: 'CPU', icon: Cpu, value: systemMetrics?.cpu || 0, color: '#8b5cf6' },
                { name: 'Memory', icon: HardDrive, value: systemMetrics?.memory || 0, color: '#3b82f6' },
                { name: 'GPU', icon: Zap, value: systemMetrics?.gpu || 0, color: '#10b981' },
                { name: 'Disk', icon: HardDrive, value: resourceHistory[resourceHistory.length - 1]?.disk || 0, color: '#f59e0b' }
              ].map((resource, index) => (
                <div key={resource.name} className="resource-item">
                  <div className="resource-header">
                    <resource.icon size={18} />
                    <span>{resource.name}</span>
                    <span className="resource-value">{resource.value.toFixed(1)}%</span>
                  </div>
                  <div className="resource-bar">
                    <motion.div
                      className="resource-fill"
                      style={{ backgroundColor: resource.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${resource.value}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Resource Chart */}
            {resourceHistory.length > 0 && (
              <div className="resource-chart">
                <h4>تاریخچه منابع</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={resourceHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="time" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        background: 'white',
                        border: '2px solid #8b5cf6',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area type="monotone" dataKey="cpu" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="memory" stackId="2" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="gpu" stackId="3" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>

          {/* Training Jobs */}
          {trainingJobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="panel training-panel"
            >
              <div className="panel-header">
                <Rocket size={20} />
                <h3>آموزش‌های در حال اجرا</h3>
                <div className="count-badge">{trainingJobs.length}</div>
              </div>

              <div className="training-jobs">
                {trainingJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="job-card"
                  >
                    <div className="job-header">
                      <div className="job-title">
                        <Brain size={16} />
                        <span>{job.name}</span>
                      </div>
                      <div className="job-status active">
                        <PlayCircle size={12} />
                        <span>{job.status === 'training' ? 'در حال آموزش' : job.status}</span>
                      </div>
                    </div>

                    <div className="job-progress">
                      <div className="progress-header">
                        <span>پیشرفت: {job.progress}%</span>
                        <span>باقی‌مانده: {job.eta}</span>
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
                        <span>Loss: {job.loss}</span>
                      </div>
                      <div className="metric">
                        <Target size={12} />
                        <span>Acc: {job.accuracy}%</span>
                      </div>
                      <div className="metric">
                        <Clock size={12} />
                        <span>{job.elapsed}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
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
            transition={{ delay: 0.6 }}
            className="panel activities-panel"
          >
            <div className="panel-header">
              <Clock size={20} />
              <h3>فعالیت‌های اخیر</h3>
              <button className="view-all-btn">مشاهده همه</button>
            </div>

            <div className="activities-list">
              <AnimatePresence>
                {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`activity-item activity-${activity.type}`}
                  >
                    <div className="activity-icon">
                      {activity.type === 'training' && <Brain size={16} />}
                      {activity.type === 'download' && <Download size={16} />}
                      {activity.type === 'complete' && <CheckCircle size={16} />}
                      {activity.type === 'error' && <AlertCircle size={16} />}
                      {!['training', 'download', 'complete', 'error'].includes(activity.type) && <Activity size={16} />}
                    </div>
                    <div className="activity-content">
                      <p className="activity-message">{activity.message}</p>
                      <p className="activity-time">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </motion.div>
                )) : (
                  <div className="empty-state">
                    <Activity size={40} />
                    <p>هیچ فعالیتی یافت نشد</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
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
                <span>تنظیمات سیستم</span>
              </button>
            </div>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="panel health-panel"
          >
            <div className="panel-header">
              <Shield size={20} />
              <h3>سلامت سیستم</h3>
            </div>

            <div className="health-items">
              <div className="health-item healthy">
                <div className="health-icon">
                  <CheckCircle size={16} />
                </div>
                <div className="health-content">
                  <p>API سرویس</p>
                  <span>عملکرد عالی</span>
                </div>
                <div className="health-status">100%</div>
              </div>

              <div className="health-item healthy">
                <div className="health-icon">
                  <CheckCircle size={16} />
                </div>
                <div className="health-content">
                  <p>دیتابیس</p>
                  <span>متصل و آماده</span>
                </div>
                <div className="health-status">100%</div>
              </div>

              <div className="health-item warning">
                <div className="health-icon">
                  <AlertCircle size={16} />
                </div>
                <div className="health-content">
                  <p>فضای ذخیره‌سازی</p>
                  <span>85% استفاده شده</span>
                </div>
                <div className="health-status">85%</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .unified-dashboard {
          padding: 24px;
          background: linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
          min-height: 100vh;
          font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          direction: rtl;
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

        .spinning {
          animation: spin 1s linear infinite;
        }

        /* Header */
        .dashboard-header {
          background: white;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
          border: 2px solid transparent;
          background-image: linear-gradient(white, white), 
                           linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }

        .header-text h1 {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .header-text p {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .header-text small {
          font-size: 12px;
          color: #9ca3af;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }

        .refresh-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* KPI Cards */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 20px;
        }

        .kpi-card {
          background: white;
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid transparent;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          opacity: 0.1;
          filter: blur(40px);
        }

        .kpi-card.kpi-purple::before { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); }
        .kpi-card.kpi-blue::before { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
        .kpi-card.kpi-green::before { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .kpi-card.kpi-orange::before { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }

        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(139, 92, 246, 0.2);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .kpi-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          position: relative;
          z-index: 1;
        }

        .kpi-purple .kpi-icon { background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); }
        .kpi-blue .kpi-icon { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
        .kpi-green .kpi-icon { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .kpi-orange .kpi-icon { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }

        .kpi-trend {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 6px;
          border-radius: 6px;
        }

        .kpi-trend.up {
          color: #10b981;
          background: #d1fae5;
        }

        .kpi-trend.neutral {
          color: #6b7280;
          background: #f3f4f6;
        }

        .kpi-content {
          position: relative;
          z-index: 1;
        }

        .kpi-value-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 6px;
        }

        .kpi-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
          margin: 0;
        }

        .kpi-total {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .kpi-title {
          font-size: 14px;
          color: #374151;
          font-weight: 600;
          margin: 0 0 2px 0;
        }

        .kpi-description {
          font-size: 11px;
          color: #9ca3af;
        }

        /* Main Content */
        .main-content {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
        }

        .left-column,
        .right-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Panel */
        .panel {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f3f4f6;
        }

        .panel-header svg {
          color: #8b5cf6;
        }

        .panel-header h3 {
          flex: 1;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .status-indicator {
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-indicator.online {
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

        .view-all-btn {
          padding: 4px 12px;
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 12px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-all-btn:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
          background: #f5f3ff;
        }

        /* Resources */
        .resources-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .resource-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .resource-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .resource-value {
          margin-right: auto;
          color: #6b7280;
          font-size: 12px;
        }

        .resource-bar {
          height: 12px;
          background: #f3f4f6;
          border-radius: 999px;
          overflow: hidden;
        }

        .resource-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.5s ease;
        }

        .resource-chart {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid #f3f4f6;
        }

        .resource-chart h4 {
          font-size: 14px;
          color: #374151;
          margin: 0 0 16px 0;
        }

        /* Training Jobs */
        .training-jobs {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .job-card {
          padding: 16px;
          background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          transition: all 0.3s;
        }

        .job-card:hover {
          border-color: #8b5cf6;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.2);
        }

        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
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
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .job-status.active {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1e40af;
        }

        .job-progress {
          margin-bottom: 12px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 6px;
        }

        .progress-bar {
          height: 8px;
          background: #f3f4f6;
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

        /* Activities */
        .activities-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 12px;
          border-right: 4px solid transparent;
          transition: all 0.2s;
        }

        .activity-item:hover {
          transform: translateX(-4px);
          background: #f3f4f6;
        }

        .activity-item.activity-training { border-right-color: #8b5cf6; }
        .activity-item.activity-complete { border-right-color: #10b981; }
        .activity-item.activity-error { border-right-color: #ef4444; }
        .activity-item.activity-download { border-right-color: #3b82f6; }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .activity-content {
          flex: 1;
        }

        .activity-message {
          font-size: 14px;
          color: #374151;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .activity-time {
          font-size: 12px;
          color: #9ca3af;
          margin: 0;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
        }

        .empty-state svg {
          margin-bottom: 12px;
          opacity: 0.5;
        }

        /* Actions */
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 12px;
          font-weight: 600;
          color: #374151;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .action-btn.purple:hover { border-color: #8b5cf6; color: #8b5cf6; background: #f5f3ff; }
        .action-btn.blue:hover { border-color: #3b82f6; color: #3b82f6; background: #eff6ff; }
        .action-btn.green:hover { border-color: #10b981; color: #10b981; background: #ecfdf5; }
        .action-btn.orange:hover { border-color: #f59e0b; color: #f59e0b; background: #fffbeb; }

        /* Health */
        .health-items {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .health-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          align-items: center;
        }

        .health-item.healthy { background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); }
        .health-item.warning { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); }

        .health-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          flex-shrink: 0;
        }

        .health-item.healthy .health-icon { color: #10b981; }
        .health-item.warning .health-icon { color: #f59e0b; }

        .health-content {
          flex: 1;
        }

        .health-content p {
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 2px 0;
        }

        .health-item.healthy .health-content p { color: #065f46; }
        .health-item.warning .health-content p { color: #92400e; }

        .health-content span {
          font-size: 12px;
          opacity: 0.8;
        }

        .health-status {
          font-size: 12px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 6px;
          background: white;
        }

        .health-item.healthy .health-status { color: #10b981; }
        .health-item.warning .health-status { color: #f59e0b; }

        /* Responsive */
        @media (max-width: 1200px) {
          .main-content {
            grid-template-columns: 1fr;
          }
          
          .kpi-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }
        }

        @media (max-width: 992px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
        }

        @media (max-width: 768px) {
          .unified-dashboard {
            padding: 16px;
          }

          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .header-content {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .refresh-button {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .kpi-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .header-text h1 {
            font-size: 24px;
          }

          .header-icon {
            width: 48px;
            height: 48px;
          }
          
          .kpi-card {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardUnified;
