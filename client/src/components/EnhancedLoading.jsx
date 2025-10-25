import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Database, 
  Cpu, 
  Network, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Activity
} from 'lucide-react';

const EnhancedLoading = ({ 
  message = "در حال بارگذاری...", 
  showProgress = true,
  steps = [
    { id: 'init', label: 'شروع سیستم', icon: Brain, status: 'pending' },
    { id: 'database', label: 'اتصال به پایگاه داده', icon: Database, status: 'pending' },
    { id: 'api', label: 'برقراری ارتباط با API', icon: Network, status: 'pending' },
    { id: 'resources', label: 'بارگذاری منابع', icon: Cpu, status: 'pending' },
    { id: 'complete', label: 'تکمیل بارگذاری', icon: CheckCircle, status: 'pending' }
  ],
  onComplete = null
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          if (onComplete) onComplete();
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [steps.length, onComplete]);

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'pending';
  };

  const getStepIcon = (step, status) => {
    const IconComponent = step.icon;
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'active') return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    return <IconComponent className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="enhanced-loading-container">
      {/* Background Animation */}
      <div className="loading-background">
        <div className="floating-shapes">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-shape"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.5
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Loading Content */}
      <div className="loading-content">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="loading-header"
        >
          <div className="logo-container">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="logo-spinner"
            >
              <Brain className="w-12 h-12 text-blue-600" />
            </motion.div>
            <div className="logo-glow"></div>
          </div>
          <h1 className="loading-title">Persian Model Trainer</h1>
          <p className="loading-subtitle">سیستم آموزش مدل‌های هوش مصنوعی فارسی</p>
        </motion.div>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="progress-container"
          >
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="progress-text">
              <span className="progress-percentage">{Math.round(progress)}%</span>
              <span className="progress-message">{message}</span>
            </div>
          </motion.div>
        )}

        {/* Loading Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="loading-steps"
        >
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <motion.div
                key={step.id}
                className={`loading-step ${status}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
              >
                <div className="step-icon">
                  {getStepIcon(step, status)}
                </div>
                <div className="step-content">
                  <span className="step-label">{step.label}</span>
                  {status === 'active' && (
                    <motion.div
                      className="step-indicator"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Completion Animation */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="completion-animation"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
                className="completion-icon"
              >
                <CheckCircle className="w-16 h-16 text-green-500" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="completion-text"
              >
                بارگذاری با موفقیت تکمیل شد!
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading Styles */}
      <style jsx>{`
        .enhanced-loading-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          overflow: hidden;
        }

        .loading-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .floating-shapes {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .floating-shape {
          position: absolute;
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .loading-content {
          text-align: center;
          color: white;
          max-width: 500px;
          padding: 2rem;
        }

        .loading-header {
          margin-bottom: 3rem;
        }

        .logo-container {
          position: relative;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .logo-spinner {
          position: relative;
          z-index: 2;
        }

        .logo-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
        }

        .loading-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(45deg, #ffffff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .loading-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          font-weight: 300;
        }

        .progress-container {
          margin: 2rem 0;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
        }

        .progress-percentage {
          font-weight: 600;
          color: #3b82f6;
        }

        .progress-message {
          opacity: 0.8;
        }

        .loading-steps {
          margin-top: 2rem;
        }

        .loading-step {
          display: flex;
          align-items: center;
          padding: 0.75rem 0;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .loading-step.completed {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .loading-step.active {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .step-icon {
          margin-left: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .step-label {
          font-weight: 500;
        }

        .step-indicator {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
        }

        .completion-animation {
          margin-top: 2rem;
        }

        .completion-icon {
          margin-bottom: 1rem;
        }

        .completion-text {
          font-size: 1.2rem;
          font-weight: 600;
          color: #10b981;
        }
      `}</style>
    </div>
  );
};

export default EnhancedLoading;

