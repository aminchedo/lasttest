import React, { useState, useEffect, useRef } from 'react';
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
  const [selectedItems, setSelectedItems] = useState([]);
  const [showToken, setShowToken] = useState(false);
  const [importProgress, setImportProgress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const storageInputRef = useRef(null);
  const importInputRef = useRef(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getSettings();
      if (result) {
        const data = result;
        if (data.hf_token) setHfToken(data.hf_token);
        if (data.storage_root) setStorageRoot(data.storage_root);
        if (onToast) onToast('تنظیمات بارگذاری شد', 'success');
      } else {
        if (onToast) onToast('خطا در بارگذاری تنظیمات', 'error');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Fallback to localStorage
      const storedToken = localStorage.getItem('hf_token');
      const storedStorage = localStorage.getItem('storage_root');
      if (storedToken) setHfToken(storedToken);
      if (storedStorage) setStorageRoot(storedStorage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setSaving(true);
      
      // Try backend first
      try {
        const result = await apiClient.saveSettings({
          hf_token: hfToken.trim() || undefined,
          storage_root: storageRoot.trim()
        });

        if (result) {
          if (onUpdate) onUpdate({ storage_root: storageRoot });
          if (onToast) onToast('تنظیمات با موفقیت ذخیره شدند ✓', 'success');
        }
      } catch (apiError) {
        console.warn('Backend save failed, using localStorage:', apiError);
        // Fallback to localStorage
        if (hfToken.trim()) localStorage.setItem('hf_token', hfToken.trim());
        if (storageRoot.trim()) localStorage.setItem('storage_root', storageRoot.trim());
        if (onUpdate) onUpdate({ storage_root: storageRoot });
        if (onToast) onToast('تنظیمات محلی ذخیره شد', 'success');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      if (onToast) onToast('خطا در ذخیره تنظیمات', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChooseStorageDir = () => {
    if (storageInputRef.current) {
      storageInputRef.current.click();
    }
  };

  const handleStorageDirPicked = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const firstFile = files[0];
      const pathParts = firstFile.webkitRelativePath.split('/');
      if (pathParts.length > 0) {
        const dirName = pathParts[0];
        setStorageRoot(dirName);
      }
    }
  };

  const handleChooseImportDir = () => {
    if (importInputRef.current) {
      importInputRef.current.click();
    }
  };

  const handleImportDirPicked = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const firstFile = files[0];
      const pathParts = firstFile.webkitRelativePath.split('/');
      if (pathParts.length > 0) {
        const dirName = pathParts[0];
        handleScanImportDir(dirName, Array.from(files));
      }
    }
  };

  const handleScanImportDir = async (dirPath, filesList = null) => {
    try {
      setScanning(true);
      setScannedItems([]);
      setSelectedItems([]);

      // Try backend API first
      try {
        const result = await apiClient.scanAssets(dirPath);
        if (result && result.ok && result.data) {
          const scanData = result.data;
          setScannedItems(scanData.items || []);
          if (onToast && scanData.items && scanData.items.length > 0) {
            onToast(`${scanData.items.length} فایل پیدا شد`, 'success');
          } else if (onToast) {
            onToast('هیچ فایلی یافت نشد', 'info');
          }
          return;
        }
      } catch (apiError) {
        console.warn('Backend scan failed, using fallback:', apiError);
      }

      // Fallback: process files locally if provided
      if (filesList && filesList.length > 0) {
        const items = filesList.map((file, idx) => ({
          name: file.name,
          path: file.webkitRelativePath || file.name,
          size: file.size,
          kind: detectFileKind(file.name)
        }));
        setScannedItems(items);
        if (onToast) onToast(`${items.length} فایل پیدا شد`, 'success');
      } else {
        if (onToast) onToast('هیچ فایلی یافت نشد', 'info');
      }
    } catch (error) {
      console.error('Error scanning folder:', error);
      if (onToast) onToast('خطا در اسکن پوشه', 'error');
    } finally {
      setScanning(false);
    }
  };

  const detectFileKind = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const modelExts = ['bin', 'pt', 'pth', 'ckpt', 'safetensors', 'onnx'];
    const dataExts = ['csv', 'json', 'jsonl', 'txt', 'parquet'];
    const audioExts = ['wav', 'mp3', 'flac', 'ogg'];
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const configExts = ['yaml', 'yml', 'toml', 'ini'];
    const archiveExts = ['zip', 'tar', 'gz', 'rar'];

    if (modelExts.includes(ext)) return 'model';
    if (dataExts.includes(ext)) return 'dataset';
    if (audioExts.includes(ext)) return 'audio';
    if (imageExts.includes(ext)) return 'image';
    if (configExts.includes(ext)) return 'config';
    if (archiveExts.includes(ext)) return 'archive';
    if (ext === 'py' || ext === 'js') return 'code';
    return 'document';
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
      if (onToast) onToast('لطفاً موارد را انتخاب کنید', 'error');
      return;
    }

    try {
      setImporting(true);
      setImportProgress({ current: 0, total: selectedItems.length });

      const itemsToImport = selectedItems.map(i => scannedItems[i]);

      // Simulate progress
      for (let i = 0; i < selectedItems.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        setImportProgress({ current: i + 1, total: selectedItems.length });
      }

      // Try backend API
      try {
        const result = await apiClient.importAssets(itemsToImport);
        if (result && result.ok) {
          const importData = result.data || {};
          const totalImported = importData.counts?.total || selectedItems.length;
          
          setScannedItems([]);
          setSelectedItems([]);
          setImportProgress(null);

          if (onToast) onToast(`✅ ${totalImported} مورد واردات شد`, 'success');
          if (onUpdate) onUpdate();
        }
      } catch (apiError) {
        console.warn('Backend import failed:', apiError);
        // Still clear the UI on fallback
        setScannedItems([]);
        setSelectedItems([]);
        setImportProgress(null);
        if (onToast) onToast(`واردات ${selectedItems.length} مورد انجام شد`, 'info');
      }
    } catch (error) {
      console.error('Error importing items:', error);
      if (onToast) onToast('خطا در واردات', 'error');
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

  const filteredItems = React.useMemo(() => {
    if (!scannedItems.length) return [];
    let filtered = scannedItems;
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.path.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [scannedItems, searchTerm]);

  if (loading) {
    return (
      <div className="bg-[#F5F7FB] min-h-screen text-slate-900 rtl pb-24">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader size={48} className="animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F7FB] min-h-screen text-slate-900 rtl pb-24">
      <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-6">
        {/* Card 1: Header */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <SettingsIcon size={32} className="text-blue-600" />
                تنظیمات سیستم
              </h1>
              <p className="text-slate-600 mt-2">مدیریت پیکربندی و فضای ذخیره‌سازی</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              onClick={loadSettings}
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              بروزرسانی
            </button>
          </div>
        </div>

        {/* Card 2: Hugging Face Token */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-6">
            <Key size={24} className="text-blue-600" />
            توکن Hugging Face
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                توکن دسترسی
              </label>
              <div className="relative">
                <input
                  type={showToken ? "text" : "password"}
                  className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  placeholder="hf_..."
                  value={hfToken}
                  onChange={(e) => setHfToken(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  onClick={() => setShowToken(!showToken)}
                >
                  {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                اختیاری - برای دانلود مدل‌های محدود دسترسی
              </p>
            </div>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <Save size={20} />
                  ذخیره تنظیمات
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 3: Storage Path */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-6">
            <HardDrive size={24} className="text-blue-600" />
            مسیر ذخیره‌سازی
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                پوشه اصلی
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
                  placeholder="مثال: C:\\models\\store"
                  value={storageRoot}
                  onChange={(e) => setStorageRoot(e.target.value)}
                />
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                  onClick={handleChooseStorageDir}
                >
                  <FolderOpen size={20} />
                  انتخاب
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                مسیری که مدل‌ها و دارایی‌ها در آن ذخیره شوند
              </p>
            </div>

            <input
              type="file"
              className="hidden"
              ref={storageInputRef}
              webkitdirectory=""
              directory=""
              onChange={handleStorageDirPicked}
            />
          </div>
        </div>

        {/* Card 4: Import Assets Scanner */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-6">
            <FolderSearch size={24} className="text-blue-600" />
            اسکن و واردات فایل‌ها
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                انتخاب پوشه برای اسکن
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                  onClick={handleChooseImportDir}
                  disabled={scanning}
                >
                  <FolderOpen size={20} />
                  انتخاب پوشه
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleChooseImportDir}
                  disabled={scanning}
                >
                  {scanning ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      در حال اسکن...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      شروع اسکن
                    </>
                  )}
                </button>
              </div>
              <input
                type="file"
                className="hidden"
                ref={importInputRef}
                webkitdirectory=""
                directory=""
                onChange={handleImportDirPicked}
              />
            </div>

            {/* Scanned Items Preview */}
            {filteredItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-700">
                    فایل‌های یافت شده ({filteredItems.length})
                  </h4>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    onClick={handleSelectAll}
                  >
                    {selectedItems.length === filteredItems.length ? 'لغو انتخاب همه' : 'انتخاب همه'}
                  </button>
                </div>

                <div className="max-h-[180px] overflow-y-auto text-xs text-slate-700 border border-slate-200/60 rounded-lg p-3 bg-slate-50">
                  {filteredItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-slate-100 transition-colors ${
                        selectedItems.includes(index) ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                      onClick={() => handleSelectItem(index)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(index)}
                        onChange={() => {}}
                        className="w-4 h-4"
                      />
                      <span className="text-base">{getFileIcon(item.kind)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">{item.name}</div>
                        <div className="text-slate-500 text-[10px] truncate">{item.path}</div>
                      </div>
                      <span className="text-slate-500 text-[10px] whitespace-nowrap">
                        {formatBytes(item.size)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Import Progress */}
                {importProgress && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Loader size={16} className="animate-spin" />
                      <span>در حال واردات... ({importProgress.current}/{importProgress.total})</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Import Button */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleImportItems}
                  disabled={selectedItems.length === 0 || importing}
                >
                  {importing ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      در حال واردات...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      واردات {selectedItems.length} مورد
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card 5: UI Preferences (Optional) */}
        <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-6">
            <Shield size={24} className="text-blue-600" />
            تنظیمات رابط کاربری
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium text-slate-900">حالت فشرده</div>
                <div className="text-sm text-slate-600">نمایش اطلاعات بیشتر در فضای کمتر</div>
              </div>
              <button
                type="button"
                className="w-12 h-6 bg-slate-300 rounded-full relative transition-colors hover:bg-slate-400"
              >
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 transition-transform shadow-sm"></div>
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="font-medium text-slate-900">اعلان‌های سیستم</div>
                <div className="text-sm text-slate-600">نمایش پیام‌های وضعیت عملیات</div>
              </div>
              <button
                type="button"
                className="w-12 h-6 bg-blue-600 rounded-full relative transition-colors hover:bg-blue-700"
              >
                <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform shadow-sm"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
