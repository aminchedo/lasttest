import React from 'react';
import { Package, Download, CheckCircle, Clock, XCircle, Star, Eye } from 'lucide-react';
const ModelCard = ({
    model,
    onDownload,
    onSelect,
    isSelected = false,
    showSelection = false,
    className = ''
}) => {
    const getTypeIcon = (pipelineTag) => {
        switch (pipelineTag) {
            case 'text-generation':
            case 'conversational':
                return <Package size={20} />;
            case 'fill-mask':
            case 'text-classification':
                return <Package size={20} />;
            case 'image-classification':
            case 'object-detection':
                return <Package size={20} />;
            case 'automatic-speech-recognition':
            case 'text-to-speech':
                return <Package size={20} />;
            default:
                return <Package size={20} />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ready':
                return <CheckCircle size={16} className="text-green-500" />;
            case 'downloading':
                return <Clock size={16} className="text-orange-500" />;
            case 'error':
                return <XCircle size={16} className="text-red-500" />;
            default:
                return <Package size={16} className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ready':
                return 'harmony-success';
            case 'downloading':
                return 'harmony-warning';
            case 'error':
                return 'harmony-danger';
            default:
                return 'harmony-secondary';
        }
    };

    const getTypeLabel = (pipelineTag) => {
        switch (pipelineTag) {
            case 'text-generation':
                return 'تولید متن';
            case 'conversational':
                return 'گفتگو';
            case 'fill-mask':
                return 'پر کردن جاهای خالی';
            case 'text-classification':
                return 'دسته‌بندی متن';
            case 'image-classification':
                return 'دسته‌بندی تصویر';
            case 'object-detection':
                return 'تشخیص اشیاء';
            case 'automatic-speech-recognition':
                return 'تشخیص گفتار';
            case 'text-to-speech':
                return 'تبدیل متن به گفتار';
            default:
                return pipelineTag || 'نامشخص';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'ready':
                return 'آماده';
            case 'downloading':
                return 'در حال دانلود';
            case 'error':
                return 'خطا';
            default:
                return 'نامشخص';
        }
    };

    const formatNumber = (value) => {
        if (!Number.isFinite(value)) {
            return '0';
        }
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        }
        if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return String(value);
    };

    const hasLikes = Number.isFinite(model.likes);
    const hasDownloads = Number.isFinite(model.downloads);

    return (
        <div className={`harmony-model-card ${className} ${isSelected ? 'selected' : ''}`}>
            <div className="harmony-model-header">
                <div className="harmony-model-icon" style={{ backgroundColor: 'var(--harmony-bg-tertiary)' }}>
                    {getTypeIcon(model.pipeline_tag)}
                </div>
                <div className="harmony-model-title">
                    <h3 className="harmony-model-name">{model.name || model.modelId}</h3>
                    <p className="harmony-model-description">{model.description || 'مدل هوش مصنوعی'}</p>
                </div>
                {showSelection && (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelect(model.id)}
                        className="harmony-model-checkbox"
                    />
                )}
            </div>

            <div className="harmony-model-meta">
                <span className="harmony-model-type">{getTypeLabel(model.pipeline_tag)}</span>
                {model.library_name && (
                    <span className="harmony-model-library">{model.library_name}</span>
                )}
                {hasLikes && (
                    <span className="harmony-model-likes">
                        <Star size={12} />
                        {formatNumber(model.likes)}
                    </span>
                )}
                {hasDownloads && (
                    <span className="harmony-model-downloads">
                        <Eye size={12} />
                        {formatNumber(model.downloads)}
                    </span>
                )}
            </div>

            <div className="harmony-model-actions">
                <button
                    className="harmony-btn harmony-btn-primary"
                    onClick={() => onDownload && onDownload(model)}
                    disabled={model.status === 'downloading'}
                >
                    <Download size={16} />
                    دانلود
                </button>
                {model.author && (
                    <span className="harmony-model-author">توسط {model.author}</span>
                )}
            </div>
        </div>
    );
};

export default ModelCard;
