// API Client - کلاینت کامل برای ارتباط با Backend
// با WebSocket، Error Handling، و Type Safety

import {
  DashboardStats,
  SystemStatus,
  SystemMetrics,
  Activity,
  ModelInfo,
  DatasetInfo,
  TrainingJob,
  CheckpointInfo,
  ModelStatistics,
  PerformanceInsight,
  UserProfile,
  StartTrainingRequest,
  AutoTuningRequest,
  AutoTuningResult,
  ApiResponse,
  ApiError,
  NetworkError,
  ResourceHistory,
  TrainingUpdateMessage,
  WSMessage
} from './types';

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

// WebSocket Manager
class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private heartbeatInterval: number | null = null;

  connect(endpoint: string): void {
    try {
      this.ws = new WebSocket(`${WS_BASE_URL}${endpoint}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected:', endpoint);
        this.reconnectAttempts = 0;
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          this.notifyListeners(message.type, message.data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.stopHeartbeat();
        this.attemptReconnect(endpoint);
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
    }
  }

  private attemptReconnect(endpoint: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting to reconnect in ${delay}ms...`);
      setTimeout(() => this.connect(endpoint), delay);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.listeners.delete(event);
        }
      }
    };
  }

  private notifyListeners(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
  }

  send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }
}

// API Client Class
class APIClient {
  private wsManager: WebSocketManager;
  private metricsInterval: number | null = null;
  private resourceHistory: ResourceHistory[] = [];

  constructor() {
    this.wsManager = new WebSocketManager();
  }

  // Generic fetch wrapper با error handling
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        throw new ApiError(
          error.error || 'Request failed',
          response.status,
          error.code
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new NetworkError('Network request failed');
    }
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
    return this.fetch<DashboardStats>('/dashboard/stats');
  }

  async getSystemStatus(): Promise<SystemStatus> {
    return this.fetch<SystemStatus>('/system/status');
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    const metrics = await this.fetch<SystemMetrics>('/system/metrics');
    
    // Add to history
    this.resourceHistory.push({
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      cpu: metrics.cpu,
      memory: metrics.memory,
      gpu: metrics.gpu,
      timestamp: Date.now()
    });

    // Keep only last 30 points
    if (this.resourceHistory.length > 30) {
      this.resourceHistory = this.resourceHistory.slice(-30);
    }

    return metrics;
  }

  getResourceHistory(): ResourceHistory[] {
    return this.resourceHistory;
  }

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return this.fetch<Activity[]>(`/activities/recent?limit=${limit}`);
  }

  // Models APIs
  async getModels(): Promise<ModelInfo[]> {
    return this.fetch<ModelInfo[]>('/models');
  }

  async getModel(id: string): Promise<ModelInfo> {
    return this.fetch<ModelInfo>(`/models/${id}`);
  }

  // Datasets APIs
  async getDatasets(): Promise<DatasetInfo[]> {
    return this.fetch<DatasetInfo[]>('/datasets');
  }

  async getDataset(id: string): Promise<DatasetInfo> {
    return this.fetch<DatasetInfo>(`/datasets/${id}`);
  }

  async uploadDataset(file: File, metadata: any): Promise<DatasetInfo> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    return this.fetch<DatasetInfo>('/datasets/upload', {
      method: 'POST',
      body: formData,
      headers: {} // Remove Content-Type to let browser set it with boundary
    });
  }

  // Training APIs
  async getTrainingJobs(): Promise<TrainingJob[]> {
    return this.fetch<TrainingJob[]>('/training/jobs');
  }

  async getTrainingJob(id: string): Promise<TrainingJob> {
    return this.fetch<TrainingJob>(`/training/jobs/${id}`);
  }

  async startTraining(request: StartTrainingRequest): Promise<{ id: string; status: string }> {
    return this.fetch<{ id: string; status: string }>('/training/start', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  async pauseTraining(id: string): Promise<{ status: string }> {
    return this.fetch<{ status: string }>(`/training/${id}/pause`, {
      method: 'POST'
    });
  }

  async resumeTraining(id: string): Promise<{ status: string }> {
    return this.fetch<{ status: string }>(`/training/${id}/resume`, {
      method: 'POST'
    });
  }

  async stopTraining(id: string): Promise<{ status: string }> {
    return this.fetch<{ status: string }>(`/training/${id}/stop`, {
      method: 'POST'
    });
  }

  async saveModel(jobId: string, options: { name: string; format: string }): Promise<{ path: string }> {
    return this.fetch<{ path: string }>(`/training/${jobId}/save`, {
      method: 'POST',
      body: JSON.stringify(options)
    });
  }

  // Auto-tuning APIs
  async startAutoTuning(request: AutoTuningRequest): Promise<AutoTuningResult> {
    return this.fetch<AutoTuningResult>('/autotuning/start', {
      method: 'POST',
      body: JSON.stringify(request)
    });
  }

  // Checkpoint APIs
  async getCheckpoints(): Promise<CheckpointInfo[]> {
    return this.fetch<CheckpointInfo[]>('/checkpoints');
  }

  async getJobCheckpoints(jobId: string): Promise<CheckpointInfo[]> {
    return this.fetch<CheckpointInfo[]>(`/checkpoints?jobId=${jobId}`);
  }

  async getLastCheckpoint(jobId: string): Promise<CheckpointInfo | null> {
    return this.fetch<CheckpointInfo | null>(`/checkpoints/${jobId}/last`);
  }

  async deleteCheckpoint(id: string): Promise<{ status: string }> {
    return this.fetch<{ status: string }>(`/checkpoints/${id}`, {
      method: 'DELETE'
    });
  }

  async downloadCheckpoint(id: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/checkpoints/${id}/download`);
    if (!response.ok) {
      throw new ApiError('Download failed', response.status);
    }
    return response.blob();
  }

  async resumeFromCheckpoint(jobId: string, checkpointId: string): Promise<{ status: string }> {
    return this.fetch<{ status: string }>(`/training/${jobId}/resume-from`, {
      method: 'POST',
      body: JSON.stringify({ checkpointId })
    });
  }

  // Statistics APIs
  async getModelStatistics(): Promise<ModelStatistics[]> {
    return this.fetch<ModelStatistics[]>('/statistics/models');
  }

  async getPerformanceInsights(): Promise<PerformanceInsight[]> {
    return this.fetch<PerformanceInsight[]>('/insights/performance');
  }

  // User APIs
  async getUserProfile(): Promise<UserProfile> {
    return this.fetch<UserProfile>('/user/profile');
  }

  // WebSocket subscriptions
  subscribeToMetrics(callback: (metrics: SystemMetrics) => void): () => void {
    this.wsManager.connect('/system/metrics');
    return this.wsManager.subscribe('metrics', callback);
  }

  subscribeToTraining(jobId: string, callback: (update: TrainingUpdateMessage) => void): () => void {
    this.wsManager.connect(`/training/${jobId}`);
    return this.wsManager.subscribe('training_update', callback);
  }

  subscribeToActivities(callback: (activity: Activity) => void): () => void {
    this.wsManager.connect('/activities');
    return this.wsManager.subscribe('activity', callback);
  }

  // Cleanup
  disconnect(): void {
    this.wsManager.disconnect();
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.fetch<{ status: string; timestamp: string }>('/health');
  }
}

// Export singleton instance
export const apiClient = new APIClient();
export default apiClient;

// Export types for convenience
export type {
  DashboardStats,
  SystemStatus,
  SystemMetrics,
  Activity,
  ModelInfo,
  DatasetInfo,
  TrainingJob,
  CheckpointInfo,
  ModelStatistics,
  PerformanceInsight,
  UserProfile,
  ResourceHistory
};
