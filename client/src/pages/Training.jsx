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

// ===== ENUMS & CONSTANTS =====
const TRAINING_STATE = {
  IDLE: 'idle',
  INITIALIZING: 'initializing',
  TRAINING: 'training',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// ===== MAIN COMPONENT =====
const Training = () => {
  // ===== STATE MANAGEMENT =====
  const [trainingState, setTrainingState] = useState(TRAINING_STATE.IDLE);
  const [currentJobId, setCurrentJobId] = useState(null);

  // Data Selection - Real data from backend
  const [allModels, setAllModels] = useState([]);
  const [teacherModels, setTeacherModels] = useState([]);
  const [baseModels, setBaseModels] = useState([]);
  const [availableDatasets, setAvailableDatasets] = useState([]);
  
  const [selectedBaseModel, setSelectedBaseModel] = useState(null);
  const [selectedDatasets, setSelectedDatasets] = useState({});
  const [selectedTeacherModel, setSelectedTeacherModel] = useState(null);

  // Training Configuration
  const [config, setConfig] = useState({
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
    optimizer: 'adamw',
    warmupSteps: 500,
    validationSplit: 0.2
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
    gradientNorm: 0,
    message: ''
  });

  // History for charts
  const [lossHistory, setLossHistory] = useState([]);
  const [lrHistory, setLrHistory] = useState([]);

  // UI States
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [activeTab, setActiveTab] = useState('metrics');
  const [loading, setLoading] = useState(true);

  // Refs
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
      
      // Load real models from backend
      const modelsResponse = await apiClient.getModels();
      const modelsData = modelsResponse?.data || modelsResponse || [];
      
      // Filter teacher models (models with role='teacher' or type='teacher' or isTeacher=true)
      const teachers = modelsData.filter(m => 
        m.role === 'teacher' || 
        m.type === 'teacher' || 
        m.isTeacher === true
      );
      
      // Filter base models (models with role='base' or type='base' or isBase=true)
      const bases = modelsData.filter(m => 
        m.role === 'base' || 
        m.type === 'base' || 
        m.isBase === true
      );

      // Load real datasets from backend
      const datasetsResponse = await apiClient.getDatasets();
      const datasetsData = datasetsResponse?.data || datasetsResponse || [];

      setAllModels(modelsData);
      setTeacherModels(teachers);
      setBaseModels(bases);
      setAvailableDatasets(datasetsData);

      console.log('Assets loaded:', {
        totalModels: modelsData.length,
        teacherModels: teachers.length,
        baseModels: bases.length,
        datasets: datasetsData.length
      });

    } catch (error) {
      console.error('Load assets error:', error);
      toast.error('خطا در بارگذاری منابع');
    } finally {
      setLoading(false);
    }
  };

  // ===== TRAINING LIFECYCLE =====
  const handleStartTraining = async () => {
    if (!selectedBaseModel) {
      toast.error('لطفاً مدل پایه را انتخاب کنید');
      return;
    }

    const selectedDatasetIds = Object.keys(selectedDatasets).filter(id => selectedDatasets[id]);
    if (selectedDatasetIds.length === 0) {
      toast.error('لطفاً حداقل یک دیتاست انتخاب کنید');
      return;
    }

    try {
      setTrainingState(TRAINING_STATE.INITIALIZING);

      const trainingConfig = {
        baseModel: selectedBaseModel,
        datasets: selectedDatasetIds,
        teacherModel: selectedTeacherModel,
        config: {
          ...config,
          totalSteps: Math.ceil(
            (selectedDatasetIds.length * 1000 / config.batchSize) * config.epochs
          )
        }
      };

      console.log('Starting training with config:', trainingConfig);

      const response = await apiClient.startTraining(trainingConfig);

      if (response?.id) {
        setCurrentJobId(response.id);
        setTrainingState(TRAINING_STATE.TRAINING);
        startTimeRef.current = Date.now();

        resetMetrics();
        toast.success('آموزش با موفقیت شروع شد!');

        // Start monitoring
        startMonitoring(response.id);
      }
    } catch (error) {
      console.error('Start training error:', error);
      const msg = error?.response?.data?.message || error?.message || 'Training start failed';
      toast.error(`خطا در شروع آموزش: ${msg}`);
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
    } catch (error) {
      console.error('Pause error:', error);
      toast.error('خطا در توقف آموزش');
    }
  };

  const handleResumeTraining = async () => {
    if (!currentJobId) return;

    try {
      await apiClient.resumeTraining(currentJobId);
      setTrainingState(TRAINING_STATE.TRAINING);
      toast.success('آموزش از سر گرفته شد');
      startMonitoring(currentJobId);
    } catch (error) {
      console.error('Resume error:', error);
      toast.error('خطا در ادامه آموزش');
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
    } catch (error) {
      console.error('Stop error:', error);
      toast.error('خطا در توقف آموزش');
    }
  };

  // ===== MONITORING =====
  const startMonitoring = (jobId) => {
    // Polling for training status
    intervalRef.current = setInterval(async () => {
      try {
        const status = await apiClient.getTrainingStatus(jobId);
        handleStatusUpdate(status);
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);
  };

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const cleanup = () => {
    stopMonitoring();
  };

  // ===== METRICS HANDLING =====
  const handleStatusUpdate = (status) => {
    if (!status) return;

    const newMetrics = {
      ...metrics,
      progress: status.progress || 0,
      message: status.message || '',
      ...(status.metrics || {}),
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
      setLossHistory(prev => [...prev, ...lossData].slice(-200));
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
  };

  // ===== COMPLETION HANDLERS =====
  const handleTrainingComplete = () => {
    setTrainingState(TRAINING_STATE.COMPLETED);
    stopMonitoring();

    const duration = formatTime((Date.now() - startTimeRef.current) / 1000);
    toast.success(`آموزش با موفقیت به پایان رسید! (${duration})`);
  };

  const handleTrainingFailed = (message) => {
    setTrainingState(TRAINING_STATE.FAILED);
    stopMonitoring();
    toast.error('آموزش با خطا مواجه شد: ' + message);
  };

  const handleSaveModel = async () => {
    if (!currentJobId) return;

    try {
      const modelName = prompt('نام مدل را وارد کنید:');
      if (!modelName) return;

      await apiClient.saveTrainedModel(currentJobId, modelName);
      toast.success('مدل با موفقیت ذخیره شد');
    } catch (error) {
      console.error('Save model error:', error);
      toast.error('خطا در ذخیره مدل');
    }
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
      gradientNorm: 0,
      message: ''
    });

    setLossHistory([]);
    setLrHistory([]);
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
  const renderKPICards = () => {
    const readyModels = allModels.filter(m => m.status === 'ready' || m.downloaded).length;
    const totalDatasets = availableDatasets.length;
    const readyDatasets = availableDatasets.filter(d => d.status === 'ready' || d.downloaded).length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">مدل‌های آماده</p>
              <p className="text-3xl font-bold text-slate-900">{readyModels}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">دیتاست‌های موجود</p>
              <p className="text-3xl font-bold text-slate-900">{totalDatasets}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">دیتاست‌های آماده</p>
              <p className="text-3xl font-bold text-slate-900">{readyDatasets}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSelectionBoxes = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Teacher Model Selection */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-4">
          <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            انتخاب مدل معلم
          </h3>
          <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-2">
            <label className="flex items-start justify-between text-[12px] text-slate-700 bg-slate-50 border border-slate-200/60 rounded-[10px] px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors">
              <span className="font-medium text-slate-900 text-[13px]">بدون مدل معلم</span>
              <input
                type="radio"
                name="teacherModel"
                value=""
                checked={!selectedTeacherModel}
                onChange={() => setSelectedTeacherModel(null)}
                className="mt-1"
              />
            </label>
            {teacherModels.map(tm => (
              <label key={tm.id} className="flex items-start justify-between text-[12px] text-slate-700 bg-slate-50 border border-slate-200/60 rounded-[10px] px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900 text-[13px]">{tm.name}</span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-2">
                    {tm.size && <span>{tm.size}</span>}
                    {tm.note && <span>{tm.note}</span>}
                  </span>
                </div>
                <input
                  type="radio"
                  name="teacherModel"
                  value={tm.id}
                  checked={selectedTeacherModel === tm.id}
                  onChange={() => setSelectedTeacherModel(tm.id)}
                  className="mt-1"
                />
              </label>
            ))}
            {teacherModels.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">هیچ مدل معلمی موجود نیست</p>
            )}
          </div>
        </div>

        {/* Datasets Selection */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-4">
          <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            انتخاب دیتاست‌ها
          </h3>
          <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-2">
            {availableDatasets.map(ds => (
              <label key={ds.id} className="flex items-start justify-between text-[12px] text-slate-700 bg-slate-50 border border-slate-200/60 rounded-[10px] px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900 text-[13px]">{ds.name}</span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-2">
                    {ds.size && <span>{ds.size}</span>}
                    {ds.samples && <span>{ds.samples} نمونه</span>}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={!!selectedDatasets[ds.id]}
                  onChange={(e) => {
                    setSelectedDatasets(prev => ({ ...prev, [ds.id]: e.target.checked }));
                  }}
                  className="mt-1"
                />
              </label>
            ))}
            {availableDatasets.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">هیچ دیتاستی موجود نیست</p>
            )}
          </div>
        </div>

        {/* Base Model Selection */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-4">
          <h3 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            انتخاب مدل پایه
          </h3>
          <div className="max-h-[180px] overflow-y-auto flex flex-col gap-2 pr-2">
            {baseModels.map(bm => (
              <label key={bm.id} className="flex items-start justify-between text-[12px] text-slate-700 bg-slate-50 border border-slate-200/60 rounded-[10px] px-3 py-2 cursor-pointer hover:bg-slate-100 transition-colors">
                <div className="flex flex-col">
                  <span className="font-medium text-slate-900 text-[13px]">{bm.name}</span>
                  <span className="text-[11px] text-slate-500 flex items-center gap-2">
                    {bm.size && <span>{bm.size}</span>}
                  </span>
                </div>
                <input
                  type="radio"
                  name="baseModel"
                  value={bm.id}
                  checked={selectedBaseModel === bm.id}
                  onChange={() => setSelectedBaseModel(bm.id)}
                  className="mt-1"
                />
              </label>
            ))}
            {baseModels.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-4">هیچ مدل پایه‌ای موجود نیست</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTrainingControls = () => {
    const isRunning = trainingState === TRAINING_STATE.TRAINING;
    const isPaused = trainingState === TRAINING_STATE.PAUSED;
    const isIdle = trainingState === TRAINING_STATE.IDLE;
    const isCompleted = trainingState === TRAINING_STATE.COMPLETED;

    return (
      <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">کنترل آموزش</h3>
        <div className="flex flex-wrap gap-3">
          {isIdle && (
            <button
              type="button"
              onClick={handleStartTraining}
              disabled={!selectedBaseModel || Object.keys(selectedDatasets).filter(id => selectedDatasets[id]).length === 0}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={20} />
              شروع آموزش
            </button>
          )}

          {isRunning && (
            <>
              <button
                type="button"
                onClick={handlePauseTraining}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-yellow-500 hover:bg-yellow-600 transition-all"
              >
                <Pause size={20} />
                توقف موقت
              </button>

              <button
                type="button"
                onClick={handleStopTraining}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-all"
              >
                <Square size={20} />
                پایان آموزش
              </button>
            </>
          )}

          {isPaused && (
            <>
              <button
                type="button"
                onClick={handleResumeTraining}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-green-500 hover:bg-green-600 transition-all"
              >
                <Play size={20} />
                ادامه آموزش
              </button>

              <button
                type="button"
                onClick={handleStopTraining}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-all"
              >
                <Square size={20} />
                پایان آموزش
              </button>
            </>
          )}

          {isCompleted && (
            <>
              <button
                type="button"
                onClick={handleSaveModel}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg transition-all"
              >
                <Save size={20} />
                ذخیره مدل
              </button>

              <button
                type="button"
                onClick={() => {
                  setTrainingState(TRAINING_STATE.IDLE);
                  resetMetrics();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all"
              >
                <RefreshCw size={20} />
                آموزش جدید
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderTrainingStatus = () => {
    if (trainingState === TRAINING_STATE.IDLE) return null;

    return (
      <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 mb-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">وضعیت آموزش</h3>
        
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">پیشرفت آموزش</span>
            <span className="font-semibold text-slate-900">{metrics.progress.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${metrics.progress}%` }}
            />
          </div>
          {metrics.message && (
            <p className="text-sm text-slate-600 mt-2">{metrics.message}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
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

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-purple-600" />
              <span className="text-xs text-slate-600">Train Loss</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{metrics.trainLoss.toFixed(4)}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target size={16} className="text-pink-600" />
              <span className="text-xs text-slate-600">Val Loss</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{metrics.valLoss.toFixed(4)}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw size={16} className="text-blue-600" />
              <span className="text-xs text-slate-600">Epoch</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{metrics.epoch} / {config.epochs}</p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-green-600" />
              <span className="text-xs text-slate-600">Throughput</span>
            </div>
            <p className="text-xl font-bold text-slate-900">{metrics.throughput.toFixed(1)} it/s</p>
          </div>
        </div>
      </div>
    );
  };

  // ===== MAIN RENDER =====
  if (loading) {
    return (
      <div className="w-full flex flex-col items-stretch bg-[#F5F7FB] text-slate-900 rtl pb-24">
        <div className="w-full max-w-[1400px] mx-auto px-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">در حال بارگذاری...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-stretch bg-[#F5F7FB] text-slate-900 rtl pb-24">
      <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col gap-6">
        {/* Header */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 mt-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">آموزش مدل</h1>
              <p className="text-sm text-slate-600">سیستم آموزش پیشرفته با الگوریتم‌های مدرن</p>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        {renderKPICards()}

        {/* Selection Boxes */}
        {renderSelectionBoxes()}

        {/* Training Controls */}
        {renderTrainingControls()}

        {/* Training Status */}
        {renderTrainingStatus()}
      </div>
    </div>
  );
};

export default Training;
