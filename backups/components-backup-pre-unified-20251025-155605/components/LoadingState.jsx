import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Brain, Database, Network, Cpu } from 'lucide-react';

const LoadingState = ({ 
  message = "در حال بارگذاری...", 
  size = "medium",
  showIcon = true,
  variant = "default"
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-8 h-8';
      case 'xlarge':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return {
          container: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
          text: 'text-gray-600 text-sm'
        };
      case 'overlay':
        return {
          container: 'bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-8',
          text: 'text-gray-700 text-base'
        };
      case 'inline':
        return {
          container: 'flex items-center gap-2',
          text: 'text-gray-500 text-sm'
        };
      default:
        return {
          container: 'flex flex-col items-center justify-center p-8',
          text: 'text-gray-600 text-base'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`loading-state ${styles.container}`}
    >
      {showIcon && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-3"
        >
          <Loader2 className={`${getSizeClasses()} text-blue-600`} />
        </motion.div>
      )}
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`loading-message ${styles.text}`}
      >
        {message}
      </motion.p>

      {/* Loading dots animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="loading-dots"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="loading-dot"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>

      <style jsx>{`
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .loading-message {
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .loading-dots {
          display: flex;
          gap: 0.25rem;
          margin-top: 0.5rem;
        }

        .loading-dot {
          width: 6px;
          height: 6px;
          background: #3b82f6;
          border-radius: 50%;
        }

        .loading-state.card {
          min-height: 200px;
        }

        .loading-state.overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
        }

        .loading-state.inline {
          flex-direction: row;
          padding: 0.5rem;
        }

        .loading-state.inline .loading-message {
          margin-bottom: 0;
          margin-right: 0.5rem;
        }

        .loading-state.inline .loading-dots {
          margin-top: 0;
        }
      `}</style>
    </motion.div>
  );
};

export default LoadingState;

