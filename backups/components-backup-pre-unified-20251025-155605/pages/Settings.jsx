import React, { useState, useEffect } from 'react';
import {
  Save, FolderOpen, Search, Key, Upload, CheckCircle, XCircle,
  AlertCircle, HardDrive, FileText, Loader, Shield, FolderSearch,
  Database, Settings as SettingsIcon, Eye, EyeOff, RefreshCw,
  Download, Trash2, Plus, Filter, Star, Clock, Zap
} from 'lucide-react';
import apiClient from '../api/endpoints';

function Settings({ onUpdate, onToast }) {
  const [hfToken, setHfToken] = useState('');
  const [storageRoot, setStorageRoot] = useState('');
  const [loading, setLoading] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [scanPath, setScanPath] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showToken, setShowToken] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const [storageStats, setStorageStats] = useState(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSettings();
    loadStorageStats();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getSettings();
      if (result) {
        const data = result;
        if (data.hf_token) setHfToken(data.hf_token);
        if (data.storage_root) setStorageRoot(data.storage_root);
        onToast('تنظیمات بارگذاری شد', 'success');
      } else {
        onToast('خطا در بارگذاری تنظیمات', 'error');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      onToast('خطا در بارگذاری تنظیمات', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStorageStats = async () => {
    // Mock storage stats - replace with actual API call
    setStorageStats({
      totalSize: '12.5 GB',
      availableSpace: '48.2 GB',
      modelsCount: 8,
      datasetsCount: 3
    });
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    if (!storageRoot.trim()) {
      onToast('لطفاً مسیر ذخیره‌سازی را وارد کنید', 'error');
      return;
    }

    try {
      setSaving(true);
      const result = await apiClient.saveSettings({
        hf_token: hfToken.trim() || undefined,
        storage_root: storageRoot.trim()
      });

      if (result) {
        onUpdate({ storage_root: storageRoot });
        onToast('تنظیمات با موفقیت ذخیره شدند ✓', 'success');
        // Reload storage stats after saving
        await loadStorageStats();
      } else {
        onToast(result.error || 'خطا در ذخیره تنظیمات', 'error');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      onToast('خطا در ذخیره تنظیمات', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleScanFolder = async (e) => {
    e.preventDefault();
    if (!scanPath.trim()) {
      onToast('لطفاً مسیر را وارد کنید', 'error');
      return;
    }

    try {
      setScanning(true);
      setScanResults(null);
      setScannedItems([]);
      setSelectedItems([]);

      const result = await apiClient.scanAssets(scanPath);
      console.log('📥 نتیجه اسکن:', result);

      if (result && result.ok && result.data) {
        const scanData = result.data;
        setScanResults(scanData);
        setScannedItems(scanData.items || []);

        if (scanData.items && scanData.items.length > 0) {
          onToast(`${scanData.items.length} فایل پیدا شد`, 'success');
        } else {
          onToast('هیچ فایلی یافت نشد', 'info');
        }
      } else {
        onToast(result?.error || 'خطا در اسکن پوشه', 'error');
        setScanResults(null);
        setScannedItems([]);
      }
    } catch (error) {
      console.error('Error scanning folder:', error);
      onToast('خطا در اسکن پوشه', 'error');
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
    if (selectedItems.length === scannedItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(scannedItems.map((_, i) => i));
    }
  };

  const handleImportItems = async () => {
    if (selectedItems.length === 0) {
      onToast('لطفاً موارد را انتخاب کنید', 'error');
      return;
    }

    try {
      setImporting(true);
      setImportProgress({ current: 0, total: selectedItems.length });

      const itemsToImport = selectedItems.map(i => scannedItems[i]);

      // Simulate progress
      for (let i = 0; i < selectedItems.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setImportProgress({ current: i + 1, total: selectedItems.length });
      }

      const result = await apiClient.importAssets(itemsToImport);
      console.log('📥 نتیجه واردات:', result);

      if (result && result.ok) {
        const importData = result.data || {};
        const totalImported = importData.counts?.total || 0;
        const skipped = importData.counts?.skipped || 0;

        setScannedItems([]);
        setSelectedItems([]);
        setScanPath('');
        setScanResults(null);
        setImportProgress(null);

        if (totalImported > 0 && skipped > 0) {
          onToast(`✅ ${totalImported} مورد جدید واردات شد، ${skipped} مورد قبلاً وجود داشت`, 'success');
        } else if (totalImported > 0) {
          onToast(`✅ ${totalImported} مورد جدید واردات شد`, 'success');
        } else if (skipped > 0) {
          onToast(`ℹ️ تمام ${skipped} مورد قبلاً وارد شده بودند`, 'info');
        } else {
          onToast('هیچ موردی برای واردات وجود ندارد', 'info');
        }

        // Reload storage stats
        await loadStorageStats();

        // نمایش جزئیات
        if (onUpdate) {
          onUpdate();
        }
      } else {
        onToast(result?.error || 'خطا در واردات', 'error');
      }
    } catch (error) {
      console.error('Error importing items:', error);
      onToast('خطا در واردات', 'error');
    } finally {
      setImporting(false);
      setImportProgress(null);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (kind) => {
    switch (kind) {
      case 'model': return '🤖';
      case 'chat-model': return '💬';
      case 'tts-model': return '🎤';
      case 'dataset': return '📊';
      case 'checkpoint': return '💾';
      case 'config': return '⚙️';
      case 'vocabulary': return '📚';
      case 'audio': return '🎵';
      case 'image': return '🖼️';
      case 'code': return '💻';
      case 'document': return '📄';
      case 'archive': return '📦';
      case 'directory': return '📁';
      default: return '📄';
    }
  };

  // Filter scanned items
  const filteredItems = React.useMemo(() => {
    if (!scannedItems.length) return [];

    let filtered = scannedItems;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.kind === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.path.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [scannedItems, filterType, searchTerm]);

  // Handle folder browser
  const handleBrowseFolder = async () => {
    try {
      // Try to use native folder picker if available
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        setStorageRoot(dirHandle.name);
      } else {
        // Fallback to file input
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.onchange = (e) => {
          if (e.target.files.length > 0) {
            const path = e.target.files[0].webkitRelativePath;
            if (path) {
              const dirPath = path.split('/')[0];
              setStorageRoot(dirPath);
            }
          }
        };
        input.click();
      }
    } catch (error) {
      console.error('Error browsing folder:', error);
      onToast('خطا در انتخاب پوشه', 'error');
    }
  };

  // Handle scan path browser
  const handleBrowseScanPath = async () => {
    try {
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        setScanPath(dirHandle.name);
      } else {
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.onchange = (e) => {
          if (e.target.files.length > 0) {
            const path = e.target.files[0].webkitRelativePath;
            if (path) {
              const dirPath = path.split('/')[0];
              setScanPath(dirPath);
            }
          }
        };
        input.click();
      }
    } catch (error) {
      console.error('Error browsing scan path:', error);
      onToast('خطا در انتخاب مسیر اسکن', 'error');
    }
  };

  if (loading) {
    return (
      <div className="settings-page animate-fadeInUp">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">در حال بارگذاری تنظیمات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-12 animate-fadeInUp">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <SettingsIcon size={32} />
            تنظیمات سیستم
          </h1>
          <p className="helper">مدیریت پیکربندی و فضای ذخیره‌سازی</p>
        </div>
        <div className="btn-group">
          <button
            className="btn btn-secondary"
            onClick={loadSettings}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            بروزرسانی
          </button>
        </div>
      </div>

      {/* Storage Stats */}
      {storageStats && (
        <div className="stats-grid">
          <div className="stat-card animate-fadeInUp animation-delay-100">
            <div className="stat-value">{storageStats.totalSize}</div>
            <div className="stat-label">فضای استفاده شده</div>
          </div>
          <div className="stat-card animate-fadeInUp animation-delay-200">
            <div className="stat-value">{storageStats.availableSpace}</div>
            <div className="stat-label">فضای موجود</div>
          </div>
          <div className="stat-card animate-fadeInUp animation-delay-300">
            <div className="stat-value">{storageStats.modelsCount + storageStats.datasetsCount}</div>
            <div className="stat-label">تعداد فایل‌ها</div>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <div className="settings-form animate-fadeInUp animation-delay-400">
        <h2 className="scanner-title">
          <Key size={24} />
          تنظیمات اصلی
        </h2>

        <form onSubmit={handleSaveSettings} className="form-grid">
          {/* Hugging Face Token */}
          <div className="form-group">
            <label className="form-label">
              <Key size={16} />
              توکن Hugging Face
            </label>
            <div className="input-with-icon">
              <input
                type={showToken ? "text" : "password"}
                className="form-input"
                placeholder="توکن Hugging Face خود را وارد کنید"
                value={hfToken}
                onChange={(e) => setHfToken(e.target.value)}
              />
              <button
                type="button"
                className="token-toggle"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="form-hint">
              اختیاری - برای دانلود مدل‌های محدود دسترسی
            </p>
          </div>

          {/* Storage Path */}
          <div className="form-group">
            <label className="form-label">
              <HardDrive size={16} />
              مسیر ذخیره‌سازی
            </label>
            <div className="input-with-icon">
              <input
                type="text"
                className="form-input"
                placeholder="مثال: C:\models\store"
                value={storageRoot}
                onChange={(e) => setStorageRoot(e.target.value)}
                required
              />
              <button
                type="button"
                className="folder-browser"
                onClick={handleBrowseFolder}
              >
                <FolderOpen size={16} />
              </button>
            </div>
            <p className="form-hint">
              مسیری که مدل‌ها و دارایی‌ها در آن ذخیره شوند
            </p>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="btn-group">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSaveSettings}
            disabled={saving || !storageRoot.trim()}
          >
            {saving ? (
              <>
                <Loader size={16} className="animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save size={16} />
                ذخیره تنظیمات
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scanner Section */}
      <div className="scanner-section animate-fadeInUp animation-delay-500">
        <div className="scanner-header">
          <h2 className="scanner-title">
            <FolderSearch size={24} />
            اسکن و واردات فایل‌ها
          </h2>
        </div>

        <form onSubmit={handleScanFolder} className="form-grid">
          <div className="form-group">
            <label className="form-label">
              <Search size={16} />
              مسیر پوشه برای اسکن
            </label>
            <div className="input-with-icon">
              <input
                type="text"
                className="form-input"
                placeholder="مثال: C:\models"
                value={scanPath}
                onChange={(e) => setScanPath(e.target.value)}
              />
              <button
                type="button"
                className="folder-browser"
                onClick={handleBrowseScanPath}
              >
                <FolderOpen size={16} />
              </button>
            </div>
            <p className="form-hint">
              مسیر پوشه برای اسکن و واردات فایل‌ها
            </p>
          </div>
        </form>

        {/* Scan Button */}
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleScanFolder}
            disabled={scanning || !scanPath.trim()}
          >
            {scanning ? (
              <>
                <Loader size={16} className="animate-spin" />
                در حال اسکن...
              </>
            ) : (
              <>
                <Search size={16} />
                شروع اسکن
              </>
            )}
          </button>
        </div>

        {/* Scanned Items */}
        {filteredItems.length > 0 && (
          <div className="scanned-section animate-fadeInUp animation-delay-600">
            <div className="scanned-header">
              <h4 className="scanned-title">
                فایل‌های یافت شده ({filteredItems.length})
              </h4>
              <div className="btn-group">
                <button
                  className="btn btn-secondary"
                  onClick={handleSelectAll}
                >
                  {selectedItems.length === filteredItems.length ? 'لغو انتخاب همه' : 'انتخاب همه'}
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="form-grid" style={{ marginBottom: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <Filter size={16} />
                  فیلتر بر اساس نوع
                </label>
                <select
                  className="form-input"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">همه انواع</option>
                  <option value="model">مدل</option>
                  <option value="chat-model">مدل چت</option>
                  <option value="tts-model">مدل TTS</option>
                  <option value="dataset">دیتاست</option>
                  <option value="config">پیکربندی</option>
                  <option value="audio">صوتی</option>
                  <option value="image">تصویری</option>
                  <option value="code">کد</option>
                  <option value="document">مستندات</option>
                  <option value="archive">فایل فشرده</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Search size={16} />
                  جستجو
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="جستجو در فایل‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="scanned-list">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  className={`scanned-item ${selectedItems.includes(index) ? 'selected' : ''}`}
                  onClick={() => handleSelectItem(index)}
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(index)}
                    onChange={() => { }}
                    style={{ margin: 0 }}
                  />

                  <div className="item-icon">
                    {getFileIcon(item.kind)}
                  </div>

                  <div className="item-details">
                    <h5 className="item-name">
                      {item.name}
                    </h5>
                    <div className="item-meta">
                      <span className="meta-tag">
                        {item.kind}
                      </span>
                      <span className="meta-size">
                        {formatBytes(item.size)}
                      </span>
                    </div>
                    <p className="item-path">
                      {item.path}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Import Progress */}
            {importProgress && (
              <div className="progress">
                <div className="progress-info">
                  <Loader size={16} className="animate-spin" />
                  <span>در حال واردات... ({importProgress.current}/{importProgress.total})</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Import Button */}
            <div className="btn-group">
              <button
                className="btn btn-success"
                onClick={handleImportItems}
                disabled={selectedItems.length === 0 || importing}
              >
                {importing ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    در حال واردات...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    واردات {selectedItems.length} مورد
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Settings;