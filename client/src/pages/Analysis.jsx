import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3, TrendingUp, Target, Zap, Brain,
  RefreshCw, Activity, Clock, CheckCircle, AlertTriangle,
  Loader, Play, Pause, Square
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import apiClient from '../api/client';

const Analysis = () => {
  // ===== STATE =====
  const [runs, setRuns] = useState([]);
  const [selectedRunId, setSelectedRunId] = useState(null);
  const [currentRunMetrics, setCurrentRunMetrics] = useState({
    accuracy: 0,
    valLoss: 0,
    throughput: 0,
    status: 'idle'
  });
  const [currentRunHistory, setCurrentRunHistory] = useState({
    lossHistory: [],
    accuracyHistory: [],
    throughputHistory: []
  });
  const [currentRunLogs, setCurrentRunLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ===== LOAD RUNS LIST =====
  useEffect(() => {
    loadRuns();
  }, []);

  const loadRuns = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getTrainingJobs();
      
      // Backend might not have this endpoint yet - handle gracefully
      if (response && response.data && Array.isArray(response.data)) {
        setRuns(response.data);
        if (response.data.length > 0 && !selectedRunId) {
          setSelectedRunId(response.data[0].id);
        }
      } else {
        // Fallback: empty runs list
        console.warn('getTrainingJobs() returned no data - backend might not support history yet');
        setRuns([]);
      }
    } catch (error) {
      console.error('Error loading runs:', error);
      // Fallback to empty array so UI still renders
      setRuns([]);
    } finally {
      setLoading(false);
    }
  };

  // ===== LOAD SELECTED RUN DATA =====
  useEffect(() => {
    if (!selectedRunId) return;

    const loadRunData = async () => {
      try {
        // Fetch latest status/metrics for this run
        const statusResponse = await apiClient.getTrainingStatus(selectedRunId);
        
        if (statusResponse && statusResponse.data) {
          const data = statusResponse.data;
          
          // Update KPI metrics
          setCurrentRunMetrics({
            accuracy: data.accuracy || data.valAccuracy || 0,
            valLoss: data.valLoss || 0,
            throughput: data.throughput || 0,
            status: data.status || 'unknown'
          });

          // Update history arrays (if backend provides them)
          if (data.history) {
            setCurrentRunHistory({
              lossHistory: data.history.loss || [],
              accuracyHistory: data.history.accuracy || [],
              throughputHistory: data.history.throughput || []
            });
          }

          // Update logs (if backend provides them)
          if (data.logs && Array.isArray(data.logs)) {
            setCurrentRunLogs(data.logs.map(log => ({
              timestamp: log.timestamp || new Date().toISOString(),
              message: log.message || '',
              type: log.type || 'info'
            })));
          }
        }
      } catch (error) {
        console.error('Error loading run data:', error);
        // Don't crash - just keep old data
      }
    };

    loadRunData();

    // Poll every 3 seconds if run is active
    const interval = setInterval(() => {
      if (currentRunMetrics.status === 'training' || currentRunMetrics.status === 'running') {
        loadRunData();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedRunId, currentRunMetrics.status]);

  // ===== RELOAD ANALYTICS =====
  const reloadAnalytics = async () => {
    setRefreshing(true);
    await loadRuns();
    setRefreshing(false);
  };

  // ===== LOADING STATE =====
  if (loading) {
    return (
      <div className="w-full flex flex-col items-stretch bg-[#F5F7FB] text-slate-900 rtl pb-24 min-h-screen">
        <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col items-center justify-center min-h-screen gap-4">
          <Loader className="animate-spin text-violet-500" size={48} />
          <p className="text-slate-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // ===== RENDER =====
  return (
    <div className="w-full flex flex-col items-stretch bg-[#F5F7FB] text-slate-900 rtl pb-24">
      <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col gap-6">
        
        {/* ===== PAGE HEADER CARD ===== */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-slate-900">گزارش‌گیری</h1>
              <p className="text-sm text-slate-600">
                تحلیل زنده و تاریخچه پیشرفت مدل‌ها
              </p>
            </div>

            {/* model/run selector and refresh */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-600 whitespace-nowrap">
                  مدل / اجرا
                </label>
                <select
                  className="text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  value={selectedRunId || ''}
                  onChange={e => setSelectedRunId(e.target.value)}
                >
                  {runs.length === 0 && (
                    <option value="">هیچ اجرایی موجود نیست</option>
                  )}
                  {runs.map(run => (
                    <option key={run.id} value={run.id}>
                      {run.name || run.modelName || run.id}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={reloadAnalytics}
                disabled={refreshing}
                className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                <span>بروزرسانی</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===== KPI ROW (TOP METRICS STRIP) ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* KPI 1: آخرین دقت */}
          <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Target size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-600">آخرین دقت</span>
                <span className="text-lg font-bold text-slate-900">
                  {currentRunMetrics.accuracy > 0 ? `${(currentRunMetrics.accuracy * 100).toFixed(2)}%` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* KPI 2: آخرین loss اعتبارسنجی */}
          <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-600">آخرین loss</span>
                <span className="text-lg font-bold text-slate-900">
                  {currentRunMetrics.valLoss > 0 ? currentRunMetrics.valLoss.toFixed(4) : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* KPI 3: توان پردازشی */}
          <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-600">توان پردازشی</span>
                <span className="text-lg font-bold text-slate-900">
                  {currentRunMetrics.throughput > 0 ? `${currentRunMetrics.throughput.toFixed(1)} it/s` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* KPI 4: وضعیت آموزش */}
          <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                currentRunMetrics.status === 'training' || currentRunMetrics.status === 'running' ? 'bg-gradient-to-br from-blue-500 to-indigo-500' :
                currentRunMetrics.status === 'completed' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                currentRunMetrics.status === 'paused' ? 'bg-gradient-to-br from-yellow-500 to-amber-500' :
                'bg-gradient-to-br from-slate-400 to-slate-500'
              }`}>
                {currentRunMetrics.status === 'training' || currentRunMetrics.status === 'running' ? <Play size={18} className="text-white" /> :
                 currentRunMetrics.status === 'completed' ? <CheckCircle size={18} className="text-white" /> :
                 currentRunMetrics.status === 'paused' ? <Pause size={18} className="text-white" /> :
                 <Square size={18} className="text-white" />}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-600">وضعیت</span>
                <span className="text-sm font-bold text-slate-900">
                  {currentRunMetrics.status === 'training' || currentRunMetrics.status === 'running' ? 'در حال آموزش' :
                   currentRunMetrics.status === 'completed' ? 'کامل شد' :
                   currentRunMetrics.status === 'paused' ? 'متوقف' :
                   currentRunMetrics.status === 'failed' ? 'ناموفق' :
                   'متوقف'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MAIN GRID CONTENT (2 COLUMNS) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN: روند پیشرفت مدل (LIVE CHART) */}
          <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-violet-600" />
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-slate-900">روند پیشرفت مدل</h3>
                <p className="text-xs text-slate-600">دقت / لاس در طول زمان</p>
              </div>
            </div>

            {currentRunHistory.lossHistory && currentRunHistory.lossHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={currentRunHistory.lossHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="step"
                    stroke="#6b7280"
                    label={{ value: 'Steps', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="trainLoss"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={false}
                    name="Train Loss"
                  />
                  <Line
                    type="monotone"
                    dataKey="valLoss"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={false}
                    name="Val Loss"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-slate-400">
                <Activity size={48} opacity={0.3} />
                <p className="mt-2 text-sm">داده‌ای برای نمایش نیست</p>
                <p className="text-xs text-slate-500">یک اجرای آموزشی را انتخاب کنید</p>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: رخدادها و هشدارها (STATUS/LOGS CARD) */}
          <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-amber-600" />
              <div className="flex flex-col">
                <h3 className="text-base font-bold text-slate-900">رخدادها و هشدارها</h3>
                <p className="text-xs text-slate-600">لاگ‌های اجرای انتخاب شده</p>
              </div>
            </div>

            <div className="max-h-[280px] overflow-y-auto text-xs text-slate-600 flex flex-col gap-2">
              {currentRunLogs.length > 0 ? (
                currentRunLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 px-3 py-2 rounded-lg border-r-4 ${
                      log.type === 'success' ? 'bg-green-50 border-green-500' :
                      log.type === 'error' ? 'bg-red-50 border-red-500' :
                      log.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <span className="text-slate-500 font-mono text-[10px] min-w-[70px]">
                      {new Date(log.timestamp).toLocaleTimeString('fa-IR')}
                    </span>
                    <span className="text-slate-700 flex-1">{log.message}</span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-[220px] text-slate-400">
                  <Clock size={40} opacity={0.3} />
                  <p className="mt-2 text-sm">هیچ لاگی ثبت نشده</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== PAST RUNS / HISTORY TABLE ===== */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Brain size={20} className="text-violet-600" />
            <div className="flex flex-col">
              <h3 className="text-base font-bold text-slate-900">تاریخچه آموزش‌ها</h3>
              <p className="text-xs text-slate-600">خلاصه اجراهای قبلی</p>
            </div>
          </div>

          {runs.length > 0 ? (
            <div className="max-h-[240px] overflow-y-auto text-xs">
              <table className="w-full text-right">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-xs font-semibold text-slate-700">نام / مدل</th>
                    <th className="px-4 py-2 text-xs font-semibold text-slate-700">دقت نهایی</th>
                    <th className="px-4 py-2 text-xs font-semibold text-slate-700">Epochs</th>
                    <th className="px-4 py-2 text-xs font-semibold text-slate-700">وضعیت</th>
                    <th className="px-4 py-2 text-xs font-semibold text-slate-700">زمان</th>
                    <th className="px-4 py-2 text-xs font-semibold text-slate-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <tr key={run.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-900 font-medium">
                        {run.name || run.modelName || run.id}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {run.finalAccuracy ? `${(run.finalAccuracy * 100).toFixed(2)}%` : '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {run.totalEpochs || run.epochs || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-semibold ${
                          run.status === 'completed' ? 'bg-green-100 text-green-700' :
                          run.status === 'failed' ? 'bg-red-100 text-red-700' :
                          run.status === 'paused' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {run.status === 'completed' ? 'کامل شده' :
                           run.status === 'failed' ? 'ناموفق' :
                           run.status === 'paused' ? 'متوقف شده' :
                           'نامشخص'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {run.completedAt ? new Date(run.completedAt).toLocaleDateString('fa-IR') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setSelectedRunId(run.id)}
                          className="px-3 py-1 text-[10px] font-semibold bg-violet-100 text-violet-700 rounded hover:bg-violet-200 transition-colors"
                        >
                          مشاهده
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Brain size={48} opacity={0.3} />
              <p className="mt-2 text-sm">هیچ آموزشی یافت نشد</p>
              <p className="text-xs text-slate-500">شما هنوز هیچ مدلی را آموزش نداده‌اید</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Analysis;
