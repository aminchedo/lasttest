import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../api/endpoints';
import { useDownloadsContext } from '../context/DownloadsProvider';
import ModeSwitch from '../components/ModeSwitch';
import URLForm from '../components/URLForm';
import {
  Database,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  FileText,
  Volume2,
  Image,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  HardDrive,
  Activity,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Clock,
  FolderOpen,
  X
} from 'lucide-react';

const fallbackToast = (msg, type = 'success') => {
  if (type === 'error') return toast.error(msg);
  if (type === 'loading') return toast.loading(msg);
  return toast(msg);
};

function Datasets({ onToast = fallbackToast }) {
  const { upsertJob } = useDownloadsContext();
  const [datasets, setDatasets] = useState([]);
  const [mode, setMode] = useState('list');
  const [url, setUrl] = useState('');
  const [targetDir, setTargetDir] = useState('data/datasets');
  const [urlJob, setUrlJob] = useState({ id: null, status: null, progress: 0 });
  const pollRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const startUrlDownload = async ({ url: sourceUrl, targetDir: destinationDir } = {}) => {
    const submittedUrl = sourceUrl ?? url;
    const submittedDir = destinationDir ?? targetDir;

    if (!submittedUrl || !submittedDir) {
      onToast('لطفاً آدرس و مسیر ذخیره را وارد کنید', 'error');
      return;
    }

    try {
      setUrl(submittedUrl);
      setTargetDir(submittedDir);

      const response = await api.startUrlDownload([{ url: submittedUrl, destDir: submittedDir }]);
      const data = response?.data ?? response;
      const jobId = data?.jobId;

      if (!jobId) {
        onToast('امکان شروع دانلود وجود ندارد', 'error');
        return;
      }

      const initialJob = { id: jobId, status: 'queued', progress: 0 };
      setUrlJob(initialJob);
      upsertJob(jobId, {
        ...initialJob,
        type: 'url',
        meta: { url: submittedUrl, destDir: submittedDir, category: 'datasets' }
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
            if (status === 'done' || status === 'completed') {
              loadDatasets();
            }
          }
        } catch (error) {
          console.error('URL status error:', error);
        }
      }, 1000);

      onToast('دانلود آغاز شد', 'success');
    } catch (error) {
      console.error('URL download error:', error);
      onToast('دانلود از طریق URL شروع نشد', 'error');
    }
  };

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [metrics, setMetrics] = useState({
    totalDatasets: 0,
    totalSize: 0,
    totalSamples: 0,
    readyDatasets: 0,
    processingDatasets: 0,
    recentUploads: 0
  });

  useEffect(() => {
    loadDatasets();
  }, []);

  useEffect(() => {
    calculateMetrics();
  }, [datasets]);

  const calculateMetrics = () => {
    const datasetsArray = Array.isArray(datasets) ? datasets : [];
    const total = datasetsArray.length;
    const totalSize = datasetsArray.reduce((acc, ds) => {
      const size = parseFloat(ds.size?.replace(' GB', '').replace(' MB', '') || '0') || 0;
      return acc + (ds.size?.includes('GB') ? size : size / 1000);
    }, 0);
    const totalSamples = datasetsArray.reduce((acc, ds) => acc + (ds.samples || 0), 0);
    const ready = datasetsArray.filter(ds => ds.status === 'ready').length;
    const processing = datasetsArray.filter(ds => ds.status === 'processing').length;
    const recent = datasetsArray.filter(ds => {
      const date = new Date(ds.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date > weekAgo;
    }).length;

    setMetrics({
      totalDatasets: total,
      totalSize: totalSize,
      totalSamples: totalSamples,
      readyDatasets: ready,
      processingDatasets: processing,
      recentUploads: recent
    });
  };

  const loadDatasets = async () => {
    setLoading(true);
    try {
      const result = await api.getDatasets();
      if (result.ok && result.data) {
        setDatasets(Array.isArray(result.data) ? result.data : []);
      } else {
        onToast(result.error || 'خطا در بارگذاری دیتاست‌ها', 'error');
        setDatasets([]);
      }
    } catch (error) {
      onToast('خطا در بارگذاری دیتاست‌ها', 'error');
      setDatasets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      formData.append('category', 'datasets');
      formData.append('destDir', targetDir);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            onToast('فایل‌ها با موفقیت آپلود شدند', 'success');
            setShowUploadModal(false);
            setUploadProgress(0);
            await loadDatasets();
          } catch (e) {
            onToast('خطا در پردازش پاسخ سرور', 'error');
          }
        } else {
          onToast('خطا در آپلود فایل‌ها', 'error');
        }
        setUploading(false);
      });

      xhr.addEventListener('error', () => {
        onToast('خطا در اتصال به سرور', 'error');
        setUploading(false);
      });

      xhr.open('POST', '/api/datasets/upload', true);
      xhr.send(formData);

    } catch (error) {
      console.error('Upload error:', error);
      onToast('خطا در آپلود فایل‌ها', 'error');
      setUploading(false);
    }
  };

  const handleDelete = async (datasetId) => {
    if (window.confirm('آیا از حذف این دیتاست اطمینان دارید؟')) {
      try {
        const response = await api.deleteDataset(datasetId);
        
        if (response.ok) {
          setDatasets(prev => {
            const prevArray = Array.isArray(prev) ? prev : [];
            return prevArray.filter(ds => ds.id !== datasetId);
          });
          onToast('دیتاست با موفقیت حذف شد', 'success');
        } else {
          onToast('خطا در حذف دیتاست', 'error');
        }
      } catch (error) {
        console.error('Delete error:', error);
        onToast('خطا در حذف دیتاست', 'error');
      }
    }
  };

  const handleDownload = async (datasetId) => {
    try {
      const dataset = datasets.find(ds => ds.id === datasetId);
      if (!dataset) return;

      onToast('شروع دانلود دیتاست...', 'loading');

      const response = await fetch(`/api/datasets/download/${datasetId}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${dataset.name}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        onToast('دانلود با موفقیت انجام شد', 'success');
      } else {
        onToast('خطا در دانلود دیتاست', 'error');
      }
    } catch (error) {
      console.error('Download error:', error);
      onToast('خطا در دانلود دیتاست', 'error');
    }
  };

  const handleUseInTraining = (datasetId) => {
    onToast('دیتاست برای آموزش انتخاب شد', 'success');
  };

  const filteredDatasets = (Array.isArray(datasets) ? datasets : []).filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dataset.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || dataset.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDatasets = filteredDatasets.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getDatasetIcon = (type) => {
    switch (type) {
      case 'text': return <FileText size={20} />;
      case 'audio': return <Volume2 size={20} />;
      case 'image': return <Image size={20} />;
      case 'conversation': return <Database size={20} />;
      default: return <Database size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      ready: { text: 'آماده', color: '#10b981', bg: '#d1fae5' },
      processing: { text: 'در حال پردازش', color: '#f59e0b', bg: '#fef3c7' },
      error: { text: 'خطا', color: '#ef4444', bg: '#fee2e2' }
    };

    const config = statusConfig[status] || statusConfig.ready;

    return (
      <span style={{
        padding: '0.25rem 0.5rem',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: '500',
        color: config.color,
        backgroundColor: config.bg
      }}>
        {config.text}
      </span>
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleFolderUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      await handleUpload(files);
    }
  };

  if (loading) {
    return (
      <div className="datasets-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2 className="loading-title">در حال بارگذاری</h2>
          <p className="loading-subtitle loading-text">دیتاست‌ها در حال بارگذاری هستند...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-12" dir="rtl">
      <ModeSwitch
        mode={mode}
        setMode={setMode}
        modes={['list', 'url']}
        labels={['نمایش لیستی', 'دانلود از URL']}
        ariaLabel="حالت نمایش دیتاست‌ها"
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
          urlPlaceholder="https://huggingface.co/datasets/..."
          dirPlaceholder="data/datasets"
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

      <div className="metrics-dashboard">
        <div className="metric-card">
          <div className="metric-card-top">
            <div className="growth-indicator">
              <span className="growth-value">12%+</span>
              <svg className="growth-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="icon-container dataset-icon">
              <Database size={24} />
            </div>
          </div>

          <div className="metric-card-value">
            <span className="value-primary">{metrics.totalDatasets}</span>
          </div>

          <div className="metric-card-content">
            <h3 className="metric-title">تعداد کل دیتاست‌ها</h3>
            <p className="metric-subtitle">دیتاست‌های موجود</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <div className="growth-indicator">
              <span className="growth-value">8.5%+</span>
              <svg className="growth-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="icon-container model-icon">
              <HardDrive size={24} />
            </div>
          </div>

          <div className="metric-card-value">
            <span className="value-primary">{metrics.totalSize.toFixed(1)}</span>
            <span className="value-secondary">GB</span>
          </div>

          <div className="metric-card-content">
            <h3 className="metric-title">حجم کل داده‌ها</h3>
            <p className="metric-subtitle">حجم ذخیره شده</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-card-top">
            <div className="growth-indicator no-growth">
              <span>0%</span>
            </div>
            <div className="icon-container processing-icon">
              <Activity size={24} />
            </div>
          </div>

          <div className="metric-card-value">
            <span className="value-primary">{formatNumber(metrics.totalSamples)}</span>
          </div>

          <div className="metric-card-content">
            <h3 className="metric-title">تعداد کل نمونه‌ها</h3>
            <p className="metric-subtitle">نمونه‌های موجود</p>
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
            <div className="icon-container success-icon">
              <CheckCircle size={24} />
            </div>
          </div>

          <div className="metric-card-value">
            <span className="value-primary">{metrics.readyDatasets}</span>
          </div>

          <div className="metric-card-content">
            <h3 className="metric-title">دیتاست‌های آماده</h3>
            <p className="metric-subtitle">آماده برای استفاده</p>
          </div>
        </div>
      </div>

      <div className="datasets-header">
        <div className="header-content">
          <h1 className="page-title">
            <Database size={28} />
            مدیریت دیتاست‌ها
          </h1>
          <p className="page-description">
            آپلود، مدیریت و سازمان‌دهی مجموعه داده‌های فارسی
          </p>
        </div>

        <div className="header-actions">
          <motion.button
            className="refresh-btn-modern"
            onClick={loadDatasets}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={18} />
            بروزرسانی
          </motion.button>

          <motion.button
            className="upload-btn-modern"
            onClick={() => setShowUploadModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
            آپلود دیتاست جدید
          </motion.button>
        </div>
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="جستجو در دیتاست‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
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
            className={`filter-btn ${filterType === 'audio' ? 'active' : ''}`}
            onClick={() => setFilterType('audio')}
          >
            صوتی
          </button>
          <button
            className={`filter-btn ${filterType === 'image' ? 'active' : ''}`}
            onClick={() => setFilterType('image')}
          >
            تصویری
          </button>
          <button
            className={`filter-btn ${filterType === 'conversation' ? 'active' : ''}`}
            onClick={() => setFilterType('conversation')}
          >
            گفتگو
          </button>
        </div>
      </div>

      <div className="datasets-grid">
        <AnimatePresence>
          {paginatedDatasets.map((dataset, index) => (
            <motion.div
              key={dataset.id}
              className="dataset-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
            >
              <div className="dataset-header">
                <div className="dataset-icon">
                  {getDatasetIcon(dataset.type)}
                </div>
                <div className="dataset-info">
                  <h3 className="dataset-name">{dataset.name}</h3>
                  <p className="dataset-description">{dataset.description}</p>
                </div>
                <div className="dataset-status">
                  {getStatusBadge(dataset.status)}
                </div>
              </div>

              <div className="dataset-details">
                <div className="detail-item">
                  <span className="detail-label">نوع:</span>
                  <span className="detail-value">{dataset.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">حجم:</span>
                  <span className="detail-value">{dataset.size}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">نمونه‌ها:</span>
                  <span className="detail-value">{(dataset.samples || 0).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">تاریخ:</span>
                  <span className="detail-value">{dataset.createdAt}</span>
                </div>
              </div>

              <div className="dataset-tags">
                {(dataset.tags || []).map((tag, tagIndex) => (
                  <span key={tagIndex} className="dataset-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="dataset-actions">
                <motion.button
                  className="action-btn primary"
                  onClick={() => handleDownload(dataset.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={16} />
                  دانلود
                </motion.button>

                <motion.button
                  className="action-btn secondary"
                  onClick={() => handleUseInTraining(dataset.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Upload size={16} />
                  استفاده در آموزش
                </motion.button>

                <motion.button
                  className="action-btn danger"
                  onClick={() => handleDelete(dataset.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredDatasets.length === 0 && (
        <motion.div
          className="empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Database size={64} />
          <h3>هیچ دیتاستی یافت نشد</h3>
          <p>برای شروع، یک دیتاست جدید آپلود کنید</p>
          <motion.button
            className="upload-btn-modern"
            onClick={() => setShowUploadModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={18} />
            آپلود دیتاست
          </motion.button>
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="harmony-pagination">
          <div className="harmony-pagination-content">
            <div className="harmony-pagination-info">
              نمایش {startIndex + 1} تا {Math.min(startIndex + itemsPerPage, filteredDatasets.length)} از {filteredDatasets.length} دیتاست
            </div>

            <div className="harmony-pagination-controls">
              <button
                className="harmony-pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronRight size={16} />
                قبلی
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    className={`harmony-pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="harmony-pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                بعدی
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !uploading && setShowUploadModal(false)}
          >
            <motion.div
              className="upload-modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>آپلود دیتاست جدید</h3>
                <button
                  className="close-btn"
                  onClick={() => !uploading && setShowUploadModal(false)}
                  disabled={uploading}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-content">
                <p className="modal-description">
                  فایل‌ها یا پوشه دیتاست خود را انتخاب کنید
                </p>

                <div className="upload-area">
                  <FolderOpen size={48} />
                  <p>فایل‌ها یا پوشه را اینجا بکشید یا کلیک کنید</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    webkitdirectory=""
                    directory=""
                    onChange={handleFolderUpload}
                    style={{ display: 'none' }}
                    id="folder-input"
                    disabled={uploading}
                  />
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <label htmlFor="folder-input" className="upload-label" style={{ opacity: uploading ? 0.5 : 1, pointerEvents: uploading ? 'none' : 'auto' }}>
                      <FolderOpen size={16} />
                      انتخاب پوشه
                    </label>
                    <label htmlFor="file-input" className="upload-label" style={{ opacity: uploading ? 0.5 : 1, pointerEvents: uploading ? 'none' : 'auto' }}>
                      <Upload size={16} />
                      انتخاب فایل
                    </label>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files.length > 0) {
                        handleUpload(e.target.files);
                      }
                    }}
                    style={{ display: 'none' }}
                    id="file-input"
                    disabled={uploading}
                  />
                </div>

                <div className="upload-formats">
                  <p>فرمت‌های پشتیبانی شده:</p>
                  <div className="format-tags">
                    <span className="format-tag">CSV</span>
                    <span className="format-tag">JSON</span>
                    <span className="format-tag">TXT</span>
                    <span className="format-tag">XML</span>
                    <span className="format-tag">MP3</span>
                    <span className="format-tag">WAV</span>
                    <span className="format-tag">JPG</span>
                    <span className="format-tag">PNG</span>
                  </div>
                </div>

                {uploading && (
                  <div className="upload-progress">
                    <div className="progress-bar">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p>در حال آپلود... {uploadProgress.toFixed(0)}%</p>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowUploadModal(false)}
                  disabled={uploading}
                >
                  {uploading ? 'در حال آپلود...' : 'لغو'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Datasets;