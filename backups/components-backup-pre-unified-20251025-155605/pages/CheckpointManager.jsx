import React, { useState } from 'react';
import { Save, Trash2, Download, Upload, Clock, Database, Award, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

const CheckpointManager = ({ checkpoints, selectedCheckpoint, onSelect, onDelete, onDownload }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  const formatSize = (bytes) => {
    if (typeof bytes === 'string') return bytes;
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };
  
  const handleDelete = async (checkpoint) => {
    try {
      await onDelete(checkpoint.id);
      toast.success('Checkpoint با موفقیت حذف شد');
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error('خطا در حذف checkpoint');
    }
  };
  
  const handleDownload = async (checkpoint) => {
    try {
      if (onDownload) {
        await onDownload(checkpoint);
        toast.success('دانلود شروع شد');
      }
    } catch (error) {
      toast.error('خطا در دانلود checkpoint');
    }
  };
  
  if (!checkpoints || checkpoints.length === 0) {
    return (
      <div className="checkpoint-manager empty">
        <div className="empty-state">
          <Database size={48} className="text-gray-300" />
          <p className="text-gray-500 mt-3">هیچ checkpoint‌ای وجود ندارد</p>
          <p className="text-gray-400 text-sm mt-1">
            Checkpoint‌ها به صورت خودکار در حین آموزش ذخیره می‌شوند
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="checkpoint-manager">
      <div className="checkpoint-header">
        <h3 className="checkpoint-title">
          <Save size={20} />
          مدیریت Checkpoints
        </h3>
        <span className="checkpoint-count">{checkpoints.length} checkpoint</span>
      </div>
      
      <div className="checkpoints-grid">
        {checkpoints.map((checkpoint, index) => {
          const isSelected = selectedCheckpoint?.id === checkpoint.id;
          const isBest = checkpoint.isBest;
          
          return (
            <motion.div
              key={checkpoint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`checkpoint-card ${isSelected ? 'selected' : ''} ${isBest ? 'best' : ''}`}
              onClick={() => onSelect(checkpoint)}
            >
              {isBest && (
                <div className="best-badge">
                  <Award size={14} />
                  <span>بهترین</span>
                </div>
              )}
              
              <div className="checkpoint-icon">
                <Database size={28} />
              </div>
              
              <div className="checkpoint-info">
                <h4 className="checkpoint-name">{checkpoint.name}</h4>
                
                <div className="checkpoint-meta">
                  <div className="meta-item">
                    <Clock size={12} />
                    <span>{formatDate(checkpoint.createdAt)}</span>
                  </div>
                  
                  <div className="meta-item">
                    <Database size={12} />
                    <span>{formatSize(checkpoint.size)}</span>
                  </div>
                </div>
                
                {checkpoint.metrics && (
                  <div className="checkpoint-metrics">
                    <div className="metric-badge">
                      <span className="metric-label">Loss:</span>
                      <span className="metric-value">{checkpoint.metrics.valLoss?.toFixed(4) || 'N/A'}</span>
                    </div>
                    <div className="metric-badge">
                      <span className="metric-label">Epoch:</span>
                      <span className="metric-value">{checkpoint.metrics.epoch || 'N/A'}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="checkpoint-actions">
                {onDownload && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(checkpoint);
                    }}
                    className="action-btn download-btn"
                    title="دانلود"
                  >
                    <Download size={16} />
                  </button>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteConfirm(checkpoint.id);
                  }}
                  className="action-btn delete-btn"
                  title="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              {/* Delete Confirmation */}
              {showDeleteConfirm === checkpoint.id && (
                <div className="delete-confirm" onClick={(e) => e.stopPropagation()}>
                  <div className="confirm-content">
                    <AlertCircle size={20} className="text-red-500" />
                    <p>آیا مطمئن هستید؟</p>
                    <div className="confirm-actions">
                      <button
                        onClick={() => handleDelete(checkpoint)}
                        className="btn-confirm-delete"
                      >
                        حذف
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="btn-cancel"
                      >
                        انصراف
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <style>{`
        .checkpoint-manager {
          background: white;
          border-radius: 20px;
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 2px solid transparent;
          background-image: linear-gradient(white, white), 
                           linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }
        
        .checkpoint-manager.empty {
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .empty-state {
          text-align: center;
        }
        
        .checkpoint-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f3f4f6;
        }
        
        .checkpoint-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }
        
        .checkpoint-title svg {
          color: #8b5cf6;
        }
        
        .checkpoint-count {
          padding: 6px 12px;
          background: linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%);
          color: #8b5cf6;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .checkpoints-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        
        .checkpoint-card {
          position: relative;
          background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        
        .checkpoint-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .checkpoint-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(139, 92, 246, 0.2);
          border-color: #a855f7;
        }
        
        .checkpoint-card:hover::before {
          opacity: 1;
        }
        
        .checkpoint-card.selected {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
        }
        
        .checkpoint-card.selected::after {
          content: '✓';
          position: absolute;
          top: 12px;
          left: 12px;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }
        
        .checkpoint-card.best {
          border-color: #f59e0b;
        }
        
        .best-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #92400e;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          z-index: 1;
        }
        
        .checkpoint-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin-bottom: 16px;
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
        }
        
        .checkpoint-info {
          flex: 1;
          z-index: 1;
        }
        
        .checkpoint-name {
          font-size: 16px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 12px;
        }
        
        .checkpoint-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #6b7280;
        }
        
        .meta-item svg {
          color: #a855f7;
        }
        
        .checkpoint-metrics {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .metric-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%);
          border-radius: 6px;
          font-size: 11px;
        }
        
        .metric-label {
          color: #8b5cf6;
          font-weight: 600;
        }
        
        .metric-value {
          color: #6b7280;
          font-weight: 700;
        }
        
        .checkpoint-actions {
          display: flex;
          gap: 8px;
          margin-top: 16px;
          z-index: 1;
        }
        
        .action-btn {
          flex: 1;
          padding: 8px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .action-btn:hover {
          transform: translateY(-2px);
        }
        
        .download-btn {
          color: #3b82f6;
          border-color: #3b82f6;
        }
        
        .download-btn:hover {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .delete-btn {
          color: #ef4444;
          border-color: #ef4444;
        }
        
        .delete-btn:hover {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        
        .delete-confirm {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(4px);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }
        
        .confirm-content {
          text-align: center;
          color: white;
          padding: 20px;
        }
        
        .confirm-content p {
          margin: 12px 0 16px 0;
          font-weight: 600;
        }
        
        .confirm-actions {
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        
        .btn-confirm-delete,
        .btn-cancel {
          padding: 8px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .btn-confirm-delete {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }
        
        .btn-confirm-delete:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        
        .btn-cancel {
          background: white;
          color: #6b7280;
        }
        
        .btn-cancel:hover {
          background: #f3f4f6;
        }
        
        @media (max-width: 768px) {
          .checkpoints-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CheckpointManager;
