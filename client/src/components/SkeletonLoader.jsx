// SkeletonLoader.jsx - Skeleton Loading Components
import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'card', count = 1, className = '' }) => {
    const skeletonVariants = {
        animate: {
            opacity: [0.5, 1, 0.5],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return (
                    <div className={`skeleton-card ${className}`}>
                        <div className="skeleton-header">
                            <div className="skeleton-avatar"></div>
                            <div className="skeleton-text-group">
                                <div className="skeleton-line skeleton-line--title"></div>
                                <div className="skeleton-line skeleton-line--subtitle"></div>
                            </div>
                        </div>
                        <div className="skeleton-content">
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line skeleton-line--short"></div>
                        </div>
                        <div className="skeleton-footer">
                            <div className="skeleton-button"></div>
                            <div className="skeleton-button"></div>
                        </div>
                    </div>
                );

            case 'table':
                return (
                    <div className={`skeleton-table ${className}`}>
                        <div className="skeleton-table-header">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="skeleton-line skeleton-line--header"></div>
                            ))}
                        </div>
                        {[...Array(5)].map((_, rowIndex) => (
                            <div key={rowIndex} className="skeleton-table-row">
                                {[...Array(4)].map((_, colIndex) => (
                                    <div key={colIndex} className="skeleton-line"></div>
                                ))}
                            </div>
                        ))}
                    </div>
                );

            case 'chart':
                return (
                    <div className={`skeleton-chart ${className}`}>
                        <div className="skeleton-chart-header">
                            <div className="skeleton-line skeleton-line--title"></div>
                            <div className="skeleton-line skeleton-line--subtitle"></div>
                        </div>
                        <div className="skeleton-chart-content">
                            <div className="skeleton-bars">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="skeleton-bar"
                                        style={{ height: `${30 + Math.random() * 40}%` }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'list':
                return (
                    <div className={`skeleton-list ${className}`}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="skeleton-list-item">
                                <div className="skeleton-avatar skeleton-avatar--small"></div>
                                <div className="skeleton-text-group">
                                    <div className="skeleton-line"></div>
                                    <div className="skeleton-line skeleton-line--short"></div>
                                </div>
                                <div className="skeleton-badge"></div>
                            </div>
                        ))}
                    </div>
                );

            default:
                return (
                    <div className={`skeleton-default ${className}`}>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line"></div>
                        <div className="skeleton-line skeleton-line--short"></div>
                    </div>
                );
        }
    };

    return (
        <>
            {[...Array(count)].map((_, index) => (
                <motion.div
                    key={index}
                    variants={skeletonVariants}
                    animate="animate"
                    className="skeleton-wrapper"
                >
                    {renderSkeleton()}
                </motion.div>
            ))}

            <style jsx>{`
        .skeleton-wrapper {
          width: 100%;
        }

        .skeleton-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .skeleton-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .skeleton-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-avatar--small {
          width: 32px;
          height: 32px;
        }

        .skeleton-text-group {
          flex: 1;
        }

        .skeleton-line {
          height: 16px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          margin-bottom: 0.5rem;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-line--title {
          width: 60%;
          height: 20px;
        }

        .skeleton-line--subtitle {
          width: 40%;
          height: 14px;
        }

        .skeleton-line--header {
          width: 80%;
          height: 18px;
        }

        .skeleton-line--short {
          width: 30%;
        }

        .skeleton-content {
          margin-bottom: 1rem;
        }

        .skeleton-footer {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .skeleton-button {
          width: 80px;
          height: 32px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          border-radius: 6px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-badge {
          width: 60px;
          height: 24px;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          border-radius: 12px;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .skeleton-table-header {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-bottom: 1px solid #e5e7eb;
        }

        .skeleton-table-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .skeleton-chart {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .skeleton-chart-header {
          margin-bottom: 1.5rem;
        }

        .skeleton-chart-content {
          height: 200px;
          display: flex;
          align-items: end;
          justify-content: space-between;
          padding: 1rem 0;
        }

        .skeleton-bars {
          display: flex;
          align-items: end;
          gap: 0.5rem;
          height: 100%;
          width: 100%;
        }

        .skeleton-bar {
          flex: 1;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          border-radius: 4px 4px 0 0;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-list {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .skeleton-list-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .skeleton-default {
          background: white;
          border-radius: 8px;
          padding: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @media (max-width: 768px) {
          .skeleton-card {
            padding: 1rem;
          }
          
          .skeleton-table-header,
          .skeleton-table-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
          }
          
          .skeleton-chart-content {
            height: 150px;
          }
        }
      `}</style>
        </>
    );
};

export default SkeletonLoader;
