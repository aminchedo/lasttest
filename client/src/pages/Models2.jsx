import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Play,
  RefreshCw,
  Upload,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Brain,
  FileText,
  Volume2,
  Eye,
  FolderOpen,
  Package,
  Search,
  Filter,
  Settings,
  Database,
  Layers,
  Zap,
  Star,
  Users,
  Calendar,
  HardDrive,
  Hash,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../api/endpoints';
import { toast } from 'react-hot-toast';
import { clamp, text, num } from '../utils/sanitize';
function Models() {
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assetRoots, setAssetRoots] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState('models');

  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [activeJobs, setActiveJobs] = useState(new Map());
  const pollIntervals = useRef(new Map());

  const [stats, setStats] = useState({
    total: 0,
    ready: 0,
    downloading: 0,
    error: 0
  });

  const [hfToken] = useState('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');

  useEffect(() => {
    loadInitialData();
    loadAssets();
    
    return () => {
      pollIntervals.current.forEach(interval => clearInterval(interval));
      pollIntervals.current.clear();
    };
  }, []);

  useEffect(() => {
    filterModels();
  }, [models, searchTerm, filterType]);

  useEffect(() => {
    if (activeTab === 'assets') {
      loadAssets();
    }
  }, [activeTab]);

  useEffect(() => {
    updateStats();
  }, [models]);

  const loadAssets = async () => {
    try {
      const [rootsRes, modelsRes] = await Promise.all([
        apiClient.get('/assets/roots'),
        apiClient.get('/assets/list/models')
      ]);

      if (rootsRes.ok) {
        setAssetRoots(Array.isArray(rootsRes.data) ? rootsRes.data : []);
      }

      if (modelsRes.ok) {
        setAssets(Array.isArray(modelsRes.data?.assets) ? modelsRes.data.assets : []);
      }
    } catch (error) {
      console.error('Error loading assets:', error);
      toast.error('خطا در بارگذاری دارایی‌ها');
    }
  };

  const uploadAsset = async (files, category = 'models') => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });
      formData.append('category', category);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          toast.success(`${files.length} فایل با موفقیت آپلود شد`);
          await loadAssets();
        } else {
          toast.error('خطا در آپلود فایل‌ها');
        }
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener('error', () => {
        toast.error('خطا در اتصال به سرور');
        setUploading(false);
        setUploadProgress(0);
      });

      xhr.open('POST', '/api/assets/upload', true);
      xhr.send(formData);

    } catch (error) {
      console.error('Error uploading assets:', error);
      toast.error('خطا در آپلود فایل‌ها');
      setUploading(false);
    }
  };

  const deleteAsset = async (assetId) => {
    if (!window.confirm('آیا از حذف این دارایی اطمینان دارید؟')) return;

    try {
      const response = await apiClient.delete(`/api/assets/${assetId}`);
      
      if (response.ok) {
        toast.success('دارایی با موفقیت حذف شد');
        loadAssets();
      } else {
        toast.error('خطا در حذف دارایی');
      }
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast.error('خطا در حذف دارایی');
    }
  };

  const downloadAsset = async (assetId, filename) => {
    try {
      toast.loading('در حال آماده‌سازی دانلود...');
      const response = await fetch(`/api/assets/download/${assetId}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success('دانلود با موفقیت انجام شد');
      } else {
        toast.error('خطا در دانلود فایل');
      }
    } catch (error) {
      console.error('Error downloading asset:', error);
      toast.error('خطا در دانلود فایل');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const loadInitialData = async () => {
    await Promise.all([loadModels(), loadHuggingFaceModels()]);
  };

  const loadModels = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getModels();

      if (result && result.ok && result.data) {
        setModels(Array.isArray(result.data) ? result.data : []);
      } else if (Array.isArray(result)) {
        setModels(result);
      } else {
        console.warn('Unexpected models format:', result);
        setModels([]);
      }
    } catch (error) {
      console.error('Error loading models:', error);
      toast.error('خطا در بارگذاری مدل‌ها');
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const loadHuggingFaceModels = async () => {
    try {
      const response = await fetch('https://huggingface.co/api/models?limit=50&sort=downloads', {
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const hfModels = await response.json();
        const formattedModels = (Array.isArray(hfModels) ? hfModels : []).map(model => ({
          id: model.id,
          name: model.id.split('/').pop(),
          fullName: model.id,
          description: model.pipeline_tag ? `مدل ${getPersianType(model.pipeline_tag)}` : 'مدل هوش مصنوعی',
          type: getModelType(model.pipeline_tag),
          size: estimateModelSize(model.downloads || 0),
          status: 'available',
          downloads: model.downloads || 0,
          tags: Array.isArray(model.tags) ? model.tags : [],
          author: model.author || 'Hugging Face',
          createdAt: model.created_at || new Date().toISOString(),
          isHuggingFace: true,
          likes: model.likes || 0
        }));

        setModels(prev => {
          const prevArray = Array.isArray(prev) ? prev : [];
          const existingIds = new Set(prevArray.map(m => m.id));
          const newModels = formattedModels.filter(m => !existingIds.has(m.id));
          return [...prevArray, ...newModels];
        });
      }
    } catch (error) {
      console.error('Error loading Hugging Face models:', error);
      toast.error('خطا در بارگذاری مدل‌های Hugging Face');
    }
  };

  const getPersianType = (pipelineTag) => {
    const typeMap = {
      'text-generation': 'تولید متن',
      'text-classification': 'دسته‌بندی متن',
      'question-answering': 'پاسخ به سوال',
      'image-classification': 'دسته‌بندی تصویر',
      'object-detection': 'تشخیص اشیاء',
      'image-segmentation': 'قطعه‌بندی تصویر',
      'text-to-speech': 'متن به گفتار',
      'automatic-speech-recognition': 'تشخیص گفتار',
      'audio-classification': 'دسته‌بندی صدا'
    };
    return typeMap[pipelineTag] || 'هوش مصنوعی';
  };

  const getModelType = (pipelineTag) => {
    const typeMap = {
      'text-generation': 'text',
      'text-classification': 'text',
      'question-answering': 'text',
      'image-classification': 'vision',
      'object-detection': 'vision',
      'image-segmentation': 'vision',
      'text-to-speech': 'audio',
      'automatic-speech-recognition': 'audio',
      'audio-classification': 'audio'
    };
    return typeMap[pipelineTag] || 'other';
  };

  const estimateModelSize = (downloads) => {
    const baseSize = 100 + (num(downloads, 0) % 1000);
    if (baseSize > 500) return `${text(num(baseSize / 1000, 0).toFixed(1))}GB`;
    if (baseSize > 100) return `${text(num(baseSize, 0))}MB`;
    return `${text(num(baseSize, 0))}MB`;
  };

  const updateStats = () => {
    if (!Array.isArray(models)) {
      setStats({ total: 0, ready: 0, downloading: 0, error: 0 });
      return;
    }

    const newStats = {
      total: models.length,
      ready: models.filter(m => m.status === 'ready').length,
      downloading: models.filter(m => m.status === 'downloading').length,
      error: models.filter(m => m.status === 'error').length
    };
    setStats(newStats);
  };

  const filterModels = () => {
    if (!Array.isArray(models)) {
      setFilteredModels([]);
      return;
    }

    let filtered = models.filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(model.tags) && model.tags.some(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );

    if (filterType !== 'all') {
      filtered = filtered.filter(model => model.type === filterType);
    }

    setFilteredModels(filtered);
  };

  const handleModelSelect = (modelId) => {
    setSelectedModels(prev => {
      const isSelected = prev.includes(modelId);
      if (isSelected) {
        return prev.filter(id => id !== modelId);
      } else {
        return [...prev, modelId];
      }
    });
  };

  const handleRealDownload = async (modelId) => {
    try {
      const model = models.find(m => m.id === modelId);
      if (!model) return;

      console.log('🚀 Starting download for:', modelId);

      setModels(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map(m =>
          m.id === modelId ? { ...m, status: 'downloading' } : m
        );
      });

      const result = await apiClient.startHfDownload(modelId, 'models/base');

      if (result && result.ok) {
        const jobId = result.jobId;
        setActiveJobs(prev => new Map(prev.set(modelId, jobId)));
        startProgressPolling(modelId, jobId);
        toast.success(`دانلود ${model.name} شروع شد`);
      } else {
        throw new Error('Download request failed');
      }
    } catch (error) {
      console.error('Error downloading model:', error);
      toast.error(`خطا در دانلود مدل: ${error.message}`);

      setModels(prev => {
        const prevArray = Array.isArray(prev) ? prev : [];
        return prevArray.map(m =>
          m.id === modelId ? { ...m, status: 'error', error: error.message } : m
        );
      });
    }
  };

  const startProgressPolling = (modelId, jobId) => {
    if (pollIntervals.current.has(modelId)) {
      clearInterval(pollIntervals.current.get(modelId));
    }

    const intervalId = setInterval(async () => {
      try {
        const result = await apiClient.checkDownloadProgress(jobId);

        if (result && result.ok) {
          const { progress, status } = result;

          setDownloadProgress(prev => ({
            ...prev,
            [modelId]: progress || 0
          }));

          if (status === 'completed') {
            handleDownloadComplete(modelId, jobId);
          } else if (status === 'failed') {
            handleDownloadFailed(modelId, jobId, result.error || 'Unknown error');
          }
        }
      } catch (error) {
        console.error('Error checking download progress:', error);
      }
    }, 2000);

    pollIntervals.current.set(modelId, intervalId);
  };

  const handleDownloadComplete = (modelId, jobId) => {
    if (pollIntervals.current.has(modelId)) {
      clearInterval(pollIntervals.current.get(modelId));
      pollIntervals.current.delete(modelId);
    }

    setModels(prev => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return prevArray.map(m =>
        m.id === modelId ? { ...m, status: 'ready' } : m
      );
    });

    setActiveJobs(prev => {
      const newJobs = new Map(prev);
      newJobs.delete(modelId);
      return newJobs;
    });

    setDownloadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[modelId];
      return newProgress;
    });

    const model = models.find(m => m.id === modelId);
    if (model) {
      toast.success(`مدل ${model.name} با موفقیت دانلود شد`);
      loadAssets();
    }
  };

  const handleDownloadFailed = (modelId, jobId, errorMessage) => {
    if (pollIntervals.current.has(modelId)) {
      clearInterval(pollIntervals.current.get(modelId));
      pollIntervals.current.delete(modelId);
    }

    setModels(prev => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return prevArray.map(m =>
        m.id === modelId ? { ...m, status: 'error', error: errorMessage } : m
      );
    });

    setActiveJobs(prev => {
      const newJobs = new Map(prev);
      newJobs.delete(modelId);
      return newJobs;
    });

    setDownloadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[modelId];
      return newProgress;
    });

    const model = models.find(m => m.id === modelId);
    if (model) {
      toast.error(`دانلود ${model.name} با خطا مواجه شد: ${errorMessage}`);
    }
  };

  const handleSingleDownload = async (modelId) => {
    await handleRealDownload(modelId);
  };

  const handleBulkDownload = async () => {
    if (selectedModels.length === 0) {
      toast.error('لطفاً حداقل یک مدل انتخاب کنید');
      return;
    }

    setDownloading(true);

    try {
      for (const modelId of selectedModels) {
        const model = models.find(m => m.id === modelId);
        if (model && model.status === 'available') {
          await handleRealDownload(modelId);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      toast.success(`دانلود ${selectedModels.length} مدل آغاز شد`);
      setSelectedModels([]);
    } catch (error) {
      console.error('Error in bulk download:', error);
      toast.error('خطا در دانلود دسته‌ای مدل‌ها');
    } finally {
      setDownloading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInitialData();
      toast.success('لیست مدل‌ها بروزرسانی شد');
    } catch (error) {
      toast.error('خطا در بروزرسانی لیست مدل‌ها');
    } finally {
      setRefreshing(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPaginatedModels = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredModels.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredModels.length / itemsPerPage);
  };

  const getStatusIcon = (status, modelId) => {
    switch (status) {
      case 'ready':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'downloading':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw size={16} className="text-blue-500" />
          </motion.div>
        );
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      case 'available':
        return <Clock size={16} className="text-gray-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusText = (status, modelId) => {
    switch (status) {
      case 'ready':
        return 'آماده استفاده';
      case 'downloading':
        const progress = downloadProgress[modelId] ?? 0;
        return `در حال دانلود (${clamp(progress, 0, 100).toFixed(0)}%)`;
      case 'error':
        return 'خطا در دانلود';
      case 'available':
        return 'آماده برای دانلود';
      default:
        return 'نامشخص';
    }
  };

  return (
    <div className="models-container-modern">
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'models' ? 'active' : ''}`}
          onClick={() => setActiveTab('models')}
        >
          <Brain className="w-4 h-4" />
          مدل‌ها
        </button>
        <button
          className={`tab-btn ${activeTab === 'assets' ? 'active' : ''}`}
          onClick={() => setActiveTab('assets')}
        >
          <FolderOpen className="w-4 h-4" />
          دارایی‌ها
        </button>
      </div>

      {activeTab === 'models' ? (
        <>
          <div className="models-header-modern">
            <div className="models-stats-container">
              <div className="metrics-dashboard">
                <div className="unified-metric-card">
                  <div className="unified-metric-card__top">
                    <div className="unified-metric-card__growth">
                      <span className="growth-value">0%</span>
                    </div>
                    <div className="unified-metric-card__icon model-icon">
                      <Package size={24} />
                    </div>
                  </div>

                  <div className="unified-metric-card__value">
                    <span className="unified-metric-card__value-primary">{stats.total}</span>
                  </div>

                  <div className="unified-metric-card__content">
                    <h3 className="unified-metric-card__title">کل مدل‌ها</h3>
                    <p className="unified-metric-card__subtitle">تعداد کل مدل‌های موجود</p>
                  </div>
                </div>

                <div className="unified-metric-card">
                  <div className="unified-metric-card__top">
                    <div className="unified-metric-card__growth">
                      <span className="growth-value">8%+</span>
                      <svg className="growth-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="unified-metric-card__icon success-icon">
                      <CheckCircle size={24} />
                    </div>
                  </div>

                  <div className="unified-metric-card__value">
                    <span className="unified-metric-card__value-primary">{stats.ready}</span>
                  </div>

                  <div className="unified-metric-card__content">
                    <h3 className="unified-metric-card__title">آماده استفاده</h3>
                    <p className="unified-metric-card__subtitle">مدل‌های آماده برای استفاده</p>
                  </div>
                </div>

                <div className="unified-metric-card">
                  <div className="unified-metric-card__top">
                    <div className="unified-metric-card__growth">
                      <span className="growth-value">5%+</span>
                      <svg className="growth-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="unified-metric-card__icon processing-icon">
                      <Download size={24} />
                    </div>
                  </div>

                  <div className="unified-metric-card__value">
                    <span className="unified-metric-card__value-primary">{stats.downloading}</span>
                  </div>

                  <div className="unified-metric-card__content">
                    <h3 className="unified-metric-card__title">در حال دانلود</h3>
                    <p className="unified-metric-card__subtitle">مدل‌های در حال دانلود</p>
                  </div>
                </div>

                <div className="unified-metric-card">
                  <div className="unified-metric-card__top">
                    <div className="unified-metric-card__growth unified-metric-card__growth--no-growth">
                      <span>0%</span>
                    </div>
                    <div className="unified-metric-card__icon error-icon">
                      <AlertCircle size={24} />
                    </div>
                  </div>

                  <div className="unified-metric-card__value">
                    <span className="unified-metric-card__value-primary">{stats.error}</span>
                  </div>

                  <div className="unified-metric-card__content">
                    <h3 className="unified-metric-card__title">خطا</h3>
                    <p className="unified-metric-card__subtitle">مدل‌های با خطا</p>
                  </div>
                </div>
              </div>

              <div className="controls-bar-modern">
                <div className="harmony-search-section">
                  <div className="harmony-search-box">
                    <Search size={18} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="جستجوی مدل..."
                      className="harmony-search-input"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="harmony-btn harmony-btn-secondary"
                        style={{ position: 'absolute', insetInlineStart: '0.5rem', padding: '0.25rem' }}
                      >
                        <XCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="filters-modern">
                  <div className="filter-label">
                    <Filter size={16} />
                    <span>نوع مدل:</span>
                  </div>
                  <div className="filter-options">
                    <button
                      className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterType('all')}
                    >
                      همه
                    </button>
                    <button
                      className={`filter-btn ${filterType === 'text' ? 'active' : ''}`}
                      onClick={() => setFilterType('text')}
                    >
                      متنی
                    </button>
                    <button
                      className={`filter-btn ${filterType === 'vision' ? 'active' : ''}`}
                      onClick={() => setFilterType('vision')}
                    >
                      بینایی
                    </button>
                    <button
                      className={`filter-btn ${filterType === 'audio' ? 'active' : ''}`}
                      onClick={() => setFilterType('audio')}
                    >
                      صوتی
                    </button>
                  </div>
                </div>

                <div className="actions-modern">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRefresh}
                    className="refresh-btn-modern"
                    disabled={refreshing}
                  >
                    <motion.div
                      animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 1, repeat: refreshing ? Infinity : 0, ease: 'linear' }}
                    >
                      <RefreshCw size={18} />
                    </motion.div>
                    <span className="btn-text-small">
                      {refreshing ? 'در حال بروزرسانی...' : 'بروزرسانی'}
                    </span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBulkDownload}
                    className={`download-btn-modern ${downloading ? 'downloading' : ''}`}
                    disabled={downloading || selectedModels.length === 0}
                  >
                    <Download size={18} />
                    <span className="btn-text-small">
                      {downloading ? 'در حال دانلود...' : 'دانلود انتخاب شده'}
                    </span>
                    {selectedModels.length > 0 && (
                      <span className="download-count-modern">{selectedModels.length}</span>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>

          <div className="models-grid-modern">
            <AnimatePresence>
              {getPaginatedModels().map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`unified-model-card ${model.type}-card ${selectedModels.includes(model.id) ? 'selected' : ''} ${model.status === 'downloading' ? 'downloading' : ''}`}
                >
                  <div className="unified-model-card__header">
                    <div className={`unified-model-card__icon ${model.type}-icon`}>
                      {model.type === 'text' && <FileText size={20} />}
                      {model.type === 'vision' && <Eye size={20} />}
                      {model.type === 'audio' && <Volume2 size={20} />}
                      {model.type === 'other' && <Brain size={20} />}
                    </div>
                    <div className="unified-model-card__info">
                      <h3 className="unified-model-card__name">{model.name}</h3>
                      <p className="unified-model-card__description">{model.description}</p>
                      <div className="model-meta">
                        {model.isHuggingFace && (
                          <div className="hf-badge">
                            <Star size={12} />
                            <span>Hugging Face</span>
                          </div>
                        )}
                        {model.likes > 0 && (
                          <div className="likes-badge">
                            <span>❤️ {model.likes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="unified-model-card__actions">
                      {model.status === 'available' && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleSingleDownload(model.id)}
                          className="download-single-btn"
                          title="دانلود این مدل"
                        >
                          <Download size={16} />
                        </motion.button>
                      )}
                      <div className="model-select-modern">
                        <input
                          type="checkbox"
                          checked={selectedModels.includes(model.id)}
                          onChange={() => handleModelSelect(model.id)}
                          className="model-checkbox"
                          disabled={model.status === 'downloading' || model.status === 'ready'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="unified-model-card__details">
                    <div className="unified-model-card__meta">
                      <span className={`model-type-badge type-${model.type}`}>
                        {model.type === 'text' && 'متنی'}
                        {model.type === 'vision' && 'بینایی'}
                        {model.type === 'audio' && 'صوتی'}
                        {model.type === 'other' && 'سایر'}
                      </span>
                      <span className="model-size-modern">{model.size}</span>
                      {model.downloads > 0 && (
                        <span className="downloads-count">
                          🔥 {model.downloads.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="model-status-modern">
                      {getStatusIcon(model.status, model.id)}
                      <span className="status-text-modern">
                        {getStatusText(model.status, model.id)}
                      </span>

                      {model.status === 'downloading' && downloadProgress[model.id] > 0 && (
                        <div className="download-progress-detailed">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${clamp(downloadProgress[model.id] ?? 0, 0, 100)}%` }}
                            ></div>
                          </div>
                          <span className="progress-percent">{clamp(downloadProgress[model.id] ?? 0, 0, 100).toFixed(0)}%</span>
                        </div>
                      )}

                      {model.status === 'error' && (
                        <div className="error-tooltip">
                          <AlertCircle size={12} />
                          <span className="error-message">{model.error}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {model.status === 'downloading' && (
                    <div className="model-progress-bar">
                      <div className="progress-track">
                        <motion.div
                          className="progress-indicator"
                          initial={{ width: 0 }}
                          animate={{ width: `${clamp(downloadProgress[model.id] ?? 0, 0, 100)}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {getPaginatedModels().length === 0 && (
              <div className="no-models-modern">
                <Brain size={48} className="text-gray-300" />
                <p className="text-gray-500 mt-2">هیچ مدلی یافت نشد</p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="clear-search-btn"
                  >
                    پاک کردن جستجو
                  </button>
                )}
              </div>
            )}
          </div>

          {getTotalPages() > 1 && (
            <div className="harmony-pagination">
              <div className="harmony-pagination-content">
                <div className="harmony-pagination-info">
                  <span>
                    نمایش {((currentPage - 1) * itemsPerPage) + 1} تا{' '}
                    {Math.min(currentPage * itemsPerPage, filteredModels.length)} از{' '}
                    {filteredModels.length} مدل
                    {stats.downloading > 0 && (
                      <span style={{ color: 'var(--harmony-warning)', marginInlineStart: '0.5rem' }}>
                        • {stats.downloading} در حال دانلود
                      </span>
                    )}
                  </span>
                </div>
                <div className="harmony-pagination-controls">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="harmony-pagination-btn"
                  >
                    <ChevronLeft size={16} />
                  </motion.button>

                  {Array.from({ length: getTotalPages() }, (_, i) => i + 1)
                    .filter(page =>
                      page === 1 ||
                      page === getTotalPages() ||
                      Math.abs(page - currentPage) <= 1
                    )
                    .map((page, index, array) => {
                      const showEllipsis = index > 0 && page - array[index - 1] > 1;
                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <span style={{ padding: '0 0.5rem', color: 'var(--harmony-text-tertiary)' }}>...</span>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handlePageChange(page)}
                            className={`harmony-pagination-btn ${currentPage === page ? 'active' : ''}`}
                          >
                            {page}
                          </motion.button>
                        </React.Fragment>
                      );
                    })}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === getTotalPages()}
                    className="harmony-pagination-btn"
                  >
                    <ChevronRight size={16} />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="assets-container">
          <div className="assets-header">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">مدیریت دارایی‌ها</h2>
              </div>
              <div className="flex gap-3">
                <label className="upload-btn" style={{ opacity: uploading ? 0.5 : 1, pointerEvents: uploading ? 'none' : 'auto' }}>
                  <Upload className="w-4 h-4" />
                  آپلود فایل
                  <input
                    type="file"
                    multiple
                    accept=".bin,.safetensors,.onnx,.pb,.h5,.json,.txt,.pth,.pt"
                    onChange={(e) => uploadAsset(e.target.files, 'models')}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <button
                  onClick={loadAssets}
                  className="refresh-btn"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  بروزرسانی
                </button>
              </div>
            </div>

            {uploading && (
              <div className="upload-progress mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span>در حال آپلود...</span>
                  <span>{uploadProgress.toFixed(0)}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {assetRoots.map((root) => (
                <div key={root.id} className="asset-root-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{root.name}</h3>
                    <HardDrive className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{root.description}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{root.fileCount || 0} فایل</span>
                    <span className="text-gray-500">{formatFileSize(root.totalSize || 0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="assets-grid">
            <AnimatePresence>
              {assets.map((asset, index) => (
                <motion.div
                  key={asset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="asset-card"
                >
                  <div className="asset-header">
                    <div className="asset-icon">
                      {asset.type === 'directory' ? (
                        <FolderOpen className="w-5 h-5 text-blue-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="asset-info">
                      <h4 className="asset-name">{asset.name}</h4>
                      <p className="asset-path">{asset.path}</p>
                    </div>
                    <div className="asset-actions">
                      {asset.type === 'file' && (
                        <button
                          onClick={() => downloadAsset(asset.id, asset.name)}
                          className="action-btn download"
                          title="دانلود"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteAsset(asset.id)}
                        className="action-btn delete"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="asset-details">
                    <div className="asset-meta">
                      <span className="meta-item">
                        <HardDrive className="w-3 h-3" />
                        {formatFileSize(asset.size)}
                      </span>
                      <span className="meta-item">
                        <Calendar className="w-3 h-3" />
                        {new Date(asset.created).toLocaleDateString('fa-IR')}
                      </span>
                      {asset.hash && (
                        <span className="meta-item">
                          <Hash className="w-3 h-3" />
                          {asset.hash.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {assets.length === 0 && !loading && (
              <div className="no-assets">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">هیچ دارایی‌ای یافت نشد</p>
                <p className="text-sm text-gray-400 mt-1">
                  فایل‌های خود را آپلود کنید یا از طریق دانلود مدل اضافه کنید
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Models;