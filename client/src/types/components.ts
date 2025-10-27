// types/components.ts - Component Props Type Definitions

import { ReactNode } from 'react';
import type { Model, Dataset, TrainingJob, TrainingConfig } from './models';
import type { ApiResponse } from './api';

/**
 * Common component props
 */
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
}

/**
 * Page props with navigation
 */
export interface PageProps extends BaseComponentProps {
  onNavigate?: (page: string) => void;
}

/**
 * Training page props
 */
export interface TrainingProps {
  models: Model[];
  datasets: Dataset[];
  teachers?: Model[];
  mode?: 'real' | 'simulated';
  onStartTraining?: (config: TrainingConfig) => Promise<{ jobId: string } | null>;
  onPollStatus?: (jobId: string) => Promise<any>;
  onRefreshData?: () => void;
}

/**
 * Model card props
 */
export interface ModelCardProps {
  model: Model;
  isSelected?: boolean;
  onSelect?: (model: Model) => void;
  onDownload?: (modelId: string) => void;
  isDownloading?: boolean;
  downloadProgress?: number;
}

/**
 * Dataset card props
 */
export interface DatasetCardProps {
  dataset: Dataset;
  isSelected?: boolean;
  onSelect?: (dataset: Dataset) => void;
  onDownload?: (datasetId: string) => void;
  isDownloading?: boolean;
  downloadProgress?: number;
}

/**
 * Training status card props
 */
export interface TrainingStatusProps {
  job: TrainingJob;
  onPause?: (jobId: string) => void;
  onResume?: (jobId: string) => void;
  onStop?: (jobId: string) => void;
  onSave?: (jobId: string, modelName: string) => void;
}

/**
 * Progress bar props
 */
export interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  label?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

/**
 * Toast notification props
 */
export interface ToastProps {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: (id: string) => void;
}

/**
 * Modal props
 */
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

/**
 * Table column definition
 */
export interface TableColumn<T = any> {
  key: string;
  header: string;
  accessor?: (row: T) => any;
  render?: (value: any, row: T) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

/**
 * Table props
 */
export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRows?: Set<string>;
  onSelectionChange?: (selected: Set<string>) => void;
}

/**
 * Chart props
 */
export interface ChartProps {
  data: any[];
  width?: number | string;
  height?: number | string;
  title?: string;
  loading?: boolean;
}

/**
 * Form field props
 */
export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  options?: Array<{ value: string | number; label: string }>;
  value?: any;
  onChange?: (value: any) => void;
  onBlur?: () => void;
}

/**
 * Settings section props
 */
export interface SettingsSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/**
 * Navigation item
 */
export interface NavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  badge?: number;
  active?: boolean;
  children?: NavigationItem[];
}

/**
 * Navigation props
 */
export interface NavigationProps {
  items: NavigationItem[];
  currentPage: string;
  onPageChange: (pageId: string) => void;
}

/**
 * Loading state props
 */
export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  overlay?: boolean;
}

/**
 * Empty state props
 */
export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Status badge props
 */
export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

/**
 * File upload props
 */
export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  onUpload: (files: File[]) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

/**
 * Pagination props
 */
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

/**
 * Search bar props
 */
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
  debounceMs?: number;
}

/**
 * Filter props
 */
export interface FilterOption {
  id: string;
  label: string;
  value: any;
}

export interface FilterProps {
  label: string;
  options: FilterOption[];
  selected: any[];
  onChange: (selected: any[]) => void;
  multiple?: boolean;
}

/**
 * Download progress props
 */
export interface DownloadProgressProps {
  itemId: string;
  itemName: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
  onCancel?: (itemId: string) => void;
  onRetry?: (itemId: string) => void;
}

export default BaseComponentProps;
