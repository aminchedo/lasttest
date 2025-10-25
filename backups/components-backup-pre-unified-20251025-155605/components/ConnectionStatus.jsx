// components/ConnectionStatus.jsx - API Connection Status Indicator
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, WifiOff, AlertTriangle, CheckCircle, 
  RefreshCw, Settings, Activity 
} from 'lucide-react';
import apiClient from '../api/client';

const ConnectionStatus = ({ className = '' }) => {
  const [status, setStatus] = useState({
    isConnected: false,
    isHealthy: false,
    consecutiveFailures: 0,
    lastSuccessfulRequest: null,
    isChecking: false
  });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Initial status check
    updateStatus();

    // Update status every 10 seconds
    const interval = setInterval(updateStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async () => {
    try {
      const connectionStatus = apiClient.getConnectionStatus();
      setStatus(prev => ({
        ...prev,
        ...connectionStatus,
        isChecking: false
      }));
    } catch (error) {
      console.error('Failed to get connection status:', error);
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        isHealthy: false,
        isChecking: false
      }));
    }
  };

  const handleManualCheck = async () => {
    setStatus(prev => ({ ...prev, isChecking: true }));
    
    try {
      const healthResponse = await apiClient.checkHealth();
      if (healthResponse.ok) {
        setStatus(prev => ({
          ...prev,
          isConnected: true,
          isHealthy: true,
          consecutiveFailures: 0,
          lastSuccessfulRequest: Date.now(),
          isChecking: false
        }));
      } else {
        throw new Error('Health check failed');
      }
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        isHealthy: false,
        consecutiveFailures: prev.consecutiveFailures + 1,
        isChecking: false
      }));
    }
  };

  const getStatusColor = () => {
    if (status.isChecking) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (status.isHealthy) return 'text-green-600 bg-green-50 border-green-200';
    if (status.isConnected) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = () => {
    if (status.isChecking) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (status.isHealthy) return <CheckCircle className="w-4 h-4" />;
    if (status.isConnected) return <AlertTriangle className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (status.isChecking) return 'در حال بررسی...';
    if (status.isHealthy) return 'متصل و سالم';
    if (status.isConnected) return 'متصل با مشکل';
    return 'قطع ارتباط';
  };

  const formatLastSuccess = () => {
    if (!status.lastSuccessfulRequest) return 'هرگز';
    
    const now = Date.now();
    const diff = now - status.lastSuccessfulRequest;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) return `${minutes} دقیقه پیش`;
    return `${seconds} ثانیه پیش`;
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${getStatusColor()}`}
        onClick={() => setShowDetails(!showDetails)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        
        {status.consecutiveFailures > 0 && (
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
            {status.consecutiveFailures} خطا
          </span>
        )}
      </motion.div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">وضعیت اتصال API</h4>
                <button
                  onClick={handleManualCheck}
                  disabled={status.isChecking}
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
                  title="بررسی دستی"
                >
                  <RefreshCw className={`w-4 h-4 ${status.isChecking ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      status.isConnected ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-gray-600">اتصال</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      status.isHealthy ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <span className="text-gray-600">سلامت</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">خطاهای متوالی:</span>
                    <span className="font-medium ml-1">{status.consecutiveFailures}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">آخرین موفقیت:</span>
                    <span className="font-medium ml-1">{formatLastSuccess()}</span>
                  </div>
                </div>
              </div>

              {!status.isConnected && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-red-800 mb-1">مشکل در اتصال</p>
                      <p className="text-red-700">
                        سرور backend در دسترس نیست. لطفاً اطمینان حاصل کنید که سرور روی پورت 3001 در حال اجرا است.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {status.isConnected && !status.isHealthy && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 mb-1">اتصال ناپایدار</p>
                      <p className="text-yellow-700">
                        اتصال برقرار است اما برخی درخواست‌ها با خطا مواجه می‌شوند.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200">
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Base URL: {apiClient.axios.defaults.baseURL}</div>
                  <div>Timeout: {apiClient.axios.defaults.timeout}ms</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConnectionStatus;