// Enhanced Dashboard - با داده‌های واقعی از بک‌اند
import React, { useState, useEffect } from 'react';
import {
  Brain, Database, ChartLine, Clock, CheckCircle,
  Activity, TrendingUp, AlertCircle,
  Download, RefreshCw,
  Users, Calendar, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns-jalali';
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

      // همه داده‌ها را همزمان بارگذاری کن
      const [
        statsRes,
        activitiesRes,
        statusRes,
        modelsRes,
        metricsRes
      ] = await Promise.all([
        apiClient.getDashboardStats(),
        apiClient.getRecentActivities(15),
        apiClient.getSystemStatus(),
        apiClient.getModels(),
        apiClient.getSystemMetrics().catch(() => null)
      ]);

      setStats(statsRes);
      setActivities(activitiesRes);
      setSystemStatus(statusRes);
      setModels(modelsRes);
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

  // Format file size
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

  // Calculate percentages
  const getPercentage = (used, total) => {
    if (!used || !total) return 0;
    const usedNum = parseFloat(used);
    const totalNum = parseFloat(total);
    return Math.round((usedNum / totalNum) * 100);
  };



  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="loading-spinner"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری داشبورد...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-12">
      {/* Header */}
      <div className="dashboard-header mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Activity className="text-blue-600" size={32} />
              داشبورد مدیریت
            </h1>
            <p className="text-gray-500 mt-2">
              نمای کلی سیستم آموزش مدل‌های هوش مصنوعی
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="modern-refresh-btn"
            disabled={refreshing}
            title="به‌روزرسانی داشبورد"
          >
            <div className="refresh-btn-content">
              <RefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
              <span className="refresh-text">
                {refreshing ? 'در حال به‌روزرسانی...' : 'بروزرسانی'}
              </span>
            </div>
            {refreshing && (
              <div className="refresh-progress">
                <div className="progress-bar"></div>
              </div>
            )}
          </motion.button>
        </div>
      </div>

      {/* Stats Cards Section (real data) */}
      <div className="stats-section mb-16">
        <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(() => {
            const activeRuns = stats?.runs?.active ?? 0;
            const totalRuns = stats?.runs?.total ?? 0;
            const assetsReady = stats?.assets?.ready ?? 0;
            const assetsTotal = stats?.assets?.total ?? 0;
            const avgLatency = typeof systemStatus?.latency === "number"
              ? `${systemStatus.latency}ms`
              : "—";
            const cards = [
              { title: "Active Models", value: activeRuns, suffix: `of ${totalRuns}`, icon: Brain, color: "blue" },
              { title: "Training Assets", value: assetsReady, suffix: `of ${assetsTotal}`, icon: Database, color: "green" },
              { title: "System Status", value: "Online", suffix: "", icon: Activity, color: "purple" },
              { title: "Avg Latency", value: avgLatency, suffix: "", icon: Clock, color: "orange" }
            ];
            return cards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`stat-card stat-${stat.color}`}
              >
                <div className="stat-header">
                  <div className="stat-icon">
                    <stat.icon size={24} />
                  </div>
                  <div className="stat-trend">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <div className="stat-content">
                  <h3 className="stat-title">{stat.title}</h3>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-suffix">{stat.suffix}</p>
                </div>
              </motion.div>
            ));
          })()}
        </div>
      </div>

      {/* Recent Activities Section */}
      <div className="activities-container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="activities-section glassmorphism-section"
        >
          <div className="section-header mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock size={24} />
              فعالیت‌های اخیر
            </h3>
            <button className="text-blue-600 text-sm hover:underline">
              مشاهده همه
            </button>
          </div>

          <div className="activities-list space-y-3">
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
                      <Clock size={12} className="inline ml-1" />
                      {activity.timestamp}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {activities.length === 0 && (
              <div className="no-activities">
                <Activity size={48} className="text-gray-300" />
                <p className="text-gray-500 mt-2">هیچ فعالیتی یافت نشد</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default Dashboard;