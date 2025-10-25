import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, AlertCircle, RefreshCw, Loader, Package, Database, Brain } from 'lucide-react';
import api from '../api/endpoints';

function CatalogPicker({ onSelectionChange, selectedBaseModel, selectedDatasets, selectedTeacherModel }) {
    const [models, setModels] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [teacherModels, setTeacherModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        loadCatalog();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const loadCatalog = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();

            // Load models and datasets in parallel
            const [modelsResult, datasetsResult] = await Promise.all([
                api.getCatalogModels(),
                api.getCatalogDatasets()
            ]);

            if (modelsResult.ok) {
                setModels(modelsResult.data);
            } else {
                console.warn('Failed to load models:', modelsResult.error);
                setModels(getDefaultModels());
            }

            if (datasetsResult.ok) {
                setDatasets(datasetsResult.data);
            } else {
                console.warn('Failed to load datasets:', datasetsResult.error);
                setDatasets(getDefaultDatasets());
            }

            // Teacher models are typically a subset of base models
            setTeacherModels(modelsResult.ok ? modelsResult.data.filter(m => m.type === 'teacher') : []);

        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Catalog loading error:', err);
                setError('خطا در بارگذاری کاتالوگ');
                setModels(getDefaultModels());
                setDatasets(getDefaultDatasets());
                setTeacherModels([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        loadCatalog();
    };

    const handleBaseModelSelect = (model) => {
        onSelectionChange({
            baseModel: model,
            datasets: selectedDatasets,
            teacherModel: selectedTeacherModel
        });
    };

    const handleDatasetToggle = (dataset) => {
        const isSelected = selectedDatasets.some(d => d.id === dataset.id);
        const newDatasets = isSelected
            ? selectedDatasets.filter(d => d.id !== dataset.id)
            : [...selectedDatasets, dataset];

        onSelectionChange({
            baseModel: selectedBaseModel,
            datasets: newDatasets,
            teacherModel: selectedTeacherModel
        });
    };

    const handleTeacherModelSelect = (model) => {
        onSelectionChange({
            baseModel: selectedBaseModel,
            datasets: selectedDatasets,
            teacherModel: model
        });
    };

    if (loading) {
        return (
            <div className="catalog-picker">
                <div className="loading-skeleton" style={{ height: '200px', borderRadius: '0.5rem' }} />
            </div>
        );
    }

    return (
        <div className="catalog-picker">
            {error && (
                <div className="error-banner">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                        <button
                            onClick={handleRetry}
                            className="retry-btn"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                                padding: '0.25rem'
                            }}
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Base Model Selection */}
            <div className="selection-section">
                <h3 className="section-title">
                    <Brain className="w-5 h-5" />
                    مدل پایه (اجباری)
                </h3>
                <div className="resource-grid">
                    {models.map(model => (
                        <div
                            key={model.id}
                            className={`resource-item ${selectedBaseModel?.id === model.id ? 'selected' : ''}`}
                            onClick={() => handleBaseModelSelect(model)}
                        >
                            <div className="resource-icon">🤖</div>
                            <div className="resource-info">
                                <h4>{model.name}</h4>
                                <div className="resource-meta">
                                    <span className="meta-tag">{model.type}</span>
                                    <span className="meta-size">{model.size}</span>
                                </div>
                            </div>
                            {selectedBaseModel?.id === model.id && (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Datasets Selection */}
            <div className="selection-section">
                <h3 className="section-title">
                    <Database className="w-5 h-5" />
                    دیتاست‌ها (حداقل ۱ مورد)
                </h3>
                <div className="resource-grid">
                    {datasets.map(dataset => {
                        const isSelected = selectedDatasets.some(d => d.id === dataset.id);
                        return (
                            <div
                                key={dataset.id}
                                className={`resource-item ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleDatasetToggle(dataset)}
                            >
                                <div className="resource-icon">📊</div>
                                <div className="resource-info">
                                    <h4>{dataset.name}</h4>
                                    <div className="resource-meta">
                                        <span className="meta-tag">{dataset.samples} نمونه</span>
                                        <span className="meta-size">{dataset.size}</span>
                                    </div>
                                </div>
                                {isSelected && (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Teacher Model Selection (Optional) */}
            {teacherModels.length > 0 && (
                <div className="selection-section">
                    <h3 className="section-title">
                        <Package className="w-5 h-5" />
                        مدل معلم (اختیاری)
                    </h3>
                    <div className="resource-grid">
                        {teacherModels.map(model => (
                            <div
                                key={model.id}
                                className={`resource-item ${selectedTeacherModel?.id === model.id ? 'selected' : ''}`}
                                onClick={() => handleTeacherModelSelect(model)}
                            >
                                <div className="resource-icon">👨‍🏫</div>
                                <div className="resource-info">
                                    <h4>{model.name}</h4>
                                    <div className="resource-meta">
                                        <span className="meta-tag">{model.type}</span>
                                        <span className="meta-size">{model.size}</span>
                                    </div>
                                </div>
                                {selectedTeacherModel?.id === model.id && (
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Selection Summary */}
            <div className="selection-summary">
                <div className="summary-item">
                    <span>مدل پایه:</span>
                    <span className={selectedBaseModel ? 'text-green-600' : 'text-red-600'}>
                        {selectedBaseModel ? selectedBaseModel.name : 'انتخاب نشده'}
                    </span>
                </div>
                <div className="summary-item">
                    <span>دیتاست‌ها:</span>
                    <span className={selectedDatasets.length > 0 ? 'text-green-600' : 'text-red-600'}>
                        {selectedDatasets.length} مورد
                    </span>
                </div>
                {selectedTeacherModel && (
                    <div className="summary-item">
                        <span>مدل معلم:</span>
                        <span className="text-blue-600">{selectedTeacherModel.name}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

// Default fallback data
function getDefaultModels() {
    return [
        { id: 'gpt2-persian', name: 'GPT-2 Persian', type: 'text-generation', size: '1.2GB' },
        { id: 'bert-fa', name: 'BERT Persian', type: 'classification', size: '420MB' },
        { id: 'roberta-fa', name: 'RoBERTa Persian', type: 'token-classification', size: '480MB' }
    ];
}

function getDefaultDatasets() {
    return [
        { id: 'fartail', name: 'FarsTail Dataset', samples: '10.3K', size: '25MB' },
        { id: 'persian-news', name: 'Persian News Dataset', samples: '800K', size: '150MB' },
        { id: 'persian-sentiment', name: 'Persian Sentiment Dataset', samples: '50K', size: '50MB' }
    ];
}

export default CatalogPicker;
