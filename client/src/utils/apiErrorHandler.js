// utils/apiErrorHandler.js - Comprehensive API Error Handling
import { toast } from 'react-hot-toast';

export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SERVER: 'SERVER_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR'
};

export const ErrorMessages = {
  [ErrorTypes.NETWORK]: 'خطا در اتصال به سرور. لطفاً اتصال اینترنت خود را بررسی کنید.',
  [ErrorTypes.TIMEOUT]: 'درخواست منقضی شد. لطفاً دوباره تلاش کنید.',
  [ErrorTypes.NOT_FOUND]: 'منبع درخواستی یافت نشد.',
  [ErrorTypes.UNAUTHORIZED]: 'دسترسی غیرمجاز. لطفاً وارد شوید.',
  [ErrorTypes.SERVER]: 'خطای داخلی سرور. لطفاً بعداً تلاش کنید.',
  [ErrorTypes.VALIDATION]: 'داده‌های ورودی نامعتبر است.',
  [ErrorTypes.RATE_LIMIT]: 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی صبر کنید.'
};

class APIErrorHandler {
  constructor() {
    this.errorCounts = new Map();
    this.lastErrorTime = new Map();
    this.suppressDuplicates = true;
    this.duplicateWindow = 5000; // 5 seconds
  }

  handleError(error, options = {}) {
    const {
      showToast = true,
      logError = true,
      context = '',
      fallbackMessage = 'خطای غیرمنتظره‌ای رخ داد'
    } = options;

    const normalizedError = this.normalizeError(error);

    if (logError) {
      this.logError(normalizedError, context);
    }

    if (showToast) {
      this.showErrorToast(normalizedError, context);
    }

    this.trackError(normalizedError, context);

    return normalizedError;
  }

  normalizeError(error) {
    if (error.response) {
      return {
        type: this.getErrorTypeFromStatus(error.response.status),
        message: error.response.data?.error || error.response.data?.message || error.message,
        status: error.response.status,
        code: error.code,
        details: error.response.data,
        isNetworkError: false,
        timestamp: new Date().toISOString()
      };
    }

    if (error.request || error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
      return {
        type: ErrorTypes.NETWORK,
        message: 'سرور در دسترس نیست. لطفاً اطمینان حاصل کنید که backend روی پورت 3001 اجرا می‌شود.',
        status: null,
        code: error.code,
        isNetworkError: true,
        timestamp: new Date().toISOString()
      };
    }

    if (error.code === 'ECONNABORTED' && error.message?.includes('timeout')) {
      return {
        type: ErrorTypes.TIMEOUT,
        message: ErrorMessages[ErrorTypes.TIMEOUT],
        status: null,
        code: error.code,
        isNetworkError: false,
        timestamp: new Date().toISOString()
      };
    }

    if (error.ok === false) {
      return {
        type: error.type || ErrorTypes.SERVER,
        message: error.error || error.message || 'خطای ناشناخته',
        status: error.status,
        code: error.code,
        isNetworkError: error.isNetworkError || false,
        timestamp: new Date().toISOString()
      };
    }

    return {
      type: ErrorTypes.SERVER,
      message: error.message || 'خطای ناشناخته',
      status: null,
      code: error.code,
      isNetworkError: false,
      timestamp: new Date().toISOString()
    };
  }

  getErrorTypeFromStatus(status) {
    if (status === 401) return ErrorTypes.UNAUTHORIZED;
    if (status === 404) return ErrorTypes.NOT_FOUND;
    if (status === 408) return ErrorTypes.TIMEOUT;
    if (status === 422) return ErrorTypes.VALIDATION;
    if (status === 429) return ErrorTypes.RATE_LIMIT;
    if (status >= 500) return ErrorTypes.SERVER;
    return ErrorTypes.SERVER;
  }

  logError(error, context) {
    const logData = {
      timestamp: error.timestamp,
      type: error.type,
      message: error.message,
      status: error.status,
      code: error.code,
      context: context || 'unknown',
      isNetworkError: error.isNetworkError
    };

    console.group(`🚨 API Error [${error.type}]`);
    console.error('Error Details:', logData);
    if (error.details) {
      console.error('Response Details:', error.details);
    }
    console.groupEnd();
  }

  showErrorToast(error, context) {
    if (this.suppressDuplicates && this.isDuplicateError(error)) {
      return;
    }

    const message = this.getErrorMessage(error, context);
    const toastOptions = {
      duration: this.getToastDuration(error.type),
      style: {
        direction: 'rtl',
        fontFamily: 'IRANSans, sans-serif'
      }
    };

    toast.error(message, toastOptions);
    this.markErrorShown(error);
  }

  getErrorMessage(error, context) {
    if (ErrorMessages[error.type]) {
      return ErrorMessages[error.type];
    }

    if (error.message && !error.message.includes('fetch') && !error.message.includes('XMLHttpRequest')) {
      return error.message;
    }

    if (context) {
      switch (context) {
        case 'training':
          return 'خطا در شروع آموزش. لطفاً تنظیمات را بررسی کنید.';
        case 'download':
          return 'خطا در دانلود. لطفاً اتصال اینترنت را بررسی کنید.';
        case 'upload':
          return 'خطا در آپلود فایل. لطفاً اندازه و فرمت فایل را بررسی کنید.';
        default:
          return `خطا در ${context}. لطفاً دوباره تلاش کنید.`;
      }
    }

    return 'خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.';
  }

  isDuplicateError(error) {
    const errorKey = `${error.type}-${error.message}`;
    const now = Date.now();
    const lastTime = this.lastErrorTime.get(errorKey);

    if (lastTime && (now - lastTime) < this.duplicateWindow) {
      return true;
    }

    return false;
  }

  markErrorShown(error) {
    const errorKey = `${error.type}-${error.message}`;
    this.lastErrorTime.set(errorKey, Date.now());
    
    const count = this.errorCounts.get(errorKey) || 0;
    this.errorCounts.set(errorKey, count + 1);
  }

  getToastDuration(errorType) {
    switch (errorType) {
      case ErrorTypes.NETWORK:
        return 6000;
      case ErrorTypes.UNAUTHORIZED:
        return 8000;
      case ErrorTypes.VALIDATION:
        return 4000;
      default:
        return 5000;
    }
  }

  trackError(error, context) {
    try {
      const errorLog = JSON.parse(localStorage.getItem('api_errors') || '[]');
      errorLog.push({
        ...error,
        context,
        timestamp: new Date().toISOString()
      });

      if (errorLog.length > 50) {
        errorLog.splice(0, errorLog.length - 50);
      }

      localStorage.setItem('api_errors', JSON.stringify(errorLog));
    } catch (e) {
      console.warn('Failed to store error log:', e);
    }
  }

  getErrorStats() {
    const errors = JSON.parse(localStorage.getItem('api_errors') || '[]');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    const recentErrors = errors.filter(e => 
      (now - new Date(e.timestamp).getTime()) < oneHour
    );

    const errorsByType = errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {});

    return {
      total: errors.length,
      lastHour: recentErrors.length,
      byType: errorsByType,
      mostRecent: errors[errors.length - 1] || null
    };
  }

  clearErrorLogs() {
    localStorage.removeItem('api_errors');
    this.errorCounts.clear();
    this.lastErrorTime.clear();
  }
}

const apiErrorHandler = new APIErrorHandler();

export default apiErrorHandler;
export const handleApiError = (error, options) => apiErrorHandler.handleError(error, options);
export const getErrorStats = () => apiErrorHandler.getErrorStats();
export const clearErrorLogs = () => apiErrorHandler.clearErrorLogs();