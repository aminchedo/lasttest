import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/endpoints';
import ProgressBar from '../components/ProgressBar';
import ModelCard from '../components/ModelCard';
import Pagination from '../components/Pagination';
import FilterBar from '../components/FilterBar';
import SearchBar from '../components/SearchBar';
import { useDownloadsContext } from '../context/DownloadsProvider';
const HF_API_URL = 'https://huggingface.co/api/models';
const HF_DEFAULT_LIMIT = 60;

// Token is provided through backend config but we keep a local fallback.
const hfToken = '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';

const typeFilters = [
  { id: 'all', label: 'همه' },
  { id: 'text', label: 'متنی' },
  { id: 'vision', label: 'بینایی' },
  { id: 'audio', label: 'صوتی' }
];

const languageFilters = [
  { id: 'all', label: 'همه زبان‌ها' },
  { id: 'fa', label: 'فارسی' }
];

const pipelineTypeMap = {
  'text-generation': 'text',
  'text2text-generation': 'text',
  summarization: 'text',
  translation: 'text',
  conversational: 'text',
  'fill-mask': 'text',
  'token-classification': 'text',
  'question-answering': 'text',
  'table-question-answering': 'text',
  'image-classification': 'vision',
  'image-segmentation': 'vision',
  'object-detection': 'vision',
  'image-to-text': 'vision',
  'automatic-speech-recognition': 'audio',
  'text-to-speech': 'audio',
  'audio-classification': 'audio',
  'voice-activity-detection': 'audio'
};

const getModelTypeId = (pipelineTag) => pipelineTypeMap[pipelineTag] || 'other';

const getPersianType = (pipelineTag) => {
  const dictionary = {
    'text-generation': 'تولید متن',
    'text2text-generation': 'تبدیل متن به متن',
    summarization: 'خلاصه‌سازی متن',
    translation: 'ترجمه',
    conversational: 'گفتگو',
    'fill-mask': 'پر کردن جای خالی',
    'token-classification': 'برچسب‌گذاری توکن',
    'question-answering': 'پاسخ به پرسش',
    'image-classification': 'دسته‌بندی تصویر',
    'image-segmentation': 'قطعه‌بندی تصویر',
    'object-detection': 'تشخیص اشیاء',
    'image-to-text': 'شرح تصویر',
    'automatic-speech-recognition': 'تشخیص گفتار',
    'text-to-speech': 'تبدیل متن به گفتار',
    'audio-classification': 'دسته‌بندی صوت'
  };
  return dictionary[pipelineTag] || 'مدل هوش مصنوعی';
};

const inferLanguage = (model) => {
  if (model.language) {
    return Array.isArray(model.language) ? model.language[0] : model.language;
  }

  const id = (model.id || model.modelId || '').toLowerCase();
  const tags = (model.tags || []).map((t) => t.toLowerCase());

  if (id.includes('persian') || id.includes('farsi') || id.includes('fa-')) {
    return 'fa';
  }
  if (tags.includes('fa') || tags.includes('farsi') || tags.includes('persian')) {
    return 'fa';
  }

  return 'other';
};

const isPersianModel = (model) => inferLanguage(model) === 'fa';

const normalizeModel = (model) => {
  const id = model.id || model.modelId;
  const pipelineTag = model.pipeline_tag || model.pipelineTag || '';
  const language = inferLanguage(model);

  return {
    id,
    modelId: id,
    name: model.name || (id ? id.split('/').pop() : 'مدل ناشناخته'),
    description:
      model.description ||
      model.summary ||
      (pipelineTag ? `مدل ${getPersianType(pipelineTag)}` : 'مدل هوش مصنوعی'),
    pipeline_tag: pipelineTag,
    library_name: model.library_name,
    likes: typeof model.likes === 'number' ? model.likes : 0,
    downloads: typeof model.downloads === 'number' ? model.downloads : 0,
    author: model.author || model.publisher || (id ? id.split('/')[0] : 'Hugging Face'),
    tags: model.tags || [],
    language,
    url: id ? `https://huggingface.co/${id}` : undefined
  };
};

const filterByTypeAndLanguage = (items, type, language) =>
  items.filter((model) => {
    const matchesType = type === 'all' || getModelTypeId(model.pipeline_tag) === type;
    const matchesLanguage =
      language === 'all' ? true : language === 'fa' ? isPersianModel(model) : false;
    return matchesType && matchesLanguage;
  });

