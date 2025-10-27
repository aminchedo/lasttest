// types/models.ts - Data Model Type Definitions

/**
 * Training job status
 */
export type TrainingStatus =
  | 'idle'
  | 'initializing'
  | 'training'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * Training job data model
 */
export interface TrainingJob {
  id: string;
  name?: string;
  baseModel: string;
  datasets: string[];
  teacherModel?: string | null;
  status: TrainingStatus;
  progress: number;
  
  // Metrics
  epoch?: number;
  step?: number;
  totalSteps?: number;
  trainLoss?: number;
  valLoss?: number;
  bestValLoss?: number;
  learningRate?: number;
  throughput?: number;
  gradientNorm?: number;
  
  // Timing
  startedAt?: string;
  completedAt?: string;
  timeElapsed?: number;
  timeRemaining?: number;
  
  // Configuration
  config?: TrainingConfig;
  
  // Messages
  message?: string;
  error?: string;
}

/**
 * Training configuration
 */
export interface TrainingConfig {
  // Basic
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer: 'adam' | 'adamw' | 'sgd' | 'rmsprop' | 'lamb';
  
  // Advanced
  lrScheduler?: 'constant' | 'linear' | 'cosine' | 'exponential' | 'step' | 'polynomial';
  warmupSteps?: number;
  warmupRatio?: number;
  weightDecay?: number;
  gradientAccumulationSteps?: number;
  maxGradNorm?: number;
  
  // Features
  mixedPrecision?: boolean;
  saveCheckpointEvery?: number;
  keepTopCheckpoints?: number;
  
  // Early Stopping
  enableEarlyStopping?: boolean;
  earlyStoppingPatience?: number;
  earlyStoppingThreshold?: number;
  
  // Knowledge Distillation
  enableDistillation?: boolean;
  distillationAlpha?: number;
  distillationTemperature?: number;
  
  // Validation
  validationSplit?: number;
  evaluateEvery?: number;
}

/**
 * Model data structure
 */
export interface Model {
  id: string;
  name: string;
  nameFA?: string;
  description?: string;
  descriptionFA?: string;
  
  // Metadata
  type?: string;
  role?: 'base' | 'teacher';
  category?: string;
  size?: string;
  sizeBytes?: number;
  
  // Status
  status: 'ready' | 'downloading' | 'training' | 'error';
  downloaded?: boolean;
  localPath?: string;
  
  // HuggingFace
  isHuggingFace?: boolean;
  huggingFaceId?: string;
  
  // Stats
  downloads?: number;
  accuracy?: number;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  
  // Author
  author?: string;
}

/**
 * Dataset data structure
 */
export interface Dataset {
  id: string;
  name: string;
  nameFA?: string;
  description?: string;
  descriptionFA?: string;
  
  // Metadata
  type?: string;
  format?: 'json' | 'csv' | 'txt' | 'jsonl' | 'parquet';
  size?: string;
  sizeBytes?: number;
  
  // Content
  samples?: number;
  features?: string[];
  languages?: string[];
  
  // Status
  status?: 'ready' | 'downloading' | 'processing' | 'error';
  downloaded?: boolean;
  localPath?: string;
  path?: string;
  
  // URLs
  downloadUrl?: string;
  viewUrl?: string;
  alternativeUrl?: string;
  
  // Instructions
  instructions?: string;
  details?: Record<string, unknown>;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User profile
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  avatar?: string;
  joinedAt?: string;
  lastLogin?: string;
}

/**
 * System status
 */
export interface SystemStatus {
  status: 'active' | 'maintenance' | 'error';
  version: string;
  uptime: string;
  memoryUsage: string;
  cpuUsage: string;
  gpuUsage?: string;
  diskUsage?: string;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalModels: number;
  activeDownloads: number;
  activeTraining: number;
  completedTraining: number;
  storageUsed: string;
  availableStorage: string;
  systemStatus: 'active' | 'warning' | 'error';
}

/**
 * Activity log entry
 */
export interface Activity {
  id: string;
  type: 'training' | 'download' | 'model' | 'dataset' | 'system';
  action: string;
  description: string;
  descriptionFA?: string;
  userId?: string;
  userName?: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  metadata?: Record<string, unknown>;
}

/**
 * Download job
 */
export interface DownloadJob {
  id: string;
  jobId: string;
  type: 'model' | 'dataset';
  itemId: string;
  itemName: string;
  
  // Progress
  status: 'pending' | 'downloading' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  currentFile?: string;
  downloadedFiles?: number;
  totalFiles?: number;
  
  // Metadata
  downloadUrl?: string;
  targetDir?: string;
  sizeBytes?: number;
  downloadedBytes?: number;
  
  // Timing
  startedAt?: string;
  completedAt?: string;
  eta?: string;
  
  // Files
  files?: Record<string, { progress: number }>;
  
  // Messages
  message?: string;
  error?: string;
}

/**
 * Metrics for charts
 */
export interface MetricsData {
  step: number;
  epoch?: number;
  trainLoss?: number;
  valLoss?: number;
  learningRate?: number;
  throughput?: number;
  gradientNorm?: number;
  timestamp?: string;
}

export default Model;
