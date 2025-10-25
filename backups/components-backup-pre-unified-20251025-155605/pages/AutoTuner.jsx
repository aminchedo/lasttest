import React, { useState } from 'react';
import { X, TrendingUp, Award, BarChart3, Check, Sliders, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, ScatterChart, Scatter, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

const AutoTuner = ({ results, onClose, onApplyConfig }) => {
  const [selectedTrial, setSelectedTrial] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // overview, details, comparison
  
  if (!results || !results.trials) {
    return null;
  }
  
  const { trials, bestConfig, bestScore, searchSpace } = results;
  
  // Sort trials by score (lower is better for loss)
  const sortedTrials = [...trials].sort((a, b) => a.score - b.score);
  const bestTrial = sortedTrials[0];
  const worstTrial = sortedTrials[sortedTrials.length - 1];
  
  // Prepare data for visualization
  const historyData = trials.map((trial, index) => ({
    trial: index + 1,
    score: trial.score,
    isBest: trial.id === bestTrial.id,
    learningRate: trial.config.learningRate,
    batchSize: trial.config.batchSize
  }));
  
  // Calculate parameter importance
  const parameterImportance = calculateParameterImportance(trials);
  
  // Improvement percentage
  const improvementPercent = ((worstTrial.score - bestTrial.score) / worstTrial.score * 100).toFixed(1);
  
  const handleApplyConfig = () => {
    if (onApplyConfig && bestConfig) {
      onApplyConfig(bestConfig);
      onClose();
    }
  };
  
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="autotuner-modal"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div className="header-title">
              <div className="title-icon">
                <Award size={28} />
              </div>
              <div>
                <h2>نتایج Auto-Tuning</h2>
                <p className="header-subtitle">
                  {trials.length} آزمایش انجام شد • بهبود {improvementPercent}%
                </p>
              </div>
            </div>
            <button className="close-btn" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          {/* View Mode Tabs */}
          <div className="view-tabs">
            <button
              className={`tab ${viewMode === 'overview' ? 'active' : ''}`}
              onClick={() => setViewMode('overview')}
            >
              <BarChart3 size={18} />
              نمای کلی
            </button>
            <button
              className={`tab ${viewMode === 'details' ? 'active' : ''}`}
              onClick={() => setViewMode('details')}
            >
              <Sliders size={18} />
              جزئیات
            </button>
            <button
              className={`tab ${viewMode === 'comparison' ? 'active' : ''}`}
              onClick={() => setViewMode('comparison')}
            >
              <TrendingUp size={18} />
              مقایسه
            </button>
          </div>
          
          {/* Content */}
          <div className="modal-content">
            {viewMode === 'overview' && (
              <div className="overview-view">
                {/* Best Configuration Card */}
                <div className="best-config-card">
                  <div className="card-header">
                    <Award size={24} className="text-yellow-500" />
                    <h3>بهترین تنظیمات</h3>
                    <span className="score-badge">
                      Score: {bestScore.toFixed(4)}
                    </span>
                  </div>
                  
                  <div className="config-grid">
                    {Object.entries(bestConfig).map(([key, value]) => (
                      <div key={key} className="config-item">
                        <span className="config-label">{formatParamName(key)}</span>
                        <span className="config-value">{formatParamValue(value)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="apply-config-btn" onClick={handleApplyConfig}>
                    <Check size={20} />
                    اعمال این تنظیمات
                  </button>
                </div>
                
                {/* Optimization History Chart */}
                <div className="chart-card">
                  <h3 className="chart-title">
                    <TrendingUp size={20} />
                    روند بهینه‌سازی
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={historyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="trial" 
                        stroke="#6b7280"
                        label={{ value: 'شماره آزمایش', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis 
                        stroke="#6b7280"
                        label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(255, 255, 255, 0.95)', 
                          border: '2px solid #8b5cf6',
                          borderRadius: '12px',
                          padding: '12px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#8b5cf6" 
                        strokeWidth={3}
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={payload.isBest ? 8 : 4}
                              fill={payload.isBest ? '#f59e0b' : '#8b5cf6'}
                              stroke="white"
                              strokeWidth={2}
                            />
                          );
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Parameter Importance */}
                <div className="chart-card">
                  <h3 className="chart-title">
                    <Target size={20} />
                    اهمیت پارامترها
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={parameterImportance} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" />
                      <YAxis dataKey="param" type="category" stroke="#6b7280" width={120} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'rgba(255, 255, 255, 0.95)', 
                          border: '2px solid #8b5cf6',
                          borderRadius: '12px'
                        }}
                      />
                      <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
                        {parameterImportance.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`url(#gradient-${index})`}
                          />
                        ))}
                      </Bar>
                      <defs>
                        {parameterImportance.map((entry, index) => (
                          <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#a855f7" />
                          </linearGradient>
                        ))}
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {viewMode === 'details' && (
              <div className="details-view">
                <div className="trials-list">
                  {sortedTrials.map((trial, index) => (
                    <motion.div
                      key={trial.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`trial-card ${selectedTrial?.id === trial.id ? 'selected' : ''} ${index === 0 ? 'best' : ''}`}
                      onClick={() => setSelectedTrial(trial)}
                    >
                      <div className="trial-header">
                        <div className="trial-rank">
                          {index === 0 ? <Award size={20} /> : `#${index + 1}`}
                        </div>
                        <div className="trial-score">
                          <span className="score-label">Score:</span>
                          <span className="score-value">{trial.score.toFixed(4)}</span>
                        </div>
                      </div>
                      
                      <div className="trial-config">
                        {Object.entries(trial.config).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="trial-param">
                            <span className="param-name">{formatParamName(key)}</span>
                            <span className="param-value">{formatParamValue(value)}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {selectedTrial && (
                  <div className="trial-details-panel">
                    <h3>جزئیات کامل آزمایش</h3>
                    <div className="details-grid">
                      {Object.entries(selectedTrial.config).map(([key, value]) => (
                        <div key={key} className="detail-item">
                          <span className="detail-label">{formatParamName(key)}</span>
                          <span className="detail-value">{formatParamValue(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {viewMode === 'comparison' && (
              <div className="comparison-view">
                <div className="comparison-cards">
                  <div className="comparison-card best-card">
                    <div className="card-badge best">
                      <Award size={16} />
                      بهترین
                    </div>
                    <h4>Score: {bestTrial.score.toFixed(4)}</h4>
                    <div className="comparison-config">
                      {Object.entries(bestTrial.config).map(([key, value]) => (
                        <div key={key} className="comparison-param">
                          <span>{formatParamName(key)}</span>
                          <strong>{formatParamValue(value)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="comparison-card worst-card">
                    <div className="card-badge worst">
                      بدترین
                    </div>
                    <h4>Score: {worstTrial.score.toFixed(4)}</h4>
                    <div className="comparison-config">
                      {Object.entries(worstTrial.config).map(([key, value]) => (
                        <div key={key} className="comparison-param">
                          <span>{formatParamName(key)}</span>
                          <strong>{formatParamValue(value)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="improvement-stats">
                  <Zap size={32} className="text-yellow-500" />
                  <h3>بهبود {improvementPercent}%</h3>
                  <p>از بدترین به بهترین نتیجه</p>
                </div>
              </div>
            )}
          </div>
          
          <style>{`
            .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.7);
              backdrop-filter: blur(4px);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
              padding: 20px;
            }
            
            .autotuner-modal {
              background: white;
              border-radius: 24px;
              max-width: 1200px;
              width: 100%;
              max-height: 90vh;
              display: flex;
              flex-direction: column;
              box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
              border: 2px solid transparent;
              background-image: linear-gradient(white, white), 
                               linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
              background-origin: border-box;
              background-clip: padding-box, border-box;
            }
            
            .modal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 24px 32px;
              border-bottom: 2px solid #f3f4f6;
            }
            
            .header-title {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            
            .title-icon {
              width: 56px;
              height: 56px;
              background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
              border-radius: 16px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
            }
            
            .header-title h2 {
              font-size: 24px;
              font-weight: 700;
              color: #1f2937;
              margin: 0;
            }
            
            .header-subtitle {
              font-size: 14px;
              color: #6b7280;
              margin-top: 4px;
            }
            
            .close-btn {
              width: 40px;
              height: 40px;
              border-radius: 12px;
              border: 2px solid #e5e7eb;
              background: white;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #6b7280;
              transition: all 0.2s;
            }
            
            .close-btn:hover {
              border-color: #8b5cf6;
              color: #8b5cf6;
              background: #f5f3ff;
            }
            
            .view-tabs {
              display: flex;
              gap: 8px;
              padding: 16px 32px;
              border-bottom: 2px solid #f3f4f6;
              background: #fafafa;
            }
            
            .tab {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 10px 20px;
              border: 2px solid transparent;
              background: white;
              border-radius: 12px;
              cursor: pointer;
              font-weight: 600;
              color: #6b7280;
              transition: all 0.2s;
            }
            
            .tab:hover {
              border-color: #a855f7;
              color: #8b5cf6;
            }
            
            .tab.active {
              background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
              color: white;
              box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
            }
            
            .modal-content {
              flex: 1;
              overflow-y: auto;
              padding: 32px;
            }
            
            .overview-view {
              display: flex;
              flex-direction: column;
              gap: 24px;
            }
            
            .best-config-card {
              background: linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
              border: 2px solid #a855f7;
              border-radius: 20px;
              padding: 24px;
              box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
            }
            
            .card-header {
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 20px;
            }
            
            .card-header h3 {
              flex: 1;
              font-size: 20px;
              font-weight: 700;
              color: #1f2937;
              margin: 0;
            }
            
            .score-badge {
              padding: 6px 14px;
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              color: #92400e;
              border-radius: 999px;
              font-size: 13px;
              font-weight: 700;
            }
            
            .config-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 12px;
              margin-bottom: 20px;
            }
            
            .config-item {
              display: flex;
              flex-direction: column;
              gap: 4px;
              padding: 12px;
              background: white;
              border-radius: 12px;
              border: 2px solid #e5e7eb;
            }
            
            .config-label {
              font-size: 12px;
              color: #6b7280;
              font-weight: 600;
            }
            
            .config-value {
              font-size: 16px;
              color: #1f2937;
              font-weight: 700;
            }
            
            .apply-config-btn {
              width: 100%;
              padding: 14px;
              background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
              color: white;
              border: none;
              border-radius: 12px;
              font-weight: 700;
              font-size: 16px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              transition: all 0.2s;
            }
            
            .apply-config-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
            }
            
            .chart-card {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 20px;
              padding: 24px;
            }
            
            .chart-title {
              display: flex;
              align-items: center;
              gap: 10px;
              font-size: 18px;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 20px;
            }
            
            .chart-title svg {
              color: #8b5cf6;
            }
            
            .details-view {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
            }
            
            .trials-list {
              display: flex;
              flex-direction: column;
              gap: 12px;
              max-height: 600px;
              overflow-y: auto;
            }
            
            .trial-card {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 16px;
              padding: 16px;
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .trial-card:hover {
              border-color: #a855f7;
              transform: translateX(-4px);
            }
            
            .trial-card.selected {
              border-color: #8b5cf6;
              background: linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
              box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
            }
            
            .trial-card.best {
              border-color: #f59e0b;
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            }
            
            .trial-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
            }
            
            .trial-rank {
              font-weight: 700;
              color: #8b5cf6;
              display: flex;
              align-items: center;
            }
            
            .trial-score {
              display: flex;
              gap: 6px;
              align-items: center;
            }
            
            .score-label {
              font-size: 12px;
              color: #6b7280;
            }
            
            .score-value {
              font-weight: 700;
              color: #1f2937;
            }
            
            .trial-config {
              display: flex;
              flex-direction: column;
              gap: 6px;
            }
            
            .trial-param {
              display: flex;
              justify-content: space-between;
              font-size: 13px;
            }
            
            .param-name {
              color: #6b7280;
            }
            
            .param-value {
              font-weight: 600;
              color: #1f2937;
            }
            
            .trial-details-panel {
              background: white;
              border: 2px solid #e5e7eb;
              border-radius: 20px;
              padding: 24px;
              max-height: 600px;
              overflow-y: auto;
            }
            
            .trial-details-panel h3 {
              font-size: 18px;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 16px;
            }
            
            .details-grid {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            
            .detail-item {
              display: flex;
              justify-content: space-between;
              padding: 12px;
              background: #f9fafb;
              border-radius: 10px;
            }
            
            .detail-label {
              color: #6b7280;
              font-weight: 600;
            }
            
            .detail-value {
              color: #1f2937;
              font-weight: 700;
            }
            
            .comparison-view {
              display: flex;
              flex-direction: column;
              gap: 32px;
              align-items: center;
            }
            
            .comparison-cards {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
              width: 100%;
            }
            
            .comparison-card {
              border-radius: 20px;
              padding: 24px;
              position: relative;
            }
            
            .best-card {
              background: linear-gradient(135deg, #f5f3ff 0%, #fae8ff 100%);
              border: 2px solid #8b5cf6;
            }
            
            .worst-card {
              background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
              border: 2px solid #ef4444;
            }
            
            .card-badge {
              position: absolute;
              top: 16px;
              right: 16px;
              padding: 6px 12px;
              border-radius: 999px;
              font-size: 12px;
              font-weight: 700;
              display: flex;
              align-items: center;
              gap: 4px;
            }
            
            .card-badge.best {
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              color: #92400e;
            }
            
            .card-badge.worst {
              background: white;
              color: #ef4444;
            }
            
            .comparison-card h4 {
              font-size: 18px;
              font-weight: 700;
              margin-bottom: 16px;
            }
            
            .comparison-config {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
            
            .comparison-param {
              display: flex;
              justify-content: space-between;
              padding: 10px;
              background: white;
              border-radius: 8px;
            }
            
            .improvement-stats {
              text-align: center;
              padding: 32px;
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
              border-radius: 20px;
              border: 2px solid #f59e0b;
            }
            
            .improvement-stats h3 {
              font-size: 32px;
              font-weight: 900;
              color: #92400e;
              margin: 12px 0 8px 0;
            }
            
            .improvement-stats p {
              color: #78350f;
              font-weight: 600;
            }
            
            @media (max-width: 768px) {
              .autotuner-modal {
                max-width: 100%;
                border-radius: 16px;
              }
              
              .details-view,
              .comparison-cards {
                grid-template-columns: 1fr;
              }
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Helper functions
function calculateParameterImportance(trials) {
  const params = Object.keys(trials[0].config);
  const importance = {};
  
  params.forEach(param => {
    const values = trials.map(t => t.config[param]);
    const scores = trials.map(t => t.score);
    
    // Simple correlation calculation
    const correlation = Math.abs(calculateCorrelation(values, scores));
    importance[param] = correlation;
  });
  
  return Object.entries(importance)
    .map(([param, imp]) => ({
      param: formatParamName(param),
      importance: imp * 100
    }))
    .sort((a, b) => b.importance - a.importance);
}

function calculateCorrelation(x, y) {
  const n = x.length;
  const sum1 = x.reduce((a, b) => a + b);
  const sum2 = y.reduce((a, b) => a + b);
  const sum1Sq = x.reduce((a, b) => a + b * b);
  const sum2Sq = y.reduce((a, b) => a + b * b);
  const pSum = x.map((xi, i) => xi * y[i]).reduce((a, b) => a + b);
  const num = pSum - (sum1 * sum2 / n);
  const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n));
  return den === 0 ? 0 : num / den;
}

function formatParamName(key) {
  const names = {
    learningRate: 'Learning Rate',
    batchSize: 'Batch Size',
    optimizer: 'Optimizer',
    lrScheduler: 'LR Scheduler',
    warmupSteps: 'Warmup Steps',
    weightDecay: 'Weight Decay',
    gradientAccumulationSteps: 'Gradient Accumulation',
    maxGradNorm: 'Max Grad Norm'
  };
  return names[key] || key;
}

function formatParamValue(value) {
  if (typeof value === 'number') {
    return value < 0.01 ? value.toExponential(2) : value.toFixed(4);
  }
  return String(value);
}

export default AutoTuner;
