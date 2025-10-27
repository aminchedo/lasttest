// ErrorBoundary.tsx - Enhanced Error Boundary Component with TypeScript
import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo | null, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error tracking service if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }

  handleRetry = (): void => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }));
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = '/';
  };

  render(): ReactNode {
    const { hasError, error, errorInfo, retryCount } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo, this.handleRetry);
      }

      // Default fallback UI
      const isNetworkError =
        error?.message?.includes('network') ||
        error?.message?.includes('fetch') ||
        error?.message?.includes('connection');

      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100/50 p-5 font-vazir" dir="rtl">
          <div className="bg-white rounded-3xl p-10 shadow-2xl text-center max-w-2xl w-full border-2 border-red-200">
            {/* Error Icon */}
            <div className="text-red-500 mb-6 animate-pulse">
              <AlertTriangle size={64} className="mx-auto" />
            </div>

            {/* Error Content */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {isNetworkError ? 'مشکل اتصال' : 'خطای غیرمنتظره'}
              </h1>

              <p className="text-base text-gray-600 leading-relaxed mb-8">
                {isNetworkError
                  ? 'نمی‌توانیم به سرور متصل شویم. لطفاً اتصال اینترنت خود را بررسی کنید.'
                  : 'متأسفانه خطایی رخ داده است. لطفاً صفحه را دوباره بارگذاری کنید.'}
              </p>

              {/* Error Details (Development Only) */}
              {import.meta.env.DEV && error && (
                <details className="mb-6 text-right border border-gray-200 rounded-xl overflow-hidden">
                  <summary className="flex items-center gap-2 p-3 bg-gray-50 cursor-pointer text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                    <Bug size={16} />
                    جزئیات خطا (فقط در حالت توسعه)
                  </summary>
                  <div className="p-4 bg-white">
                    <pre className="text-xs text-gray-700 bg-gray-100 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap text-left" dir="ltr">
                      {error.toString()}
                      {errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={this.handleRetry}
                  disabled={retryCount >= 3}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  <RefreshCw size={18} />
                  تلاش مجدد
                  {retryCount > 0 && ` (${retryCount}/3)`}
                </button>

                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <RefreshCw size={18} />
                  بارگذاری مجدد صفحه
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <Home size={18} />
                  بازگشت به صفحه اصلی
                </button>
              </div>

              {/* Retry Limit Warning */}
              {retryCount >= 3 && (
                <div className="mt-6 p-4 bg-amber-100 border border-amber-400 rounded-xl text-amber-900">
                  <p className="mb-2 text-sm font-medium">
                    تعداد تلاش‌های مجدد به حد مجاز رسیده است.
                  </p>
                  <p className="text-sm">
                    لطفاً صفحه را دوباره بارگذاری کنید یا با پشتیبانی تماس بگیرید.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
