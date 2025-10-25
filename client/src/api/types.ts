// API Types and Interfaces
// تعریف تمام type‌های مورد نیاز پروژه

export interface DashboardStats {
  runs: {
    active: number;
    total: number;
    completed: number;
    failed: number;
  };
  assets: {
    ready: number;
    total: number;
    datasets: number;
    models: number;
  };
  todayTrainings: number;
  todayCompletions: number;
  totalUsers: number;
  activeUsers: number;
}

export interface SystemStatus {
  status: 'online' | 'offline' | 'maintenance';
  latency: number;
  uptime: number;
  version: string;
  lastUpdate: string;
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  gpu: number;
  disk: number;
  network: {
    upload: number;
    download: number;
  };
  timestamp: string;
}

export interface Activity {
  id: string;
  type: 'training' | 'download' | 'complete' | 'error' | 'upload' | 'delete';
  message: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  type: 'text-generation' | 'classification' | 'qa' | 'translation';
  size: string;
  parameters: number;
  downloads: number;
  lastUsed?: string;
}

export interface DatasetInfo {
  id: string;
  name: string;
  description?: string;
  size: number;
  type: 'text' | 'image' | 'audio' | 'video';
  rows?: number;
  uploadedAt: string;
  status: 'ready' | 'processing' | 'error';
}

export interface TrainingJob {
  id: string;
  name: string;
  modelId: string;
  datasetIds: string[];
  status: 'pending' | 'initializing' | 'training' | 'paused' | 'completed' | 'failed';
  progress: number;
  currentEpoch: number;
  totalEpochs: number;
  metrics: {
    trainLoss: number;
    valLoss: number;
    trainAccuracy?: number;
    valAccuracy?: number;
    learningRate: number;
    throughput?: number;
    gradientNorm?: number;
  };
  startTime: string;
  endTime?: string;
  elapsed: string;
  estimatedTimeRemaining?: string;
  config: TrainingConfig;
  checkpoints: string[];
}

export interface TrainingConfig {
  baseModel?: string;
  checkpointPath?: string;
  datasets: string[];
  modelName: string;
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer: 'adam' | 'adamw' | 'sgd' | 'rmsprop';
  lrScheduler: 'constant' | 'linear' | 'cosine' | 'cosine_with_restarts';
  warmupSteps?: number;
  weightDecay?: number;
  gradientAccumulationSteps?: number;
  maxGradNorm?: number;
  mixedPrecision?: boolean;
  enableAutoRecovery?: boolean;
  saveCheckpointEvery?: number;
  evaluateEvery?: number;
}

export interface CheckpointInfo {
  id: string;
  name: string;
  path: string;
  jobId: string;
  createdAt: string;
  size: number;
  metrics: {
    epoch: number;
    step: number;
    trainLoss: number;
    valLoss: number;
    valAccuracy?: number;
  };
  isBest: boolean;
}

export interface ModelStatistics {
  name: string;
  usage: number;
  trainings: number;
  avgAccuracy: number;
  color: string;
}

export interface ResourceHistory {
  time: string;
  cpu: number;
  memory: number;
  gpu: number;
  timestamp: number;
}

export interface PerformanceInsight {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description: string;
  value?: string;
  change?: number;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
  createdAt: string;
  lastLogin: string;
  statistics: {
    totalTrainings: number;
    totalModels: number;
    totalDatasets: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
}

// WebSocket Message Types
export interface WSMessage {
  type: 'metrics' | 'training_update' | 'activity' | 'system_alert';
  data: any;
  timestamp: string;
}

export interface TrainingUpdateMessage {
  jobId: string;
  status: TrainingJob['status'];
  progress: number;
  metrics: TrainingJob['metrics'];
  currentEpoch: number;
  message?: string;
}

// Request Types
export interface StartTrainingRequest {
  baseModel?: string;
  checkpointPath?: string;
  datasets: string[];
  modelName: string;
  config: Partial<TrainingConfig>;
}

export interface AutoTuningRequest {
  baseModel: string;
  datasets: string[];
  budget: number;
  metric: 'val_loss' | 'val_accuracy' | 'train_loss';
  searchSpace: {
    learningRate?: [number, number];
    batchSize?: number[];
    optimizer?: string[];
    warmupSteps?: [number, number];
  };
}

export interface AutoTuningResult {
  trials: Array<{
    id: number;
    config: Record<string, any>;
    score: number;
  }>;
  bestConfig: Record<string, any>;
  bestScore: number;
  searchSpace: Record<string, any>;
}

// Filter and Sort Types
export interface FilterOptions {
  status?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

// Error Types
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
