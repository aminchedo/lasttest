// Enhanced ModelsHub.jsx - نسخه نهایی بدون تداخل
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  CheckCircle, 
  Database, 
  Brain, 
  Zap,
  ArrowUpRight,
  FolderOpen
} from 'lucide-react';
import Models from './Models';
import Datasets from './Datasets';
import TTS from './TTS';
import HuggingFaceModels from './HuggingFaceModels';
import './ModelsHub.css';

const ModelsHub = () => {
  const [activeTab, setActiveTab] = useState('models');
  const [activeSubTab, setActiveSubTab] = useState('models'); // models or assets
  const [stats, setStats] = useState({
    activeTrainings: 0,
    successfulTrainings: 12,
    successRate: 92.3,
    datasets: 5,
    activeModels: 0
  });

  // Define tabs configuration
  const tabs = [
    { id: 'models', label: 'مدل‌ها', component: Models, icon: <Brain size={18} /> },
    { id: 'datasets', label: 'داده‌ها', component: Datasets, icon: <Database size={18} /> },
    { id: 'tts', label: 'تبدیل متن به گفتار', component: TTS, icon: <Zap size={18} /> },
    { id: 'huggingface', label: 'Hugging Face', component: HuggingFaceModels, icon: <Package size={18} /> }
  ];

  // Metric cards data
  const metricsData = [
    {
      type: 'training',
      icon: <Zap size={24} />,
      value: stats.activeTrainings,
      title: 'آموزش‌های جاری',
      subtitle: 'آموزش‌های در حال اجرا',
      hasGrowth: false,
      growthValue: 0
    },
    {
      type: 'success',
      icon: <CheckCircle size={24} />,
      value: stats.successfulTrainings,
      valueSecondary: `${stats.successRate}%`,
      title: 'آموزش‌های موفق',
      subtitle: 'نرخ موفقیت آموزش',
      hasGrowth: true,
      growthValue: 8
    },
    {
      type: 'dataset',
      icon: <Database size={24} />,
      value: stats.datasets,
      title: 'دیتاست‌ها',
      subtitle: 'مجموعه داده‌های آماده',
      hasGrowth: true,
      growthValue: 5
    },
    {
      type: 'model',
      icon: <Brain size={24} />,
      value: stats.activeModels,
      title: 'مدل‌های فعال',
      subtitle: 'مدل‌های در حال استفاده',
      hasGrowth: true,
      growthValue: 12
    }
  ];

  // Animation variants for tab content
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  // Handle URL hash changes for deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#tab=')) {
        const tab = hash.substring(5);
        if (tabs.some(t => t.id === tab)) {
          setActiveTab(tab);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL hash when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.location.hash = `#tab=${tab}`;
  };

  // Get active tab configuration
  const activeTabConfig = tabs.find(tab => tab.id === activeTab) || tabs[0];

  // Pass subTab state to Models component
  const renderTabContent = () => {
    if (activeTab === 'models') {
      return <Models activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />;
    }
    return React.createElement(activeTabConfig.component);
  };

  return (
    <div className="models-hub-container models-hub">
      {/* Modern Dashboard Stats */}
      <div className="dashboard-section">
        <div className="metrics-dashboard">
          {metricsData.map((metric, index) => (
            <div className="metric-card" key={index}>
              <div className="metric-card-top">
                <div className={`growth-indicator ${!metric.hasGrowth ? 'no-growth' : ''}`}>
                  {metric.hasGrowth ? (
                    <>
                      <span className="growth-value">{metric.growthValue}%+</span>
                      <ArrowUpRight size={14} />
                    </>
                  ) : (
                    <span>0%</span>
                  )}
                </div>
                <div className={`icon-container ${metric.type}-icon`}>
                  {metric.icon}
                </div>
              </div>
              
              <div className="metric-card-value">
                <span className="value-primary">{metric.value}</span>
                {metric.valueSecondary && (
                  <span className="value-secondary">{metric.valueSecondary}</span>
                )}
              </div>
              
              <div className="metric-card-content">
                <h3 className="metric-title">{metric.title}</h3>
                <p className="metric-subtitle">{metric.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Enhanced Tab Navigation */}
      <div className="harmony-tab-container">
        <div className="harmony-tab-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`harmony-tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <span className="tab-button-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div 
                  className="tab-indicator"
                  layoutId="tab-indicator"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          ))}
        </div>
        
        {/* Sub-tabs for Models (models/assets) */}
        {activeTab === 'models' && (
          <div className="harmony-tab-navigation" style={{ marginTop: '16px' }}>
            <button
              className={`harmony-tab-button ${activeSubTab === 'models' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('models')}
              role="tab"
              aria-selected={activeSubTab === 'models'}
            >
              <span className="tab-button-icon"><Brain size={18} /></span>
              <span className="tab-label">مدل‌ها</span>
              {activeSubTab === 'models' && (
                <motion.div 
                  className="tab-indicator"
                  layoutId="sub-tab-indicator"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
            <button
              className={`harmony-tab-button ${activeSubTab === 'assets' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('assets')}
              role="tab"
              aria-selected={activeSubTab === 'assets'}
            >
              <span className="tab-button-icon"><FolderOpen size={18} /></span>
              <span className="tab-label">دارایی‌ها</span>
              {activeSubTab === 'assets' && (
                <motion.div 
                  className="tab-indicator"
                  layoutId="sub-tab-indicator"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
            </button>
          </div>
        )}
        
        {/* Tab Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            className="harmony-tab-content"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={tabContentVariants}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModelsHub;
