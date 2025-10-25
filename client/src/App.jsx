import React, { useState, useRef, useEffect } from 'react';
import Navigation from './components/Navigation';
import NetworkMonitor from './components/NetworkMonitor';
import MonitoringStrip from './components/MonitoringStrip';
import ErrorBoundary from './components/ErrorBoundary';
import { Search, Bell, Settings as SettingsIcon, HelpCircle, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import DashboardUnified from './pages/DashboardUnified';
import ModelsHub from './pages/ModelsHub';
import Training from './pages/Training';
import Analysis from './pages/Analysis';
import Exports from './pages/Exports';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Kitchen from './pages/Kitchen';
import Downloader from './components/Downloader';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isNetworkMonitorVisible, setIsNetworkMonitorVisible] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [settings, setSettings] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const toastIdCounter = useRef(0);

  // Training data state
  const [models, setModels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [mode, setMode] = useState('real');

  const showToast = (message, type = 'info') => {
    toastIdCounter.current += 1;
    const id = `toast-${Date.now()}-${toastIdCounter.current}`;
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleUpdateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    setRefreshKey(prev => prev + 1);
  };

  // Fetch training data
  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        // Check backend health and set mode
        const healthResponse = await fetch('/api/health');
        const healthData = await healthResponse.json();
        setMode(healthData.ok ? 'real' : 'simulated');

        if (healthData.ok) {
          // Fetch models
          const modelsResponse = await fetch('/api/models');
          const modelsData = await modelsResponse.json();
          const modelsArray = modelsData.items || modelsData.data || modelsData || [];
          // Add downloaded field based on status
          const processedModels = modelsArray.map(model => ({
            ...model,
            downloaded: model.status === 'ready' || model.status === 'downloaded' || !!model.localPath || model.downloaded
          }));
          setModels(processedModels);

          // Fetch datasets
          const datasetsResponse = await fetch('/api/datasets');
          const datasetsData = await datasetsResponse.json();
          const datasetsArray = datasetsData.items || datasetsData.data || datasetsData || [];
          // Add downloaded field and path
          const processedDatasets = datasetsArray.map(dataset => ({
            ...dataset,
            downloaded: dataset.status === 'ready' || dataset.status === 'downloaded' || !!dataset.localPath || dataset.downloaded,
            path: dataset.localPath || dataset.path || dataset.id
          }));
          setDatasets(processedDatasets);

          // Fetch teachers (optional)
          try {
            const teachersResponse = await fetch('/api/teachers');
            const teachersData = await teachersResponse.json();
            if (teachersData.ok) {
              setTeachers(teachersData.data || []);
            }
          } catch (error) {
            // Teachers endpoint might not exist, that's ok
            setTeachers([]);
          }
        } else {
          // Simulated mode - provide mock data
          setModels([
            { id: 'model-1', name: 'Persian GPT Base', downloaded: true },
            { id: 'model-2', name: 'BERT Persian', downloaded: true }
          ]);
          setDatasets([
            { id: 'dataset-1', name: 'Persian News Corpus', downloaded: true, path: '/data/persian-news' },
            { id: 'dataset-2', name: 'Poetry Dataset', downloaded: true, path: '/data/poetry' }
          ]);
          setTeachers([]);
        }
      } catch (error) {
        console.error('Failed to fetch training data:', error);
        setMode('simulated');
        // Provide fallback mock data
        setModels([
          { id: 'model-1', name: 'Persian GPT Base', downloaded: true },
          { id: 'model-2', name: 'BERT Persian', downloaded: true }
        ]);
        setDatasets([
          { id: 'dataset-1', name: 'Persian News Corpus', downloaded: true, path: '/data/persian-news' },
          { id: 'dataset-2', name: 'Poetry Dataset', downloaded: true, path: '/data/poetry' }
        ]);
        setTeachers([]);
      }
    };

    fetchTrainingData();
  }, [refreshKey]);

  // Training handlers
  const handleStartTraining = async (payload) => {
    try {
      // Transform payload to match backend expectations
      const transformedPayload = {
        baseModel: payload.modelId,
        datasets: payload.datasetIds,
        teacherModel: payload.teacherId || null,
        config: {}
      };

      const response = await fetch('/api/training/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedPayload),
      });

      const data = await response.json();
      if (data.ok) {
        showToast('Training started successfully', 'success');
        return { jobId: data.jobId };
      } else {
        showToast('Failed to start training: ' + (data.error || 'Unknown error'), 'error');
        return null;
      }
    } catch (error) {
      console.error('Training start error:', error);
      showToast('Failed to start training: ' + error.message, 'error');
      return null;
    }
  };

  const handlePollStatus = async (jobId) => {
    try {
      const response = await fetch(`/api/training/status/${jobId}`);
      if (response.ok) {
        const data = await response.json();
        // Transform the response to match what the Training component expects
        return {
          status: data.status || 'IDLE',
          progress: data.progress || 0,
          epoch: data.metrics?.epoch,
          loss: data.metrics?.trainLoss,
          acc: data.metrics?.accuracy,
          eta: data.eta || data.estimated_time_remaining
        };
      }
      return null;
    } catch (error) {
      console.error('Status poll error:', error);
      return null;
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardUnified onNavigate={setCurrentPage} />;
      case 'models': return <ModelsHub />;
      case 'training': return (
        <Training
          models={models}
          datasets={datasets}
          teachers={teachers}
          mode={mode}
          onStartTraining={handleStartTraining}
          onPollStatus={handlePollStatus}
          onRefreshData={() => setRefreshKey(prev => prev + 1)}
        />
      );
      case 'analysis': return <Analysis />;
      case 'exports': return <Exports />;
      case 'users': return <Users />;
      case 'kitchen': return <Kitchen />;
      case 'settings': return <Settings onToast={showToast} onUpdate={handleUpdateSettings} />;
      case 'downloader': return <Downloader />;
      default: return <DashboardUnified />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="app">
        <Navigation key={refreshKey} currentPage={currentPage} onPageChange={setCurrentPage} />
        <div className="main-wrapper">
          <div className="app-header-nav">
            <div className="nav-brand">
              <h1>{getPageTitle(currentPage)}</h1>
              <span>سیستم آموزش مدل‌های فارسی</span>
            </div>

            <div className="search-bar-container">
              <input
                type="text"
                placeholder="جستجو در مدل‌ها، داده‌ها، آموزش‌ها..."
              />
            </div>

            <div className="nav-icons">
              <button className="nav-icon" title="تنظیمات سریع" onClick={() => setCurrentPage('settings')} type="button">
                <SettingsIcon size={18} />
              </button>
              <button className="nav-icon" title="اعلان‌ها" type="button">
                <Bell size={18} />
              </button>
              <button className="nav-icon" title="راهنما" type="button">
                <HelpCircle size={18} />
              </button>
            </div>

            <div className="user-profile-section">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="user-name">علی محمدی</span>
                <span className="user-role">مدیر سیستم</span>
              </div>
            </div>
          </div>
          <div className="main-content">{renderPage()}</div>
          <div className="footer glass-container">
            <div className="footer-left">
              <span>© 1404 - Persian Model Trainer</span>
              <span className="version-badge">ورژن 2.5.0</span>
            </div>
            <div className="footer-links">
              <a href="/docs" className="footer-link">مستندات</a>
              <a href="/support" className="footer-link">پشتیبانی</a>
              <a href="/about" className="footer-link">درباره ما</a>
            </div>
            <div className="footer-status">
              <span className="status-online">
                <span className="status-dot"></span>
                سیستم آنلاین
              </span>
            </div>
          </div>
        </div>
        <NetworkMonitor isVisible={isNetworkMonitorVisible} onToggle={() => setIsNetworkMonitorVisible(!isNetworkMonitorVisible)} />
        <MonitoringStrip />
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`} onClick={() => removeToast(toast.id)}>
              <div className="toast-icon">
                {toast.type === 'success' && <CheckCircle size={20} />}
                {toast.type === 'error' && <XCircle size={20} />}
                {toast.type === 'info' && <AlertCircle size={20} />}
              </div>
              <div className="toast-message">{toast.message}</div>
            </div>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}

const getPageTitle = (page) => {
  const titles = {
    dashboard: 'داشبورد',
    models: 'مدل‌ها',
    training: 'آموزش',
    analysis: 'آنالیز و گزارش‌گیری',
    exports: 'خروجی‌ها',
    users: 'کاربران',
    kitchen: 'آشپزخانه مدل‌سازی',
    settings: 'تنظیمات',
    downloader: 'منابع دانلود شده'
  };
  return titles[page] || 'داشبورد';
};

export default App;