const MOCK_MODELS = [
  normalizeModel({
    id: 'HooshvareLab/bert-fa-base-uncased',
    pipeline_tag: 'fill-mask',
    likes: 480,
    downloads: 18000,
    author: 'HooshvareLab',
    tags: ['persian', 'fa', 'nlp', 'bert']
  }),
  normalizeModel({
    id: 'm3hrdadfi/bert-fa-base-uncased-clf-persiannews',
    pipeline_tag: 'text-classification',
    likes: 320,
    downloads: 9100,
    author: 'm3hrdadfi',
    tags: ['persian', 'fa', 'classification']
  }),
  normalizeModel({
    id: 'facebook/detr-resnet-50',
    pipeline_tag: 'object-detection',
    likes: 2100,
    downloads: 120000,
    author: 'Meta',
    tags: ['vision', 'object-detection']
  }),
  normalizeModel({
    id: 'openai/whisper-small',
    pipeline_tag: 'automatic-speech-recognition',
    likes: 5400,
    downloads: 230000,
    author: 'OpenAI',
    tags: ['audio', 'speech-recognition']
  }),
  normalizeModel({
    id: 'distilbert-base-uncased',
    pipeline_tag: 'fill-mask',
    likes: 6200,
    downloads: 450000,
    author: 'Hugging Face',
    tags: ['nlp', 'distilbert']
  })
];

const getMockHuggingFaceModels = (type, query, language) => {
  const search = (query || '').toLowerCase();
  let items = MOCK_MODELS.slice();

  if (search) {
    items = items.filter((model) => {
      const candidate =
        (model.name || '').toLowerCase() +
        (model.description || '').toLowerCase() +
        (model.author || '').toLowerCase() +
        (model.tags || []).join(' ').toLowerCase();
      return candidate.includes(search);
    });
  }

  items = filterByTypeAndLanguage(items, type, language);
  return items;
};

