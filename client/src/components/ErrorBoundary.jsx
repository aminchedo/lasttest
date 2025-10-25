// ErrorBoundary.jsx - Enhanced Error Boundary Component
import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: 0
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.error('Error caught by boundary:', error, errorInfo);

        this.setState({
            error,
            errorInfo
        });

        // Report to error tracking service if available
        if (window.gtag) {
            window.gtag('event', 'exception', {
                description: error.toString(),
                fatal: false
            });
        }
    }

    handleRetry = () => {
        this.setState(prevState => ({
            hasError: false,
            error: null,
            errorInfo: null,
            retryCount: prevState.retryCount + 1
        }));
    };

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            const { error, retryCount } = this.state;
            const isNetworkError = error?.message?.includes('network') ||
                error?.message?.includes('fetch') ||
                error?.message?.includes('connection');

            return (
                <div className="error-boundary-container">
                    <div className="error-boundary-content">
                        <div className="error-icon">
                            <AlertTriangle size={64} />
                        </div>

                        <div className="error-content">
                            <h1 className="error-title">
                                {isNetworkError ? 'مشکل اتصال' : 'خطای غیرمنتظره'}
                            </h1>

                            <p className="error-description">
                                {isNetworkError
                                    ? 'نمی‌توانیم به سرور متصل شویم. لطفاً اتصال اینترنت خود را بررسی کنید.'
                                    : 'متأسفانه خطایی رخ داده است. لطفاً صفحه را دوباره بارگذاری کنید.'
                                }
                            </p>

                            {process.env.NODE_ENV === 'development' && error && (
                                <details className="error-details">
                                    <summary className="error-details-summary">
                                        <Bug size={16} />
                                        جزئیات خطا (فقط در حالت توسعه)
                                    </summary>
                                    <div className="error-details-content">
                                        <pre className="error-stack">
                                            {error.toString()}
                                            {this.state.errorInfo?.componentStack}
                                        </pre>
                                    </div>
                                </details>
                            )}

                            <div className="error-actions">
                                <button
                                    onClick={this.handleRetry}
                                    className="error-btn error-btn-primary"
                                    disabled={retryCount >= 3}
                                >
                                    <RefreshCw size={18} />
                                    تلاش مجدد
                                    {retryCount > 0 && ` (${retryCount}/3)`}
                                </button>

                                <button
                                    onClick={this.handleReload}
                                    className="error-btn error-btn-secondary"
                                >
                                    <RefreshCw size={18} />
                                    بارگذاری مجدد صفحه
                                </button>

                                <button
                                    onClick={this.handleGoHome}
                                    className="error-btn error-btn-outline"
                                >
                                    <Home size={18} />
                                    بازگشت به صفحه اصلی
                                </button>
                            </div>

                            {retryCount >= 3 && (
                                <div className="error-limit-reached">
                                    <p>تعداد تلاش‌های مجدد به حد مجاز رسیده است.</p>
                                    <p>لطفاً صفحه را دوباره بارگذاری کنید یا با پشتیبانی تماس بگیرید.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <style>{`
            .error-boundary-container {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%);
              padding: 20px;
              font-family: 'Vazirmatn', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              direction: rtl;
            }

            .error-boundary-content {
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
              text-align: center;
              max-width: 600px;
              width: 100%;
              border: 2px solid #fecaca;
            }

            .error-icon {
              color: #ef4444;
              margin-bottom: 24px;
              animation: pulse 2s infinite;
            }

            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }

            .error-title {
              font-size: 28px;
              font-weight: 700;
              color: #1f2937;
              margin: 0 0 16px 0;
            }

            .error-description {
              font-size: 16px;
              color: #6b7280;
              line-height: 1.6;
              margin: 0 0 32px 0;
            }

            .error-details {
              margin: 24px 0;
              text-align: right;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              overflow: hidden;
            }

            .error-details-summary {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 12px 16px;
              background: #f9fafb;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              color: #374151;
              border-bottom: 1px solid #e5e7eb;
            }

            .error-details-content {
              padding: 16px;
              background: #fefefe;
            }

            .error-stack {
              font-size: 12px;
              color: #374151;
              background: #f3f4f6;
              padding: 12px;
              border-radius: 8px;
              overflow-x: auto;
              white-space: pre-wrap;
              text-align: left;
              direction: ltr;
            }

            .error-actions {
              display: flex;
              flex-direction: column;
              gap: 12px;
              margin-top: 32px;
            }

            .error-btn {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px 24px;
              border-radius: 12px;
              font-weight: 600;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.2s;
              border: none;
            }

            .error-btn:disabled {
              opacity: 0.5;
              cursor: not-allowed;
            }

            .error-btn-primary {
              background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
              color: white;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .error-btn-primary:hover:not(:disabled) {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
            }

            .error-btn-secondary {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }

            .error-btn-secondary:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
            }

            .error-btn-outline {
              background: white;
              color: #374151;
              border: 2px solid #e5e7eb;
            }

            .error-btn-outline:hover {
              background: #f9fafb;
              border-color: #d1d5db;
            }

            .error-limit-reached {
              margin-top: 24px;
              padding: 16px;
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 12px;
              color: #92400e;
            }

            .error-limit-reached p {
              margin: 0 0 8px 0;
              font-size: 14px;
            }

            .error-limit-reached p:last-child {
              margin-bottom: 0;
            }

            @media (max-width: 768px) {
              .error-boundary-content {
                padding: 24px;
                margin: 16px;
              }

              .error-title {
                font-size: 24px;
              }

              .error-actions {
                gap: 10px;
              }

              .error-btn {
                padding: 10px 20px;
                font-size: 13px;
              }
            }
          `}</style>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;