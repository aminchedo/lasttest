import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, Pause, Square, RefreshCw, Save, Download, Upload,
  Brain, TrendingUp, Target, Zap, Clock, AlertTriangle,
  CheckCircle, Loader, Settings, Activity, Award, Timer,
  Gauge, Info, Sliders, Shield, Database, Server, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import apiClient from '../api/client';
import MonitoringStrip from './MonitoringStrip';
import AutoTuner from './AutoTuner';
import CheckpointManager from './CheckpointManager';

// ===== ENUMS & CONSTANTS =====
const TRAINING_STATE = {
  IDLE: 'idle',
  INITIALIZING: 'initializing',
  TRAINING: 'training',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed',
  RECOVERING: 'recovering',
  TUNING: 'tuning'
};

const OPTIMIZER_TYPES = {
  ADAM: 'adam',
  ADAMW: 'adamw',
  SGD: 'sgd',
  RMSPROP: 'rmsprop',
  LAMB: 'lamb',
  ADAFACTOR: 'adafactor'
};

const LR_SCHEDULER_TYPES = {
  CONSTANT: 'constant',
  LINEAR: 'linear',
  COSINE: 'cosine',
  COSINE_WITH_RESTARTS: 'cosine_with_restarts',
  EXPONENTIAL: 'exponential',
  STEP: 'step',
  POLYNOMIAL: 'polynomial',
  INVERSE_SQRT: 'inverse_sqrt'
};

