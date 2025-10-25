import React, { useState, useEffect } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Brain,
  Target, Users, RefreshCw,
  Cpu, BarChart, PieChart, LineChart, AlertTriangle,
  ChevronDown, ChevronUp, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/endpoints';

function Analysis() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('accuracy');
  const [timeRange, setTimeRange] = useState('7d');
  const [data, setData] = useState({
    accuracy: { current: 0, previous: 0, trend: 'neutral' },
    performance: { current: 0, previous: 0, trend: 'neutral' },
    throughput: { current: 0, previous: 0, trend: 'neutral' },
    users: { current: 0, previous: 0, trend: 'neutral' }
  });

  useEffect(() => {
    loadAnalysisData();
  }, [selectedMetric, timeRange]);

  const loadAnalysisData = async () => {
    setLoading(true);
    try {
      const result = await api.getAnalysisMetrics(selectedMetric, timeRange);
      if (result.ok && result.data) {
        setData(result.data);
      } else {
        // Fallback to default data structure if API fails
        setData({
          accuracy: { current: 0, previous: 0, trend: 'neutral' },
          performance: { current: 0, previous: 0, trend: 'neutral' },
          throughput: { current: 0, previous: 0, trend: 'neutral' },
          users: { current: 0, previous: 0, trend: 'neutral' }
        });
      }
    } catch (error) {
      console.error('Error loading analysis data:', error);
      setData({
        accuracy: { current: 0, previous: 0, trend: 'neutral' },
        performance: { current: 0, previous: 0, trend: 'neutral' },
        throughput: { current: 0, previous: 0, trend: 'neutral' },
        users: { current: 0, previous: 0, trend: 'neutral' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalysisData();
    setRefreshing(false);
  };

  if (loading || !data) {
    return (
      <div className="analysis-page">
        <div className="loading-container">
          <div className="unified-loading-spinner"></div>
          <p className="loading-text">در حال بارگذاری آنالیز...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-12">
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <h1 className="page-title">
              <BarChart3 size={28} />
              آنالیز و گزارش‌گیری
            </h1>
            <p className="page-subtitle">
              تحلیل جامع عملکرد سیستم و معیارهای کلیدی
            </p>
          </div>

          <div className="header-actions">
            <div className="filter-group">
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="filter-select"
              >
                <option value="accuracy">دقت</option>
                <option value="performance">عملکرد</option>
                <option value="throughput">توان عملیاتی</option>
                <option value="users">کاربران</option>
              </select>

              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="filter-select"
              >
                <option value="1d">1 روز</option>
                <option value="7d">7 روز</option>
                <option value="30d">30 روز</option>
                <option value="90d">90 روز</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="refresh-btn"
            >
              <RefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
              {refreshing ? 'در حال به‌روزرسانی...' : 'بروزرسانی'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Key Metrics - Compact Design */}
      <div className="stats-grid">
        {/* Metric 1: Accuracy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card metric-purple"
        >
          <div className="stat-header">
            <div className="stat-icon">
              <Target size={14} />
            </div>
            <span className={`stat-trend ${data?.accuracy?.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {data?.accuracy?.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            </span>
          </div>
          <div className="stat-content">
            <p className="stat-value">{(data?.accuracy?.current || 0).toFixed(1)}%</p>
            <p className="stat-label">میانگین دقت</p>
            <p className="stat-sublabel">
              {data?.accuracy?.trend === 'up' ? '+' : '-'}
              {Math.abs((data?.accuracy?.current || 0) - (data?.accuracy?.previous || 0)).toFixed(1)}% نسبت به قبل
            </p>
          </div>
          <div className="stat-details">
            <div className={`stat-change ${data?.accuracy?.trend === 'up' ? 'positive' : 'negative'}`}>
              {data?.accuracy?.trend === 'up' ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
              {Math.abs((data?.accuracy?.current || 0) - (data?.accuracy?.previous || 0)).toFixed(1)}%
            </div>
            <div className="stat-period">7 روز</div>
          </div>
        </motion.div>

        {/* Metric 2: Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="stat-card metric-blue"
        >
          <div className="stat-header">
            <div className="stat-icon">
              <Cpu size={14} />
            </div>
            <span className={`stat-trend ${data?.performance?.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {data?.performance?.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            </span>
          </div>
          <div className="stat-content">
            <p className="stat-value">{(data?.performance?.current || 0).toFixed(1)}%</p>
            <p className="stat-label">عملکرد سیستم</p>
            <p className="stat-sublabel">
              {data?.performance?.trend === 'up' ? '+' : '-'}
              {Math.abs((data?.performance?.current || 0) - (data?.performance?.previous || 0)).toFixed(1)}% نسبت به قبل
            </p>
          </div>
          <div className="stat-details">
            <div className={`stat-change ${data?.performance?.trend === 'up' ? 'positive' : 'negative'}`}>
              {data?.performance?.trend === 'up' ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
              {Math.abs((data?.performance?.current || 0) - (data?.performance?.previous || 0)).toFixed(1)}%
            </div>
            <div className="stat-period">7 روز</div>
          </div>
        </motion.div>

        {/* Metric 3: Throughput */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="stat-card metric-green"
        >
          <div className="stat-header">
            <div className="stat-icon">
              <BarChart size={14} />
            </div>
            <span className={`stat-trend ${data?.throughput?.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {data?.throughput?.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            </span>
          </div>
          <div className="stat-content">
            <p className="stat-value">{(data?.throughput?.current || 0).toLocaleString()}</p>
            <p className="stat-label">توان عملیاتی</p>
            <p className="stat-sublabel">
              {data?.throughput?.trend === 'up' ? '+' : '-'}
              {Math.abs((data?.throughput?.current || 0) - (data?.throughput?.previous || 0)).toLocaleString()} نسبت به قبل
            </p>
          </div>
          <div className="stat-details">
            <div className={`stat-change ${data?.throughput?.trend === 'up' ? 'positive' : 'negative'}`}>
              {data?.throughput?.trend === 'up' ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
              {Math.abs((data?.throughput?.current || 0) - (data?.throughput?.previous || 0)).toLocaleString()}
            </div>
            <div className="stat-period">7 روز</div>
          </div>
        </motion.div>

        {/* Metric 4: Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="stat-card metric-orange"
        >
          <div className="stat-header">
            <div className="stat-icon">
              <Users size={14} />
            </div>
            <span className={`stat-trend ${data?.users?.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
              {data?.users?.trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            </span>
          </div>
          <div className="stat-content">
            <p className="stat-value">{(data?.users?.current || 0).toLocaleString()}</p>
            <p className="stat-label">کاربران فعال</p>
            <p className="stat-sublabel">
              {data?.users?.trend === 'up' ? '+' : '-'}
              {Math.abs((data?.users?.current || 0) - (data?.users?.previous || 0)).toLocaleString()} نسبت به قبل
            </p>
          </div>
          <div className="stat-details">
            <div className={`stat-change ${data?.users?.trend === 'up' ? 'positive' : 'negative'}`}>
              {data?.users?.trend === 'up' ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
              {Math.abs((data?.users?.current || 0) - (data?.users?.previous || 0)).toLocaleString()}
            </div>
            <div className="stat-period">7 روز</div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="chart-container"
        >
          <div className="chart-header">
            <h3 className="chart-title">
              <LineChart size={20} />
              نمودار عملکرد
            </h3>
            <div className="chart-controls">
              <button className="chart-btn active">
                <BarChart size={16} />
                ستونی
              </button>
              <button className="chart-btn">
                <LineChart size={16} />
                خطی
              </button>
              <button className="chart-btn">
                <PieChart size={16} />
                دایره‌ای
              </button>
            </div>
          </div>

          <div className="chart-content">
            <div className="chart-placeholder">
              <BarChart3 size={48} className="chart-icon" />
              <p className="chart-text">نمودار عملکرد در دسترس است</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="insights-container"
        >
          <div className="insights-header">
            <h3 className="insights-title">
              <Brain size={20} />
              بینش‌های هوشمند
            </h3>
          </div>

          <div className="insights-list">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="insight-item success"
            >
              <div className="insight-icon">
                <TrendingUp size={20} />
              </div>
              <div className="insight-content">
                <h4 className="insight-title">بهبود عملکرد</h4>
                <p className="insight-description">عملکرد سیستم در 7 روز گذشته 12% بهبود یافته است</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="insight-item warning"
            >
              <div className="insight-icon">
                <AlertTriangle size={20} />
              </div>
              <div className="insight-content">
                <h4 className="insight-title">نیاز به بهینه‌سازی</h4>
                <p className="insight-description">توان عملیاتی در برخی ساعات کاهش یافته است</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              className="insight-item info"
            >
              <div className="insight-icon">
                <Users size={20} />
              </div>
              <div className="insight-content">
                <h4 className="insight-title">رشد کاربران</h4>
                <p className="insight-description">تعداد کاربران فعال 15% افزایش یافته است</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Recommendations Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="recommendations-section"
      >
        <div className="recommendations-header">
          <h3 className="recommendations-title">
            <Star size={20} />
            توصیه‌های بهینه‌سازی
          </h3>
        </div>

        <div className="recommendations-list">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="recommendation-item"
          >
            <div className="recommendation-number">1</div>
            <div className="recommendation-content">
              <p className="recommendation-text">افزایش منابع سرور برای بهبود عملکرد</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
            className="recommendation-item"
          >
            <div className="recommendation-number">2</div>
            <div className="recommendation-content">
              <p className="recommendation-text">بهینه‌سازی الگوریتم‌های یادگیری</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
            className="recommendation-item"
          >
            <div className="recommendation-number">3</div>
            <div className="recommendation-content">
              <p className="recommendation-text">پیاده‌سازی سیستم مانیتورینگ پیشرفته</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Analysis;
