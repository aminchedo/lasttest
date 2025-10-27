// utils/errorHandler.ts - Centralized Error Handling
import toast from 'react-hot-toast';
import type { ApiError, ErrorInfo, HttpStatus } from '../types/api';

/**
 * Persian error messages for common HTTP status codes
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: 'درخواست نامعتبر است. لطفاً اطلاعات ورودی را بررسی کنید.',
  401: 'لطفاً وارد حساب کاربری خود شوید.',
  403: 'شما مجوز دسترسی به این بخش را ندارید.',
  404: 'منبع مورد نظر یافت نشد.',
  409: 'این عملیات با داده‌های موجود تداخل دارد.',
  500: 'خطای سرور رخ داده است. لطفاً بعداً تلاش کنید.',
  503: 'سرویس در حال حاضر در دسترس نیست. لطفاً بعداً تلاش کنید.',
};

/**
 * Network error messages
 */
const NETWORK_ERROR_MESSAGE = 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.';
const TIMEOUT_ERROR_MESSAGE = 'زمان اتصال به سرور تمام شد. لطفاً دوباره تلاش کنید.';
const DEFAULT_ERROR_MESSAGE = 'خطای غیرمنتظره رخ داده است. لطفاً دوباره تلاش کنید.';

/**
 * Extract error message from various error formats
 */
export function extractErrorMessage(error: any): string {
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle API error responses
  if (error?.response) {
    const response = error.response;
    
    // Try different message fields
    if (response.data?.error) {
      return response.data.error;
    }
    if (response.data?.message) {
      return response.data.message;
    }
    
    // Use status-based message
    const status = response.status;
    if (ERROR_MESSAGES[status]) {
      return ERROR_MESSAGES[status];
    }
  }

  // Handle network errors
  if (error?.message) {
    if (error.message.includes('Network Error') || error.message.includes('network')) {
      return NETWORK_ERROR_MESSAGE;
    }
    if (error.message.includes('timeout')) {
      return TIMEOUT_ERROR_MESSAGE;
    }
    return error.message;
  }

  // Handle custom error objects
  if (error?.error) {
    return error.error;
  }

  return DEFAULT_ERROR_MESSAGE;
}

/**
 * Get error severity based on status code
 */
export function getErrorSeverity(status?: number): ErrorInfo['severity'] {
  if (!status) return 'error';
  
  if (status >= 500) return 'critical';
  if (status === 401 || status === 403) return 'warning';
  if (status >= 400 && status < 500) return 'error';
  
  return 'info';
}

/**
 * Get actionable suggestion based on error type
 */
export function getErrorSuggestion(status?: number, message?: string): string | undefined {
  if (status === 401) {
    return 'لطفاً دوباره وارد شوید.';
  }
  if (status === 403) {
    return 'در صورت نیاز به دسترسی، با مدیر سیستم تماس بگیرید.';
  }
  if (status === 404) {
    return 'ممکن است این منبع حذف شده یا منتقل شده باشد.';
  }
  if (status === 500 || status === 503) {
    return 'لطفاً چند دقیقه دیگر دوباره تلاش کنید.';
  }
  if (message?.includes('network') || message?.includes('اتصال')) {
    return 'اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.';
  }
  
  return undefined;
}

/**
 * Centralized error handler for API calls
 */
export function handleApiError(error: any, showToast = true): ErrorInfo {
  const message = extractErrorMessage(error);
  const status = error?.response?.status || error?.status;
  const severity = getErrorSeverity(status);
  const suggestion = getErrorSuggestion(status, message);

  const errorInfo: ErrorInfo = {
    message,
    severity,
    status,
    suggestion,
  };

  // Show toast notification if enabled
  if (showToast) {
    const toastMessage = suggestion ? `${message}\n${suggestion}` : message;
    
    switch (severity) {
      case 'critical':
      case 'error':
        toast.error(toastMessage, { duration: 5000 });
        break;
      case 'warning':
        toast.error(toastMessage, { duration: 4000, icon: '⚠️' });
        break;
      case 'info':
        toast(toastMessage, { duration: 3000 });
        break;
    }
  }

  // In development, log to console for debugging
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error('[API Error]', {
      message,
      status,
      severity,
      error,
    });
  }

  return errorInfo;
}

/**
 * Create standardized API error object
 */
export function createApiError(
  message: string,
  status?: number,
  code?: string
): ApiError {
  return {
    ok: false,
    error: message,
    status,
    code,
  };
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    !error?.response &&
    (error?.message?.includes('Network Error') ||
      error?.message?.includes('network') ||
      error?.code === 'ECONNABORTED' ||
      error?.code === 'ERR_NETWORK')
  );
}

/**
 * Check if error is an auth error (401/403)
 */
export function isAuthError(error: any): boolean {
  const status = error?.response?.status || error?.status;
  return status === 401 || status === 403;
}

/**
 * Check if error is retryable (5xx or network errors)
 */
export function isRetryableError(error: any): boolean {
  const status = error?.response?.status || error?.status;
  return (
    (status && status >= 500 && status < 600) ||
    isNetworkError(error) ||
    error?.code === 'ETIMEDOUT'
  );
}

export default handleApiError;
