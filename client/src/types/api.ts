// types/api.ts - API Type Definitions

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

/**
 * API Error structure
 */
export interface ApiError {
  ok: false;
  error: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  ok: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * HTTP Status Codes
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

/**
 * Error severity levels
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Structured error information
 */
export interface ErrorInfo {
  message: string;
  severity: ErrorSeverity;
  code?: string;
  status?: number;
  suggestion?: string;
}

export default ApiResponse;
