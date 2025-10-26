import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../api/client';

const Settings = () => {
  const [hfToken, setHfToken] = useState('');
  const [storagePath, setStoragePath] = useState('');
  const [importPath, setImportPath] = useState('');
  const [importedAssets, setImportedAssets] = useState([]);
  const [uiPrefs, setUiPrefs] = useState({
    fontScale: 'normal',
    accent: 'violet',
  });
  const [saving, setSaving] = useState(false);

  const storageInputRef = useRef(null);
  const importInputRef = useRef(null);

  useEffect(() => {
    // On mount: try to load any previously saved settings.
    // Try backend first; if not available, fall back to localStorage.
    (async () => {
      try {
        if (apiClient && apiClient.getSettings) {
          const res = await apiClient.getSettings();
          if (res && res.data) {
            if (res.data.hfToken) setHfToken(res.data.hfToken);
            if (res.data.storagePath) setStoragePath(res.data.storagePath);
            if (res.data.importPath) setImportPath(res.data.importPath);
            if (res.data.uiPrefs) setUiPrefs(res.data.uiPrefs);
          }
        } else {
          const lsToken = localStorage.getItem('hfToken') || '';
          const lsStorage = localStorage.getItem('storagePath') || '';
          const lsImport = localStorage.getItem('importPath') || '';
          const lsUi = localStorage.getItem('uiPrefs');
          setHfToken(lsToken);
          setStoragePath(lsStorage);
          setImportPath(lsImport);
          if (lsUi) {
            try {
              setUiPrefs(JSON.parse(lsUi));
            } catch (_) {}
          }
        }
      } catch (_) {
        // swallow, page must still render
      }
    })();
  }, []);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);

      // Try backend first
      if (apiClient && apiClient.saveSettings) {
        await apiClient.saveSettings({
          hfToken,
          storagePath,
          importPath,
          uiPrefs
        });
      } else {
        // Backend may not support this yet. Fallback to localStorage.
        localStorage.setItem('hfToken', hfToken);
        localStorage.setItem('storagePath', storagePath);
        localStorage.setItem('importPath', importPath);
        localStorage.setItem('uiPrefs', JSON.stringify(uiPrefs));
      }

      // You MUST NOT crash if toast is missing. It's allowed to call toast.success if imported.
      // If toast is not available, silently succeed.
    } catch (err) {
      // same rule: don't crash
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
    // Browser security: we may not get a real path. Use placeholder from first file if available.
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      // Try to infer directory label from webkitRelativePath
      const rel = f.webkitRelativePath || '';
      const topFolder = rel.split('/')[0] || '';
      if (topFolder) {
        setStoragePath(topFolder);
      }
    }
  };

  const handleChooseImportDir = () => {
    if (importInputRef.current) {
      importInputRef.current.click();
    }
  };

  const handleImportDirPicked = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      const rel = f.webkitRelativePath || '';
      const topFolder = rel.split('/')[0] || '';
      if (topFolder) {
        setImportPath(topFolder);
      }
    }
  };

  const handleScanImportDir = async () => {
    try {
      // try backend
      if (apiClient && apiClient.scanLocalAssets) {
        const res = await apiClient.scanLocalAssets(importPath);
        // expected shape: { ok: true, data: [ { name, kind, size, status } ] }
        if (res && res.ok && Array.isArray(res.data)) {
          setImportedAssets(res.data);
          // if backend also registers them automatically into catalog,
          // great. if not, we could also call apiClient.registerLocalAssets(res.data)
        } else {
          setImportedAssets([]);
        }
      } else {
        // backend not implemented yet -> fallback empty
        setImportedAssets([]);
      }
    } catch (err) {
      setImportedAssets([]);
    }
  };

  return (
    <div className="w-full flex flex-col items-stretch bg-[#F5F7FB] text-slate-900 rtl pb-24">
      <div className="w-full max-w-[1400px] mx-auto px-4 flex flex-col gap-6">
        {/* CARD 1: Header / Context Card */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-slate-900">تنظیمات سیستم</h1>
          <p className="text-sm text-slate-700">
            مدیریت مسیر ذخیره‌سازی، توکن دسترسی و وارد کردن منابع محلی
          </p>
          <p className="text-xs text-slate-500">
            این تنظیمات فقط روی این دستگاه اعمال می‌شوند.
          </p>
        </div>

        {/* CARD 2: Hugging Face Token */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-900">توکن Hugging Face</h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">توکن Hugging Face</label>
            <input
              className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
              type="password"
              placeholder="توکن Hugging Face خود را وارد کنید"
              value={hfToken}
              onChange={e => setHfToken(e.target.value)}
            />
            <p className="text-[11px] text-slate-500">
              این توکن برای دانلود مدل‌های محدود دسترسی استفاده می‌شود.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveSettings}
            className="self-start px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>ذخیره تنظیمات</span>
          </button>
        </div>

        {/* CARD 3: Storage Location */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-900">مسیر ذخیره‌سازی</h3>
          <p className="text-xs text-slate-600">مسیر پیش‌فرضی که مدل‌ها و فایل‌ها در آن ذخیره می‌شوند.</p>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">مسیر ذخیره‌سازی</label>
              <input
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                type="text"
                placeholder="مثال: C:\\models\\store"
                value={storagePath}
                onChange={e => setStoragePath(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0">
              <input
                type="file"
                className="hidden"
                ref={storageInputRef}
                webkitdirectory=""
                directory=""
                onChange={handleStorageDirPicked}
              />
              <button
                type="button"
                onClick={handleChooseStorageDir}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-200 transition-colors"
              >
                انتخاب پوشه
              </button>
            </div>
          </div>
        </div>

        {/* CARD 4: Import & Scan Local Assets */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-900">وارد کردن و اسکن فایل‌ها</h3>
          <p className="text-xs text-slate-600">یک پوشه را انتخاب کنید تا مدل‌ها / دیتاست‌ها / TTSها شناسایی و در سیستم ثبت شوند</p>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">مسیر اسکن</label>
              <input
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                type="text"
                placeholder="مثال: C:\\models"
                value={importPath}
                onChange={e => setImportPath(e.target.value)}
              />
            </div>
            <div className="flex-shrink-0 flex gap-2">
              <input
                type="file"
                className="hidden"
                ref={importInputRef}
                webkitdirectory=""
                directory=""
                onChange={handleImportDirPicked}
              />
              <button
                type="button"
                onClick={handleChooseImportDir}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg border border-slate-300 hover:bg-slate-200 transition-colors"
              >
                انتخاب پوشه
              </button>
              <button
                type="button"
                onClick={handleScanImportDir}
                className="px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                اسکن
              </button>
            </div>
          </div>
          <div className="max-h-[180px] overflow-y-auto text-xs text-slate-700 border border-slate-200/60 rounded-lg p-3 bg-slate-50">
            {importedAssets.length === 0 ? (
              <div className="text-slate-500 text-center py-6 text-[11px]">
                هنوز منبعی شناسایی نشده
              </div>
            ) : (
              importedAssets.map((asset, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-white border border-slate-200/60 rounded-[10px] px-3 py-2 mb-2 last:mb-0"
                >
                  <div className="flex flex-col">
                    <span className="text-[13px] font-semibold text-slate-900">{asset.name}</span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">{asset.kind || 'منبع'}</span>
                      {asset.size && <span>{asset.size}</span>}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {asset.status || 'ثبت شد'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CARD 5: UI Preferences */}
        <div className="bg-white rounded-[14px] border border-slate-200/60 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.07),0_2px_4px_rgba(15,23,42,0.04)] p-6 flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-900">نمایش و ظاهر</h3>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">اندازه فونت</label>
              <select
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={uiPrefs.fontScale}
                onChange={e => setUiPrefs({ ...uiPrefs, fontScale: e.target.value })}
              >
                <option value="normal">عادی</option>
                <option value="large">بزرگ</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">رنگ اصلی</label>
              <select
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={uiPrefs.accent}
                onChange={e => setUiPrefs({ ...uiPrefs, accent: e.target.value })}
              >
                <option value="violet">بنفش</option>
                <option value="blue">آبی</option>
                <option value="green">سبز</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            این تنظیمات فقط روی همین دستگاه شما اعمال می‌شوند و در export پروژه قرار نمی‌گیرند.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
