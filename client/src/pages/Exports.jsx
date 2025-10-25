import React, { useState, useEffect } from 'react';
import {
    Download, FileText, Package, CheckCircle, Clock, XCircle,
    Search, Database, Brain, Layers, HardDrive, Activity
} from 'lucide-react';
import apiClient from '../api/endpoints';
import { num, text } from '../utils/sanitize';

// Mini progress bar component for download progress (reused from Models.jsx)
function MiniProgressBar({ value }) {
  const pct = Math.min(Math.max(value ?? 0, 0), 100);
  return (
    <div className="w-full h-[2px] bg-slate-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-l from-fuchsia-500 to-violet-500 transition-[width] duration-200 ease-linear"
        style={{ width: pct + '%' }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      />
    </div>
  );
}

function Exports() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Computed metrics from assets
    const totalAssets = assets.length;
    const readyAssets = assets.filter(a => a.status === 'ready').length;
    const totalSizeGb = assets.reduce((sum, a) => {
        const sizeGb = parseFloat(a.sizeGb) || 0;
        return sum + sizeGb;
    }, 0).toFixed(1);
    const downloadsThisMonth = 0; // Placeholder since we don't have per-month timestamp

    // Load all assets from multiple sources
    const loadAssets = async () => {
        setLoading(true);
        try {
            const [modelsResult, datasetsResult, trainingAssetsResult] = await Promise.all([
                apiClient.getCatalogModels().catch(() => ({ ok: false, data: [] })),
                apiClient.getCatalogDatasets().catch(() => ({ ok: false, data: [] })),
                apiClient.getTrainingAssets().catch(() => ({ ok: false, data: [] }))
            ]);

            const unifiedAssets = [];

            // Process models
            if (modelsResult.ok && modelsResult.data) {
                const modelsArray = Array.isArray(modelsResult.data) ? modelsResult.data : [];
                modelsArray.forEach(model => {
                    unifiedAssets.push({
                        id: model.id || `model-${Date.now()}-${Math.random()}`,
                        name: model.name || model.title || 'نام نامشخص',
                        kind: 'model',
                        sizeLabel: model.size || model.sizeLabel || 'نامشخص',
                        sizeGb: parseSizeToGb(model.size || model.sizeLabel),
                        status: model.status || 'ready',
                        source: model.source || model.origin || 'local',
                        downloadedAt: model.downloadedAt || model.createdAt
                    });
                });
            }

            // Process datasets
            if (datasetsResult.ok && datasetsResult.data) {
                const datasetsArray = Array.isArray(datasetsResult.data) ? datasetsResult.data : [];
                datasetsArray.forEach(dataset => {
                    unifiedAssets.push({
                        id: dataset.id || `dataset-${Date.now()}-${Math.random()}`,
                        name: dataset.name || dataset.title || 'نام نامشخص',
                        kind: 'dataset',
                        sizeLabel: dataset.size || dataset.sizeLabel || 'نامشخص',
                        sizeGb: parseSizeToGb(dataset.size || dataset.sizeLabel),
                        status: dataset.status || 'ready',
                        source: dataset.source || dataset.origin || 'local',
                        downloadedAt: dataset.downloadedAt || dataset.createdAt
                    });
                });
            }

            // Process training assets/checkpoints
            if (trainingAssetsResult.ok && trainingAssetsResult.data) {
                const assetsArray = Array.isArray(trainingAssetsResult.data) ? trainingAssetsResult.data : [];
                assetsArray.forEach(asset => {
                    unifiedAssets.push({
                        id: asset.id || `checkpoint-${Date.now()}-${Math.random()}`,
                        name: asset.name || asset.title || 'نام نامشخص',
                        kind: asset.kind || 'checkpoint',
                        sizeLabel: asset.size || asset.sizeLabel || 'نامشخص',
                        sizeGb: parseSizeToGb(asset.size || asset.sizeLabel),
                        status: asset.status || 'ready',
                        source: asset.source || 'training output',
                        downloadedAt: asset.downloadedAt || asset.createdAt
                    });
                });
            }

            setAssets(unifiedAssets);
        } catch (error) {
            console.error('Error loading assets:', error);
            setAssets([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper to parse size strings to GB
    const parseSizeToGb = (sizeStr) => {
        if (!sizeStr) return 0;
        if (typeof sizeStr === 'number') return sizeStr;
        
        const str = String(sizeStr).toLowerCase();
        const numMatch = str.match(/[\d.]+/);
        if (!numMatch) return 0;
        
        const num = parseFloat(numMatch[0]);
        if (str.includes('gb')) return num;
        if (str.includes('mb')) return num / 1024;
        if (str.includes('kb')) return num / (1024 * 1024);
        return 0;
    };

    useEffect(() => {
        loadAssets();
    }, []);

    // Filter assets based on search and filter type
    const filteredAssets = assets.filter(asset => {
        const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || asset.kind === filterType;
        return matchesSearch && matchesFilter;
    });

    // Get kind label in Persian
    const getKindLabel = (kind) => {
        switch (kind) {
            case 'model': return 'مدل';
            case 'dataset': return 'دیتاست';
            case 'checkpoint': return 'خروجی آموزش';
            case 'tts': return 'TTS';
            default: return kind;
        }
    };

    // Get status icon and label
    const getStatusDisplay = (status) => {
        switch (status) {
            case 'ready':
                return { icon: <CheckCircle size={14} className="text-green-500" />, label: 'آماده' };
            case 'downloading':
                return { icon: <Clock size={14} className="text-blue-500 animate-pulse" />, label: 'در حال دانلود' };
            case 'error':
                return { icon: <XCircle size={14} className="text-red-500" />, label: 'خطا' };
            default:
                return { icon: <Clock size={14} className="text-slate-400" />, label: 'نامشخص' };
        }
    };

    if (loading) {
        return (
            <div className="w-full flex flex-col items-stretch bg-[#F5F7FB] text-slate-900 rtl pb-24">
                <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col gap-6 pt-6">
                    <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex items-center justify-center min-h-[200px]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-3 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-slate-600">در حال بارگذاری منابع...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-stretch bg-[#F5F7FB] text-slate-900 rtl pb-24">
            <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col gap-6 pt-6">
                
                {/* Page Header */}
                <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">منابع موجود</h1>
                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full border border-green-200">
                                آنلاین
                            </span>
                        </div>
                        <p className="text-sm text-slate-600">
                            تمام مدل‌ها، دیتاست‌ها و خروجی‌های قابل استفاده روی این سیستم
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={loadAssets}
                        className="px-4 py-2 bg-gradient-to-l from-fuchsia-500 to-violet-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        <Download size={16} />
                        بروزرسانی
                    </button>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {/* Total Assets */}
                    <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                                <Layers size={20} className="text-violet-600" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-3xl font-bold text-slate-900">{totalAssets}</p>
                            <p className="text-xs text-slate-600 font-medium">تعداد کل منابع</p>
                        </div>
                    </div>

                    {/* Downloads This Month */}
                    <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                <Download size={20} className="text-blue-600" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-3xl font-bold text-slate-900">{downloadsThisMonth}</p>
                            <p className="text-xs text-slate-600 font-medium">کل دانلودها این ماه</p>
                        </div>
                    </div>

                    {/* Total Storage */}
                    <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                <HardDrive size={20} className="text-green-600" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-3xl font-bold text-slate-900">{totalSizeGb} GB</p>
                            <p className="text-xs text-slate-600 font-medium">حجم کل ذخیره‌سازی</p>
                        </div>
                    </div>

                    {/* Ready to Use */}
                    <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <CheckCircle size={20} className="text-orange-600" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-3xl font-bold text-slate-900">{readyAssets}</p>
                            <p className="text-xs text-slate-600 font-medium">آماده استفاده الان</p>
                        </div>
                    </div>
                </div>

                {/* Assets List Card */}
                <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-4 flex flex-col gap-4">
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="جستجو در منابع..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-10 pl-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                            />
                        </div>
                        
                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setFilterType('all')}
                                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                                    filterType === 'all'
                                        ? 'bg-violet-50 text-violet-700 border border-violet-200'
                                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                همه
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterType('model')}
                                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                                    filterType === 'model'
                                        ? 'bg-violet-50 text-violet-700 border border-violet-200'
                                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <Brain size={14} />
                                مدل‌ها
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterType('dataset')}
                                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                                    filterType === 'dataset'
                                        ? 'bg-violet-50 text-violet-700 border border-violet-200'
                                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <Database size={14} />
                                دیتاست‌ها
                            </button>
                            <button
                                type="button"
                                onClick={() => setFilterType('checkpoint')}
                                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1 ${
                                    filterType === 'checkpoint'
                                        ? 'bg-violet-50 text-violet-700 border border-violet-200'
                                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <Package size={14} />
                                گزارش‌ها
                            </button>
                        </div>
                    </div>

                    {/* Assets List */}
                    <div className="flex flex-col gap-2">
                        {filteredAssets.length > 0 ? (
                            filteredAssets.map((asset) => {
                                const statusDisplay = getStatusDisplay(asset.status);
                                return (
                                    <div
                                        key={asset.id}
                                        className="flex items-center justify-between text-[12px] text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-[10px] px-3 py-2 transition-colors"
                                    >
                                        {/* Asset Info */}
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="flex-shrink-0">
                                                {asset.kind === 'model' && <Brain size={16} className="text-violet-600" />}
                                                {asset.kind === 'dataset' && <Database size={16} className="text-blue-600" />}
                                                {asset.kind === 'checkpoint' && <Package size={16} className="text-green-600" />}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-medium text-slate-900 truncate">{asset.name}</span>
                                                <span className="text-[10px] text-slate-500">{getKindLabel(asset.kind)}</span>
                                            </div>
                                        </div>

                                        {/* Size */}
                                        <div className="flex-shrink-0 px-3 text-slate-600">
                                            {asset.sizeLabel}
                                        </div>

                                        {/* Status */}
                                        <div className="flex-shrink-0 flex items-center gap-1.5 px-3">
                                            {statusDisplay.icon}
                                            <span className="text-[11px]">{statusDisplay.label}</span>
                                        </div>

                                        {/* Source */}
                                        <div className="flex-shrink-0 px-3 text-slate-500 text-[11px]">
                                            {asset.source}
                                        </div>

                                        {/* Progress bar for downloading */}
                                        {asset.status === 'downloading' && (
                                            <div className="flex-shrink-0 w-24">
                                                <MiniProgressBar value={asset.progress || 0} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                <FileText size={48} className="text-slate-300 mb-3" />
                                <p className="text-sm font-medium">هیچ منبعی یافت نشد</p>
                                <p className="text-xs text-slate-400 mt-1">برای شروع، یک مدل یا دیتاست دانلود کنید</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Exports;
