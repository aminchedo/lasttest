import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, Square, RefreshCw, Save, Download,
  Brain, TrendingUp, Target, Zap, Clock, AlertTriangle,
  CheckCircle, Loader, Settings, ChevronDown, ChevronUp,
  Activity, Award, Timer, Gauge, Info, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ComposedChart
} from 'recharts';
import apiClient from '../api/client';
import MonitoringStrip from '../components/MonitoringStrip';
import useBackgroundDownload from '../hooks/useBackgroundDownload';

// ===== ENUMS & CONSTANTS =====
const TRAINING_STATE = {
  IDLE: 'idle',
  INITIALIZING: 'initializing',
  TRAINING: 'training',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

const OPTIMIZER_TYPES = {
  ADAM: 'adam',
  ADAMW: 'adamw',
  SGD: 'sgd',
  RMSPROP: 'rmsprop',
  LAMB: 'lamb'
};

const LR_SCHEDULER_TYPES = {
  CONSTANT: 'constant',
  LINEAR: 'linear',
  COSINE: 'cosine',
  EXPONENTIAL: 'exponential',
  STEP: 'step',
  POLYNOMIAL: 'polynomial'
};

// ===== MAIN COMPONENT =====
const Training = () => {
  // ===== STATE MANAGEMENT =====
  const [trainingState, setTrainingState] = useState(TRAINING_STATE.IDLE);
  const [currentJobId, setCurrentJobId] = useState(null);

  // Data Selection
  const [models, setModels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [selectedBaseModel, setSelectedBaseModel] = useState(null);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [selectedTeacherModel, setSelectedTeacherModel] = useState(null);

  // Training Configuration (پیشرفته)
  const [config, setConfig] = useState({
    // اصلی
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
    optimizer: OPTIMIZER_TYPES.ADAMW,

    // پیشرفته
    lrScheduler: LR_SCHEDULER_TYPES.COSINE,
    warmupSteps: 500,
    warmupRatio: 0.1,
    weightDecay: 0.01,
    gradientAccumulationSteps: 4,
    maxGradNorm: 1.0,

    // Early Stopping
    enableEarlyStopping: true,
    earlyStoppingPatience: 3,
    earlyStoppingThreshold: 0.0001,

    // Mixed Precision
    mixedPrecision: true,

    // Checkpointing
    saveCheckpointEvery: 100,
    keepTopCheckpoints: 3,

    // Knowledge Distillation
    enableDistillation: false,
    distillationAlpha: 0.5,
    distillationTemperature: 2.0,

    // Validation
    validationSplit: 0.2,
    evaluateEvery: 50
  });

  // Real-time Metrics
  const [metrics, setMetrics] = useState({
    epoch: 0,
    step: 0,
    totalSteps: 0,
    trainLoss: 0,
    valLoss: 0,
    learningRate: 0,
    throughput: 0,
    timeElapsed: 0,
    timeRemaining: 0,
    progress: 0,
    bestValLoss: Infinity,
    earlyStoppingCounter: 0,
    gradientNorm: 0,
    message: ''
  });

  // History برای نمودارها
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [lossHistory, setLossHistory] = useState([]);
  const [lrHistory, setLrHistory] = useState([]);

  // UI States
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [activeTab, setActiveTab] = useState('metrics'); // metrics, logs, config
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Download Progress States
  const [downloadProgress, setDownloadProgress] = useState({});
  const [downloadingDatasets, setDownloadingDatasets] = useState(new Set());

  // Background Download Hook
  const {
    isSupported: isBackgroundDownloadSupported,
    startBackgroundDownload,
    getDownloadStatus,
    isDownloading: isBackgroundDownloading,
    isCompleted: isBackgroundCompleted,
    getActiveDownloads
  } = useBackgroundDownload();

  // Refs
  const wsRef = useRef(null);
  const intervalRef = useRef(null);
  const metricsBufferRef = useRef([]);
  const startTimeRef = useRef(null);

  // ===== LIFECYCLE =====
  useEffect(() => {
    loadAssets();
    return cleanup;
  }, []);

  useEffect(() => {
    // Update charts every 500ms to avoid too many re-renders
    const chartUpdateInterval = setInterval(() => {
      if (metricsBufferRef.current.length > 0) {
        updateChartsData(metricsBufferRef.current);
        metricsBufferRef.current = [];
      }
    }, 500);

    return () => clearInterval(chartUpdateInterval);
  }, []);

  // ===== ASSET LOADING =====
  const loadAssets = async () => {
    try {
      setLoading(true);
      const [modelsRes, datasetsRes] = await Promise.all([
        apiClient.getCatalogModels(),
        apiClient.getCatalogDatasets()
      ]);

      setModels(modelsRes || []);
      setDatasets(datasetsRes || []);

      addLog('منابع با موفقیت بارگذاری شد', 'success');
    } catch (error) {
      console.error('Load assets error:', error);
      toast.error('خطا در بارگذاری منابع');
      addLog(`خطا در بارگذاری: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // ===== TRAINING LIFECYCLE =====
  const handleStartTraining = async () => {
    const required = ['baseModel', 'datasetId', 'outputDir'];
    for (const k of required) {
      if (!selectedBaseModel || !selectedDatasets.length) {
        toast.error(`Missing field: ${k}`);
        return;
      }
    }

    try {
      setTrainingState(TRAINING_STATE.INITIALIZING);
      addLog('در حال آماده‌سازی برای شروع آموزش...', 'info');

      // Debug logging
      console.log('Selected Base Model:', selectedBaseModel);
      console.log('Selected Datasets:', selectedDatasets);
      console.log('Available Models:', models);

      const trainingConfig = {
        baseModel: selectedBaseModel?.id || selectedBaseModel,
        datasets: selectedDatasets.map(ds => ds.id || ds),
        teacherModel: selectedTeacherModel?.id || selectedTeacherModel,
        config: {
          ...config,
          // Calculate total steps for proper scheduling
          totalSteps: Math.ceil(
            (selectedDatasets.reduce((acc, ds) => acc + (ds.size || 1000), 0) / config.batchSize) *
            config.epochs /
            config.gradientAccumulationSteps
          )
        }
      };

      console.log('Training Config being sent:', trainingConfig);

      const response = await apiClient.startTraining(trainingConfig);

      if (response?.id) {
        setCurrentJobId(response.id);
        setTrainingState(TRAINING_STATE.TRAINING);
        startTimeRef.current = Date.now();

        // Reset metrics
        resetMetrics();

        toast.success('آموزش با موفقیت شروع شد!');
        addLog(`آموزش شروع شد - Job ID: ${response.id}`, 'success');

        // Start monitoring
        startMonitoring(response.id);
      }
    } catch (error) {
      console.error('Start training error:', error);
      const msg = (error && error.response && error.response.data && (error.response.data.message || error.response.data.error)) || error.message || 'Training start failed';
      toast.error(msg);
      addLog(`خطا در شروع: ${error.message}`, 'error');
      setTrainingState(TRAINING_STATE.IDLE);
    }
  };

  const handlePauseTraining = async () => {
    if (!currentJobId) return;

    try {
      await apiClient.pauseTraining(currentJobId);
      setTrainingState(TRAINING_STATE.PAUSED);
      stopMonitoring();

      toast.success('آموزش متوقف شد');
      addLog('آموزش به صورت موقت متوقف شد', 'warning');
    } catch (error) {
      console.error('Pause error:', error);
      toast.error('خطا در توقف آموزش');
      addLog(`خطا در توقف: ${error.message}`, 'error');
    }
  };

  const handleResumeTraining = async () => {
    if (!currentJobId) return;

    try {
      await apiClient.resumeTraining(currentJobId);
      setTrainingState(TRAINING_STATE.TRAINING);

      toast.success('آموزش از سر گرفته شد');
      addLog('آموزش از سر گرفته شد', 'success');

      startMonitoring(currentJobId);
    } catch (error) {
      console.error('Resume error:', error);
      toast.error('خطا در ادامه آموزش');
      addLog(`خطا در ادامه: ${error.message}`, 'error');
    }
  };

  const handleStopTraining = async () => {
    if (!currentJobId) return;

    if (!confirm('آیا مطمئن هستید که می‌خواهید آموزش را متوقف کنید؟')) {
      return;
    }

    try {
      await apiClient.stopTraining(currentJobId);
      setTrainingState(TRAINING_STATE.IDLE);
      setCurrentJobId(null);
      stopMonitoring();

      toast.warning('آموزش کامل متوقف شد');
      addLog('آموزش به صورت کامل متوقف شد', 'warning');
    } catch (error) {
      console.error('Stop error:', error);
      toast.error('خطا در توقف آموزش');
      addLog(`خطا در توقف: ${error.message}`, 'error');
    }
  };

  // ===== MONITORING =====
  const startMonitoring = (jobId) => {
    // WebSocket connection for real-time updates
    try {
      wsRef.current = apiClient.subscribeToTraining(jobId, handleMetricsUpdate);
      addLog('اتصال WebSocket برقرار شد', 'success');
    } catch (error) {
      console.error('WebSocket error:', error);
      addLog('خطا در اتصال WebSocket، استفاده از polling', 'warning');
    }

    // Polling fallback
    intervalRef.current = setInterval(async () => {
      try {
        const status = await apiClient.getTrainingStatus(jobId);
        handleStatusUpdate(status);
      } catch (error) {
        console.error('Polling error:', error);
        addLog(`خطا در دریافت وضعیت: ${error.message}`, 'error');
      }
    }, 2000);
  };

  const stopMonitoring = () => {
    if (wsRef.current) {
      wsRef.current();
      wsRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const cleanup = () => {
    stopMonitoring();
  };

  // ===== METRICS HANDLING =====
  const handleMetricsUpdate = useCallback((data) => {
    const newMetrics = {
      ...metrics,
      ...data,
      timeElapsed: startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0
    };

    // Calculate time remaining
    if (newMetrics.progress > 0) {
      const estimatedTotal = (newMetrics.timeElapsed / newMetrics.progress) * 100;
      newMetrics.timeRemaining = estimatedTotal - newMetrics.timeElapsed;
    }

    setMetrics(newMetrics);

    // Buffer metrics for chart updates
    metricsBufferRef.current.push(newMetrics);

    // Log important events
    if (data.message) {
      addLog(data.message, data.type || 'info');
    }

    // Check for early stopping
    if (config.enableEarlyStopping && data.valLoss) {
      checkEarlyStopping(data.valLoss);
    }
  }, [metrics, config.enableEarlyStopping]);

  const handleStatusUpdate = (status) => {
    if (!status) return;

    const updates = {
      progress: status.progress || 0,
      message: status.message || '',
      ...(status.metrics || {})
    };

    handleMetricsUpdate(updates);

    // State transitions
    if (status.status === 'completed') {
      handleTrainingComplete();
    } else if (status.status === 'failed') {
      handleTrainingFailed(status.message || 'Unknown error');
    }
  };

  const updateChartsData = (newData) => {
    // Update loss history
    const lossData = newData
      .filter(d => d.trainLoss || d.valLoss)
      .map(d => ({
        step: d.step,
        trainLoss: d.trainLoss,
        valLoss: d.valLoss,
        epoch: d.epoch
      }));

    if (lossData.length > 0) {
      setLossHistory(prev => [...prev, ...lossData].slice(-200)); // Keep last 200 points
    }

    // Update learning rate history
    const lrData = newData
      .filter(d => d.learningRate)
      .map(d => ({
        step: d.step,
        lr: d.learningRate
      }));

    if (lrData.length > 0) {
      setLrHistory(prev => [...prev, ...lrData].slice(-200));
    }

    // Update general metrics
    const metricsData = newData
      .filter(d => d.throughput || d.gradientNorm)
      .map(d => ({
        step: d.step,
        throughput: d.throughput,
        gradientNorm: d.gradientNorm
      }));

    if (metricsData.length > 0) {
      setMetricsHistory(prev => [...prev, ...metricsData].slice(-200));
    }
  };

  // ===== EARLY STOPPING =====
  const checkEarlyStopping = (valLoss) => {
    setMetrics(prev => {
      const improvement = prev.bestValLoss - valLoss;

      if (improvement > config.earlyStoppingThreshold) {
        // Improvement detected
        return {
          ...prev,
          bestValLoss: valLoss,
          earlyStoppingCounter: 0
        };
      } else {
        // No improvement
        const newCounter = prev.earlyStoppingCounter + 1;

        if (newCounter >= config.earlyStoppingPatience) {
          addLog(
            `Early stopping triggered - no improvement for ${config.earlyStoppingPatience} evaluations`,
            'warning'
          );
          handleStopTraining();
        }

        return {
          ...prev,
          earlyStoppingCounter: newCounter
        };
      }
    });
  };

  // ===== COMPLETION HANDLERS =====
  const handleTrainingComplete = () => {
    setTrainingState(TRAINING_STATE.COMPLETED);
    stopMonitoring();

    const duration = formatTime((Date.now() - startTimeRef.current) / 1000);

    toast.success(`آموزش با موفقیت به پایان رسید! (${duration})`);
    addLog(`آموزش با موفقیت کامل شد - مدت زمان: ${duration}`, 'success');

    // Show completion stats
    const stats = {
      finalTrainLoss: metrics.trainLoss.toFixed(4),
      finalValLoss: metrics.valLoss.toFixed(4),
      bestValLoss: metrics.bestValLoss.toFixed(4),
      totalEpochs: metrics.epoch,
      duration
    };

    addLog(`آمار نهایی: ${JSON.stringify(stats, null, 2)}`, 'info');
  };

  const handleTrainingFailed = (message) => {
    setTrainingState(TRAINING_STATE.FAILED);
    stopMonitoring();

    toast.error('آموزش با خطا مواجه شد: ' + message);
    addLog(`آموزش با خطا متوقف شد: ${message}`, 'error');
  };

  const handleSaveModel = async () => {
    if (!currentJobId) return;

    try {
      const modelName = prompt('نام مدل را وارد کنید:');
      if (!modelName) return;

      await apiClient.saveTrainedModel(currentJobId, modelName);
      toast.success('مدل با موفقیت ذخیره شد');
      addLog(`مدل با نام "${modelName}" ذخیره شد`, 'success');
    } catch (error) {
      console.error('Save model error:', error);
      toast.error('خطا در ذخیره مدل');
      addLog(`خطا در ذخیره مدل: ${error.message}`, 'error');
    }
  };

  const handleExportMetrics = () => {
    const data = {
      config,
      metrics,
      lossHistory,
      lrHistory,
      metricsHistory,
      logs
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training-metrics-${currentJobId || Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('متریک‌ها با موفقیت export شد');
  };

  // ===== UTILITY FUNCTIONS =====
  const resetMetrics = () => {
    setMetrics({
      epoch: 0,
      step: 0,
      totalSteps: 0,
      trainLoss: 0,
      valLoss: 0,
      learningRate: config.learningRate,
      throughput: 0,
      timeElapsed: 0,
      timeRemaining: 0,
      progress: 0,
      bestValLoss: Infinity,
      earlyStoppingCounter: 0,
      gradientNorm: 0,
      message: ''
    });

    setLossHistory([]);
    setLrHistory([]);
    setMetricsHistory([]);
    setLogs([]);
  };

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString('fa-IR');
    setLogs(prev => [
      { timestamp, message, type },
      ...prev.slice(0, 99) // Keep last 100 logs
    ]);
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // ===== RENDER HELPERS =====
  const renderTrainingControls = () => {
    const isRunning = trainingState === TRAINING_STATE.TRAINING;
    const isPaused = trainingState === TRAINING_STATE.PAUSED;
    const isIdle = trainingState === TRAINING_STATE.IDLE;
    const isCompleted = trainingState === TRAINING_STATE.COMPLETED;

    return (
      <div className="flex flex-wrap gap-3">
        {isIdle && (
          <motion.button
            type="button"
            onClick={handleStartTraining}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedBaseModel || selectedDatasets.length === 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play size={20} />
            <span>شروع آموزش</span>
          </motion.button>
        )}

        {isRunning && (
          <>
            <motion.button
              type="button"
              onClick={handlePauseTraining}
              className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Pause size={20} />
              <span>توقف موقت</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={handleStopTraining}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Square size={20} />
              <span>پایان آموزش</span>
            </motion.button>
          </>
        )}

        {isPaused && (
          <>
            <motion.button
              type="button"
              onClick={handleResumeTraining}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play size={20} />
              <span>ادامه آموزش</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={handleStopTraining}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Square size={20} />
              <span>پایان آموزش</span>
            </motion.button>
          </>
        )}

        {isCompleted && (
          <>
            <motion.button
              type="button"
              onClick={handleSaveModel}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save size={20} />
              <span>ذخیره مدل</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={handleExportMetrics}
              className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={20} />
              <span>Export متریک‌ها</span>
            </motion.button>

            <motion.button
              type="button"
              onClick={() => {
                setTrainingState(TRAINING_STATE.IDLE);
                resetMetrics();
              }}
              className="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw size={20} />
              <span>آموزش جدید</span>
            </motion.button>
          </>
        )}
      </div>
    );
  };

  const renderProgressBar = () => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-700">پیشرفت آموزش</span>
          <span className="text-lg font-bold text-violet-600">{metrics.progress.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{formatTime(metrics.timeElapsed)}</span>
          </div>
          {metrics.timeRemaining > 0 && (
            <div className="flex items-center gap-1">
              <Timer size={14} />
              <span>~{formatTime(metrics.timeRemaining)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${metrics.progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {metrics.message && (
        <p className="text-sm text-slate-600 italic">{metrics.message}</p>
      )}
    </div>
  );

  const renderMetricsCards = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-4 border border-violet-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-600">Train Loss</span>
            <span className="text-lg font-bold text-slate-900">{metrics.trainLoss.toFixed(4)}</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Target size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-600">Val Loss</span>
            <span className="text-lg font-bold text-slate-900">{metrics.valLoss.toFixed(4)}</span>
            {metrics.bestValLoss < Infinity && (
              <span className="text-[10px] text-slate-500">Best: {metrics.bestValLoss.toFixed(4)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <RefreshCw size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-600">Epoch</span>
            <span className="text-lg font-bold text-slate-900">{metrics.epoch} / {config.epochs}</span>
            <span className="text-[10px] text-slate-500">Step: {metrics.step}</span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-600">Throughput</span>
            <span className="text-lg font-bold text-slate-900">{metrics.throughput.toFixed(1)} it/s</span>
            <span className="text-[10px] text-slate-500">LR: {metrics.learningRate.toExponential(2)}</span>
          </div>
        </div>
      </div>

      {config.enableEarlyStopping && (
        <div className="unified-metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Early Stopping</span>
            <span className="metric-value">
              {metrics.earlyStoppingCounter} / {config.earlyStoppingPatience}
            </span>
          </div>
        </div>
      )}

      {metrics.gradientNorm > 0 && (
        <div className="unified-metric-card">
          <div className="metric-icon" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
            <Activity size={24} />
          </div>
          <div className="metric-content">
            <span className="metric-label">Gradient Norm</span>
            <span className="metric-value">{metrics.gradientNorm.toFixed(3)}</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderCharts = () => (
    <div className="flex flex-col gap-6">
      {/* Loss Chart */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h3 className="text-base font-bold text-slate-900 mb-4">Training & Validation Loss</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lossHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="step"
              stroke="#6b7280"
              label={{ value: 'Steps', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              stroke="#6b7280"
              label={{ value: 'Loss', angle: -90, position: 'insideLeft' }}
            />
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
      </div>

      {/* Learning Rate Chart */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h3 className="text-base font-bold text-slate-900 mb-4">Learning Rate Schedule</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={lrHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="step"
              stroke="#6b7280"
              label={{ value: 'Steps', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              stroke="#6b7280"
              label={{ value: 'Learning Rate', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value) => value.toExponential(3)}
            />
            <Area
              type="monotone"
              dataKey="lr"
              stroke="#3b82f6"
              fill="url(#lrGradient)"
              name="Learning Rate"
            />
            <defs>
              <linearGradient id="lrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Throughput & Gradient Norm */}
      {metricsHistory.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="text-base font-bold text-slate-900 mb-4">Throughput & Gradient Norm</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="step"
                stroke="#6b7280"
              />
              <YAxis
                yAxisId="left"
                stroke="#10b981"
                label={{ value: 'Throughput (it/s)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#f59e0b"
                label={{ value: 'Gradient Norm', angle: 90, position: 'insideRight' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="throughput"
                fill="#10b981"
                name="Throughput"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="gradientNorm"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                name="Gradient Norm"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );

  const renderLogs = () => (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900">Training Logs</h3>
        <button
          type="button"
          onClick={() => setLogs([])}
          className="px-3 py-1 text-sm border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="max-h-[400px] overflow-y-auto flex flex-col gap-2">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`flex gap-3 px-4 py-2 rounded-lg text-sm border-r-4 ${
              log.type === 'success' ? 'bg-green-50 border-green-500' :
              log.type === 'error' ? 'bg-red-50 border-red-500' :
              log.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
              'bg-blue-50 border-blue-500'
            }`}
          >
            <span className="text-slate-500 font-mono text-xs min-w-[80px]">{log.timestamp}</span>
            <span className="text-slate-700 flex-1">{log.message}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Info size={40} opacity={0.3} />
            <p className="mt-2">هیچ log‌ای وجود ندارد</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderConfiguration = () => (
    <div className="flex flex-col gap-6">
      {/* Basic Config */}
      <div className="bg-slate-50 rounded-xl p-4">
        <h3 className="text-base font-bold text-slate-900 mb-4">تنظیمات اصلی</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Epochs</label>
            <input
              type="number"
              value={config.epochs}
              onChange={(e) => updateConfig('epochs', parseInt(e.target.value))}
              min="1"
              max="1000"
              disabled={trainingState !== TRAINING_STATE.IDLE}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Batch Size</label>
            <input
              type="number"
              value={config.batchSize}
              onChange={(e) => updateConfig('batchSize', parseInt(e.target.value))}
              min="1"
              max="512"
              disabled={trainingState !== TRAINING_STATE.IDLE}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Learning Rate</label>
            <input
              type="number"
              value={config.learningRate}
              onChange={(e) => updateConfig('learningRate', parseFloat(e.target.value))}
              step="0.0001"
              min="0.00001"
              max="1"
              disabled={trainingState !== TRAINING_STATE.IDLE}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Optimizer</label>
            <select
              value={config.optimizer}
              onChange={(e) => updateConfig('optimizer', e.target.value)}
              disabled={trainingState !== TRAINING_STATE.IDLE}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
            >
              {Object.entries(OPTIMIZER_TYPES).map(([key, value]) => (
                <option key={value} value={value}>{key}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Config */}
      <div className="bg-slate-50 rounded-xl p-4">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
        >
          <h3 className="text-base font-bold text-slate-900">تنظیمات پیشرفته</h3>
          {showAdvancedConfig ? <ChevronUp size={20} className="text-slate-600" /> : <ChevronDown size={20} className="text-slate-600" />}
        </div>

        <AnimatePresence>
          {showAdvancedConfig && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            >
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">LR Scheduler</label>
                <select
                  value={config.lrScheduler}
                  onChange={(e) => updateConfig('lrScheduler', e.target.value)}
                  disabled={trainingState !== TRAINING_STATE.IDLE}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  {Object.entries(LR_SCHEDULER_TYPES).map(([key, value]) => (
                    <option key={value} value={value}>{key}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Warmup Steps</label>
                <input
                  type="number"
                  value={config.warmupSteps}
                  onChange={(e) => updateConfig('warmupSteps', parseInt(e.target.value))}
                  min="0"
                  disabled={trainingState !== TRAINING_STATE.IDLE}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Weight Decay</label>
                <input
                  type="number"
                  value={config.weightDecay}
                  onChange={(e) => updateConfig('weightDecay', parseFloat(e.target.value))}
                  step="0.001"
                  min="0"
                  max="1"
                  disabled={trainingState !== TRAINING_STATE.IDLE}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Gradient Accumulation Steps</label>
                <input
                  type="number"
                  value={config.gradientAccumulationSteps}
                  onChange={(e) => updateConfig('gradientAccumulationSteps', parseInt(e.target.value))}
                  min="1"
                  max="128"
                  disabled={trainingState !== TRAINING_STATE.IDLE}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Max Gradient Norm</label>
                <input
                  type="number"
                  value={config.maxGradNorm}
                  onChange={(e) => updateConfig('maxGradNorm', parseFloat(e.target.value))}
                  step="0.1"
                  min="0"
                  disabled={trainingState !== TRAINING_STATE.IDLE}
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  id="mixedPrecision"
                  checked={config.mixedPrecision}
                  onChange={(e) => updateConfig('mixedPrecision', e.target.checked)}
                  disabled={trainingState !== TRAINING_STATE.IDLE}
                  className="w-4 h-4 text-violet-500 border-slate-300 rounded focus:ring-violet-500 disabled:opacity-50"
                />
                <label htmlFor="mixedPrecision" className="text-sm font-medium text-slate-700">
                  Mixed Precision Training
                </label>
              </div>

              <div className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  id="enableEarlyStopping"
                  checked={config.enableEarlyStopping}
                  onChange={(e) => updateConfig('enableEarlyStopping', e.target.checked)}
                  disabled={trainingState !== TRAINING_STATE.IDLE}
                  className="w-4 h-4 text-violet-500 border-slate-300 rounded focus:ring-violet-500 disabled:opacity-50"
                />
                <label htmlFor="enableEarlyStopping" className="text-sm font-medium text-slate-700">
                  Enable Early Stopping
                </label>
              </div>

              {config.enableEarlyStopping && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Early Stopping Patience</label>
                    <input
                      type="number"
                      value={config.earlyStoppingPatience}
                      onChange={(e) => updateConfig('earlyStoppingPatience', parseInt(e.target.value))}
                      min="1"
                      max="20"
                      disabled={trainingState !== TRAINING_STATE.IDLE}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Early Stopping Threshold</label>
                    <input
                      type="number"
                      value={config.earlyStoppingThreshold}
                      onChange={(e) => updateConfig('earlyStoppingThreshold', parseFloat(e.target.value))}
                      step="0.0001"
                      min="0"
                      disabled={trainingState !== TRAINING_STATE.IDLE}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 col-span-2">
                <input
                  type="checkbox"
                  id="enableDistillation"
                  checked={config.enableDistillation}
                  onChange={(e) => updateConfig('enableDistillation', e.target.checked)}
                  disabled={trainingState !== TRAINING_STATE.IDLE || !selectedTeacherModel}
                  className="w-4 h-4 text-violet-500 border-slate-300 rounded focus:ring-violet-500 disabled:opacity-50"
                />
                <label htmlFor="enableDistillation" className="text-sm font-medium text-slate-700">
                  Knowledge Distillation
                </label>
              </div>

              {config.enableDistillation && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Distillation Alpha</label>
                    <input
                      type="number"
                      value={config.distillationAlpha}
                      onChange={(e) => updateConfig('distillationAlpha', parseFloat(e.target.value))}
                      step="0.1"
                      min="0"
                      max="1"
                      disabled={trainingState !== TRAINING_STATE.IDLE}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700">Distillation Temperature</label>
                    <input
                      type="number"
                      value={config.distillationTemperature}
                      onChange={(e) => updateConfig('distillationTemperature', parseFloat(e.target.value))}
                      step="0.1"
                      min="1"
                      max="10"
                      disabled={trainingState !== TRAINING_STATE.IDLE}
                      className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  const handleDownloadModel = async (modelId) => {
    try {
      console.log('Downloading model:', modelId);
      console.log('API Base URL:', apiClient.axios.defaults.baseURL);
      console.log('Full URL:', `${apiClient.axios.defaults.baseURL}/download/model/${modelId}`);

      // Test with direct fetch first
      const testUrl = `http://localhost:3001/api/download/model/${modelId}`;
      console.log('Testing direct fetch to:', testUrl);

      const testResponse = await fetch(testUrl);
      console.log('Test response status:', testResponse.status);
      const testData = await testResponse.json();
      console.log('Test response data:', testData);

      if (testData && testData.downloadUrl) {
        // Create download link
        const link = document.createElement('a');
        link.href = testData.downloadUrl;
        link.download = testData.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('دانلود مدل شروع شد');
      } else {
        console.error('No download URL in test response:', testData);
        toast.error('لینک دانلود یافت نشد');
      }
    } catch (error) {
      console.error('Download error:', error);
      console.error('Error message:', error.message);
      toast.error('خطا در دانلود مدل');
    }
  };

  const renderModelSelection = () => {
    // فیلتر مدل‌های base و teacher از لیست کلی مدل‌ها
    const baseModels = models.filter(m => 
      m.role === 'base' || m.type === 'base' || m.category === 'base' || 
      (!m.role && !m.type && !m.category) // اگر role مشخص نباشد، به عنوان base در نظر بگیریم
    );
    const teacherModels = models.filter(m => 
      m.role === 'teacher' || m.type === 'teacher' || m.category === 'teacher'
    );

    return (
      <>
        {/* Base Models */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-900">انتخاب مدل پایه</h3>
          </div>
          <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-2">
            {baseModels.length > 0 ? baseModels.map((model) => (
              <label
                key={model.id}
                className="flex items-start justify-between text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-[10px] px-3 py-2 cursor-pointer transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-900 text-sm">{model.name}</span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-2">
                    {model.size && <span>{model.size}</span>}
                    {model.type && <span className="px-2 py-0.5 rounded bg-violet-100 text-violet-700">{model.type}</span>}
                  </span>
                </div>
                <input
                  type="radio"
                  name="baseModel"
                  value={model.id}
                  checked={selectedBaseModel?.id === model.id}
                  onChange={() => setSelectedBaseModel(model)}
                  className="mt-1"
                />
              </label>
            )) : (
              <p className="text-sm text-slate-500 text-center py-4">مدل پایه‌ای در دسترس نیست</p>
            )}
          </div>
        </div>

        {/* Teacher Models */}
        {teacherModels.length > 0 && (
          <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Brain size={16} className="text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-900">انتخاب مدل معلم (اختیاری)</h3>
            </div>
            <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-2">
              <label className="flex items-start justify-between text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-[10px] px-3 py-2 cursor-pointer transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-900 text-sm">بدون مدل معلم</span>
                  <span className="text-[11px] text-slate-500">آموزش بدون distillation</span>
                </div>
                <input
                  type="radio"
                  name="teacherModel"
                  value=""
                  checked={!selectedTeacherModel}
                  onChange={() => setSelectedTeacherModel(null)}
                  className="mt-1"
                />
              </label>
              {teacherModels.map((model) => (
                <label
                  key={model.id}
                  className="flex items-start justify-between text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-[10px] px-3 py-2 cursor-pointer transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-slate-900 text-sm">{model.name}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-2">
                      {model.size && <span>{model.size}</span>}
                      {model.type && <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">{model.type}</span>}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="teacherModel"
                    value={model.id}
                    checked={selectedTeacherModel?.id === model.id}
                    onChange={() => setSelectedTeacherModel(model)}
                    className="mt-1"
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const handleDownloadDataset = async (datasetId) => {
    // Prevent multiple simultaneous downloads
    if (downloadingDatasets.has(datasetId)) {
      toast.error('دانلود در حال انجام است. لطفاً صبر کنید...');
      return;
    }

    try {
      // Mark as downloading
      setDownloadingDatasets(prev => new Set([...prev, datasetId]));
      setDownloadProgress(prev => ({ ...prev, [datasetId]: 0 }));

      console.log(`[Download] Fetching metadata for: ${datasetId}`);

      // Step 1: Get dataset metadata from backend
      const metadataResponse = await fetch(`http://localhost:3001/api/download/dataset/${datasetId}`);

      if (!metadataResponse.ok) {
        const errorData = await metadataResponse.json();
        throw new Error(errorData.error || 'Failed to fetch dataset metadata');
      }

      const metadata = await metadataResponse.json();

      if (!metadata.success) {
        throw new Error('اطلاعات دیتاست یافت نشد');
      }

      // Check if direct download is available
      if (!metadata.downloadUrl) {
        // No direct download available, show information and redirect
        const infoMessage = `
📊 ${metadata.nameFA || metadata.name}

📝 توضیحات: ${metadata.descriptionFA || metadata.description}
💾 حجم: ${metadata.size}
📁 فرمت: ${metadata.format}
${metadata.details ? `\n🔢 جزئیات: ${JSON.stringify(metadata.details, null, 2)}` : ''}

${metadata.instructions || 'دانلود مستقیم امکان‌پذیر نیست.'}

🌐 منابع:
- وب‌سایت اصلی: ${metadata.viewUrl}
${metadata.alternativeUrl ? `- منبع جایگزین: ${metadata.alternativeUrl}` : ''}

آیا می‌خواهید به منابع دیتاست مراجعه کنید؟
        `.trim();

        if (confirm(infoMessage)) {
          if (metadata.viewUrl) {
            window.open(metadata.viewUrl, '_blank');
          }
          if (metadata.alternativeUrl) {
            window.open(metadata.alternativeUrl, '_blank');
          }
          toast.success('صفحات دیتاست در تب‌های جدید باز شدند');
        }

        // Clear progress
        setDownloadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[datasetId];
          return newProgress;
        });
        setDownloadingDatasets(prev => {
          const newSet = new Set(prev);
          newSet.delete(datasetId);
          return newSet;
        });
        return;
      }

      console.log(`[Download] Metadata received:`, metadata);

      // Step 2: Show confirmation dialog with dataset info
      const confirmMessage = `
📊 ${metadata.nameFA || metadata.name}

📝 توضیحات: ${metadata.descriptionFA || metadata.description}
💾 حجم: ${metadata.size}
📁 فرمت: ${metadata.format}
${metadata.details ? `\n🔢 جزئیات: ${JSON.stringify(metadata.details, null, 2)}` : ''}

🌐 منبع: ${metadata.viewUrl.includes('huggingface') ? 'Hugging Face' : 'GitHub'}

آیا می‌خواهید دانلود را شروع کنید؟
      `.trim();

      if (!confirm(confirmMessage)) {
        setDownloadingDatasets(prev => {
          const newSet = new Set(prev);
          newSet.delete(datasetId);
          return newSet;
        });
        setDownloadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[datasetId];
          return newProgress;
        });
        return;
      }

      // Step 3: Download with progress tracking
      console.log(`[Download] Starting download from: ${metadata.downloadUrl}`);

      let downloadResponse;
      try {
        downloadResponse = await fetch(metadata.downloadUrl);
      } catch (networkError) {
        console.warn(`[Download] Primary URL failed, trying alternative...`);
        // Try alternative URL if available
        if (metadata.alternativeUrl) {
          downloadResponse = await fetch(metadata.alternativeUrl);
        } else {
          throw networkError;
        }
      }

      if (!downloadResponse.ok) {
        // If main download fails, try to redirect to view page
        if (metadata.viewUrl) {
          console.log(`[Download] Download failed, redirecting to view page: ${metadata.viewUrl}`);
          window.open(metadata.viewUrl, '_blank');
          toast.success(`دانلود مستقیم امکان‌پذیر نیست. صفحه دیتاست در تب جدید باز شد.`);
          return;
        }
        throw new Error(`HTTP ${downloadResponse.status}: ${downloadResponse.statusText}`);
      }

      // Get total size for progress calculation
      const contentLength = downloadResponse.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : metadata.sizeBytes;

      let loaded = 0;

      // Create a ReadableStream to track progress
      const reader = downloadResponse.body.getReader();
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        chunks.push(value);
        loaded += value.length;

        // Update progress
        const progress = total ? Math.round((loaded / total) * 100) : 0;
        setDownloadProgress(prev => ({ ...prev, [datasetId]: progress }));

        console.log(`[Download] Progress: ${progress}% (${loaded}/${total} bytes)`);
      }

      // Combine chunks into a single Blob
      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);

      // Step 4: Trigger download
      const link = document.createElement('a');
      link.href = url;
      const fileName = `${datasetId}_${Date.now()}.${metadata.format.toLowerCase()}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      window.URL.revokeObjectURL(url);

      // Set progress to 100%
      setDownloadProgress(prev => ({ ...prev, [datasetId]: 100 }));

      console.log(`[Download] ✅ Complete: ${datasetId}`);

      // Show success message
      setTimeout(() => {
        toast.success(`✅ دانلود با موفقیت انجام شد!\n\n📁 فایل: ${fileName}`);

        // Clear progress after 2 seconds
        setTimeout(() => {
          setDownloadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[datasetId];
            return newProgress;
          });
          setDownloadingDatasets(prev => {
            const newSet = new Set(prev);
            newSet.delete(datasetId);
            return newSet;
          });
        }, 2000);
      }, 500);

    } catch (error) {
      console.error(`[Download] ❌ Error:`, error);

      // Clear progress on error
      setDownloadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[datasetId];
        return newProgress;
      });
      setDownloadingDatasets(prev => {
        const newSet = new Set(prev);
        newSet.delete(datasetId);
        return newSet;
      });

      toast.error(`❌ خطا در دانلود دیتاست\n\n${error.message}\n\nلطفاً دوباره تلاش کنید یا از لینک مستقیم استفاده کنید.`);
    }
  };

  // Background Download Handler
  const handleBackgroundDownload = async (datasetId) => {
    try {
      console.log(`[Background Download] Starting: ${datasetId}`);

      // Get dataset metadata
      const metadataResponse = await fetch(`http://localhost:3001/api/download/dataset/${datasetId}`);

      if (!metadataResponse.ok) {
        throw new Error('Failed to fetch dataset metadata');
      }

      const metadata = await metadataResponse.json();

      if (!metadata.success || !metadata.downloadUrl) {
        toast.error('دانلود پس‌زمینه برای این دیتاست امکان‌پذیر نیست');
        return;
      }

      // Prepare URLs for background download
      const urls = [metadata.downloadUrl];
      if (metadata.alternativeUrls && metadata.alternativeUrls.length > 0) {
        urls.push(...metadata.alternativeUrls);
      }

      // Start background download
      const success = await startBackgroundDownload(datasetId, urls, {
        estimatedSize: metadata.sizeBytes,
        title: `دانلود ${metadata.nameFA || metadata.name}`,
        description: metadata.descriptionFA || metadata.description
      });

      if (success) {
        toast.success(`🚀 دانلود پس‌زمینه شروع شد: ${metadata.nameFA || metadata.name}`);
      } else {
        toast.error('خطا در شروع دانلود پس‌زمینه');
      }

    } catch (error) {
      console.error(`[Background Download] Error:`, error);
      toast.error(`❌ خطا در دانلود پس‌زمینه: ${error.message}`);
    }
  };

  const renderDatasetSelection = () => (
    <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Brain size={16} className="text-white" />
        </div>
        <h3 className="text-base font-bold text-slate-900">انتخاب دیتاست‌ها</h3>
      </div>
      <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-2">
        {datasets.length > 0 ? datasets.map((dataset) => {
          const isSelected = selectedDatasets.some(d => (typeof d === 'object' ? d.id : d) === dataset.id);
          return (
            <label
              key={dataset.id}
              className="flex items-start justify-between text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-[10px] px-3 py-2 cursor-pointer transition-colors"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium text-slate-900 text-sm">{dataset.name}</span>
                <span className="text-[11px] text-slate-500 flex items-center gap-2">
                  {dataset.size && <span>{dataset.size}</span>}
                  {dataset.type && <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">{dataset.type}</span>}
                </span>
              </div>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDatasets(prev => [...prev, dataset]);
                  } else {
                    setSelectedDatasets(prev => prev.filter(d => (typeof d === 'object' ? d.id : d) !== dataset.id));
                  }
                }}
                className="mt-1"
              />
            </label>
          );
        }) : (
          <p className="text-sm text-slate-500 text-center py-4">دیتاستی در دسترس نیست</p>
        )}
      </div>
      {datasets.length > 0 && (
        <div className="pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-600">
            {selectedDatasets.length} دیتاست انتخاب شده
          </p>
        </div>
      )}
    </div>
  );

  const renderDatasetSelectionOld = () => (
    <div className="selection-section">
      <h3 className="section-title">انتخاب دیتاست‌ها (قدیمی)</h3>
      <div className="datasets-grid">
        {datasets.map((dataset) => {
          const isSelected = selectedDatasets.some(d => d.id === dataset.id);
          return (
            <div
              key={dataset.id}
              className={`dataset-card ${isSelected ? 'selected' : ''}`}
              onClick={() => {
                if (isSelected) {
                  setSelectedDatasets(prev => prev.filter(d => d.id !== dataset.id));
                } else {
                  setSelectedDatasets(prev => [...prev, dataset]);
                }
              }}
            >
              <div className="dataset-icon">
                <Brain size={20} />
              </div>
              <h4>{dataset.name}</h4>
              <p className="dataset-info">
                {dataset.size} samples • {dataset.type}
              </p>
              <div className="dataset-actions">
                <div className="flex gap-2">
                  {/* Regular Download Button */}
                  <div className="relative flex-1">
                    <button
                      type="button"
                      className={`download-btn ${downloadingDatasets.has(dataset.id) ? 'downloading' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadDataset(dataset.id);
                      }}
                      disabled={downloadingDatasets.has(dataset.id) || isBackgroundDownloading(dataset.id)}
                      title="دانلود عادی"
                    >
                      {downloadingDatasets.has(dataset.id) ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          در حال دانلود... {downloadProgress[dataset.id] || 0}%
                        </span>
                      ) : isBackgroundDownloading(dataset.id) ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-pulse h-4 w-4 text-blue-500" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          پس‌زمینه
                        </span>
                      ) : (
                        <>
                          <Download size={16} />
                          دانلود
                        </>
                      )}
                    </button>

                    {/* Progress Bar (shown during download) */}
                    {downloadProgress[dataset.id] !== undefined && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
                          style={{ width: `${downloadProgress[dataset.id]}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Background Download Button */}
                  {isBackgroundDownloadSupported && (
                    <button
                      className="download-btn bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBackgroundDownload(dataset.id);
                      }}
                      disabled={downloadingDatasets.has(dataset.id) || isBackgroundDownloading(dataset.id)}
                      title="دانلود پس‌زمینه"
                    >
                      {isBackgroundDownloading(dataset.id) ? (
                        <span className="flex items-center gap-1">
                          <svg className="animate-pulse h-4 w-4" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                            <path d="M12 2v4m0 12v4m10-10h-4M6 12H2" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          پس‌زمینه
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          پس‌زمینه
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ===== MAIN RENDER =====
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

  return (
    <div className="w-full flex flex-col items-stretch bg-[#F5F7FB] text-slate-900 rtl pb-24">
      <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col gap-6">
        {/* Monitoring Strip - نمایش وضعیت در بالای صفحه */}
        {trainingState !== TRAINING_STATE.IDLE && <MonitoringStrip />}

        {/* Header */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Brain size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">آموزش مدل</h1>
              <p className="text-sm text-slate-600">سیستم آموزش پیشرفته با الگوریتم‌های مدرن</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
              trainingState === TRAINING_STATE.IDLE ? 'bg-slate-100 text-slate-700' :
              trainingState === TRAINING_STATE.TRAINING ? 'bg-blue-100 text-blue-700' :
              trainingState === TRAINING_STATE.PAUSED ? 'bg-yellow-100 text-yellow-700' :
              trainingState === TRAINING_STATE.COMPLETED ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {trainingState === TRAINING_STATE.IDLE && <CheckCircle size={16} />}
              {trainingState === TRAINING_STATE.TRAINING && <Loader className="spinner-sm" size={16} />}
              {trainingState === TRAINING_STATE.PAUSED && <Pause size={16} />}
              {trainingState === TRAINING_STATE.COMPLETED && <Award size={16} />}
              {trainingState === TRAINING_STATE.FAILED && <AlertTriangle size={16} />}
              <span>{trainingState === 'idle' ? 'آماده' : trainingState === 'training' ? 'در حال آموزش' : trainingState === 'paused' ? 'متوقف' : trainingState === 'completed' ? 'کامل شده' : 'خطا'}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Model & Dataset Selection */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {renderModelSelection()}
            {renderDatasetSelection()}
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Controls */}
            <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6">
              {renderTrainingControls()}
            </div>

            {/* Progress (when training) */}
            {trainingState !== TRAINING_STATE.IDLE && (
              <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6">
                {renderProgressBar()}
              </div>
            )}

            {/* Metrics Cards */}
            {trainingState !== TRAINING_STATE.IDLE && (
              <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6">
                {renderMetricsCards()}
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6">
              <div className="flex gap-2 border-b border-slate-200 mb-6">
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === 'metrics'
                      ? 'border-violet-500 text-violet-700 bg-violet-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setActiveTab('metrics')}
                >
                  <BarChart3 size={16} />
                  نمودارها
                </button>
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === 'config'
                      ? 'border-violet-500 text-violet-700 bg-violet-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setActiveTab('config')}
                >
                  <Settings size={16} />
                  تنظیمات
                </button>
                <button
                  type="button"
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                    activeTab === 'logs'
                      ? 'border-violet-500 text-violet-700 bg-violet-50'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                  onClick={() => setActiveTab('logs')}
                >
                  <Activity size={16} />
                  Logs
                </button>
              </div>

              <div>
                {activeTab === 'metrics' && renderCharts()}
                {activeTab === 'config' && renderConfiguration()}
                {activeTab === 'logs' && renderLogs()}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Training;

/* REMOVED INLINE STYLES - NOW USING TAILWIND CSS */
/* OLD CSS BELOW (COMMENTED OUT FOR REFERENCE) */
/*
      <style>{`
        .training-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          padding: 24px;
          font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          direction: rtl;
          position: relative;
        }
        
        .training-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.03) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        
        .training-container > * {
          position: relative;
          z-index: 1;
        }
        
        .training-container.loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        .spinner-sm {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .training-header {
          background: white;
          border-radius: 20px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
          border: 2px solid transparent;
          background-image: linear-gradient(white, white), 
                           linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
          position: relative;
          overflow: hidden;
        }
        
        .training-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .header-title {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .header-title h1 {
          margin: 0;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }
        
        .header-title p {
          margin: 0;
          color: #6b7280;
          font-size: 16px;
        }
        
        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
        }
        
        .status-idle {
          background: #e5e7eb;
          color: #6b7280;
        }
        
        .status-training {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .status-paused {
          background: #fef3c7;
          color: #92400e;
        }
        
        .status-completed {
          background: #d1fae5;
          color: #065f46;
        }
        
        .status-failed {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .training-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
        }
        
        .training-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .training-main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .training-panel {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
          border: 2px solid transparent;
          background-image: linear-gradient(white, white), 
                           linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }
        
        .selection-section {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
          border: 2px solid transparent;
          background-image: linear-gradient(white, white), 
                           linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .section-title svg {
          color: #8b5cf6;
        }
        
        .models-grid, .datasets-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .model-card, .dataset-card {
          padding: 20px;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        
        .model-card:hover, .dataset-card:hover {
          border-color: #8b5cf6;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(139, 92, 246, 0.15);
        }
        
        .model-card.selected, .dataset-card.selected {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, #f5f3ff 0%, #faf5ff 100%);
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
        }
        
        .model-icon, .dataset-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border-radius: 12px;
          color: white;
          margin-bottom: 16px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        
        .model-card h4, .dataset-card h4 {
          font-size: 16px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: #1f2937;
          font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .model-description, .dataset-info {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
          font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .model-tags {
          display: flex;
          gap: 8px;
          margin-top: 8px;
        }
        
        .tag {
          padding: 6px 12px;
          background: linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%);
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: #6b21a8;
          border: 1px solid #c084fc;
          font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .model-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .download-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .download-btn:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .download-btn.downloading {
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          cursor: not-allowed;
          opacity: 0.8;
        }

        .download-btn.downloading:hover {
          transform: none;
          box-shadow: none;
        }

        .download-btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .dataset-actions {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }
        
        .training-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        
        .btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          color: white;
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
          font-weight: 700;
          position: relative;
          overflow: hidden;
          border: none;
        }
        
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }
        
        .btn-primary:hover::before {
          left: 100%;
        }
        
        .btn-primary:hover {
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5);
          transform: translateY(-3px);
        }
        
        .btn-primary svg {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .btn-warning {
          background: #fbbf24;
          color: white;
        }
        
        .btn-danger {
          background: #ef4444;
          color: white;
        }
        
        .btn-success {
          background: #10b981;
          color: white;
        }
        
        .btn-secondary {
          background: #6b7280;
          color: white;
        }
        
        .btn-ghost {
          background: transparent;
          border: 2px solid #e5e7eb;
          color: #6b7280;
        }
        
        .btn-lg {
          padding: 16px 32px;
          font-size: 16px;
        }
        
        .btn-sm {
          padding: 6px 12px;
          font-size: 12px;
        }
        
        .progress-section {
          margin-bottom: 16px;
        }
        
        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .progress-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .progress-label {
          font-weight: 600;
        }
        
        .progress-percentage {
          font-weight: 700;
          color: #8b5cf6;
        }
        
        .progress-time {
          display: flex;
          gap: 16px;
        }
        
        .time-item {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6b7280;
          font-size: 14px;
        }
        
        .progress-bar-container {
          height: 16px;
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.1);
        }
        
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .progress-bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }
        
        .progress-message {
          margin-top: 8px;
          font-size: 13px;
          color: #6b7280;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        
        .metric-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          border-radius: 16px;
          border: 1px solid rgba(99, 102, 241, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .metric-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          border-radius: 0 2px 2px 0;
        }
        
        .metric-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.2);
        }
        
        .metric-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .metric-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        
        .metric-label {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }
        
        .metric-value {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .metric-sub {
          font-size: 11px;
          color: #9ca3af;
        }
        
        .tabs {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 24px;
        }
        
        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          background: transparent;
          color: #6b7280;
          font-weight: 600;
          font-size: 14px;
          font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          margin-bottom: -3px;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .tab:hover {
          color: #8b5cf6;
          background: rgba(139, 92, 246, 0.05);
        }
        
        .tab.active {
          color: #8b5cf6;
          border-bottom-color: #8b5cf6;
          background: rgba(139, 92, 246, 0.08);
        }
        
        .tab svg {
          width: 18px;
          height: 18px;
        }
        
        .charts-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .chart-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
        }
        
        .chart-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1f2937;
        }
        
        .logs-container {
          max-height: 500px;
          overflow-y: auto;
        }
        
        .logs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        
        .logs-header h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
        }
        
        .logs-content {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .log-entry {
          display: flex;
          gap: 12px;
          padding: 8px 12px;
          background: #f9fafb;
          border-radius: 6px;
          border-left: 3px solid transparent;
          font-size: 13px;
        }
        
        .log-time {
          color: #9ca3af;
          font-weight: 500;
          min-width: 80px;
        }
        
        .log-message {
          flex: 1;
          color: #374151;
        }
        
        .log-info {
          border-left-color: #3b82f6;
        }
        
        .log-success {
          border-left-color: #10b981;
        }
        
        .log-warning {
          border-left-color: #f59e0b;
        }
        
        .log-error {
          border-left-color: #ef4444;
        }
        
        .logs-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: #9ca3af;
        }
        
        .config-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .config-section {
          background: #f9fafb;
          padding: 20px;
          border-radius: 12px;
        }
        
        .config-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          user-select: none;
        }
        
        .config-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 16px;
          color: #1f2937;
        }
        
        .config-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }
        
        .form-group input,
        .form-group select {
          padding: 10px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #8b5cf6;
        }
        
        .form-group input:disabled,
        .form-group select:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }
        
        .checkbox-group {
          flex-direction: row;
          align-items: center;
        }
        
        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        
        .checkbox-group input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        
        @media (max-width: 1024px) {
          .training-content {
            grid-template-columns: 1fr;
          }
          
          .metrics-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }
          
          .config-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
*/
