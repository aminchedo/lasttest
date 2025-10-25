// Enhanced Dashboard - با رنگ‌بندی بنفش-آبی و قابلیت‌های پیشرفته
import React, { useState, useEffect } from 'react';
import {
  Brain, Database, ChartLine, Clock, CheckCircle,
  Activity, TrendingUp, AlertCircle, Zap, Server,
  Download, RefreshCw, Users, Calendar, Settings,
  Cpu, HardDrive, Wifi, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns-jalali';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
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
        apiClient.getRecentActivities(15),
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
        ...prev.slice(-59), // Keep last 60 points
        {
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
          cpu: metricsRes.cpu || 0,
          memory: metricsRes.memory || 0,
          gpu: metricsRes.gpu || 0
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
          <div className="unified-loading-spinner"></div>
          <p>در حال بارگذاری داشبورد...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title-section">
            <div className="title-icon">
              <Activity size={32} />
            </div>
            <div>
              <h1>داشبورد مدیریت</h1>
              <p>نمای کلی سیستم آموزش مدل‌های هوش مصنوعی</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="refresh-btn"
            disabled={refreshing}
          >
            <RefreshCw className={refreshing ? 'spinning' : ''} size={18} />
            <span>{refreshing ? 'در حال به‌روزرسانی...' : 'بروزرسانی'}</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {[
          {
            title: 'مدل‌های فعال',
            value: stats?.runs?.active ?? 0,
            total: stats?.runs?.total ?? 0,
            icon: Brain,
            gradient: 'purple',
            change: '+12%'
          },
          {
            title: 'دیتاست‌های آماده',
            value: stats?.assets?.ready ?? 0,
            total: stats?.assets?.total ?? 0,
            icon: Database,
            gradient: 'blue',
            change: '+5%'
          },
          {
            title: 'آموزش‌های امروز',
            value: stats?.todayTrainings ?? 0,
            total: '',
            icon: Zap,
            gradient: 'green',
            change: '+8%'
          },
          {
            title: 'متوسط زمان',
            value: systemStatus?.latency ? `${systemStatus.latency}ms` : '—',
            total: '',
            icon: Clock,
            gradient: 'orange',
            change: '-3%'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`stat-card gradient-${stat.gradient}`}
          >
            <div className="stat-icon">
              <stat.icon size={28} />
            </div>
            <div className="stat-content">
              <p className="stat-title">{stat.title}</p>
              <div className="stat-value-row">
                <h3 className="stat-value">{stat.value}</h3>
                {stat.total && <span className="stat-total">از {stat.total}</span>}
              </div>
              {stat.change && (
                <div className="stat-change positive">
                  <TrendingUp size={14} />
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* System Resources */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="panel-card"
        >
          <div className="panel-header">
            <Server size={24} />
            <h3>منابع سیستم</h3>
          </div>
          
          <div className="resources-grid">
            <div className="resource-item">
              <div className="resource-header">
                <Cpu size={20} />
                <span>CPU</span>
              </div>
              <div className="resource-bar">
                <div 
                  className="resource-fill purple"
                  style={{ width: `${metrics?.cpu || 0}%` }}
                />
              </div>
              <span className="resource-value">{metrics?.cpu || 0}%</span>
            </div>
            
            <div className="resource-item">
              <div className="resource-header">
                <HardDrive size={20} />
                <span>Memory</span>
              </div>
              <div className="resource-bar">
                <div 
                  className="resource-fill blue"
                  style={{ width: `${metrics?.memory || 0}%` }}
                />
              </div>
              <span className="resource-value">{metrics?.memory || 0}%</span>
            </div>
            
            <div className="resource-item">
              <div className="resource-header">
                <Zap size={20} />
                <span>GPU</span>
              </div>
              <div className="resource-bar">
                <div 
                  className="resource-fill green"
                  style={{ width: `${metrics?.gpu || 0}%` }}
                />
              </div>
              <span className="resource-value">{metrics?.gpu || 0}%</span>
            </div>
          </div>
          
          {resourceHistory.length > 0 && (
            <div className="resource-chart">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={resourceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: 'white',
                      border: '2px solid #8b5cf6',
                      borderRadius: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cpu" 
                    stackId="1"
                    stroke="#8b5cf6" 
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="memory" 
                    stackId="2"
                    stroke="#3b82f6" 
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gpu" 
                    stackId="3"
                    stroke="#10b981" 
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="panel-card"
        >
          <div className="panel-header">
            <Clock size={24} />
            <h3>فعالیت‌های اخیر</h3>
          </div>

          <div className="activities-list">
            <AnimatePresence>
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`activity-item activity-${activity.type}`}
                >
                  <div className="activity-icon">
                    {activity.type === 'training' && <Brain size={18} />}
                    {activity.type === 'download' && <Download size={18} />}
                    {activity.type === 'complete' && <CheckCircle size={18} />}
                    {activity.type === 'error' && <AlertCircle size={18} />}
                  </div>
                  <div className="activity-content">
                    <p className="activity-message">{activity.message}</p>
                    <p className="activity-time">
                      <Clock size={12} />
                      {activity.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {activities.length === 0 && (
              <div className="no-activities">
                <Activity size={48} />
                <p>هیچ فعالیتی یافت نشد</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Training Jobs */}
        {trainingJobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="panel-card full-width"
          >
            <div className="panel-header">
              <Zap size={24} />
              <h3>آموزش‌های در حال اجرا</h3>
            </div>

            <div className="jobs-grid">
              {trainingJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="job-card"
                >
                  <div className="job-header">
                    <h4>{job.name}</h4>
                    <span className={`job-status status-${job.status}`}>
                      {job.status}
                    </span>
                  </div>
                  
                  <div className="job-progress">
                    <div className="progress-info">
                      <span>Progress</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="job-meta">
                    <div className="meta-item">
                      <Clock size={14} />
                      <span>{job.elapsed}</span>
                    </div>
                    <div className="meta-item">
                      <TrendingUp size={14} />
                      <span>Loss: {job.loss?.toFixed(4)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
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
        
        .header-title-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .title-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
        }
        
        .header-title-section h1 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        
        .header-title-section p {
          font-size: 14px;
          color: #6b7280;
          margin-top: 4px;
        }
        
        .refresh-btn {
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
        
        .refresh-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
        }
        
        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spinning {
          animation: spin 1s linear infinite;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .stat-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          display: flex;
          gap: 20px;
          align-items: flex-start;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid transparent;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
        }
        
        .stat-card::before {
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
        
        .stat-card.gradient-purple::before {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        }
        
        .stat-card.gradient-blue::before {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }
        
        .stat-card.gradient-green::before {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .stat-card.gradient-orange::before {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(139, 92, 246, 0.2);
        }
        
        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
          position: relative;
          z-index: 1;
        }
        
        .gradient-purple .stat-icon {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
        }
        
        .gradient-blue .stat-icon {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }
        
        .gradient-green .stat-icon {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .gradient-orange .stat-icon {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        
        .stat-content {
          flex: 1;
          position: relative;
          z-index: 1;
        }
        
        .stat-title {
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .stat-value-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
          margin: 0;
        }
        
        .stat-total {
          font-size: 14px;
          color: #9ca3af;
        }
        
        .stat-change {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .stat-change.positive {
          color: #10b981;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 20px;
        }
        
        .panel-card {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .panel-card.full-width {
          grid-column: 1 / -1;
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
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        
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
        
        .resource-fill.purple {
          background: linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%);
        }
        
        .resource-fill.blue {
          background: linear-gradient(90deg, #3b82f6 0%, #2563eb 100%);
        }
        
        .resource-fill.green {
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
        }
        
        .resource-value {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
        }
        
        .resource-chart {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid #f3f4f6;
        }
        
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
          border-left: 4px solid transparent;
          transition: all 0.2s;
        }
        
        .activity-item:hover {
          transform: translateX(-4px);
          background: #f3f4f6;
        }
        
        .activity-item.activity-training {
          border-left-color: #8b5cf6;
        }
        
        .activity-item.activity-complete {
          border-left-color: #10b981;
        }
        
        .activity-item.activity-error {
          border-left-color: #ef4444;
        }
        
        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
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
          font-size: 14px;
          color: #374151;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .activity-time {
          font-size: 12px;
          color: #9ca3af;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .no-activities {
          text-align: center;
          padding: 40px;
          color: #9ca3af;
        }
        
        .no-activities svg {
          margin-bottom: 12px;
        }
        
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        
        .job-card {
          background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s;
        }
        
        .job-card:hover {
          border-color: #8b5cf6;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.2);
        }
        
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .job-header h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }
        
        .job-status {
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }
        
        .job-status.status-training {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1e40af;
        }
        
        .job-status.status-completed {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
        }
        
        .job-progress {
          margin-bottom: 12px;
        }
        
        .progress-info {
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
          transition: width 0.5s ease;
        }
        
        .job-meta {
          display: flex;
          gap: 12px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
        }
        
        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .jobs-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
