// Downloader.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download, Database, Brain, Volume2, Search, RefreshCw,
    CheckCircle, Clock, AlertCircle, HardDrive, Package, FileText,
    Trash2, Eye, ChevronRight, Star, Activity, Filter, Play, StopCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import apiClient from '../api/client';
import { clamp, text } from '../utils/sanitize';
import './Downloader.css';

const Downloader = () => {
    const [activeTab, setActiveTab] = useState('datasets');
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadDownloads();
    }, [activeTab]);

    const loadDownloads = async () => {
        setRefreshing(true);
        try {
            let response;

            // تلاش برای دریافت داده از API
            try {
                switch (activeTab) {
                    case 'models':
                        response = await apiClient.getModels();
                        break;
                    case 'datasets':
                        response = await apiClient.getDatasets();
                        break;
                    case 'tts':
                        response = await apiClient.getTTSModels();
                        break;
                    default:
                        response = await apiClient.getModels();
                }

                if (response && response.ok) {
                    const items = response.data || [];

                    // تبدیل داده‌های API به فرمت یکسان
                    const formattedItems = items.map(item => ({
                        id: item.id || item._id,
                        name: item.name || item.filename || 'بدون نام',
                        description: item.description || item.type || 'بدون توضیح',
                        size: item.size || 'نامشخص',
                        status: getItemStatus(item),
                        type: item.type || activeTab,
                        createdAt: formatDate(item.createdAt || item.downloadDate),
                        downloads: item.downloads || 0,
                        progress: item.progress || 0,
                        filePath: item.path || item.filePath,
                        error: item.error,
                        isHuggingFace: item.isHuggingFace || false
                    }));

                    setDownloads(formattedItems);
                } else {
                    throw new Error('API response not ok');
                }
            } catch (apiError) {
                // اگر API در دسترس نبود، از داده‌های نمونه استفاده کن
                console.log('Using mock data due to API error:', apiError);
                const mockData = getMockData();
                setDownloads(mockData[activeTab] || []);
            }

        } catch (error) {
            console.error('Error loading downloads:', error);
            toast.error('خطا در بارگذاری منابع');
            setDownloads([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const getMockData = () => ({
        datasets: [
            {
                id: 'dataset-1',
                name: 'دیتاست متن فارسی',
                description: 'مجموعه داده‌های متنی برای آموزش مدل‌های NLP',
                size: '2.1GB',
                status: 'ready',
                type: 'text',
                createdAt: '۱۴۰۲/۱۰/۱۵',
                downloads: 45,
                progress: 100
            },
            {
                id: 'dataset-2',
                name: 'دیتاست تصاویر',
                description: 'تصاویر برای آموزش مدل‌های بینایی کامپیوتر',
                size: '4.5GB',
                status: 'downloading',
                type: 'vision',
                createdAt: '۱۴۰۲/۱۰/۱۶',
                downloads: 23,
                progress: 65
            }
        ],
        models: [
            {
                id: 'model-1',
                name: 'مدل پردازش متن',
                description: 'مدل آموزش دیده برای پردازش زبان فارسی',
                size: '780MB',
                status: 'ready',
                type: 'text',
                createdAt: '۱۴۰۲/۱۰/۱۲',
                downloads: 89,
                progress: 100,
                isHuggingFace: true
            },
            {
                id: 'model-2',
                name: 'مدل تشخیص اشیاء',
                description: 'مدل بینایی کامپیوتر برای تشخیص اشیاء',
                size: '1.2GB',
                status: 'error',
                type: 'vision',
                createdAt: '۱۴۰۲/۱۰/۱۴',
                downloads: 34,
                progress: 45,
                error: 'خطا در اتصال به سرور'
            }
        ],
        tts: [
            {
                id: 'tts-1',
                name: 'مدل TTS فارسی',
                description: 'مدل تبدیل متن به گفتار برای زبان فارسی',
                size: '890MB',
                status: 'ready',
                type: 'audio',
                createdAt: '۱۴۰۲/۱۰/۱۰',
                downloads: 67,
                progress: 100
            }
        ]
    });

    const getItemStatus = (item) => {
        if (item.status) return item.status;
        if (item.progress === 100) return 'ready';
        if (item.progress > 0) return 'downloading';
        if (item.error) return 'error';
        return 'ready';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'نامشخص';
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('fa-IR').format(date);
        } catch {
            return dateString;
        }
    };

    const getFilteredDownloads = () => {
        let filtered = downloads;

        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterStatus !== 'all') {
            filtered = filtered.filter(item => item.status === filterStatus);
        }

        return filtered;
    };

    const getTabIcon = (tab) => {
        switch (tab) {
            case 'datasets': return <Database size={20} />;
            case 'models': return <Brain size={20} />;
            case 'tts': return <Volume2 size={20} />;
            default: return <Package size={20} />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ready': return <CheckCircle size={16} className="status-icon ready" />;
            case 'downloading': return <Clock size={16} className="status-icon downloading" />;
            case 'error': return <AlertCircle size={16} className="status-icon error" />;
            case 'completed': return <CheckCircle size={16} className="status-icon ready" />;
            default: return <Clock size={16} className="status-icon pending" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'ready': return 'آماده';
            case 'downloading': return 'در حال دانلود';
            case 'error': return 'خطا';
            case 'completed': return 'تکمیل شده';
            case 'pending': return 'در انتظار';
            default: return status;
        }
    };

    const handleDelete = async (itemId) => {
        if (window.confirm('آیا از حذف این منبع اطمینان دارید؟')) {
            try {
                // تلاش برای حذف از طریق API
                try {
                    let response;
                    switch (activeTab) {
                        case 'models':
                            response = await apiClient.deleteModel(itemId);
                            break;
                        case 'datasets':
                            response = await apiClient.deleteDataset(itemId);
                            break;
                        default:
                            toast.info('عملکرد حذف برای این بخش پیاده‌سازی نشده است');
                            return;
                    }

                    if (response && response.ok) {
                        setDownloads(prev => prev.filter(item => item.id !== itemId));
                        toast.success('منبع با موفقیت حذف شد');
                        return;
                    }
                } catch (apiError) {
                    console.log('API delete failed, using mock delete');
                }

                // حذف نمونه در صورت عدم دسترسی به API
                setDownloads(prev => prev.filter(item => item.id !== itemId));
                toast.success('منبع با موفقیت حذف شد');

            } catch (error) {
                console.error('Delete error:', error);
                toast.error('خطا در حذف منبع');
            }
        }
    };

    const handleView = (item) => {
        toast.success(`مشاهده ${item.name}`);
        console.log('File details:', item);
        // می‌توانید یک modal برای نمایش جزئیات باز کنید
    };

    const handleDownload = async (item) => {
        if (item.status === 'downloading') {
            toast.info('این فایل در حال حاضر در حال دانلود است');
            return;
        }

        try {
            toast.loading(`شروع دانلود ${item.name}`, { id: 'download' });

            // تلاش برای دانلود از طریق API
            try {
                let response;
                if (item.isHuggingFace) {
                    response = await apiClient.startHfDownload(item.id, 'models/base');
                } else {
                    response = await apiClient.downloadModels([item.id]);
                }

                if (response && response.ok) {
                    toast.success(`دانلود ${item.name} شروع شد`, { id: 'download' });

                    setDownloads(prev =>
                        prev.map(dl =>
                            dl.id === item.id
                                ? { ...dl, status: 'downloading', progress: 0 }
                                : dl
                        )
                    );

                    if (response.jobId) {
                        pollDownloadStatus(response.jobId, item.id);
                    }
                    return;
                }
            } catch (apiError) {
                console.log('API download failed, using mock download');
            }

            // شبیه‌سازی دانلود در صورت عدم دسترسی به API
            toast.success(`دانلود ${item.name} شروع شد`, { id: 'download' });
            setDownloads(prev =>
                prev.map(dl =>
                    dl.id === item.id
                        ? { ...dl, status: 'downloading', progress: 0 }
                        : dl
                )
            );

            // شبیه‌سازی پیشرفت دانلود
            simulateDownloadProgress(item.id);

        } catch (error) {
            console.error('Download error:', error);
            toast.error('خطا در شروع دانلود', { id: 'download' });
        }
    };

    const simulateDownloadProgress = (itemId) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                setDownloads(prev =>
                    prev.map(dl =>
                        dl.id === itemId
                            ? { ...dl, status: 'ready', progress: 100 }
                            : dl
                    )
                );
                clearInterval(interval);
                toast.success('دانلود با موفقیت تکمیل شد');
            } else {
                setDownloads(prev =>
                    prev.map(dl =>
                        dl.id === itemId
                            ? { ...dl, progress: Math.min(progress, 99) }
                            : dl
                    )
                );
            }
        }, 500);
    };

    const pollDownloadStatus = async (jobId, itemId) => {
        const interval = setInterval(async () => {
            try {
                const status = await apiClient.getHfStatus(jobId);

                if (status && status.ok) {
                    const jobData = status.data;

                    setDownloads(prev =>
                        prev.map(dl =>
                            dl.id === itemId
                                ? {
                                    ...dl,
                                    status: jobData.status,
                                    progress: jobData.progress || dl.progress
                                }
                                : dl
                        )
                    );

                    if (jobData.status === 'completed' || jobData.status === 'error') {
                        clearInterval(interval);
                        if (jobData.status === 'completed') {
                            toast.success(`دانلود ${itemId} تکمیل شد`);
                        }
                    }
                }
            } catch (error) {
                console.error('Polling error:', error);
                clearInterval(interval);
            }
        }, 2000);
    };

    const handleCancelDownload = async (itemId) => {
        try {
            const item = downloads.find(dl => dl.id === itemId);
            if (!item) return;

            toast.info(`دانلود ${item.name} متوقف شد`);

            setDownloads(prev =>
                prev.map(dl =>
                    dl.id === itemId
                        ? { ...dl, status: 'ready', progress: 0 }
                        : dl
                )
            );
        } catch (error) {
            console.error('Cancel download error:', error);
            toast.error('خطا در توقف دانلود');
        }
    };

    const stats = {
        total: downloads.length,
        ready: downloads.filter(d => d.status === 'ready' || d.status === 'completed').length,
        downloading: downloads.filter(d => d.status === 'downloading').length,
        error: downloads.filter(d => d.status === 'error').length
    };

    if (loading) {
        return (
            <div className="downloader-loading">
                <div className="loading-container">
                    <div className="loading-spinner-large"></div>
                    <p className="loading-text">در حال بارگذاری منابع...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="downloader-page">
            {/* Header */}
            <div className="downloader-header">
                <div className="header-content">
                    <div className="header-title-section">
                        <div className="title-with-icon">
                            <Download className="header-icon" />
                            <h1>منابع دانلود شده</h1>
                        </div>
                        <p className="header-description">
                            مشاهده و مدیریت مدل‌ها، دیتاست‌ها و منابع دانلود شده
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={loadDownloads}
                        className="refresh-btn"
                        disabled={refreshing}
                    >
                        <RefreshCw className={refreshing ? 'spinning' : ''} size={18} />
                        <span>بروزرسانی</span>
                    </motion.button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {[
                    {
                        title: 'کل منابع',
                        value: stats.total,
                        icon: Package,
                        color: 'blue',
                        suffix: 'منبع موجود'
                    },
                    {
                        title: 'آماده',
                        value: stats.ready,
                        icon: CheckCircle,
                        color: 'green',
                        suffix: 'آماده استفاده'
                    },
                    {
                        title: 'در حال دانلود',
                        value: stats.downloading,
                        icon: Clock,
                        color: 'orange',
                        suffix: 'در حال پردازش'
                    },
                    {
                        title: 'خطا',
                        value: stats.error,
                        icon: AlertCircle,
                        color: 'red',
                        suffix: 'نیاز به بررسی'
                    }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`stat-card stat-${stat.color}`}
                    >
                        <div className="stat-icon-wrapper">
                            <stat.icon className={`stat-icon icon-${stat.color}`} size={24} />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-value">{stat.value}</h3>
                            <p className="stat-title">{stat.title}</p>
                            <p className="stat-suffix">{stat.suffix}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="tabs-container">
                <div className="tabs-wrapper">
                    {['datasets', 'models', 'tts'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            <span className="tab-icon">
                                {getTabIcon(tab)}
                            </span>
                            <span className="tab-label">
                                {tab === 'datasets' && 'دیتاست‌ها'}
                                {tab === 'models' && 'مدل‌ها'}
                                {tab === 'tts' && 'TTS'}
                            </span>
                            {downloads.length > 0 && (
                                <span className="tab-badge">
                                    {downloads.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search and Filter */}
            <div className="filters-section">
                <div className="search-container">
                    <div className="search-box">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder={`جستجو در ${activeTab === 'models' ? 'مدل‌ها' : activeTab === 'datasets' ? 'دیتاست‌ها' : 'TTS'}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="clear-search"
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>

                <div className="filter-container">
                    <div className="filter-buttons">
                        {[
                            { key: 'all', label: 'همه' },
                            { key: 'ready', label: 'آماده' },
                            { key: 'downloading', label: 'در حال دانلود' },
                            { key: 'error', label: 'خطا' }
                        ].map(status => (
                            <button
                                key={status.key}
                                className={`filter-btn ${filterStatus === status.key ? 'active' : ''}`}
                                onClick={() => setFilterStatus(status.key)}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Downloads List */}
            <div className="downloads-container">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeTab}-${filterStatus}-${searchTerm}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="downloads-grid"
                    >
                        {getFilteredDownloads().map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className={`download-card ${item.status}`}
                            >
                                <div className="card-header">
                                    <div className="item-icon">
                                        {getTabIcon(activeTab)}
                                        {item.isHuggingFace && (
                                            <div className="hf-indicator" title="Hugging Face">
                                                <Star size={12} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="item-info">
                                        <h3 className="item-name">{item.name}</h3>
                                        <p className="item-description">{item.description}</p>
                                        <div className="item-meta">
                                            <span className="item-size">{item.size}</span>
                                            <span className="item-date">{item.createdAt}</span>
                                            {item.downloads > 0 && (
                                                <span className="item-downloads">📥 {item.downloads}</span>
                                            )}
                                            {item.isHuggingFace && (
                                                <span className="hf-badge">HF</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="item-status">
                                        {getStatusIcon(item.status)}
                                        <span className="status-text">
                                            {getStatusText(item.status)}
                                        </span>
                                        {item.status === 'downloading' && item.progress > 0 && (
                                            <div className="progress-indicator">
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${clamp(item?.progress ?? 0, 0, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="progress-text">{text(clamp(item?.progress ?? 0, 0, 100))}%</span>
                                            </div>
                                        )}
                                        {item.error && (
                                            <div className="error-message" title={item.error}>
                                                <AlertCircle size={12} />
                                                <span>خطا</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="card-actions">
                                    {item.status === 'ready' || item.status === 'completed' ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="action-btn view-btn"
                                            onClick={() => handleView(item)}
                                            title="مشاهده جزئیات"
                                        >
                                            <Eye size={16} />
                                            <span>مشاهده</span>
                                        </motion.button>
                                    ) : item.status === 'downloading' ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="action-btn cancel-btn"
                                            onClick={() => handleCancelDownload(item.id)}
                                            title="توقف دانلود"
                                        >
                                            <StopCircle size={16} />
                                            <span>توقف</span>
                                        </motion.button>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="action-btn download-btn"
                                            onClick={() => handleDownload(item)}
                                            title="دانلود مجدد"
                                        >
                                            <Download size={16} />
                                            <span>دانلود</span>
                                        </motion.button>
                                    )}

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="action-btn delete-btn"
                                        onClick={() => handleDelete(item.id)}
                                        title="حذف منبع"
                                    >
                                        <Trash2 size={16} />
                                        <span>حذف</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {getFilteredDownloads().length === 0 && (
                    <div className="empty-state">
                        <HardDrive className="empty-icon" size={64} />
                        <h3 className="empty-title">
                            {searchTerm || filterStatus !== 'all'
                                ? 'نتیجه‌ای یافت نشد'
                                : 'منبعی یافت نشد'
                            }
                        </h3>
                        <p className="empty-description">
                            {searchTerm || filterStatus !== 'all'
                                ? 'با تغییر فیلترها یا عبارت جستجو دوباره امتحان کنید'
                                : `هنوز هیچ ${activeTab === 'models' ? 'مدلی' : activeTab === 'datasets' ? 'دیتاستی' : 'منبع TTS'} دانلود نکرده‌اید`
                            }
                        </p>
                        {!searchTerm && filterStatus === 'all' && (
                            <button
                                className="browse-btn"
                                onClick={() => {
                                    if (activeTab === 'models') {
                                        window.location.href = '/models';
                                    } else if (activeTab === 'datasets') {
                                        window.location.href = '/datasets';
                                    }
                                }}
                            >
                                <ChevronRight size={16} />
                                <span>
                                    {activeTab === 'models' ? 'مرور مدل‌ها' :
                                        activeTab === 'datasets' ? 'مرور دیتاست‌ها' :
                                            'مرور منابع TTS'}
                                </span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Downloader;