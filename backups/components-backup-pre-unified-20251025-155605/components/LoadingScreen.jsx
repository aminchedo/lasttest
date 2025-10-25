// LoadingScreen.jsx - Enhanced Loading Component
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Database, Zap, Activity } from 'lucide-react';

const LoadingScreen = ({ message = "در حال بارگذاری..." }) => {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const loadingSteps = [
        { icon: Brain, text: "بارگذاری مدل‌ها", duration: 1000 },
        { icon: Database, text: "اتصال به پایگاه داده", duration: 800 },
        { icon: Zap, text: "آماده‌سازی سیستم", duration: 600 },
        { icon: Activity, text: "فعال‌سازی داشبورد", duration: 400 }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const stepInterval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev >= loadingSteps.length - 1) {
                    clearInterval(stepInterval);
                    return prev;
                }
                return prev + 1;
            });
        }, 800);

        return () => clearInterval(stepInterval);
    }, []);

    const currentStepData = loadingSteps[currentStep];

    return (
        <div className="loading-screen">
            <div className="loading-container">
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
                                }}
                                transition={{
                                    duration: 2 + i * 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.3,
                                }}
                                style={{
                                    left: `${10 + i * 15}%`,
                                    top: `${20 + (i % 3) * 30}%`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="loading-content">
                    {/* Logo/Icon */}
                    <motion.div
                        className="loading-logo"
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <Brain size={64} className="text-blue-600" />
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="loading-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        سیستم آموزش مدل‌های فارسی
                    </motion.h1>

                    {/* Current Step */}
                    <motion.div
                        className="loading-step"
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="step-icon">
                            <currentStepData.icon size={24} className="text-blue-600" />
                        </div>
                        <span className="step-text">{currentStepData.text}</span>
                    </motion.div>

                    {/* Progress Bar */}
                    <div className="progress-container">
                        <div className="progress-bar">
                            <motion.div
                                className="progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <div className="progress-text">{progress}%</div>
                    </div>

                    {/* Message */}
                    <motion.p
                        className="loading-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        {message}
                    </motion.p>

                    {/* Loading Dots */}
                    <div className="loading-dots">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="loading-dot"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
        .loading-screen {
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
          direction: rtl;
        }

        .loading-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
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
        }

        .loading-content {
          text-align: center;
          color: white;
          z-index: 10;
          position: relative;
        }

        .loading-logo {
          margin-bottom: 2rem;
        }

        .loading-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .loading-step {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .step-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-text {
          font-size: 1.1rem;
          font-weight: 500;
        }

        .progress-container {
          width: 300px;
          margin: 0 auto 2rem;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          font-size: 0.9rem;
          font-weight: 600;
          opacity: 0.8;
        }

        .loading-message {
          font-size: 1rem;
          opacity: 0.8;
          margin-bottom: 2rem;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }

        .loading-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .loading-title {
            font-size: 1.5rem;
          }
          
          .progress-container {
            width: 250px;
          }
          
          .loading-step {
            padding: 0.75rem 1.5rem;
          }
        }
      `}</style>
        </div>
    );
};

export default LoadingScreen;
