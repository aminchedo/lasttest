// components/QuickStart.jsx - Quick Start Actions Component
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, Brain, Database, Download, Upload, Play,
  FileText, Settings, Zap, Target, ChevronRight,
  Clock, CheckCircle, AlertCircle
} from 'lucide-react';
// Navigation will be handled via props or window.location
import apiClient from '../api/endpoints';
import { toast } from 'react-hot-toast';

const QuickStart = ({ onNavigate }) => {
  const [loading, setLoading] = useState({});

  const quickActions = [
    {
      id: 'new-training',
      title: 'شروع آموزش جدید',
      description: 'آموزش مدل جدید با داده‌های خود',
      icon: Brain,
      color: 'blue',
      action: () => onNavigate ? onNavigate('training') : window.location.hash = '#training',
      estimated: '5-30 دقیقه'
    },
    {
      id: 'download-model',
      title: 'دانلود مدل',
      description: 'دانلود مدل از Hugging Face',
      icon: Download,
      color: 'green',
      action: () => onNavigate ? onNavigate('models') : window.location.hash = '#models',
      estimated: '2-10 دقیقه'
    },
    {
      id: 'upload-dataset',
      title: 'آپلود داده',
      description: 'آپلود مجموعه داده جدید',
      icon: Upload,
      color: 'purple',
      action: () => onNavigate ? onNavigate('datasets') : window.location.hash = '#datasets',
      estimated: '1-5 دقیقه'
    },
    {
      id: 'analyze-model',
      title: 'تحلیل مدل',
      description: 'تحلیل عملکرد مدل‌های موجود',
      icon: Target,
      color: 'orange',
      action: () => onNavigate ? onNavigate('analysis') : window.location.hash = '#analysis',
      estimated: '2-5 دقیقه'
    }
  ];

  const templates = [
    {
      id: 'text-classification',
      title: 'طبقه‌بندی متن',
      description: 'آموزش مدل برای طبقه‌بندی متون فارسی',
      icon: FileText,
      config: {
        modelType: 'text-classification',
        architecture: 'bert-base-multilingual',
        epochs: 3,
        batchSize: 16
      }
    },
    {
      id: 'sentiment-analysis',
      title: 'تحلیل احساسات',
      description: 'تشخیص احساسات در متون فارسی',
      icon: Brain,
      config: {
        modelType: 'sentiment-analysis',
        architecture: 'bert-base-multilingual',
        epochs: 5,
        batchSize: 8
      }
    },
    {
      id: 'ner',
      title: 'تشخیص موجودیت',
      description: 'شناسایی اسامی اشخاص، مکان‌ها و سازمان‌ها',
      icon: Zap,
      config: {
        modelType: 'token-classification',
        architecture: 'bert-base-multilingual',
        epochs: 4,
        batchSize: 12
      }
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
      gray: 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
    };
    return colors[color] || colors.gray;
  };

  const handleQuickAction = async (action) => {
    setLoading(prev => ({ ...prev, [action.id]: true }));
    
    try {
      if (action.action) {
        await action.action();
      }
    } catch (error) {
      console.error('Error in quick action:', error);
      toast.error('خطا در انجام عملیات');
    } finally {
      setLoading(prev => ({ ...prev, [action.id]: false }));
    }
  };

  const startTemplateTraining = async (template) => {
    if (!template?.id) return;
    
    setLoading(prev => ({ ...prev, [template.id]: true }));
    
    try {
      const response = await apiClient.post('/lifecycle/jobs', {
        ...template.config,
        templateId: template.id,
        datasetPath: '/datasets/sample.csv' // Default dataset
      });
      
      if (response?.ok) {
        toast.success(`آموزش ${template.title} شروع شد`);
        if (onNavigate) {
          onNavigate('training');
        } else {
          window.location.hash = '#training';
        }
      } else {
        const errorMsg = response?.error || 'خطا در شروع آموزش';
        toast.error(errorMsg);
        console.warn('Training start failed:', response);
      }
    } catch (error) {
      console.error('Error starting template training:', error);
      const errorMsg = error.message?.includes('fetch') 
        ? 'خطا در اتصال به سرور' 
        : 'خطا در شروع آموزش';
      toast.error(errorMsg);
    } finally {
      setLoading(prev => ({ ...prev, [template.id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Rocket className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">شروع سریع</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            const isLoading = loading[action.id];
            
            return (
              <motion.button
                key={action.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction(action)}
                disabled={isLoading}
                className={`
                  p-4 rounded-lg border-2 text-right transition-all duration-200
                  ${getColorClasses(action.color)}
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{action.title}</h4>
                    <p className="text-sm opacity-75 mb-2">{action.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{action.estimated}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Icon className="w-5 h-5" />
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Training Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">قالب‌های آموزش</h3>
          <span className="text-sm text-gray-500">آموزش سریع با تنظیمات از پیش تعریف شده</span>
        </div>
        
        <div className="space-y-3">
          {templates.map((template) => {
            const Icon = template.icon;
            const isLoading = loading[template.id];
            
            return (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.01 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{template.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Architecture: {template.config.architecture}</span>
                        <span>Epochs: {template.config.epochs}</span>
                        <span>Batch Size: {template.config.batchSize}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => startTemplateTraining(template)}
                    disabled={isLoading}
                    className={`
                      px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                      transition-colors flex items-center gap-2
                      ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>شروع</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">خلاصه فعالیت‌ها</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
            <div className="text-sm text-gray-600">آموزش تکمیل شده</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">8</div>
            <div className="text-sm text-gray-600">مدل دانلود شده</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">24</div>
            <div className="text-sm text-gray-600">مجموعه داده</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStart;