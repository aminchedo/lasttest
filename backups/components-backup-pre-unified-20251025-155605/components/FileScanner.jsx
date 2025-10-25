import React, { useState, useEffect } from 'react';
import {
  Search, FolderOpen, File, Folder, Filter, Download,
  Eye, Trash2, Upload, RefreshCw, BarChart3, Clock
} from 'lucide-react';
import api from '../api/endpoints';
function FileScanner({ onToast }) {
  const [scanPath, setScanPath] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showStats, setShowStats] = useState(false);

  const handleScan = async () => {
    if (!scanPath.trim()) {
      onToast('لطفاً مسیر را وارد کنید', 'error');
      return;
    }

    setScanning(true);
    setScanResults(null);

    try {
      const result = await api.scanComplete(scanPath, {
        includeAll: true,
        maxDepth: 10
      });

      if (result.ok) {
        setScanResults(result.data);
        onToast(`اسکن کامل شد: ${result.data.stats.totalItems} مورد یافت شد`, 'success');
      } else {
        onToast(result.error, 'error');
      }
    } catch (error) {
      onToast('خطا در اسکن', 'error');
    } finally {
      setScanning(false);
    }
  };

  const handleSelectItem = (index) => {
    setSelectedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((_, i) => i));
    }
  };

  const handleImport = async () => {
    if (selectedItems.length === 0) {
      onToast('لطفاً موارد را انتخاب کنید', 'error');
      return;
    }

    const itemsToImport = selectedItems.map(i => filteredItems[i]);

    try {
      const result = await api.importAssets(itemsToImport);
      if (result.ok) {
        onToast(`${result.data.imported} مورد واردات شد`, 'success');
        setSelectedItems([]);
      } else {
        onToast(result.error, 'error');
      }
    } catch (error) {
      onToast('خطا در واردات', 'error');
    }
  };

  // فیلتر و مرتب‌سازی نتایج با تشخیص بهبود یافته
  const filteredItems = React.useMemo(() => {
    if (!scanResults?.items) return [];

    let filtered = scanResults.items.map(item => ({
      ...item,
      detectedType: detectModelType(item) // Add detected type to each item
    }));

    // فیلتر بر اساس نوع (با استفاده از تشخیص بهبود یافته)
    if (filterType !== 'all') {
      filtered = filtered.filter(item => {
        const detectedType = item.detectedType;
        return detectedType === filterType ||
          item.kind === filterType ||
          item.type === filterType;
      });
    }

    // فیلتر بر اساس جستجو
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.detectedType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // مرتب‌سازی
    filtered.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'size':
          aVal = a.size || 0;
          bVal = b.size || 0;
          break;
        case 'type':
          aVal = a.detectedType || a.kind || 'unknown';
          bVal = b.detectedType || b.kind || 'unknown';
          break;
        case 'modified':
          aVal = new Date(a.modified || 0);
          bVal = new Date(b.modified || 0);
          break;
        default:
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [scanResults, filterType, searchTerm, sortBy, sortOrder]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fa-IR');
  };

  // Improved model detection function
  const detectModelType = (item) => {
    if (item.isDirectory) return 'directory';

    const fileName = item.name.toLowerCase();
    const filePath = item.path.toLowerCase();

    // Model file extensions
    const modelExtensions = [
      '.pth', '.pt', '.pkl', '.pickle', '.h5', '.hdf5', '.pb', '.pkl',
      '.model', '.bin', '.safetensors', '.ckpt', '.weights', '.onnx',
      '.tflite', '.mlmodel', '.pkl', '.joblib', '.npy', '.npz'
    ];

    // Dataset file extensions
    const datasetExtensions = [
      '.csv', '.json', '.jsonl', '.parquet', '.feather', '.arrow',
      '.tsv', '.txt', '.data', '.dat', '.db', '.sqlite'
    ];

    // Audio file extensions
    const audioExtensions = [
      '.wav', '.mp3', '.flac', '.aac', '.ogg', '.m4a', '.wma'
    ];

    // Image file extensions
    const imageExtensions = [
      '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp', '.svg'
    ];

    // Code file extensions
    const codeExtensions = [
      '.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.cpp', '.c', '.h',
      '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala'
    ];

    // Document file extensions
    const documentExtensions = [
      '.pdf', '.doc', '.docx', '.txt', '.rtf', '.odt', '.md', '.rst'
    ];

    // Archive file extensions
    const archiveExtensions = [
      '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz'
    ];

    // Check for model files
    if (modelExtensions.some(ext => fileName.endsWith(ext))) {
      return 'model';
    }

    // Check for dataset files
    if (datasetExtensions.some(ext => fileName.endsWith(ext))) {
      return 'dataset';
    }

    // Check for audio files
    if (audioExtensions.some(ext => fileName.endsWith(ext))) {
      return 'audio';
    }

    // Check for image files
    if (imageExtensions.some(ext => fileName.endsWith(ext))) {
      return 'image';
    }

    // Check for code files
    if (codeExtensions.some(ext => fileName.endsWith(ext))) {
      return 'code';
    }

    // Check for document files
    if (documentExtensions.some(ext => fileName.endsWith(ext))) {
      return 'document';
    }

    // Check for archive files
    if (archiveExtensions.some(ext => fileName.endsWith(ext))) {
      return 'archive';
    }

    // Check for config files
    if (fileName.includes('config') || fileName.includes('setting') ||
      fileName.endsWith('.yaml') || fileName.endsWith('.yml') ||
      fileName.endsWith('.ini') || fileName.endsWith('.cfg') ||
      fileName.endsWith('.conf') || fileName.endsWith('.json')) {
      return 'config';
    }

    // Check for vocabulary files
    if (fileName.includes('vocab') || fileName.includes('token') ||
      fileName.endsWith('.vocab') || fileName.endsWith('.tokens')) {
      return 'vocabulary';
    }

    return 'unknown';
  };

  const getFileIcon = (item) => {
    if (item.isDirectory) {
      return <Folder className="w-5 h-5" style={{ color: '#3498db' }} />;
    }

    // Use improved detection
    const detectedType = detectModelType(item);

    switch (detectedType) {
      case 'model': return '🤖';
      case 'dataset': return '📊';
      case 'config': return '⚙️';
      case 'vocabulary': return '📚';
      case 'audio': return '🎵';
      case 'image': return '🖼️';
      case 'code': return '💻';
      case 'document': return '📄';
      case 'archive': return '📦';
      case 'directory': return <Folder className="w-5 h-5" style={{ color: '#3498db' }} />;
      default: return <File className="w-5 h-5" style={{ color: '#95a5a6' }} />;
    }
  };

  return (
    <div className="real-container" dir="rtl">
      {/* Header */}
      <div className="real-card">
        <h2 className="real-card-title">
          <Search className="w-6 h-6" />
          اسکن کامل فایل‌ها و پوشه‌ها
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          اسکن و فهرست کردن تمام فایل‌ها و پوشه‌های موجود در مسیر مشخص
        </p>

        {/* Scan Input */}
        <div className="real-form-grid">
          <div className="real-form-group">
            <label className="real-label">مسیر برای اسکن</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="real-input"
                placeholder="مثال: C:\models یا /home/user/data"
                value={scanPath}
                onChange={(e) => setScanPath(e.target.value)}
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={handleScan}
                className="real-btn real-btn-primary"
                disabled={scanning}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '0.5rem',
                  minWidth: 'auto'
                }}
              >
                {scanning ? (
                  <RefreshCw className="w-4 h-4" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="real-hint">
              مسیر کامل پوشه‌ای که می‌خواهید اسکن کنید
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      {scanResults && (
        <div className="real-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>آمار اسکن</h3>
            <button
              className="real-btn real-btn-secondary"
              onClick={() => setShowStats(!showStats)}
            >
              <BarChart3 className="w-4 h-4" style={{ marginLeft: '0.5rem' }} />
              {showStats ? 'مخفی کردن' : 'نمایش'} جزئیات
            </button>
          </div>

          <div className="real-stats-grid">
            <div className="real-stat-card">
              <div className="real-stat-value">{scanResults.stats.totalItems}</div>
              <div className="real-stat-label">کل موارد</div>
            </div>
            <div className="real-stat-card">
              <div className="real-stat-value">{scanResults.stats.files}</div>
              <div className="real-stat-label">فایل‌ها</div>
            </div>
            <div className="real-stat-card">
              <div className="real-stat-value">{scanResults.stats.directories}</div>
              <div className="real-stat-label">پوشه‌ها</div>
            </div>
            <div className="real-stat-card">
              <div className="real-stat-value">{formatFileSize(scanResults.stats.totalSize)}</div>
              <div className="real-stat-label">حجم کل</div>
            </div>
            <div className="real-stat-card">
              <div className="real-stat-value">{scanResults.stats.scanTime}ms</div>
              <div className="real-stat-label">زمان اسکن</div>
            </div>
          </div>

          {showStats && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4>توزیع بر اساس نوع:</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                {Object.entries(scanResults.stats.byKind).map(([kind, count]) => (
                  <div key={kind} style={{
                    background: 'var(--light-bg)',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{kind}</div>
                    <div style={{ fontSize: '1.2rem', color: 'var(--secondary-color)' }}>{count}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {scanResults && (
        <div className="real-card">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ position: 'relative' }}>
                <Search className="w-4 h-4" style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)'
                }} />
                <input
                  type="text"
                  className="real-input"
                  placeholder="جستجو در نتایج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingRight: '2.5rem' }}
                />
              </div>
            </div>

            <select
              className="real-input"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="all">همه انواع</option>
              <option value="model">مدل</option>
              <option value="dataset">دیتاست</option>
              <option value="config">پیکربندی</option>
              <option value="audio">صوتی</option>
              <option value="image">تصویری</option>
              <option value="code">کد</option>
              <option value="document">مستندات</option>
              <option value="directory">پوشه</option>
            </select>

            <select
              className="real-input"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              style={{ minWidth: '150px' }}
            >
              <option value="name-asc">نام (صعودی)</option>
              <option value="name-desc">نام (نزولی)</option>
              <option value="size-asc">حجم (صعودی)</option>
              <option value="size-desc">حجم (نزولی)</option>
              <option value="type-asc">نوع (صعودی)</option>
              <option value="type-desc">نوع (نزولی)</option>
              <option value="modified-asc">تاریخ (صعودی)</option>
              <option value="modified-desc">تاریخ (نزولی)</option>
            </select>
          </div>

          {/* Results List */}
          <div style={{
            maxHeight: '500px',
            overflowY: 'auto',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            background: 'var(--light-bg)'
          }}>
            {filteredItems.map((item, index) => (
              <div
                key={`${item.path}-${item.name}`}
                className={`real-scanned-item ${selectedItems.includes(index) ? 'selected' : ''}`}
                onClick={() => handleSelectItem(index)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(index)}
                  onChange={() => { }}
                  style={{ margin: 0 }}
                />

                <div style={{ fontSize: '1.5rem', margin: '0 0.75rem' }}>
                  {getFileIcon(item)}
                </div>

                <div style={{ flex: 1 }}>
                  <h5 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {item.name}
                  </h5>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    marginTop: '0.25rem',
                    fontSize: '0.8rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      background: item.isDirectory ? 'var(--secondary-color)' :
                        item.detectedType === 'model' ? '#8b5cf6' :
                          item.detectedType === 'dataset' ? '#10b981' :
                            item.detectedType === 'config' ? '#f59e0b' :
                              item.detectedType === 'audio' ? '#06b6d4' :
                                item.detectedType === 'image' ? '#ec4899' :
                                  item.detectedType === 'code' ? '#6366f1' :
                                    item.detectedType === 'document' ? '#84cc16' :
                                      item.detectedType === 'archive' ? '#f97316' :
                                        'var(--text-secondary)',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {item.detectedType || item.kind || 'unknown'}
                    </span>
                    {!item.isDirectory && (
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {formatFileSize(item.size)}
                      </span>
                    )}
                    <span style={{ color: 'var(--text-secondary)' }}>
                      عمق: {item.depth}
                    </span>
                    {item.modified && (
                      <span style={{ color: 'var(--text-secondary)' }}>
                        <Clock className="w-3 h-3" style={{ display: 'inline', marginLeft: '0.25rem' }} />
                        {formatDate(item.modified)}
                      </span>
                    )}
                  </div>
                  <p style={{
                    margin: '0.25rem 0 0 0',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'monospace',
                    wordBreak: 'break-all'
                  }}>
                    {item.path}
                  </p>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <Search className="w-12 h-12" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <h3>هیچ موردی یافت نشد</h3>
                <p>سعی کنید فیلترها را تغییر دهید</p>
              </div>
            )}
          </div>

          {/* Actions */}
          {filteredItems.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-color)'
              }}>
                <h4 style={{ margin: 0 }}>
                  {selectedItems.length} مورد از {filteredItems.length} انتخاب شده
                </h4>
                <button
                  className="real-btn real-btn-secondary"
                  onClick={handleSelectAll}
                  style={{ fontSize: '0.875rem' }}
                >
                  {selectedItems.length === filteredItems.length ? 'لغو انتخاب همه' : 'انتخاب همه'}
                </button>
              </div>

              <div className="real-btn-group">
                <button
                  className="real-btn real-btn-success"
                  onClick={handleImport}
                  disabled={selectedItems.length === 0}
                >
                  <Upload className="w-4 h-4" style={{ marginLeft: '0.5rem' }} />
                  واردات {selectedItems.length} مورد
                </button>
                <button
                  className="real-btn real-btn-secondary"
                  onClick={() => setSelectedItems([])}
                >
                  <RefreshCw className="w-4 h-4" style={{ marginLeft: '0.5rem' }} />
                  پاک کردن انتخاب
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FileScanner;