export default function HuggingFaceModels() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [activeLanguage, setActiveLanguage] = useState('all');
  const [healthStatus, setHealthStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const itemsPerPage = 12;

  const pollersRef = useRef({});
  const { upsertJob } = useDownloadsContext();

  useEffect(() => {
    const initialize = async () => {
      try {
        const health = await api.checkHuggingFaceHealth();
        if (health?.ok) {
          setHealthStatus({ ok: true, message: 'متصل' });
        }
      } catch (err) {
        console.error('HF health check error:', err);
        setHealthStatus({ ok: false, message: 'نامشخص' });
      } finally {
        await loadModels({});
      }
    };

    initialize();

    return () => {
      Object.values(pollersRef.current).forEach((intervalId) => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      });
      pollersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadModels = async ({ query, type, language } = {}) => {
    const resolvedQuery = query !== undefined ? query : searchQuery;
    const resolvedType = type !== undefined ? type : activeType;
    const resolvedLanguage = language !== undefined ? language : activeLanguage;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: HF_DEFAULT_LIMIT.toString(),
        sort: 'downloads'
      });

      if (resolvedQuery) {
        params.append('search', resolvedQuery);
      }

      const response = await fetch(`${HF_API_URL}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const normalized = payload.map(normalizeModel);
      const filteredItems = filterByTypeAndLanguage(normalized, resolvedType, resolvedLanguage);

      setModels(filteredItems);
      setHealthStatus({ ok: true, message: 'متصل' });
    } catch (err) {
      console.error('Error loading Hugging Face models:', err);
      setError('خطا در ارتباط با سرور Hugging Face. داده‌های نمونه نمایش داده می‌شود.');
      setHealthStatus({ ok: false, message: 'قطع' });
      setModels(getMockHuggingFaceModels(resolvedType, resolvedQuery, resolvedLanguage));
    } finally {
      setLoading(false);
    }
  };

  const filteredModels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return models.filter((model) => {
      const matchesQuery =
        !q ||
        (model.name || '').toLowerCase().includes(q) ||
        (model.description || '').toLowerCase().includes(q) ||
        (model.author || '').toLowerCase().includes(q) ||
        (model.tags || []).some((tag) => tag.toLowerCase().includes(q));

      const matchesType = activeType === 'all' || getModelTypeId(model.pipeline_tag) === activeType;
      const matchesLanguage =
        activeLanguage === 'all'
          ? true
          : activeLanguage === 'fa'
          ? isPersianModel(model)
          : false;

      return matchesQuery && matchesType && matchesLanguage;
    });
  }, [models, searchQuery, activeType, activeLanguage]);

  const totalPages = Math.max(1, Math.ceil(filteredModels.length / itemsPerPage));
  const currentPageItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredModels.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredModels, currentPage, itemsPerPage]);

  const humanETA = (seconds) => {
    if (!seconds || !Number.isFinite(seconds)) {
      return '';
    }
    const totalSeconds = Math.max(0, Math.round(seconds));
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${String(secs).padStart(2, '0')} باقی‌مانده`;
  };

  const handleServerDownload = async (model) => {
    const modelId = model.modelId || model.id;

    if (!modelId) {
      toast.error('شناسه مدل معتبر نیست');
      return;
    }

    try {
      const downloadResponse = await api.startHfDownload(modelId, 'models/huggingface');
      const responseData = downloadResponse?.data ?? downloadResponse;

      if (responseData?.ok === false) {
        toast.error(responseData.error || 'امکان شروع دانلود وجود ندارد');
        return;
      }

      const jobId = responseData?.jobId || responseData?.data?.jobId;
      if (!jobId) {
        toast.error('شناسه دانلود دریافت نشد');
        return;
      }

      setProgressMap((prev) => ({
        ...prev,
        [modelId]: { pct: 0, speedMbps: 0, eta: '', message: 'در صف دانلود' }
      }));

      upsertJob(jobId, {
        id: jobId,
        type: 'hf',
        status: 'queued',
        progress: 0,
        meta: { modelId }
      });

      if (pollersRef.current[jobId]) {
        clearInterval(pollersRef.current[jobId]);
      }

      pollersRef.current[jobId] = setInterval(async () => {
        try {
          const statusResponse = await api.getHfStatus(jobId);
          const statusPayload = statusResponse?.data ?? statusResponse;
          const statusData = statusPayload?.data ?? statusPayload;

          if (!statusData) {
            return;
          }

          const status = statusData.status || 'processing';
          const progress =
            Number.isFinite(statusData.progress) && statusData.progress >= 0
              ? statusData.progress
              : Number.isFinite(statusData.pct)
              ? statusData.pct
              : 0;

          setProgressMap((prev) => ({
            ...prev,
            [modelId]: {
              pct: progress,
              speedMbps: statusData.speedMbps || statusData.speed || 0,
              eta: humanETA(statusData.etaSec || statusData.eta),
              message: statusData.message || status
            }
          }));

          upsertJob(jobId, { status, progress });

          if (['done', 'completed', 'finished', 'error'].includes(status)) {
            clearInterval(pollersRef.current[jobId]);
            delete pollersRef.current[jobId];

            if (status === 'error') {
              toast.error(statusData.error || 'دانلود ناموفق بود');
            } else {
              toast.success('دانلود و ذخیره‌سازی مدل با موفقیت تکمیل شد');
              setProgressMap((prev) => ({
                ...prev,
                [modelId]: {
                  pct: 100,
                  speedMbps: 0,
                  eta: '',
                  message: 'دانلود کامل شد'
                }
              }));
            }
          }
        } catch (statusError) {
          console.error('HF status polling error:', statusError);
        }
      }, 1000);
    } catch (err) {
      console.error('Error starting HF download:', err);
      toast.error('خطا در شروع دانلود مدل');
    }
  };

  const handleDownload = (model) => {
    handleServerDownload(model);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadModels({ query: searchQuery });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
    loadModels({ query: '' });
  };

  const handleTypeFilterChange = (filterId) => {
    setActiveType(filterId);
    setCurrentPage(1);
    loadModels({ type: filterId });
  };

  const handleLanguageFilterChange = (filterId) => {
    setActiveLanguage(filterId);
    setCurrentPage(1);
    loadModels({ language: filterId });
  };

  return (
    <div className="huggingface-container">
      <div className="hf-header">
        <h2 className="section-title">مدل‌های Hugging Face</h2>
        <div className="hf-status">
          <span
            className={
              healthStatus?.ok ? 'status-indicator connected' : 'status-indicator error'
            }
          />
          <span className="token-status">
            {healthStatus?.message || (healthStatus?.ok ? 'متصل' : 'قطع')}
          </span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="huggingface-controls">
        <SearchBar
          placeholder="جستجو در نام یا توضیح مدل..."
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          onClear={handleClearSearch}
        />

        <div className="huggingface-filter-group">
          <FilterBar
            filters={typeFilters}
            activeFilter={activeType}
            onFilterChange={handleTypeFilterChange}
          />
          <FilterBar
            filters={languageFilters}
            activeFilter={activeLanguage}
            onFilterChange={handleLanguageFilterChange}
            className="huggingface-language-filter"
          />
        </div>
      </div>

      {!loading && filteredModels.length > 0 && (
        <div className="hf-summary">
          <span>
            تعداد مدل‌ها: {filteredModels.length.toLocaleString('fa-IR', { useGrouping: true })}
          </span>
        </div>
      )}

      {loading && <div className="loading-indicator">در حال بارگیری مدل‌ها...</div>}

      {!loading && (
        <>
          <div className="models-grid">
            {currentPageItems.map((model) => {
              const modelKey = model.modelId || model.id;
              const progress = progressMap[modelKey] || {};
              return (
                <div key={modelKey} className="huggingface-card">
                  <ModelCard
                    model={model}
                    onDownload={handleDownload}
                    className="huggingface-model-card"
                  />
                  <div className="huggingface-card-footer">
                    <a className="harmony-model-link" href={model.url} target="_blank" rel="noreferrer">
                      صفحه مدل ↗
                    </a>
                  </div>
                  {progress.pct !== undefined && (
                    <ProgressBar
                      value={progress.pct || 0}
                      speedMbps={progress.speedMbps || 0}
                      eta={progress.eta || ''}
                      message={progress.message || ''}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {filteredModels.length > itemsPerPage && (
            <div className="pagination-container">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredModels.length}
              />
            </div>
          )}
        </>
      )}

      {!loading && filteredModels.length === 0 && (
        <div className="no-models-message">
          <h3>مدلی یافت نشد</h3>
          <p>لطفاً جستجوی دیگری امتحان کنید یا فیلترها را تغییر دهید.</p>
        </div>
      )}
    </div>
  );
}
