// components/ActiveJobs.jsx - Active Training Jobs Component
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, Square, Clock, CheckCircle, XCircle,
  AlertCircle, Activity, TrendingUp, Zap, Brain
} from 'lucide-react';
import apiClient from '../api/endpoints';

const ActiveJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sseConnections, setSseConnections] = useState(new Map());

  useEffect(() => {
    loadActiveJobs();
    return () => {
      // Cleanup SSE connections
      sseConnections.forEach(eventSource => {
        eventSource.close();
      });
    };
  }, []);

  const loadActiveJobs = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/lifecycle/jobs?status=running');
      
      if (response?.ok && response.data) {
        const activeJobs = response.data.jobs || [];
        setJobs(Array.isArray(activeJobs) ? activeJobs : []);
        
        // Setup SSE for each active job
        activeJobs.forEach(job => {
          if (job?.id && !sseConnections.has(job.id)) {
            setupSSEForJob(job.id);
          }
        });
      } else {
        console.warn('Failed to load active jobs:', response?.error || 'Unknown error');
        setJobs([]);
      }
    } catch (error) {
      console.error('Error loading active jobs:', error);
      setJobs([]);
      // Don't show error toast for connection issues, just log them
    } finally {
      setLoading(false);
    }
  };

  const setupSSEForJob = (jobId) => {
    if (!jobId) return;
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:30011';
      const eventSource = new EventSource(`${API_BASE_URL}/api/lifecycle/jobs/${jobId}/stream`);
      
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data?.type === 'job:updated' && data.data) {
            setJobs(prevJobs => 
              Array.isArray(prevJobs) ? prevJobs.map(job => 
                job?.id === jobId ? { ...job, ...data.data } : job
              ) : []
            );
          }
        } catch (error) {
          console.error('Error parsing SSE data for job', jobId, error);
        }
      };

      eventSource.onerror = (error) => {
        console.warn('SSE connection lost for job', jobId);
        eventSource.close();
        setSseConnections(prev => {
          const newMap = new Map(prev);
          newMap.delete(jobId);
          return newMap;
        });
      };

      setSseConnections(prev => new Map(prev).set(jobId, eventSource));
    } catch (error) {
      console.error('Error setting up SSE for job', jobId, error);
    }
  };

  const controlJob = async (jobId, action) => {
    if (!jobId || !action) return;
    
    try {
      const response = await apiClient.post(`/lifecycle/jobs/${jobId}/control`, {
        action
      });
      
      if (response?.ok) {
        // Job will be updated via SSE
        console.log(`Job ${jobId} ${action} successful`);
      } else {
        console.warn(`Failed to ${action} job ${jobId}:`, response?.error);
      }
    } catch (error) {
      console.error(`Error ${action} job ${jobId}:`, error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'stopped':
        return <Square className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'stopped':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatDuration = (startTime) => {
    if (!startTime) return 'نامشخص';
    
    const start = new Date(startTime);
    const now = new Date();
    const diff = now - start;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}س ${minutes % 60}د`;
    }
    return `${minutes}د`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">کارهای فعال</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">کارهای فعال</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {jobs.length}
          </span>
        </div>
        <button
          onClick={loadActiveJobs}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Activity className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 text-gray-500"
            >
              <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>هیچ کار فعالی در حال اجرا نیست</p>
            </motion.div>
          ) : (
            jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {job.config?.modelType || 'مدل نامشخص'}
                      </h4>
                      <p className="text-sm text-gray-500">
                        مرحله: {job.stage || 'نامشخص'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                {job.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>پیشرفت</span>
                      <span>{job.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-600 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${job.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* Metrics */}
                {job.metrics && Object.keys(job.metrics).length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    {job.metrics.epoch && (
                      <div>
                        <span className="text-gray-500">Epoch:</span>
                        <span className="font-medium mr-1">{job.metrics.epoch}</span>
                      </div>
                    )}
                    {job.metrics.loss && (
                      <div>
                        <span className="text-gray-500">Loss:</span>
                        <span className="font-medium mr-1">{job.metrics.loss}</span>
                      </div>
                    )}
                    {job.metrics.accuracy && (
                      <div>
                        <span className="text-gray-500">Accuracy:</span>
                        <span className="font-medium mr-1">{job.metrics.accuracy}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Controls and Info */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {formatDuration(job.startTime)}
                    </span>
                    {job.artifacts && job.artifacts.length > 0 && (
                      <span className="text-gray-500">
                        <Zap className="w-4 h-4 inline mr-1" />
                        {job.artifacts.length} artifact
                      </span>
                    )}
                  </div>

                  {job.status === 'running' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => controlJob(job.id, 'pause')}
                        className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                        title="توقف موقت"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => controlJob(job.id, 'stop')}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="توقف کامل"
                      >
                        <Square className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {job.status === 'paused' && (
                    <button
                      onClick={() => controlJob(job.id, 'resume')}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="ادامه"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ActiveJobs;