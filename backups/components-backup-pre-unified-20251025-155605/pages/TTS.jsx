// pages/TTS.jsx - Text-to-Speech Models with Hugging Face Integration
import React, { useState, useRef, useEffect } from 'react';
import {
  Volume2, Search, RefreshCw, Download, Play, Pause,
  ChevronLeft, ChevronRight, Settings, Star, Clock,
  CheckCircle, XCircle, AlertCircle, Brain, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../api/endpoints';
import { useDownloadsContext } from '../context/DownloadsProvider';
import ModeSwitch from '../components/ModeSwitch';
import URLForm from '../components/URLForm';

function TTS() {
  const [ttsModels, setTtsModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [playingModel, setPlayingModel] = useState(null);
  const [hfToken] = useState('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');
  const [stats, setStats] = useState({
    total: 0,
    ready: 0,
    downloading: 0,
    error: 0
  });
  const { upsertJob } = useDownloadsContext();
  const [mode, setMode] = useState('list'); // 'list' | 'url'
  const [url, setUrl] = useState('');
  const [targetDir, setTargetDir] = useState('downloads/tts');
  const [urlJob, setUrlJob] = useState({ id: null, status: null, progress: 0 });
  const pollRef = useRef(null);

  useEffect(() => {
    loadTTSModels();
  }, []);

  useEffect(() => {
    filterModels();
  }, [ttsModels, searchTerm]);

  useEffect(() => {
    updateStats();
  }, [ttsModels]);

  useEffect(() => () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const loadTTSModels = async () => {
    try {
      setLoading(true);

      // Load TTS models from Hugging Face
      const response = await fetch('https://huggingface.co/api/models?pipeline_tag=text-to-speech&limit=50', {
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const hfModels = await response.json();
        const formattedModels = hfModels.map(model => ({
          id: model.id,
          name: model.id.split('/').pop(),
          description: model.pipeline_tag || 'مدل تبدیل متن به گفتار',
          type: 'tts',
          size: formatModelSize(model.downloads || 0),
          status: 'ready',
          downloads: model.downloads || 0,
          tags: model.tags || [],
          author: model.author || 'Hugging Face',
          createdAt: model.created_at || new Date().toISOString(),
          isHuggingFace: true,
          language: model.language || 'fa',
          voice: model.voice || 'default'
        }));

        setTtsModels(formattedModels);
        toast.success(`${formattedModels.length} مدل TTS بارگذاری شد`);
      } else {
        toast.error('خطا در بارگذاری مدل‌های TTS');
      }
    } catch (error) {
      console.error('Error loading TTS models:', error);
      toast.error('خطا در بارگذاری مدل‌های TTS');
    } finally {
      setLoading(false);
    }
  };

  const startUrlDownload = async ({ url: sourceUrl, targetDir: destinationDir } = {}) => {
    const submittedUrl = sourceUrl ?? url;
    const submittedDir = destinationDir ?? targetDir;

    if (!submittedUrl || !submittedDir) {
      toast.error('لطفاً آدرس و مسیر ذخیره را وارد کنید');
      return;
    }

    try {
      setUrl(submittedUrl);
      setTargetDir(submittedDir);

      const response = await api.startUrlDownload([{ url: submittedUrl, destDir: submittedDir }]);
      const data = response?.data ?? response;
      const jobId = data?.jobId;

      if (!jobId) {
        toast.error('امکان شروع دانلود وجود ندارد');
        return;
      }

      const initialJob = { id: jobId, status: 'queued', progress: 0 };
      setUrlJob(initialJob);
      upsertJob(jobId, {
        ...initialJob,
        type: 'url',
        meta: { url: submittedUrl, destDir: submittedDir, category: 'tts' }
      });

      if (pollRef.current) {
        clearInterval(pollRef.current);
      }

      pollRef.current = setInterval(async () => {
        try {
          const statusResponse = await api.getUrlStatus(jobId);
          const statusData = statusResponse?.data ?? statusResponse;
          const status = statusData?.status || 'pending';
          const progress = statusData?.progress ?? statusData?.pct ?? 0;

          setUrlJob({ id: jobId, status, progress });
          upsertJob(jobId, { status, progress });

          if (['done', 'completed', 'error'].includes(status)) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        } catch (error) {
          console.error('URL status error:', error);
        }
      }, 1000);

      toast.success('دانلود آغاز شد');
    } catch (error) {
      console.error('URL download error:', error);
      toast.error('دانلود از طریق URL شروع نشد');
    }
  };

  const formatModelSize = (downloads) => {
    if (downloads > 1000000) return `${(downloads / 1000000).toFixed(1)}M`;
    if (downloads > 1000) return `${(downloads / 1000).toFixed(1)}K`;
    return downloads.toString();
  };

  const filterModels = () => {
    let filtered = ttsModels;

    if (searchTerm) {
      filtered = filtered.filter(model =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredModels(filtered);
  };

  const updateStats = () => {
    const newStats = {
      total: ttsModels.length,
      ready: ttsModels.filter(m => m.status === 'ready').length,
      downloading: ttsModels.filter(m => m.status === 'downloading').length,
      error: ttsModels.filter(m => m.status === 'error').length
    };
    setStats(newStats);
  };

  const handleModelSelect = (modelId) => {
    setSelectedModels(prev =>
      prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleDownload = async () => {
    if (selectedModels.length === 0) {
      toast.error('لطفاً مدل‌هایی برای دانلود انتخاب کنید');
      return;
    }

    try {
      setDownloading(true);
      // Simulate download process
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(`دانلود ${selectedModels.length} مدل TTS شروع شد`);
      setSelectedModels([]);
    } catch (error) {
      toast.error('خطا در شروع دانلود');
    } finally {
      setDownloading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTTSModels();
    setRefreshing(false);
    toast.success('مدل‌های TTS به‌روزرسانی شدند');
  };

  const handlePlay = (modelId) => {
    if (playingModel === modelId) {
      setPlayingModel(null);
      toast.info('پخش متوقف شد');
    } else {
      setPlayingModel(modelId);
      toast.success('پخش شروع شد');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginatedModels = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredModels.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(filteredModels.length / itemsPerPage);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready': return <CheckCircle size={16} className="status-ready" />;
      case 'downloading': return <Clock size={16} className="status-downloading" />;
      case 'error': return <XCircle size={16} className="status-error" />;
      default: return <Clock size={16} className="status-pending" />;
    }
  };

  if (loading) {
    return (
      <div className="tts-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2 className="loading-title">در حال بارگذاری</h2>
          <p className="loading-subtitle loading-text">مدل‌های تبدیل متن به گفتار در حال بارگذاری هستند...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-12">
      <ModeSwitch
        mode={mode}
        setMode={setMode}
        modes={['list', 'url']}
        labels={['نمایش لیستی', 'دانلود از URL']}
        ariaLabel="حالت نمایش مدل‌های TTS"
      />
      {mode === 'url' && (
        <URLForm
          url={url}
          setUrl={setUrl}
          targetDir={targetDir}
          setTargetDir={setTargetDir}
          onSubmit={({ url: submittedUrl, targetDir: submittedDir }) =>
            startUrlDownload({ url: submittedUrl, targetDir: submittedDir })
          }
          urlPlaceholder="https://huggingface.co/..."
          dirPlaceholder="/downloads/tts"
          submitLabel="دانلود"
        />
      )}
      {mode === 'url' && urlJob?.id ? (
        <div className="url-job-status">
          <div className="url-job-meta">
            <span className="mono">شناسه: {urlJob.id}</span>
            <span>وضعیت: {urlJob.status}</span>
          </div>
          <div className="progress">
            <div style={{ width: `${Math.min(100, urlJob.progress || 0)}%` }} />
          </div>
        </div>
      ) : null}
      {/* Header */}
      <div className="page-header">
        <div className="flex">
          <div>
            <h1>
              <Volume2 size={32} />
              مدل‌های تبدیل متن به گفتار
            </h1>
            <p>
              مدیریت و استفاده از مدل‌های TTS از Hugging Face
            </p>
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="modern-refresh-btn"
              disabled={refreshing}
            >
              <div className="refresh-btn-content">
                <RefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
                <span>
                  {refreshing ? 'در حال به‌روزرسانی...' : 'بروزرسانی'}
                </span>
              </div>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="btn-primary-modern"
              disabled={downloading || selectedModels.length === 0}
            >
              <Download size={18} />
              {downloading ? 'در حال دانلود...' : `دانلود (${selectedModels.length})`}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modern Metric Cards */}
      <div className="metrics-dashboard">
        <div className="metric-card">
          <div className="metric-card-top">
            <div className="growth-indicator">
              <span className="growth-value">0%</span>
            </div>
            <div className="icon-container model-icon">
              <Volume2 size={24} />
            </div>
          </div>

          <div className="metric-card-value">
            <span className="value-primary">{stats.total}</span>
          </div>

          <div className="metric-card-content">
            <h3 className="metric-title">کل مدل‌های TTS</h3>
            <p className="metric-subtitle">مدل موجود</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <div className="growth-indicator">
              <span className="growth-value">8%+</span>
              <svg className="growth-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="icon-container success-icon">
              <CheckCircle size={24} />
            </div>
          </div>

          <div className="metric-card-value">
            <span className="value-primary">{stats.ready}</span>
          </div>

          <div className="metric-card-content">
            <h3 className="metric-title">آماده</h3>
            <p className="metric-subtitle">مدل آماده</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <div className="growth-indicator">
              <span className="growth-value">5%+</span>
              <svg className="growth-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="icon-container processing-icon">
              <Clock size={24} />
            </div>
          </div>

          <div className="metric-card-value">
            <span className="value-primary">{stats.downloading}</span>
          </div>

          <div className="metric-card-content">
            <h3 className="metric-title">در حال دانلود</h3>
            <p className="metric-subtitle">در حال پردازش</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <div className="growth-indicator no-growth">
              <span>0%</span>
            </div>
            <div className="icon-container error-icon">
              <XCircle size={24} />
            </div>
          </div>

          <div className="metric-card-value">
            <span className="value-primary">{stats.error}</span>
          </div>

          <div className="metric-card-content">
            <h3 className="metric-title">خطا</h3>
            <p className="metric-subtitle">نیاز به بررسی</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="harmony-search-section">
        <div className="harmony-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="جستجو در مدل‌های TTS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="harmony-search-input"
          />
        </div>
      </div>

      {/* TTS Models Grid */}
      <div className="models-grid-modern">
        <AnimatePresence>
          {getPaginatedModels().map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`model-card-modern tts-card ${selectedModels.includes(model.id) ? 'selected' : ''}`}
              onClick={() => handleModelSelect(model.id)}
            >
              <div className="model-card-header">
                <div className="model-icon-modern tts-icon">
                  <Volume2 size={20} />
                </div>
                <div className="model-info-modern">
                  <h3 className="model-name-modern">{model.name}</h3>
                  <p className="model-description-modern">{model.description}</p>
                  {model.isHuggingFace && (
                    <div className="hf-badge">
                      <Star size={12} />
                      <span>Hugging Face</span>
                    </div>
                  )}
                </div>
                <div className="model-select-modern">
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(model.id)}
                    onChange={() => { }}
                    className="model-checkbox"
                  />
                </div>
              </div>

              <div className="model-card-details">
                <div className="model-meta-modern">
                  <span className="model-type-badge type-tts">
                    TTS
                  </span>
                  <span className="model-size-modern">{model.size}</span>
                  <span className="model-language-modern">
                    {model.language === 'fa' ? 'فارسی' : model.language}
                  </span>
                </div>

                <div className="model-actions-modern">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(model.id);
                    }}
                    className={`play-btn ${playingModel === model.id ? 'playing' : ''}`}
                    title={playingModel === model.id ? 'توقف' : 'پخش'}
                  >
                    {playingModel === model.id ? <Pause size={16} /> : <Play size={16} />}
                  </motion.button>

                  <div className="model-status-modern">
                    {getStatusIcon(model.status)}
                    <span className="status-text-modern">
                      {model.status === 'ready' && 'آماده'}
                      {model.status === 'downloading' && 'در حال دانلود'}
                      {model.status === 'error' && 'خطا'}
                      {model.status === 'pending' && 'در انتظار'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {getPaginatedModels().length === 0 && (
          <div className="no-models-modern">
            <Volume2 size={48} />
            <p>هیچ مدل TTS یافت نشد</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {getTotalPages() > 1 && (
        <div className="harmony-pagination">
          <div className="harmony-pagination-content">
            <div className="harmony-pagination-info">
              <span>
                نمایش {((currentPage - 1) * itemsPerPage) + 1} تا {Math.min(currentPage * itemsPerPage, filteredModels.length)} از {filteredModels.length} مدل
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

              {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(page => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(page)}
                  className={`harmony-pagination-btn ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </motion.button>
              ))}

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
    </div>
  );
}

export default TTS;
