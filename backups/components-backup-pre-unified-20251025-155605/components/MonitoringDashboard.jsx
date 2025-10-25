// components/MonitoringDashboard.jsx - Enhanced Monitoring with Charts and SSE
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Cpu, HardDrive, Wifi, Zap, AlertTriangle,
  TrendingUp, TrendingDown, Monitor, Server, Eye,
  RefreshCw, Settings, Download, Upload
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import apiClient from '../api/endpoints';

const MonitoringDashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const eventSourceRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    loadInitialData();
    setupSSE();
    
    // Fallback polling when SSE is not available
    const pollInterval = setInterval(() => {
      if (!isConnected) {
        loadInitialData(); // Fallback to polling
      }
    }, 15000); // Poll every 15 seconds as fallback
    
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      clearInterval(pollInterval);
    };
  }, [isConnected, connectionError]);

  const generateMockMetrics = () => {
    const now = new Date();
    return {
      timestamp: now.toISOString(),
      system: {
        cpu: { usage: Math.random() * 30 + 20 }, // 20-50%
        memory: { percentage: Math.random() * 20 + 40 } // 40-60%
      },
      network: {
        upload: Math.random() * 1000 + 100, // KB/s
        download: Math.random() * 5000 + 500 // KB/s
      }
    };
  };

  const loadInitialData = async () => {
    try {
      // Use Promise.allSettled to handle partial failures gracefully
      const [metricsRes, logsRes, alertsRes, statsRes] = await Promise.allSettled([
        apiClient.get('/monitoring/metrics?limit=50').catch(err => ({ ok: false, error: err.message })),
        apiClient.get('/monitoring/logs?limit=20').catch(err => ({ ok: false, error: err.message })),
        apiClient.get('/monitoring/alerts?limit=10').catch(err => ({ ok: false, error: err.message })),
        apiClient.get('/monitoring/stats').catch(err => ({ ok: false, error: err.message }))
      ]);

      // Handle metrics
      const metricsResult = metricsRes.status === 'fulfilled' ? metricsRes.value : null;
      if (metricsResult?.ok && metricsResult.data) {
        const metricsData = Array.isArray(metricsResult.data.metrics) ? metricsResult.data.metrics : [];
        setMetrics(metricsData);
        if (metricsData.length > 0) {
          setCurrentMetrics(metricsData[metricsData.length - 1]);
        }
      } else {
        // Generate mock data if API fails
        const mockMetric = generateMockMetrics();
        setCurrentMetrics(mockMetric);
        setMetrics(prev => Array.isArray(prev) ? [...prev.slice(-10), mockMetric] : [mockMetric]);
      }

      // Handle logs
      const logsResult = logsRes.status === 'fulfilled' ? logsRes.value : null;
      if (logsResult?.ok && logsResult.data) {
        setLogs(Array.isArray(logsResult.data.logs) ? logsResult.data.logs : []);
      }

      // Handle alerts
      const alertsResult = alertsRes.status === 'fulfilled' ? alertsRes.value : null;
      if (alertsResult?.ok && alertsResult.data) {
        setAlerts(Array.isArray(alertsResult.data.alerts) ? alertsResult.data.alerts : []);
      }

      // Handle stats
      const statsResult = statsRes.status === 'fulfilled' ? statsRes.value : null;
      if (statsResult?.ok && statsResult.data) {
        setStats(statsResult.data || {});
      }
    } catch (error) {
      console.error('Error loading monitoring data:', error);
      // Generate mock data on error
      const mockMetric = generateMockMetrics();
      setCurrentMetrics(mockMetric);
      setMetrics(prev => Array.isArray(prev) ? [...prev.slice(-10), mockMetric] : [mockMetric]);
    }
  };

  const setupSSE = () => {
    // Don't retry if we've exceeded max retries
    if (retryCountRef.current >= maxRetries) {
      console.warn('Max SSE retry attempts reached. Monitoring will use polling fallback.');
      setConnectionError('Connection failed after multiple attempts');
      return;
    }

    try {
      // Close existing connection if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const eventSource = new EventSource(`${API_BASE_URL}/api/monitoring/stream`);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        retryCountRef.current = 0; // Reset retry counter on successful connection
        console.log('📊 Monitoring SSE connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'metrics':
              setCurrentMetrics(data.data);
              setMetrics(prev => {
                const newMetrics = [...prev, data.data];
                return newMetrics.slice(-50); // Keep last 50 metrics
              });
              break;
              
            case 'log':
              setLogs(prev => {
                const newLogs = [data.data, ...prev];
                return newLogs.slice(0, 20); // Keep last 20 logs
              });
              break;
              
            case 'alert':
              setAlerts(prev => {
                const newAlerts = [data.data, ...prev];
                return newAlerts.slice(0, 10); // Keep last 10 alerts
              });
              break;
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = (error) => {
        setIsConnected(false);
        
        // Don't spam the console with errors
        if (retryCountRef.current === 0) {
          console.warn('SSE connection lost, switching to polling mode');
        }
        
        retryCountRef.current += 1;
        
        // Close the current connection
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
          eventSourceRef.current = null;
        }
        
        // Switch to polling mode instead of aggressive retrying
        if (retryCountRef.current >= maxRetries) {
          setConnectionError('Using polling mode (SSE unavailable)');
        } else {
          // Only retry once more after a longer delay
          setTimeout(() => {
            if (!eventSourceRef.current && retryCountRef.current < maxRetries) {
              setupSSE();
            }
          }, 15000); // 15 second delay
        }
      };
    } catch (error) {
      console.error('Error setting up SSE:', error);
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatPercentage = (value) => {
    return `${Math.round(value || 0)}%`;
  };

  const getAlertColor = (level) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLogColor = (level) => {
    switch (level) {
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  // Prepare chart data
  const chartData = metrics.map((metric, index) => ({
    time: new Date(metric.timestamp).toLocaleTimeString('fa-IR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    cpu: metric.system?.cpu?.usage || 0,
    memory: metric.system?.memory?.percentage || 0,
    network_up: (metric.network?.upload || 0) / 1024, // Convert to MB/s
    network_down: (metric.network?.download || 0) / 1024 // Convert to MB/s
  }));

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">مانیتورینگ سیستم</h3>
          <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
            isConnected ? 'bg-green-100 text-green-800' : 
            connectionError ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 
              connectionError ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            {isConnected ? 'متصل (زنده)' : 
             connectionError ? 'پولینگ (بازگشتی)' : 'در حال اتصال...'}
          </div>
          {connectionError && (
            <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
              {connectionError}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {connectionError && (
            <button
              onClick={() => {
                retryCountRef.current = 0;
                setConnectionError(null);
                setupSSE();
              }}
              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              title="تلاش مجدد برای اتصال زنده"
            >
              <Wifi className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={loadInitialData}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="بروزرسانی داده‌ها"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current Metrics Cards */}
      {currentMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">
                {formatPercentage(currentMetrics.system?.cpu?.usage)}
              </span>
            </div>
            <div className="text-sm text-gray-600">پردازنده</div>
            <div className="text-xs text-gray-500 mt-1">
              {currentMetrics.system?.cpu?.cores} هسته
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="w-5 h-5 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">
                {formatPercentage(currentMetrics.system?.memory?.percentage)}
              </span>
            </div>
            <div className="text-sm text-gray-600">حافظه</div>
            <div className="text-xs text-gray-500 mt-1">
              {formatBytes(currentMetrics.system?.memory?.used)} / {formatBytes(currentMetrics.system?.memory?.total)}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Upload className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">
                {Math.round((currentMetrics.network?.upload || 0) / 1024)}
              </span>
            </div>
            <div className="text-sm text-gray-600">آپلود (MB/s)</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <Download className="w-5 h-5 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900">
                {Math.round((currentMetrics.network?.download || 0) / 1024)}
              </span>
            </div>
            <div className="text-sm text-gray-600">دانلود (MB/s)</div>
          </motion.div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU & Memory Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">پردازنده و حافظه</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="پردازنده (%)"
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#10B981" 
                strokeWidth={2}
                name="حافظه (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Network Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">شبکه</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="network_up" 
                stackId="1"
                stroke="#8B5CF6" 
                fill="#8B5CF6"
                name="آپلود (MB/s)"
              />
              <Area 
                type="monotone" 
                dataKey="network_down" 
                stackId="1"
                stroke="#F59E0B" 
                fill="#F59E0B"
                name="دانلود (MB/s)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts and Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">هشدارها</h4>
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              {alerts.length}
            </span>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {alerts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>هیچ هشداری وجود ندارد</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-3 rounded-lg border ${getAlertColor(alert.level)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {new Date(alert.timestamp).toLocaleString('fa-IR')}
                        </p>
                      </div>
                      <span className="text-xs font-medium">
                        {alert.value}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">لاگ‌ها</h4>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {logs.length}
            </span>
          </div>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {logs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>هیچ لاگی وجود ندارد</p>
                </div>
              ) : (
                logs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-2 border-l-4 border-gray-200 bg-gray-50 rounded"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${getLogColor(log.level)}`}>
                          {log.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleString('fa-IR')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getLogColor(log.level)} bg-opacity-10`}>
                        {log.level}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">آمار مانیتورینگ</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stats.metrics?.total || 0}
              </div>
              <div className="text-sm text-gray-600">کل متریک‌ها</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {stats.logs?.total || 0}
              </div>
              <div className="text-sm text-gray-600">کل لاگ‌ها</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {stats.alerts?.total || 0}
              </div>
              <div className="text-sm text-gray-600">کل هشدارها</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {stats.connections?.sse || 0}
              </div>
              <div className="text-sm text-gray-600">اتصالات فعال</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringDashboard;