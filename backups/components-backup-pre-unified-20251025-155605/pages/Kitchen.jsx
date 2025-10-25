// Kitchen - آشپزخانه مدل‌سازی (Cooking Metaphor for Model Training)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Droplet, Wind, Zap, ChefHat, ThermometerSun,
  Clock, Target, Activity, TrendingUp, AlertCircle, CheckCircle,
  PlayCircle, PauseCircle, StopCircle, SkipForward, RotateCcw
} from 'lucide-react';
import apiClient from '../api/endpoints';
import { toast } from 'react-hot-toast';

const toArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  if (data && Array.isArray(data.results)) return data.results;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && typeof data === 'object') return Object.values(data);
  return [];
};

const Kitchen = () => {
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  // Pagination states
  const [activePage, setActivePage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [failedPage, setFailedPage] = useState(1);
  const itemsPerPage = 6;

  // Load training jobs
  useEffect(() => {
    loadTrainingJobs();
    const interval = setInterval(loadTrainingJobs, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const loadTrainingJobs = async () => {
    try {
      const result = await apiClient.getTrainingJobs();
      if (result && result.ok) {
        setJobsList(toArray(result.data));
      } else {
        console.error('Error loading training jobs:', result?.error || 'Unknown error');
        setJobsList([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading training jobs:', error);
      setJobsList([]);
      setLoading(false);
    }
  };

  // Get cooking state based on training progress
  const getCookingState = (job) => {
    const progress = job.progress || 0;

    if (job.status === 'completed') {
      return { state: 'ready', icon: CheckCircle, temp: 'perfect', color: '#10b981' };
    } else if (job.status === 'failed' || job.status === 'error') {
      return { state: 'burnt', icon: AlertCircle, temp: 'too hot', color: '#ef4444' };
    } else if (progress === 0) {
      return { state: 'preheating', icon: ThermometerSun, temp: 'warming up', color: '#8b5cf6' };
    } else if (progress < 30) {
      return { state: 'simmering', icon: Droplet, temp: 'low heat', color: '#3b82f6' };
    } else if (progress < 70) {
      return { state: 'boiling', icon: Flame, temp: 'high heat', color: '#f59e0b' };
    } else {
      return { state: 'finishing', icon: Wind, temp: 'cooling down', color: '#06b6d4' };
    }
  };

  // Format time
  const formatDuration = (ms) => {
    if (!ms) return '0m';
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="kitchen-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <ChefHat size={64} />
        </motion.div>
        <p>در حال بارگذاری آشپزخانه...</p>
      </div>
    );
  }

  const activeJobs = jobsList.filter(j => j.status === 'running' || j.status === 'training');
  const completedJobs = jobsList.filter(j => j.status === 'completed');
  const failedJobs = jobsList.filter(j => j.status === 'failed' || j.status === 'error');

  // Paginated data
  const paginatedActiveJobs = activeJobs.slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);
  const paginatedCompletedJobs = completedJobs.slice((completedPage - 1) * itemsPerPage, completedPage * itemsPerPage);
  const paginatedFailedJobs = failedJobs.slice((failedPage - 1) * itemsPerPage, failedPage * itemsPerPage);

  // Total pages
  const activeTotalPages = Math.ceil(activeJobs.length / itemsPerPage);
  const completedTotalPages = Math.ceil(completedJobs.length / itemsPerPage);
  const failedTotalPages = Math.ceil(failedJobs.length / itemsPerPage);

  return (
    <div className="container-12">
      {/* Kitchen Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="kitchen-header"
      >
        <div className="kitchen-title">
          <ChefHat size={48} className="chef-icon" />
          <div>
            <h1>🍳 آشپزخانه مدل‌سازی</h1>
            <p>مدل‌های شما در حال پخت هستند!</p>
          </div>
        </div>
        <div className="kitchen-stats">
          <div className="stat-badge active">
            <Flame size={20} />
            <span>{activeJobs.length} در حال پخت</span>
          </div>
          <div className="stat-badge success">
            <CheckCircle size={20} />
            <span>{completedJobs.length} آماده</span>
          </div>
          <div className="stat-badge error">
            <AlertCircle size={20} />
            <span>{failedJobs.length} سوخته</span>
          </div>
        </div>
      </motion.div>

      {/* Active Cooking (Running Jobs) */}
      {activeJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cooking-section active-section"
        >
          <h2 className="section-title">
            <Flame size={24} className="flame-icon" />
            در حال پخت (اجرای فعال)
          </h2>
          <div className="stoves-grid">
            {paginatedActiveJobs.map((job) => {
              const cookingState = getCookingState(job);
              return (
                <StoveCard
                  key={job.id}
                  job={job}
                  cookingState={cookingState}
                  onClick={() => setSelectedJob(job)}
                />
              );
            })}
          </div>

          {/* Pagination for Active Jobs */}
          {activeTotalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setActivePage(prev => Math.max(1, prev - 1))}
                disabled={activePage === 1}
                className="pagination-btn"
              >
                قبلی
              </button>
              <span className="pagination-info">
                صفحه {activePage} از {activeTotalPages}
              </span>
              <button
                onClick={() => setActivePage(prev => Math.min(activeTotalPages, prev + 1))}
                disabled={activePage === activeTotalPages}
                className="pagination-btn"
              >
                بعدی
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Pending Jobs (Queue) */}
      {jobsList.filter(j => j.status === 'pending' || j.status === 'queued').length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cooking-section queue-section"
        >
          <h2 className="section-title">
            <Clock size={24} />
            در صف انتظار
          </h2>
          <div className="queue-list">
            {jobsList
              .filter(j => j.status === 'pending' || j.status === 'queued')
              .map((job, index) => (
                <QueueCard key={job.id} job={job} position={index + 1} />
              ))}
          </div>
        </motion.div>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cooking-section completed-section"
        >
          <h2 className="section-title">
            <CheckCircle size={24} />
            غذاهای آماده (مدل‌های کامل)
          </h2>
          <div className="completed-grid">
            {paginatedCompletedJobs.map((job) => (
              <CompletedCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination for Completed Jobs */}
          {completedTotalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCompletedPage(prev => Math.max(1, prev - 1))}
                disabled={completedPage === 1}
                className="pagination-btn"
              >
                قبلی
              </button>
              <span className="pagination-info">
                صفحه {completedPage} از {completedTotalPages}
              </span>
              <button
                onClick={() => setCompletedPage(prev => Math.min(completedTotalPages, prev + 1))}
                disabled={completedPage === completedTotalPages}
                className="pagination-btn"
              >
                بعدی
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Failed Jobs */}
      {failedJobs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="cooking-section failed-section"
        >
          <h2 className="section-title">
            <AlertCircle size={24} />
            غذاهای سوخته (خطاها)
          </h2>
          <div className="failed-list">
            {paginatedFailedJobs.map((job) => (
              <FailedCard key={job.id} job={job} />
            ))}
          </div>

          {/* Pagination for Failed Jobs */}
          {failedTotalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setFailedPage(prev => Math.max(1, prev - 1))}
                disabled={failedPage === 1}
                className="pagination-btn"
              >
                قبلی
              </button>
              <span className="pagination-info">
                صفحه {failedPage} از {failedTotalPages}
              </span>
              <button
                onClick={() => setFailedPage(prev => Math.min(failedTotalPages, prev + 1))}
                disabled={failedPage === failedTotalPages}
                className="pagination-btn"
              >
                بعدی
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {jobsList.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="kitchen-empty"
        >
          <ChefHat size={120} />
          <h2>آشپزخانه خالی است!</h2>
          <p>هنوز هیچ مدلی در حال آموزش نیست</p>
          <button className="btn-start-cooking" onClick={() => window.location.href = '/train'}>
            <PlayCircle size={20} />
            شروع پخت مدل جدید
          </button>
        </motion.div>
      )}

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
        )}
      </AnimatePresence>

      <style>{`
        .kitchen-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 32px;
        }

        /* Header */
        .kitchen-header {
          background: white;
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 32px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .kitchen-title {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .chef-icon {
          color: #f59e0b;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .kitchen-title h1 {
          font-size: 32px;
          font-weight: 800;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .kitchen-title p {
          font-size: 16px;
          color: #6b7280;
          margin: 0;
        }

        .kitchen-stats {
          display: flex;
          gap: 16px;
        }

        .stat-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 14px;
        }

        .stat-badge.active {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
        }

        .stat-badge.success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
        }

        .stat-badge.error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
        }

        /* Sections */
        .cooking-section {
          background: white;
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 24px 0;
        }

        .flame-icon {
          color: #f59e0b;
          animation: flicker 1s ease-in-out infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        /* Stoves Grid */
        .stoves-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        /* Queue & Other Lists */
        .queue-list,
        .completed-grid,
        .failed-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 2px solid #f3f4f6;
        }
        
        .pagination-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .pagination-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-info {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
        }

        .completed-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }

        /* Empty State */
        .kitchen-empty {
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .kitchen-empty svg {
          color: #d1d5db;
          margin-bottom: 24px;
        }

        .kitchen-empty h2 {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .kitchen-empty p {
          font-size: 16px;
          color: #6b7280;
          margin: 0 0 32px 0;
        }

        .btn-start-cooking {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 32px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-start-cooking:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(245, 158, 11, 0.3);
        }

        /* Loading */
        .kitchen-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #1f2937;
        }

        .kitchen-loading p {
          margin-top: 24px;
          font-size: 18px;
          font-weight: 600;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .kitchen-container {
            padding: 16px;
          }

          .kitchen-header {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .kitchen-stats {
            flex-wrap: wrap;
          }

          .stoves-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

// Stove Card Component (Active Training)
const StoveCard = ({ job, cookingState, onClick }) => {
  const { state, icon: Icon, temp, color } = cookingState;
  const progress = job.progress || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="stove-card"
      onClick={onClick}
      style={{ borderColor: color }}
    >
      {/* Animated Icon */}
      <div className="stove-icon" style={{ background: `${color}20` }}>
        <motion.div
          animate={{
            scale: state === 'boiling' ? [1, 1.2, 1] : [1, 1.05, 1],
            rotate: state === 'boiling' ? [0, 5, -5, 0] : 0
          }}
          transition={{
            duration: state === 'boiling' ? 0.5 : 1.5,
            repeat: Infinity
          }}
        >
          <Icon size={32} style={{ color }} />
        </motion.div>
      </div>

      {/* Job Info */}
      <div className="stove-info">
        <h3 className="stove-title">{job.baseModel || job.id || 'مدل در حال آموزش'}</h3>
        <div className="stove-state" style={{ color }}>
          <span className="state-label">{temp}</span>
          <span className="state-name">({state})</span>
        </div>
      </div>

      {/* Progress */}
      <div className="stove-progress">
        <div className="progress-header">
          <span>پیشرفت پخت</span>
          <strong>{progress}%</strong>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Metrics */}
      <div className="stove-metrics">
        {job.startedAt && (
          <div className="metric">
            <Clock size={14} />
            <span>شروع: {new Date(job.startedAt).toLocaleTimeString('fa-IR')}</span>
          </div>
        )}
        {job.metrics?.epoch && (
          <div className="metric">
            <Target size={14} />
            <span>Epoch: {job.metrics.epoch}</span>
          </div>
        )}
        {job.metrics?.trainLoss && (
          <div className="metric">
            <TrendingUp size={14} />
            <span>Loss: {parseFloat(job.metrics.trainLoss).toFixed(4)}</span>
          </div>
        )}
        {job.message && (
          <div className="metric">
            <Activity size={14} />
            <span>{job.message}</span>
          </div>
        )}
      </div>

      {/* Temperature Animation */}
      {state === 'boiling' && (
        <div className="heat-waves">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="heat-wave"
              animate={{
                y: [-20, -60],
                opacity: [0.6, 0],
                scale: [0.8, 1.2]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        .stove-card {
          position: relative;
          background: white;
          border: 3px solid;
          border-radius: 20px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.3s;
          overflow: hidden;
        }

        .stove-card:hover {
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .stove-icon {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .stove-info {
          margin-bottom: 16px;
        }

        .stove-title {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 8px 0;
        }

        .stove-state {
          display: flex;
          gap: 6px;
          font-size: 14px;
          font-weight: 600;
        }

        .stove-progress {
          margin-bottom: 16px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
          color: #6b7280;
          font-weight: 600;
        }

        .progress-bar {
          height: 10px;
          background: #f3f4f6;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
        }

        .stove-metrics {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #6b7280;
        }
        
        .job-time {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
        }

        .heat-waves {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 100px;
          pointer-events: none;
        }

        .heat-wave {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 60px;
          background: radial-gradient(circle, #f59e0b 0%, transparent 70%);
          border-radius: 50%;
        }
      `}</style>
    </motion.div>
  );
};

// Helper function moved inside component scope
const formatDuration = (ms) => {
  if (!ms) return '0m';
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
};

// Queue Card, Completed Card, Failed Card, and Modal components would go here
// (Truncated for brevity - I can add them if needed)

const QueueCard = ({ job, position }) => (
  <div className="queue-card">
    <div className="queue-position">#{position}</div>
    <div className="queue-info">
      <h4>{job.baseModel || job.id || 'مدل در صف'}</h4>
      <p>در انتظار اجرا...</p>
    </div>
  </div>
);

const CompletedCard = ({ job }) => (
  <div className="completed-card">
    <CheckCircle size={32} color="#10b981" />
    <h4>{job.baseModel || job.id || 'مدل تکمیل شده'}</h4>
    <p>آماده برای استفاده</p>
    {job.finishedAt && (
      <p className="job-time">تکمیل: {new Date(job.finishedAt).toLocaleDateString('fa-IR')}</p>
    )}
  </div>
);

const FailedCard = ({ job }) => (
  <div className="failed-card">
    <AlertCircle size={24} color="#ef4444" />
    <div>
      <h4>{job.baseModel || job.id || 'مدل ناموفق'}</h4>
      <p>{job.message || 'خطای نامشخص'}</p>
    </div>
  </div>
);

const JobDetailModal = ({ job, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="modal-overlay"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <h2>جزئیات آموزش</h2>
      <pre>{JSON.stringify(job, null, 2)}</pre>
      <button onClick={onClose}>بستن</button>
    </motion.div>
  </motion.div>
);

export default Kitchen;