// ===== MAIN COMPONENT =====
const TrainingAdvanced = () => {
  // ===== STATE MANAGEMENT =====
  const [trainingState, setTrainingState] = useState(TRAINING_STATE.IDLE);
  const [currentJobId, setCurrentJobId] = useState(null);

  // Data Selection
  const [models, setModels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [selectedBaseModel, setSelectedBaseModel] = useState(null);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [customModelName, setCustomModelName] = useState('');

  // Advanced Configuration
  const [config, setConfig] = useState({
    // Basic
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
    optimizer: OPTIMIZER_TYPES.ADAMW,

    // Advanced
    lrScheduler: LR_SCHEDULER_TYPES.COSINE_WITH_RESTARTS,
    warmupSteps: 500,
    warmupRatio: 0.1,
    weightDecay: 0.01,
    gradientAccumulationSteps: 4,
    maxGradNorm: 1.0,

    // Performance Optimization
    useMultiGPU: true,
    enableGradientCheckpointing: true,
    enableCompilation: true, // torch.compile or similar
    numWorkers: 4,
    pinMemory: true,
    prefetchFactor: 2,

    // Fault Tolerance
    enableAutoRecovery: true,
    saveCheckpointEvery: 100,
    keepTopCheckpoints: 5,
    maxRecoveryAttempts: 3,
    healthCheckInterval: 30, // seconds

    // Auto-tuning
    enableAutoTuning: false,
    tuningBudget: 20, // number of trials
    tuningMetric: 'val_loss',

    // Early Stopping
    enableEarlyStopping: true,
    earlyStoppingPatience: 5,
    earlyStoppingThreshold: 0.0001,

    // Mixed Precision
    mixedPrecision: true,
    gradScaler: true,

    // Data
    validationSplit: 0.2,
    evaluateEvery: 50,

    // Model Saving
    modelSaveFormat: 'safetensors', // or 'pytorch'
    saveOptimizer: true,
    saveFullState: true
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
    memoryUsage: 0,
    gpuUtilization: 0,
    recoveryAttempts: 0,
    lastCheckpoint: null,
    message: ''
  });

  // History
  const [metricsHistory, setMetricsHistory] = useState([]);
  const [lossHistory, setLossHistory] = useState([]);
  const [lrHistory, setLrHistory] = useState([]);

  // Checkpoints
  const [checkpoints, setCheckpoints] = useState([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);

  // Auto-tuning
  const [tuningResults, setTuningResults] = useState([]);
  const [showAutoTuner, setShowAutoTuner] = useState(false);

  // UI States
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [showPerformanceConfig, setShowPerformanceConfig] = useState(false);
  const [showFaultToleranceConfig, setShowFaultToleranceConfig] = useState(false);
  const [activeTab, setActiveTab] = useState('metrics');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Refs
  const wsRef = useRef(null);
  const intervalRef = useRef(null);
  const healthCheckRef = useRef(null);
  const metricsBufferRef = useRef([]);
  const startTimeRef = useRef(null);
  const recoveryAttemptRef = useRef(0);

  // ===== LIFECYCLE =====
  useEffect(() => {
    loadAssets();
    loadCheckpoints();
    return cleanup;
  }, []);

  useEffect(() => {
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

  const loadCheckpoints = async () => {
    try {
      const checkpointsRes = await apiClient.getCheckpoints();
      setCheckpoints(checkpointsRes || []);
    } catch (error) {
      console.error('Load checkpoints error:', error);
    }
  };

  // ===== AUTO-TUNING =====
  const handleStartAutoTuning = async () => {
    if (!selectedBaseModel || selectedDatasets.length === 0) {
      toast.error('لطفاً مدل و دیتاست را انتخاب کنید');
      return;
    }

    setTrainingState(TRAINING_STATE.TUNING);
    setShowAutoTuner(true);
    addLog('شروع Auto-tuning...', 'info');

    try {
      const tuningConfig = {
        baseModel: selectedBaseModel,
        datasets: selectedDatasets,
        budget: config.tuningBudget,
        metric: config.tuningMetric,
        searchSpace: {
          learningRate: [1e-5, 1e-2],
          batchSize: [16, 32, 64, 128],
          optimizer: Object.values(OPTIMIZER_TYPES),
          lrScheduler: Object.values(LR_SCHEDULER_TYPES),
          warmupSteps: [100, 500, 1000],
          weightDecay: [0, 0.01, 0.1]
        }
      };

      const results = await apiClient.startAutoTuning(tuningConfig);
      setTuningResults(results);

      // Apply best configuration
      if (results.bestConfig) {
        setConfig(prev => ({ ...prev, ...results.bestConfig }));
        toast.success('بهترین تنظیمات اعمال شد!');
        addLog(`بهترین config پیدا شد: ${JSON.stringify(results.bestConfig)}`, 'success');
      }

      setTrainingState(TRAINING_STATE.IDLE);
    } catch (error) {
      console.error('Auto-tuning error:', error);
      toast.error('خطا در Auto-tuning');
      addLog(`خطا در Auto-tuning: ${error.message}`, 'error');
      setTrainingState(TRAINING_STATE.IDLE);
    }
  };

  // ===== TRAINING LIFECYCLE =====
  const handleStartTraining = async (fromCheckpoint = null) => {
    if (!selectedBaseModel && !fromCheckpoint) {
      toast.error('لطفاً مدل پایه را انتخاب کنید');
      return;
    }

    if (selectedDatasets.length === 0) {
      toast.error('لطفاً حداقل یک دیتاست انتخاب کنید');
      return;
    }

    if (!customModelName) {
      toast.error('لطفاً نام مدل سفارشی را وارد کنید');
      return;
    }

    try {
      setTrainingState(TRAINING_STATE.INITIALIZING);
      addLog('در حال آماده‌سازی برای شروع آموزش...', 'info');

      const trainingConfig = {
        baseModel: fromCheckpoint ? null : selectedBaseModel,
        checkpointPath: fromCheckpoint,
        datasets: selectedDatasets,
        modelName: customModelName,
        config: {
          ...config,
          totalSteps: Math.ceil(
            (selectedDatasets.reduce((acc, ds) => acc + (ds.size || 1000), 0) / config.batchSize) *
            config.epochs /
            config.gradientAccumulationSteps
          )
        }
      };

      const response = await apiClient.startTraining(trainingConfig);

      if (response?.id) {
        setCurrentJobId(response.id);
        setTrainingState(TRAINING_STATE.TRAINING);
        startTimeRef.current = Date.now();
        recoveryAttemptRef.current = 0;

        resetMetrics();

        toast.success('آموزش با موفقیت شروع شد!');
        addLog(`آموزش شروع شد - Job ID: ${response.id}`, 'success');

        startMonitoring(response.id);

        if (config.enableAutoRecovery) {
          startHealthCheck(response.id);
        }
      }
    } catch (error) {
      console.error('Start training error:', error);
      toast.error('خطا در شروع آموزش: ' + error.message);
      addLog(`خطا در شروع: ${error.message}`, 'error');
      setTrainingState(TRAINING_STATE.IDLE);
    }
  };

  const handleResumeFromCheckpoint = async () => {
    if (!selectedCheckpoint) {
      toast.error('لطفاً checkpoint را انتخاب کنید');
      return;
    }

    addLog(`ادامه آموزش از checkpoint: ${selectedCheckpoint.name}`, 'info');
    await handleStartTraining(selectedCheckpoint.path);
  };

  const handlePauseTraining = async () => {
    if (!currentJobId) return;

    try {
      await apiClient.pauseTraining(currentJobId);
      setTrainingState(TRAINING_STATE.PAUSED);
      stopMonitoring();
      stopHealthCheck();

      toast.info('آموزش متوقف شد');
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
      if (config.enableAutoRecovery) {
        startHealthCheck(currentJobId);
      }
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
      stopHealthCheck();

      toast.warning('آموزش کامل متوقف شد');
      addLog('آموزش به صورت کامل متوقف شد', 'warning');
    } catch (error) {
      console.error('Stop error:', error);
      toast.error('خطا در توقف آموزش');
      addLog(`خطا در توقف: ${error.message}`, 'error');
    }
  };

  // ===== FAULT TOLERANCE =====
  const startHealthCheck = (jobId) => {
    healthCheckRef.current = setInterval(async () => {
      try {
        const health = await apiClient.checkTrainingHealth(jobId);

        if (!health.healthy) {
          addLog(`مشکل در سلامت آموزش: ${health.reason}`, 'error');

          if (config.enableAutoRecovery &&
            recoveryAttemptRef.current < config.maxRecoveryAttempts) {
            await attemptRecovery(jobId);
          } else {
            handleTrainingFailed('Maximum recovery attempts reached');
          }
        }
      } catch (error) {
        console.error('Health check error:', error);
      }
    }, config.healthCheckInterval * 1000);
  };

  const stopHealthCheck = () => {
    if (healthCheckRef.current) {
      clearInterval(healthCheckRef.current);
      healthCheckRef.current = null;
    }
  };

  const attemptRecovery = async (jobId) => {
    setTrainingState(TRAINING_STATE.RECOVERING);
    recoveryAttemptRef.current += 1;

    addLog(`تلاش برای بازیابی (${recoveryAttemptRef.current}/${config.maxRecoveryAttempts})...`, 'warning');
    toast.warning(`در حال بازیابی خودکار... (تلاش ${recoveryAttemptRef.current})`);

    try {
      // Get last checkpoint
      const lastCheckpoint = await apiClient.getLastCheckpoint(jobId);

      if (lastCheckpoint) {
        // Resume from checkpoint
        await apiClient.resumeFromCheckpoint(jobId, lastCheckpoint.path);
        setTrainingState(TRAINING_STATE.TRAINING);

        setMetrics(prev => ({
          ...prev,
          recoveryAttempts: recoveryAttemptRef.current,
          lastCheckpoint: lastCheckpoint.name
        }));

        addLog(`بازیابی موفق از checkpoint: ${lastCheckpoint.name}`, 'success');
        toast.success('آموزش با موفقیت بازیابی شد!');
      } else {
        throw new Error('No checkpoint found for recovery');
      }
    } catch (error) {
      console.error('Recovery error:', error);
      addLog(`خطا در بازیابی: ${error.message}`, 'error');

      if (recoveryAttemptRef.current >= config.maxRecoveryAttempts) {
        handleTrainingFailed('Recovery failed after maximum attempts');
      }
    }
  };

  // ===== MONITORING =====
  const startMonitoring = (jobId) => {
    try {
      wsRef.current = apiClient.subscribeToTraining(jobId, handleMetricsUpdate);
      addLog('اتصال WebSocket برقرار شد', 'success');
    } catch (error) {
      console.error('WebSocket error:', error);
      addLog('خطا در اتصال WebSocket، استفاده از polling', 'warning');
    }

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
    stopHealthCheck();
  };

  // ===== METRICS HANDLING =====
  const handleMetricsUpdate = useCallback((data) => {
    const newMetrics = {
      ...metrics,
      ...data,
      timeElapsed: startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0
    };

    if (newMetrics.progress > 0) {
      const estimatedTotal = (newMetrics.timeElapsed / newMetrics.progress) * 100;
      newMetrics.timeRemaining = estimatedTotal - newMetrics.timeElapsed;
    }

    setMetrics(newMetrics);
    metricsBufferRef.current.push(newMetrics);

    if (data.message) {
      addLog(data.message, data.type || 'info');
    }

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

    if (status.status === 'completed') {
      handleTrainingComplete();
    } else if (status.status === 'failed') {
      handleTrainingFailed(status.message || 'Unknown error');
    }
  };

  const updateChartsData = (newData) => {
    const lossData = newData
      .filter(d => d.trainLoss || d.valLoss)
      .map(d => ({
        step: d.step,
        trainLoss: d.trainLoss,
        valLoss: d.valLoss,
        epoch: d.epoch
      }));

    if (lossData.length > 0) {
      setLossHistory(prev => [...prev, ...lossData].slice(-200));
    }

    const lrData = newData
      .filter(d => d.learningRate)
      .map(d => ({
        step: d.step,
        lr: d.learningRate
      }));

    if (lrData.length > 0) {
      setLrHistory(prev => [...prev, ...lrData].slice(-200));
    }

    const metricsData = newData
      .filter(d => d.throughput || d.gradientNorm)
      .map(d => ({
        step: d.step,
        throughput: d.throughput,
        gradientNorm: d.gradientNorm,
        memoryUsage: d.memoryUsage,
        gpuUtilization: d.gpuUtilization
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
        return {
          ...prev,
          bestValLoss: valLoss,
          earlyStoppingCounter: 0
        };
      } else {
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
    stopHealthCheck();

    const duration = formatTime((Date.now() - startTimeRef.current) / 1000);

    toast.success(`آموزش با موفقیت به پایان رسید! (${duration})`);
    addLog(`آموزش با موفقیت کامل شد - مدت زمان: ${duration}`, 'success');

    loadCheckpoints(); // Reload checkpoints
  };

  const handleTrainingFailed = (message) => {
    setTrainingState(TRAINING_STATE.FAILED);
    stopMonitoring();
    stopHealthCheck();

    toast.error('آموزش با خطا مواجه شد: ' + message);
    addLog(`آموزش با خطا متوقف شد: ${message}`, 'error');
  };

  const handleSaveModel = async () => {
    if (!currentJobId) return;

    try {
      const finalModelName = customModelName || prompt('نام مدل را وارد کنید:');
      if (!finalModelName) return;

      await apiClient.saveTrainedModel(currentJobId, {
        name: finalModelName,
        format: config.modelSaveFormat,
        saveOptimizer: config.saveOptimizer,
        saveFullState: config.saveFullState
      });

      toast.success('مدل با موفقیت ذخیره شد');
      addLog(`مدل با نام "${finalModelName}" ذخیره شد`, 'success');

      loadCheckpoints();
    } catch (error) {
      console.error('Save model error:', error);
      toast.error('خطا در ذخیره مدل');
      addLog(`خطا در ذخیره مدل: ${error.message}`, 'error');
    }
  };

  const handleExportMetrics = () => {
    const data = {
      modelName: customModelName,
      config,
      metrics,
      lossHistory,
      lrHistory,
      metricsHistory,
      logs,
      checkpoints: checkpoints.map(c => c.name)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `training-metrics-${customModelName || currentJobId || Date.now()}.json`;
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
      memoryUsage: 0,
      gpuUtilization: 0,
      recoveryAttempts: 0,
      lastCheckpoint: null,
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
      ...prev.slice(0, 99)
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
    const isTuning = trainingState === TRAINING_STATE.TUNING;
    const isRecovering = trainingState === TRAINING_STATE.RECOVERING;

    return (
      <div className="training-controls">
        {isIdle && (
          <>
            <motion.button
              onClick={handleStartTraining}
              className="btn btn-primary btn-lg"
              disabled={!selectedBaseModel || selectedDatasets.length === 0 || !customModelName}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              <span>شروع آموزش جدید</span>
            </motion.button>

            {checkpoints.length > 0 && (
              <motion.button
                onClick={handleResumeFromCheckpoint}
                className="btn btn-secondary"
                disabled={!selectedCheckpoint}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload size={20} />
                <span>ادامه از Checkpoint</span>
              </motion.button>
            )}

            {config.enableAutoTuning && (
              <motion.button
                onClick={handleStartAutoTuning}
                className="btn btn-gradient"
                disabled={!selectedBaseModel || selectedDatasets.length === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sliders size={20} />
                <span>Auto-Tuning</span>
              </motion.button>
            )}
          </>
        )}

        {isRunning && (
          <>
            <motion.button
              onClick={handlePauseTraining}
              className="btn btn-warning"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pause size={20} />
              <span>توقف موقت</span>
            </motion.button>

            <motion.button
              onClick={handleStopTraining}
              className="btn btn-danger"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Square size={20} />
              <span>پایان آموزش</span>
            </motion.button>
          </>
        )}

        {isPaused && (
          <>
            <motion.button
              onClick={handleResumeTraining}
              className="btn btn-success"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              <span>ادامه آموزش</span>
            </motion.button>

            <motion.button
              onClick={handleStopTraining}
              className="btn btn-danger"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Square size={20} />
              <span>پایان آموزش</span>
            </motion.button>
          </>
        )}

        {isCompleted && (
          <>
            <motion.button
              onClick={handleSaveModel}
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save size={20} />
              <span>ذخیره مدل</span>
            </motion.button>

            <motion.button
              onClick={handleExportMetrics}
              className="btn btn-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={20} />
              <span>Export متریک‌ها</span>
            </motion.button>

            <motion.button
              onClick={() => {
                setTrainingState(TRAINING_STATE.IDLE);
                resetMetrics();
              }}
              className="btn btn-ghost"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={20} />
              <span>آموزش جدید</span>
            </motion.button>
          </>
        )}

        {(isTuning || isRecovering) && (
          <div className="btn btn-ghost" style={{ cursor: 'default' }}>
            <Loader className="spinner" size={20} />
            <span>{isTuning ? 'در حال Auto-Tuning...' : 'در حال بازیابی...'}</span>
          </div>
        )}
      </div>
    );
  };

  // ... (ادامه رندر functions در پاسخ بعدی به دلیل محدودیت طول)

  // Simplified render for length
  if (loading) {
    return (
      <div className="training-container loading">
        <Loader className="spinner" size={48} />
        <p>در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div className="training-container">
      {trainingState !== TRAINING_STATE.IDLE && (
        <MonitoringStrip
          trainingStatus={trainingState}
          trainingMetrics={metrics}
        />
      )}

      <div className="training-header">
        <div className="header-content">
          <div className="header-title">
            <Brain size={32} />
            <div>
              <h1>آموزش پیشرفته مدل</h1>
              <p>سیستم آموزش production-ready با Auto-tuning و Fault Tolerance</p>
            </div>
          </div>

          <div className="header-status">
            <div className={`status-badge status-${trainingState}`}>
              {trainingState === TRAINING_STATE.TRAINING && <Loader className="spinner-sm" size={16} />}
              {trainingState === TRAINING_STATE.RECOVERING && <Shield size={16} />}
              <span>{trainingState.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="training-content">
        {/* Model Name Input */}
        <div className="training-panel">
          <h3 className="section-title">نام مدل سفارشی</h3>
          <input
            type="text"
            value={customModelName}
            onChange={(e) => setCustomModelName(e.target.value)}
            placeholder="مثال: my-custom-gpt2-persian"
            className="model-name-input"
            disabled={trainingState !== TRAINING_STATE.IDLE}
          />
          <p className="text-sm text-gray-600 mt-2">
            این نام برای ذخیره و بازیابی مدل استفاده می‌شود
          </p>
        </div>

        {/* Controls */}
        <div className="training-panel">
          {renderTrainingControls()}
        </div>

        {/* Checkpoint Manager */}
        {checkpoints.length > 0 && (
          <CheckpointManager
            checkpoints={checkpoints}
            selectedCheckpoint={selectedCheckpoint}
            onSelect={setSelectedCheckpoint}
            onDelete={async (id) => {
              await apiClient.deleteCheckpoint(id);
              loadCheckpoints();
            }}
          />
        )}

        {/* Auto-Tuner Modal */}
        {showAutoTuner && (
          <AutoTuner
            results={tuningResults}
            onClose={() => setShowAutoTuner(false)}
          />
        )}

        {/* Rest of the UI... */}
      </div>

      <style>{`
        /* Same styles as before with additions */
        .btn-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .model-name-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        .model-name-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
        
        .model-name-input:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default TrainingAdvanced;
