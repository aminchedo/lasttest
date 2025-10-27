// ErrorFallback.tsx - Reusable Error Fallback Components
import React from 'react';
import { AlertTriangle, AlertCircle, Info, XCircle } from 'lucide-react';

export type ErrorSeverity = 'critical' | 'warning' | 'info' | 'error';

interface ErrorFallbackProps {
  title: string;
  message: string;
  severity?: ErrorSeverity;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  showDetails?: boolean;
  details?: string;
}

/**
 * Reusable error fallback component with different severity levels
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title,
  message,
  severity = 'error',
  action,
  secondaryAction,
  showDetails = false,
  details,
}) => {
  const severityConfig = {
    critical: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-900',
      buttonColor: 'bg-red-600 hover:bg-red-700',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      textColor: 'text-red-800',
      buttonColor: 'bg-red-500 hover:bg-red-600',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-900',
      buttonColor: 'bg-amber-600 hover:bg-amber-700',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
    },
  };

  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <div className={`p-6 ${config.bgColor} border-2 ${config.borderColor} rounded-xl`} dir="rtl">
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 ${config.iconColor}`}>
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${config.textColor} mb-2`}>{title}</h3>
          <p className={`text-sm ${config.textColor} opacity-90 leading-relaxed`}>{message}</p>

          {showDetails && details && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold opacity-75 hover:opacity-100">
                جزئیات بیشتر
              </summary>
              <pre className="mt-2 text-xs bg-white/50 p-3 rounded-lg overflow-x-auto" dir="ltr">
                {details}
              </pre>
            </details>
          )}

          {(action || secondaryAction) && (
            <div className="flex gap-3 mt-4">
              {action && (
                <button
                  onClick={action.onClick}
                  className={`px-4 py-2 ${config.buttonColor} text-white rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg`}
                >
                  {action.label}
                </button>
              )}
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className="px-4 py-2 bg-white text-gray-700 border-2 border-gray-200 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-all"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Critical error fallback - for production-blocking errors
 */
export const CriticalErrorFallback: React.FC<{
  message: string;
  onRetry?: () => void;
  details?: string;
}> = ({ message, onRetry, details }) => (
  <ErrorFallback
    title="خطای بحرانی"
    message={message}
    severity="critical"
    action={onRetry ? { label: 'تلاش مجدد', onClick: onRetry } : undefined}
    secondaryAction={{
      label: 'بارگذاری مجدد',
      onClick: () => window.location.reload(),
    }}
    showDetails={import.meta.env.DEV}
    details={details}
  />
);

/**
 * Warning fallback - for recoverable issues
 */
export const WarningFallback: React.FC<{
  message: string;
  onDismiss?: () => void;
}> = ({ message, onDismiss }) => (
  <ErrorFallback
    title="هشدار"
    message={message}
    severity="warning"
    action={onDismiss ? { label: 'متوجه شدم', onClick: onDismiss } : undefined}
  />
);

/**
 * Info fallback - for informational messages
 */
export const InfoFallback: React.FC<{
  message: string;
  onAction?: () => void;
  actionLabel?: string;
}> = ({ message, onAction, actionLabel = 'بستن' }) => (
  <ErrorFallback
    title="اطلاعات"
    message={message}
    severity="info"
    action={onAction ? { label: actionLabel, onClick: onAction } : undefined}
  />
);

export default ErrorFallback;
