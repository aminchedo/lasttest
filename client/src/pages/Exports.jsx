import React, { useState, useRef, useEffect } from 'react';
import {
    Download, FileText, Package, Calendar, Clock, CheckCircle,
    RefreshCw, Filter, Search, Eye, Trash2, Share2
} from 'lucide-react';
import api from '../api/endpoints';
import { num, text, clamp, humanBytes } from '../utils/sanitize';

function Exports() {
    const [exportList, setExportList] = useState([]);
    const [url, setUrl] = useState('');
    const [dest, setDest] = useState('downloads/exports');
    const [jobId, setJobId] = useState(null);
    const [status, setStatus] = useState(null);
    const [progress, setProgress] = useState(0);
    const pollRef = useRef(null);

    async function startExportDl() {
        // TODO: Implement export download functionality
        console.log('Export download:', url, dest);
    }

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        loadExports();
    }, []);

    const loadExports = async () => {
        setLoading(true);
        try {
            const result = await api.getExports();
            if (result.ok && result.data) {
                // Ensure we always get an array
                const exportData = Array.isArray(result.data) ? result.data : [];
                setExportList(exportData);
            } else {
                console.error('Error loading exports:', result.error);
                setExportList([]);
            }
        } catch (error) {
            console.error('Error loading exports:', error);
            setExportList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadExport = async (id) => {
        try {
            const result = await api.downloadExport(id);
            if (result.ok && result.data) {
                const url = window.URL.createObjectURL(result.data);
                const a = document.createElement('a');
                a.href = url;
                a.download = `export-${id}.zip`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                alert('خطا در دانلود فایل');
            }
        } catch (error) {
            console.error('Error downloading export:', error);
            alert('خطا در دانلود فایل');
        }
    };

    const handleDeleteExport = async (id) => {
        if (!window.confirm('آیا از حذف این خروجی اطمینان دارید؟')) {
            return;
        }
        try {
            const result = await api.deleteExport(id);
            if (result.ok) {
                setExportList(exportList.filter(e => e.id !== id));
            } else {
                alert('خطا در حذف خروجی');
            }
        } catch (error) {
            console.error('Error deleting export:', error);
            alert('خطا در حذف خروجی');
        }
    };


    const filteredExports = exportList.filter(exportItem => {
        const matchesSearch = exportItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exportItem.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || exportItem.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const totalDownloads = exportList.reduce((sum, exportItem) => {
        return sum + num(exportItem?.downloads, 0);
    }, 0);

    const totalSizeGb = exportList.reduce((sum, exportItem) => {
        const rawSize = exportItem?.size;
        if (rawSize === null || rawSize === undefined) {
            return sum;
        }

        if (typeof rawSize === 'number' && Number.isFinite(rawSize)) {
            return sum + rawSize / 1024;
        }

        const sizeString = String(rawSize).trim();
        const numericPart = num(parseFloat(sizeString.replace(/[^\d.]/g, '')), 0);
        if (!Number.isFinite(numericPart) || numericPart <= 0) {
            return sum;
        }

        const inGb = sizeString.toLowerCase().includes('gb')
            ? numericPart
            : numericPart / 1024;

        return sum + inGb;
    }, 0);

    const totalSizeGbDisplay = Number.isFinite(totalSizeGb)
        ? totalSizeGb.toFixed(1)
        : '0.0';

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ready': return <CheckCircle size={16} className="text-green-500" />;
            case 'processing': return <Clock size={16} className="text-blue-500 animate-spin" />;
            case 'error': return <Clock size={16} className="text-red-500" />;
            default: return <Clock size={16} className="text-gray-500" />;
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'report': return <FileText size={20} className="text-blue-500" />;
            case 'model': return <Package size={20} className="text-purple-500" />;
            default: return <FileText size={20} className="text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="exports-page animate-fadeInUp">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">
                            📤 مدیریت خروجی‌ها
                        </h1>
                        <p className="helper">مدیریت فایل‌های خروجی و گزارش‌ها</p>
                    </div>
                </div>

                <div className="loading-container">
                    <div className="unified-loading-spinner"></div>
                    <p className="loading-text">در حال بارگذاری خروجی‌ها...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-12 animate-fadeInUp">
            <div className="page-header">
                <div>
                    <h1 className="page-title">
                        📤 مدیریت خروجی‌ها
                    </h1>
                    <p className="helper">مدیریت فایل‌های خروجی و گزارش‌ها</p>
                </div>
                <div className="page-actions">
                    <button className="glass-button">
                        <RefreshCw size={16} />
                        بروزرسانی
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card metric-purple animate-fadeInUp animation-delay-100">
                    <div className="stat-header">
                        <div className="stat-icon">📄</div>
                        <span className="stat-trend">↑</span>
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{exportList.length}</p>
                        <p className="stat-label">فایل‌های خروجی</p>
                        <p className="stat-sublabel">کل فایل‌ها</p>
                    </div>
                </div>

                <div className="stat-card metric-blue animate-fadeInUp animation-delay-200">
                    <div className="stat-header">
                        <div className="stat-icon">📊</div>
                        <span className="stat-trend">↑</span>
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{totalDownloads}</p>
                        <p className="stat-label">کل دانلودها</p>
                        <p className="stat-sublabel">این ماه</p>
                    </div>
                </div>

                <div className="stat-card metric-green animate-fadeInUp animation-delay-300">
                    <div className="stat-header">
                        <div className="stat-icon">💾</div>
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{text(totalSizeGbDisplay)} GB</p>
                        <p className="stat-label">حجم کل</p>
                        <p className="stat-sublabel">ذخیره‌سازی</p>
                    </div>
                </div>

                <div className="stat-card metric-orange animate-fadeInUp animation-delay-400">
                    <div className="stat-header">
                        <div className="stat-icon">✅</div>
                    </div>
                    <div className="stat-content">
                        <p className="stat-value">{exportList.filter(e => e.status === 'ready').length}</p>
                        <p className="stat-label">آماده دانلود</p>
                        <p className="stat-sublabel">از {exportList.length} فایل</p>
                    </div>
                </div>
            </div>

            {/* Enhanced Filters */}
            <div className="filters-section glass-card animate-fadeInUp animation-delay-500">
                <div className="search-container">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            className="glass-input"
                            placeholder="جستجو در خروجی‌ها..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        <FileText size={16} />
                        همه
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'report' ? 'active' : ''}`}
                        onClick={() => setFilterType('report')}
                    >
                        <FileText size={16} />
                        گزارش‌ها
                    </button>
                    <button
                        className={`filter-btn ${filterType === 'model' ? 'active' : ''}`}
                        onClick={() => setFilterType('model')}
                    >
                        <Package size={16} />
                        مدل‌ها
                    </button>
                </div>
            </div>

            {/* Enhanced Exports Grid */}
            <div className="exports-grid">
                {filteredExports.length > 0 ? (
                    filteredExports.map((exportItem, index) => (
                        <div
                            key={exportItem.id}
                            className="export-card interactive-card animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="export-header">
                                <div className="export-icon">
                                    {getTypeIcon(exportItem.type)}
                                </div>
                                <div className="export-info">
                                    <h3 className="export-name">{exportItem.name}</h3>
                                    <p className="export-description">{text(exportItem?.description, 'بدون توضیحات')}</p>
                                    <div className="export-meta">
                                        <span className="export-format">{text(exportItem?.format, 'نامشخص')}</span>
                                        <span className="export-size">{text(exportItem?.size, '0 MB')}</span>
                                    </div>
                                </div>
                                <div className="export-status">
                                    {getStatusIcon(exportItem.status)}
                                    <span className="status-text">
                                        {exportItem.status === 'ready' && 'آماده'}
                                        {exportItem.status === 'processing' && 'در حال پردازش'}
                                        {exportItem.status === 'error' && 'خطا'}
                                    </span>
                                </div>
                            </div>

                            <div className="export-details">
                                <div className="export-metrics">
                                    <div className="metric-item">
                                        <Download size={14} />
                                        <span>{text(num(exportItem?.downloads, 0))} دانلود</span>
                                    </div>
                                    <div className="metric-item">
                                        <Calendar size={14} />
                                        <span>{text(exportItem?.createdAt, 'نامشخص')}</span>
                                    </div>
                                </div>

                                <div className="export-footer">
                                    <div className="export-actions">
                                        <button className="action-btn">
                                            <Eye size={16} />
                                        </button>
                                        <button className="action-btn">
                                            <Download size={16} />
                                        </button>
                                        <button className="action-btn">
                                            <Share2 size={16} />
                                        </button>
                                        <button className="action-btn danger">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-exports glass-card">
                        <FileText size={64} />
                        <h3>هیچ خروجی‌ای یافت نشد</h3>
                        <p>برای شروع، یک مدل آموزش دهید</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Exports;
