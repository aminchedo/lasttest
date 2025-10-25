// Training Wizard Component - Modern Step-by-Step Interface
import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Square, RefreshCw, Download, Save,
  Brain, Database, Cpu, Clock, Target, TrendingUp,
  AlertCircle, CheckCircle, Loader, Settings,
  ChevronDown, ChevronUp, Zap, BarChart3,
  ArrowRight, ArrowLeft, Upload, FileText, Eye, Volume2,
  Sparkles, Layers, Activity, Award, Timer, Gauge
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import apiClient from '../api/client';

const Training = () => {
  // Wizard States
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps] = useState(4);

  // Data States
  const [models, setModels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [selectedBaseModel, setSelectedBaseModel] = useState(null);
  const [selectedDatasets, setSelectedDatasets] = useState([]);
  const [selectedTeacherModel, setSelectedTeacherModel] = useState(null);

  // Training States
  const [trainingStatus, setTrainingStatus] = useState('idle');
  const [currentJobId, setCurrentJobId] = useState(null);
  const [trainingMetrics, setTrainingMetrics] = useState({
    epoch: 0,
    trainLoss: 0,
    valLoss: 0,
    learningRate: 0.001,
    throughput: 0,
    progress: 0,
    message: ''
  });

  // Configuration States
  const [config, setConfig] = useState({
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
    optimizer: 'adam',
    warmupSteps: 100,
    validationSplit: 0.2
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(true);

  // UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModelType, setSelectedModelType] = useState('all');
  const [selectedDatasetType, setSelectedDatasetType] = useState('all');

  // Pagination States
  const [currentModelPage, setCurrentModelPage] = useState(1);
  const [currentDatasetPage, setCurrentDatasetPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Refs
  const intervalRef = useRef(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    loadAssets();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);

      // بارگذاری مدل‌ها و دیتاست‌ها
      const [modelsRes, datasetsRes] = await Promise.all([
        apiClient.getCatalogModels(),
        apiClient.getCatalogDatasets()
      ]);

      setModels(modelsRes);
      setDatasets(datasetsRes);

    } catch (error) {
      console.error('Load assets error:', error);
      toast.error('خطا در بارگذاری منابع');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTraining = async () => {
    if (!selectedBaseModel) {
      toast.error('لطفاً مدل پایه را انتخاب کنید');
      return;
    }

    if (selectedDatasets.length === 0) {
      toast.error('لطفاً حداقل یک دیتاست انتخاب کنید');
      return;
    }

    try {
      const trainingConfig = {
        baseModel: selectedBaseModel,
        datasets: selectedDatasets,
        teacherModel: selectedTeacherModel,
        config: {
          epochs: config.epochs,
          batchSize: config.batchSize,
          learningRate: config.learningRate,
          optimizer: config.optimizer,
          warmupSteps: config.warmupSteps
        }
      };

      const response = await apiClient.startTraining(trainingConfig);

      if (response.id) {
        setCurrentJobId(response.id);
        setTrainingStatus('training');
        toast.success('آموزش شروع شد');

        // شروع monitoring
        startMonitoring(response.id);
      }
    } catch (error) {
      console.error('Start training error:', error);
      toast.error('خطا در شروع آموزش');
    }
  };

  const startMonitoring = (jobId) => {
    // Subscribe to WebSocket updates
    unsubscribeRef.current = apiClient.subscribeToTraining(jobId, (data) => {
      updateMetrics(data);
    });

    // Polling fallback
    intervalRef.current = setInterval(async () => {
      try {
        const status = await apiClient.getTrainingStatus(jobId);
        updateFromStatus(status);
      } catch (error) {
        console.error('Monitoring error:', error);
      }
    }, 2000);
  };

  const updateFromStatus = (status) => {
    if (status) {
      setTrainingMetrics({
        progress: status.progress || 0,
        message: status.message || '',
        epoch: status.metrics?.epoch || 0,
        trainLoss: status.metrics?.trainLoss || 0,
        valLoss: status.metrics?.valLoss || 0,
        learningRate: status.metrics?.learningRate || config.learningRate,
        throughput: status.metrics?.throughput || 0
      });

      if (status.status === 'completed') {
        handleTrainingComplete();
      } else if (status.status === 'failed') {
        handleTrainingFailed(status.message);
      }
    }
  };

  const updateMetrics = (data) => {
    setTrainingMetrics(prev => ({
      ...prev,
      ...data
    }));
  };

  const handlePauseTraining = async () => {
    if (!currentJobId) return;

    try {
      await apiClient.stopTraining(currentJobId);
      setTrainingStatus('paused');
      toast.info('آموزش متوقف شد');

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } catch (error) {
      console.error('Pause error:', error);
      toast.error('خطا در توقف آموزش');
    }
  };

  const handleResumeTraining = async () => {
    if (!currentJobId) return;

    try {
      await apiClient.resumeTraining(currentJobId);
      setTrainingStatus('training');
      toast.info('آموزش از سر گرفته شد');
      startMonitoring(currentJobId);
    } catch (error) {
      console.error('Resume error:', error);
      toast.error('خطا در ادامه آموزش');
    }
  };

  const handleStopTraining = async () => {
    if (!currentJobId) return;

    try {
      await apiClient.stopTraining(currentJobId);
      setTrainingStatus('idle');
      setCurrentJobId(null);
      setTrainingMetrics({
        epoch: 0,
        trainLoss: 0,
        valLoss: 0,
        learningRate: config.learningRate,
        throughput: 0,
        progress: 0,
        message: ''
      });

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }

      toast.warning('آموزش متوقف شد');
    } catch (error) {
      console.error('Stop error:', error);
      toast.error('خطا در توقف آموزش');
    }
  };

  const handleSaveModel = async () => {
    if (!currentJobId) return;

    const modelName = prompt('نام مدل را وارد کنید:');
    if (!modelName) return;

    try {
      const response = await apiClient.saveModel(currentJobId, modelName);
      toast.success(`مدل در ${response.modelPath} ذخیره شد`);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('خطا در ذخیره مدل');
    }
  };

  const handleTrainingComplete = () => {
    setTrainingStatus('completed');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    toast.success('آموزش با موفقیت تکمیل شد!', {
      duration: 5000,
      icon: '🎉'
    });
  };

  const handleTrainingFailed = (message) => {
    setTrainingStatus('failed');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    toast.error(`آموزش با خطا مواجه شد: ${message}`);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Wizard Navigation Functions
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    setCurrentStep(step);
  };

  // Filter Functions
  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedModelType === 'all' || model.type === selectedModelType;
    return matchesSearch && matchesType;
  });

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedDatasetType === 'all' || dataset.type === selectedDatasetType;
    return matchesSearch && matchesType;
  });

  // Pagination Functions
  const getPaginatedModels = () => {
    const startIndex = (currentModelPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredModels.slice(startIndex, endIndex);
  };

  const getPaginatedDatasets = () => {
    const startIndex = (currentDatasetPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDatasets.slice(startIndex, endIndex);
  };

  const getTotalModelPages = () => Math.ceil(filteredModels.length / itemsPerPage);
  const getTotalDatasetPages = () => Math.ceil(filteredDatasets.length / itemsPerPage);

  const handleModelPageChange = (page) => {
    setCurrentModelPage(page);
  };

  const handleDatasetPageChange = (page) => {
    setCurrentDatasetPage(page);
  };

  // Step Validation
  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return true; // Allow proceeding even without model selection
      case 2:
        return selectedDatasets.length > 0;
      case 3:
        return true; // Configuration is optional
      case 4:
        return trainingStatus === 'idle';
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="training-wizard-loading">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="loading-spinner-large"></div>
            <p className="mt-4 text-gray-600 font-medium">در حال بارگذاری منابع...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="training-wizard">
      {/* Wizard Header */}
      <div className="wizard-header">
        <div className="wizard-title">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="text-purple-600" size={32} />
            آموزش مدل‌های هوش مصنوعی
          </h1>
          <p className="text-gray-500 mt-2">
            راهنمای گام‌به‌گام برای آموزش مدل‌های فارسی
          </p>
        </div>

        {/* Step Progress */}
        <div className="wizard-progress">
          <div className="progress-steps">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <motion.div
                  className={`step-circle ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                  onClick={() => goToStep(step)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentStep > step ? (
                    <CheckCircle size={16} />
                  ) : (
                    <span>{step}</span>
                  )}
                </motion.div>
                {step < 4 && (
                  <div className={`step-line ${currentStep > step ? 'completed' : ''}`} />
                )}
              </div>
            ))}
          </div>
          <div className="step-labels">
            <span className={currentStep === 1 ? 'active' : ''}>انتخاب مدل</span>
            <span className={currentStep === 2 ? 'active' : ''}>انتخاب داده</span>
            <span className={currentStep === 3 ? 'active' : ''}>پیکربندی</span>
            <span className={currentStep === 4 ? 'active' : ''}>آموزش</span>
          </div>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="wizard-content-layout">
        {/* Left Sidebar - Training Controls */}
        <div className="training-sidebar">
          {/* Training Summary */}
          <div className="training-summary-card">
            <h3 className="summary-title">
              <Brain size={20} />
              خلاصه آموزش
            </h3>
            <div className="summary-content">
              <div className="summary-item">
                <span className="summary-label">مدل پایه:</span>
                <span className="summary-value">
                  {models.find(m => m.id === selectedBaseModel)?.name || 'انتخاب نشده'}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">دیتاست‌ها:</span>
                <span className="summary-value">
                  {selectedDatasets.length} دیتاست انتخاب شده
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Epochs:</span>
                <span className="summary-value">{config.epochs}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Batch Size:</span>
                <span className="summary-value">{config.batchSize}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Learning Rate:</span>
                <span className="summary-value">{config.learningRate}</span>
              </div>
            </div>
          </div>

          {/* Training Controls */}
          <div className="training-controls-card">
            <h3 className="controls-title">
              <Play size={20} />
              کنترل آموزش
            </h3>
            <div className="controls-content">
              {trainingStatus === 'idle' && (
                <motion.button
                  onClick={handleStartTraining}
                  className="start-training-btn"
                  disabled={!selectedBaseModel || selectedDatasets.length === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play size={20} />
                  شروع آموزش
                </motion.button>
              )}

              {trainingStatus === 'training' && (
                <div className="training-active-controls">
                  <motion.button
                    onClick={handlePauseTraining}
                    className="pause-training-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Pause size={20} />
                    توقف موقت
                  </motion.button>
                  <motion.button
                    onClick={handleStopTraining}
                    className="stop-training-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Square size={20} />
                    پایان آموزش
                  </motion.button>
                </div>
              )}

              {trainingStatus === 'paused' && (
                <div className="training-paused-controls">
                  <motion.button
                    onClick={handleResumeTraining}
                    className="resume-training-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Play size={20} />
                    ادامه آموزش
                  </motion.button>
                  <motion.button
                    onClick={handleStopTraining}
                    className="stop-training-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Square size={20} />
                    پایان آموزش
                  </motion.button>
                </div>
              )}

              {trainingStatus === 'completed' && (
                <div className="training-completed-controls">
                  <motion.button
                    onClick={handleSaveModel}
                    className="save-model-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save size={20} />
                    ذخیره مدل
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setTrainingStatus('idle');
                      setCurrentStep(1);
                      setSelectedBaseModel(null);
                      setSelectedDatasets([]);
                      setTrainingMetrics({
                        epoch: 0,
                        trainLoss: 0,
                        valLoss: 0,
                        learningRate: config.learningRate,
                        throughput: 0,
                        progress: 0,
                        message: ''
                      });
                    }}
                    className="new-training-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw size={20} />
                    آموزش جدید
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* Training Metrics */}
          {trainingStatus !== 'idle' && (
            <motion.div
              className="training-metrics-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="metrics-title">
                <BarChart3 size={20} />
                معیارهای آموزش
              </h3>

              {/* Progress Bar */}
              <div className="progress-section">
                <div className="progress-header">
                  <span>پیشرفت</span>
                  <span>{trainingMetrics.progress}%</span>
                </div>
                <div className="progress-bar-container">
                  <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${trainingMetrics.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="progress-message">
                  {trainingMetrics.message}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">
                    <TrendingUp size={16} className="text-red-500" />
                  </div>
                  <div className="metric-content">
                    <span className="metric-label">Train Loss</span>
                    <span className="metric-value">
                      {trainingMetrics.trainLoss?.toFixed(4) || '0.0000'}
                    </span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">
                    <Target size={16} className="text-green-500" />
                  </div>
                  <div className="metric-content">
                    <span className="metric-label">Val Loss</span>
                    <span className="metric-value">
                      {trainingMetrics.valLoss?.toFixed(4) || '0.0000'}
                    </span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">
                    <RefreshCw size={16} className="text-blue-500" />
                  </div>
                  <div className="metric-content">
                    <span className="metric-label">Epoch</span>
                    <span className="metric-value">
                      {trainingMetrics.epoch}/{config.epochs}
                    </span>
                  </div>
                </div>

                <div className="metric-card">
                  <div className="metric-icon">
                    <Zap size={16} className="text-yellow-500" />
                  </div>
                  <div className="metric-content">
                    <span className="metric-label">Throughput</span>
                    <span className="metric-value">
                      {trainingMetrics.throughput?.toFixed(1) || '0.0'} it/s
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="wizard-main-content">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="wizard-step"
              >
                <div className="step-header">
                  <h2 className="step-title">
                    <Brain className="text-purple-600" size={24} />
                    انتخاب مدل پایه
                  </h2>
                  <p className="step-description">
                    مدل پایه‌ای را انتخاب کنید که می‌خواهید آموزش دهید
                  </p>
                </div>

                {/* Search and Filter */}
                <div className="search-filter-section">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="جستجو در مدل‌ها..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="filter-buttons">
                    {['all', 'text', 'vision', 'audio'].map((type) => (
                      <button
                        key={type}
                        className={`filter-btn ${selectedModelType === type ? 'active' : ''}`}
                        onClick={() => setSelectedModelType(type)}
                      >
                        {type === 'all' && 'همه'}
                        {type === 'text' && 'متنی'}
                        {type === 'vision' && 'بینایی'}
                        {type === 'audio' && 'صوتی'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Models Grid */}
                <div className="models-grid">
                  {getPaginatedModels().map((model) => (
                    <motion.div
                      key={model.id}
                      whileHover={{ scale: currentStep === 1 ? 1.02 : 1 }}
                      whileTap={{ scale: currentStep === 1 ? 0.98 : 1 }}
                      className={`model-card ${selectedBaseModel === model.id ? 'selected' : ''} ${currentStep > 1 ? 'disabled' : ''}`}
                      onClick={() => currentStep === 1 && setSelectedBaseModel(model.id)}
                    >
                      <div className="model-card-content">
                        <div className="model-icon">
                          {model.type === 'text' && <FileText size={20} />}
                          {model.type === 'vision' && <Eye size={20} />}
                          {model.type === 'audio' && <Volume2 size={20} />}
                          {!['text', 'vision', 'audio'].includes(model.type) && <Brain size={20} />}
                        </div>
                        <div className="model-info">
                          <h4 className="model-name">{model.name}</h4>
                          <p className="model-type">{model.type}</p>
                          <p className="model-size">{model.size}</p>
                        </div>
                        <div className="model-status">
                          {selectedBaseModel === model.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="selection-check"
                            >
                              <CheckCircle className="text-green-500" size={20} />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Models Pagination */}
                {getTotalModelPages() > 1 && (
                  <div className="pagination-controls">
                    <div className="pagination-info">
                      نمایش {((currentModelPage - 1) * itemsPerPage) + 1} تا {Math.min(currentModelPage * itemsPerPage, filteredModels.length)} از {filteredModels.length} مدل
                    </div>
                    <div className="pagination-buttons">
                      <button
                        onClick={() => handleModelPageChange(currentModelPage - 1)}
                        disabled={currentModelPage === 1}
                        className="pagination-btn"
                      >
                        قبلی
                      </button>
                      {Array.from({ length: getTotalModelPages() }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handleModelPageChange(page)}
                          className={`pagination-btn ${currentModelPage === page ? 'active' : ''}`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handleModelPageChange(currentModelPage + 1)}
                        disabled={currentModelPage === getTotalModelPages()}
                        className="pagination-btn"
                      >
                        بعدی
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="wizard-step"
              >
                <div className="step-header">
                  <h2 className="step-title">
                    <Database className="text-blue-600" size={24} />
                    انتخاب دیتاست‌ها
                  </h2>
                  <p className="step-description">
                    دیتاست‌های مورد نیاز برای آموزش را انتخاب کنید
                  </p>
                </div>

                {/* Search and Filter */}
                <div className="search-filter-section">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="جستجو در دیتاست‌ها..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                  </div>
                  <div className="filter-buttons">
                    {['all', 'text', 'vision', 'audio'].map((type) => (
                      <button
                        key={type}
                        className={`filter-btn ${selectedDatasetType === type ? 'active' : ''}`}
                        onClick={() => setSelectedDatasetType(type)}
                      >
                        {type === 'all' && 'همه'}
                        {type === 'text' && 'متنی'}
                        {type === 'vision' && 'بینایی'}
                        {type === 'audio' && 'صوتی'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Datasets Grid */}
                <div className="datasets-grid">
                  {getPaginatedDatasets().map((dataset) => (
                    <motion.div
                      key={dataset.id}
                      whileHover={{ scale: currentStep === 2 ? 1.02 : 1 }}
                      whileTap={{ scale: currentStep === 2 ? 0.98 : 1 }}
                      className={`dataset-card ${selectedDatasets.includes(dataset.id) ? 'selected' : ''} ${currentStep !== 2 ? 'disabled' : ''}`}
                      onClick={() => {
                        if (currentStep !== 2) return;
                        if (selectedDatasets.includes(dataset.id)) {
                          setSelectedDatasets(selectedDatasets.filter(id => id !== dataset.id));
                        } else {
                          setSelectedDatasets([...selectedDatasets, dataset.id]);
                        }
                      }}
                    >
                      <div className="dataset-card-content">
                        <div className="dataset-icon">
                          <Database size={20} />
                        </div>
                        <div className="dataset-info">
                          <h4 className="dataset-name">{dataset.name}</h4>
                          <p className="dataset-samples">{dataset.samples} نمونه</p>
                          <p className="dataset-size">{dataset.size}</p>
                        </div>
                        <div className="dataset-status">
                          {selectedDatasets.includes(dataset.id) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="selection-check"
                            >
                              <CheckCircle className="text-green-500" size={20} />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Datasets Pagination */}
                {getTotalDatasetPages() > 1 && (
                  <div className="pagination-controls">
                    <div className="pagination-info">
                      نمایش {((currentDatasetPage - 1) * itemsPerPage) + 1} تا {Math.min(currentDatasetPage * itemsPerPage, filteredDatasets.length)} از {filteredDatasets.length} دیتاست
                    </div>
                    <div className="pagination-buttons">
                      <button
                        onClick={() => handleDatasetPageChange(currentDatasetPage - 1)}
                        disabled={currentDatasetPage === 1}
                        className="pagination-btn"
                      >
                        قبلی
                      </button>
                      {Array.from({ length: getTotalDatasetPages() }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handleDatasetPageChange(page)}
                          className={`pagination-btn ${currentDatasetPage === page ? 'active' : ''}`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handleDatasetPageChange(currentDatasetPage + 1)}
                        disabled={currentDatasetPage === getTotalDatasetPages()}
                        className="pagination-btn"
                      >
                        بعدی
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="wizard-step"
              >
                <div className="step-header">
                  <h2 className="step-title">
                    <Settings className="text-green-600" size={24} />
                    پیکربندی آموزش
                  </h2>
                  <p className="step-description">
                    تنظیمات آموزش را مطابق نیاز خود تغییر دهید
                  </p>
                </div>

                <div className="config-grid">
                  {/* Basic Configuration */}
                  <div className="config-section">
                    <div className="config-section-header">
                      <h3 className="config-section-title">
                        <Settings size={20} />
                        تنظیمات اصلی
                      </h3>
                      <div className="config-section-badge">
                        اجباری
                      </div>
                    </div>
                    <div className="config-fields">
                      <div className="config-field">
                        <label className="config-label">
                          <span className="label-text">تعداد Epoch</span>
                          <span className="label-help">تعداد دفعاتی که مدل روی کل دیتاست آموزش می‌بیند</span>
                        </label>
                        <div className="input-wrapper">
                          <input
                            type="number"
                            value={config.epochs}
                            onChange={(e) => setConfig({ ...config, epochs: parseInt(e.target.value) })}
                            min="1"
                            max="100"
                            className="config-input"
                          />
                          <span className="input-suffix">دور</span>
                        </div>
                      </div>
                      <div className="config-field">
                        <label className="config-label">
                          <span className="label-text">Batch Size</span>
                          <span className="label-help">تعداد نمونه‌هایی که در هر مرحله پردازش می‌شود</span>
                        </label>
                        <div className="input-wrapper">
                          <input
                            type="number"
                            value={config.batchSize}
                            onChange={(e) => setConfig({ ...config, batchSize: parseInt(e.target.value) })}
                            min="1"
                            max="256"
                            className="config-input"
                          />
                          <span className="input-suffix">نمونه</span>
                        </div>
                      </div>
                      <div className="config-field">
                        <label className="config-label">
                          <span className="label-text">Learning Rate</span>
                          <span className="label-help">سرعت یادگیری مدل (هرچه کمتر، دقیق‌تر)</span>
                        </label>
                        <div className="input-wrapper">
                          <input
                            type="number"
                            value={config.learningRate}
                            onChange={(e) => setConfig({ ...config, learningRate: parseFloat(e.target.value) })}
                            min="0.0001"
                            max="0.1"
                            step="0.0001"
                            className="config-input"
                          />
                          <span className="input-suffix">LR</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Configuration */}
                  <div className="config-section">
                    <div className="config-section-header">
                      <h3 className="config-section-title">تنظیمات پیشرفته</h3>
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="toggle-advanced"
                      >
                        {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {showAdvanced ? 'مخفی کردن' : 'نمایش'}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showAdvanced && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="config-fields"
                        >
                          <div className="config-field">
                            <label>Optimizer</label>
                            <select
                              value={config.optimizer}
                              onChange={(e) => setConfig({ ...config, optimizer: e.target.value })}
                            >
                              <option value="adam">Adam</option>
                              <option value="sgd">SGD</option>
                              <option value="rmsprop">RMSprop</option>
                              <option value="adamw">AdamW</option>
                            </select>
                          </div>
                          <div className="config-field">
                            <label>Warmup Steps</label>
                            <input
                              type="number"
                              value={config.warmupSteps}
                              onChange={(e) => setConfig({ ...config, warmupSteps: parseInt(e.target.value) })}
                              min="0"
                              max="1000"
                            />
                          </div>
                          <div className="config-field">
                            <label>Validation Split</label>
                            <input
                              type="number"
                              value={config.validationSplit}
                              onChange={(e) => setConfig({ ...config, validationSplit: parseFloat(e.target.value) })}
                              min="0.1"
                              max="0.5"
                              step="0.05"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Teacher Model Selection */}
                  <div className="config-section">
                    <h3 className="config-section-title">مدل معلم (اختیاری)</h3>
                    <div className="config-fields">
                      <div className="config-field">
                        <label>انتخاب مدل معلم</label>
                        <select
                          value={selectedTeacherModel || ''}
                          onChange={(e) => setSelectedTeacherModel(e.target.value || null)}
                        >
                          <option value="">بدون مدل معلم</option>
                          {models.map((model) => (
                            <option key={model.id} value={model.id}>
                              {model.name}
                            </option>
                          ))}
                        </select>
                        <p className="config-help">
                          استفاده از مدل معلم برای Knowledge Distillation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Configuration & Controls */}
            <div className="space-y-6">
              {/* Configuration */}
              <motion.div
                className="config-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="section-title">
                    <Settings size={20} />
                    پیکربندی
                  </h3>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-blue-600 text-sm flex items-center gap-1"
                  >
                    {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {showAdvanced ? 'ساده' : 'پیشرفته'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">تعداد Epoch</label>
                    <input
                      type="number"
                      value={config.epochs}
                      onChange={(e) => setConfig({ ...config, epochs: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded-lg"
                      min="1"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Batch Size</label>
                    <input
                      type="number"
                      value={config.batchSize}
                      onChange={(e) => setConfig({ ...config, batchSize: parseInt(e.target.value) })}
                      className="w-full p-2 border rounded-lg"
                      min="1"
                      max="256"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Learning Rate</label>
                    <input
                      type="number"
                      value={config.learningRate}
                      onChange={(e) => setConfig({ ...config, learningRate: parseFloat(e.target.value) })}
                      className="w-full p-2 border rounded-lg"
                      min="0.0001"
                      max="0.1"
                      step="0.0001"
                    />
                  </div>

                  <AnimatePresence>
                    {showAdvanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium mb-1">Optimizer</label>
                          <select
                            value={config.optimizer}
                            onChange={(e) => setConfig({ ...config, optimizer: e.target.value })}
                            className="w-full p-2 border rounded-lg"
                          >
                            <option value="adam">Adam</option>
                            <option value="sgd">SGD</option>
                            <option value="rmsprop">RMSprop</option>
                            <option value="adamw">AdamW</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Warmup Steps</label>
                          <input
                            type="number"
                            value={config.warmupSteps}
                            onChange={(e) => setConfig({ ...config, warmupSteps: parseInt(e.target.value) })}
                            className="w-full p-2 border rounded-lg"
                            min="0"
                            max="1000"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Validation Split</label>
                          <input
                            type="number"
                            value={config.validationSplit}
                            onChange={(e) => setConfig({ ...config, validationSplit: parseFloat(e.target.value) })}
                            className="w-full p-2 border rounded-lg"
                            min="0.1"
                            max="0.5"
                            step="0.05"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Training Controls */}
              <motion.div
                className="controls-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="section-title mb-4">کنترل آموزش</h3>

                <div className="space-y-3">
                  {trainingStatus === 'idle' && (
                    <button
                      onClick={handleStartTraining}
                      className="btn btn-primary w-full"
                      disabled={!selectedBaseModel || selectedDatasets.length === 0}
                    >
                      <Play size={20} />
                      شروع آموزش
                    </button>
                  )}

                  {trainingStatus === 'training' && (
                    <>
                      <button
                        onClick={handlePauseTraining}
                        className="btn btn-warning w-full"
                      >
                        <Pause size={20} />
                        توقف موقت
                      </button>
                      <button
                        onClick={handleStopTraining}
                        className="btn btn-danger w-full"
                      >
                        <Square size={20} />
                        پایان آموزش
                      </button>
                    </>
                  )}

                  {trainingStatus === 'paused' && (
                    <>
                      <button
                        onClick={handleResumeTraining}
                        className="btn btn-success w-full"
                      >
                        <Play size={20} />
                        ادامه آموزش
                      </button>
                      <button
                        onClick={handleStopTraining}
                        className="btn btn-danger w-full"
                      >
                        <Square size={20} />
                        پایان آموزش
                      </button>
                    </>
                  )}

                  {trainingStatus === 'completed' && (
                    <>
                      <button
                        onClick={handleSaveModel}
                        className="btn btn-primary w-full"
                      >
                        <Save size={20} />
                        ذخیره مدل
                      </button>
                      <button
                        onClick={() => {
                          setTrainingStatus('idle');
                          setTrainingMetrics({
                            epoch: 0,
                            trainLoss: 0,
                            valLoss: 0,
                            learningRate: config.learningRate,
                            throughput: 0,
                            progress: 0,
                            message: ''
                          });
                        }}
                        className="btn btn-secondary w-full"
                      >
                        <RefreshCw size={20} />
                        آموزش جدید
                      </button>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Metrics */}
              {trainingStatus !== 'idle' && (
                <motion.div
                  className="metrics-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="section-title mb-4">
                    <BarChart3 size={20} />
                    معیارها
                  </h3>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>پیشرفت</span>
                      <span>{trainingMetrics.progress}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <motion.div
                        className="progress-bar-fill bg-gradient-to-r from-purple-500 to-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${trainingMetrics.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {trainingMetrics.message}
                    </p>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="metric-item">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={16} className="text-red-500" />
                        <span className="text-xs text-gray-600">Train Loss</span>
                      </div>
                      <p className="text-lg font-bold">
                        {trainingMetrics.trainLoss?.toFixed(4) || '0.0000'}
                      </p>
                    </div>

                    <div className="metric-item">
                      <div className="flex items-center gap-2 mb-1">
                        <Target size={16} className="text-green-500" />
                        <span className="text-xs text-gray-600">Val Loss</span>
                      </div>
                      <p className="text-lg font-bold">
                        {trainingMetrics.valLoss?.toFixed(4) || '0.0000'}
                      </p>
                    </div>

                    <div className="metric-item">
                      <div className="flex items-center gap-2 mb-1">
                        <RefreshCw size={16} className="text-blue-500" />
                        <span className="text-xs text-gray-600">Epoch</span>
                      </div>
                      <p className="text-lg font-bold">
                        {trainingMetrics.epoch}/{config.epochs}
                      </p>
                    </div>

                    <div className="metric-item">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={16} className="text-yellow-500" />
                        <span className="text-xs text-gray-600">Throughput</span>
                      </div>
                      <p className="text-lg font-bold">
                        {trainingMetrics.throughput?.toFixed(1) || '0.0'} it/s
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Learning Rate</span>
                      <span className="text-sm font-medium">
                        {trainingMetrics.learningRate?.toFixed(6) || '0.000000'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </div>

        {/* Wizard Navigation */}
        <div className="wizard-navigation">
          <div className="nav-buttons">
            {currentStep > 1 && (
              <motion.button
                onClick={prevStep}
                className="nav-btn prev-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ArrowLeft size={16} />
                قبلی
              </motion.button>
            )}

            {currentStep < totalSteps && (
              <motion.button
                onClick={nextStep}
                className="nav-btn next-btn"
                disabled={!canProceedToNext()}
                whileHover={{ scale: canProceedToNext() ? 1.02 : 1 }}
                whileTap={{ scale: canProceedToNext() ? 0.98 : 1 }}
              >
                بعدی
                <ArrowRight size={16} />
              </motion.button>
            )}
          </div>

          <div className="step-indicator-bottom">
            <span className="step-info">
              مرحله {currentStep} از {totalSteps}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Training;