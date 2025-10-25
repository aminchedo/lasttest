// PerformanceOptimizer.jsx - Performance optimization utilities
import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import SkeletonLoader from './SkeletonLoader';

// Lazy load heavy components
const LazyChart = lazy(() => import('./LazyChart'));
const LazyTable = lazy(() => import('./LazyTable'));

// Memoized components for better performance
export const MemoizedCard = memo(({ title, value, icon: Icon, color, onClick }) => {
    return (
        <div
            className={`kpi-card kpi-${color}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        >
            <div className="kpi-header">
                <div className="kpi-title">{title}</div>
                <div className="kpi-icon">
                    <Icon size={24} />
                </div>
            </div>
            <div className="kpi-value">{value}</div>
        </div>
    );
});

export const MemoizedActivityItem = memo(({ activity, index }) => {
    const formatTime = useCallback((timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'همین الان';
        if (diffMins < 60) return `${diffMins} دقیقه پیش`;
        if (diffHours < 24) return `${diffHours} ساعت پیش`;
        return `${diffDays} روز پیش`;
    }, []);

    return (
        <div className="activity-item">
            <div className="activity-icon">
                <activity.icon size={20} />
            </div>
            <div className="activity-content">
                <div className="activity-title">{activity.title}</div>
                <div className="activity-description">{activity.description}</div>
                <div className="activity-time">{formatTime(activity.timestamp)}</div>
            </div>
        </div>
    );
});

// Virtual scrolling for large lists
export const VirtualList = memo(({ items, itemHeight = 60, containerHeight = 400, renderItem }) => {
    const [scrollTop, setScrollTop] = React.useState(0);

    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
        visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
    );

    const visibleItems = items.slice(visibleStart, visibleEnd);
    const totalHeight = items.length * itemHeight;
    const offsetY = visibleStart * itemHeight;

    const handleScroll = useCallback((e) => {
        setScrollTop(e.target.scrollTop);
    }, []);

    return (
        <div
            className="virtual-list-container"
            style={{ height: containerHeight, overflow: 'auto' }}
            onScroll={handleScroll}
        >
            <div style={{ height: totalHeight, position: 'relative' }}>
                <div style={{ transform: `translateY(${offsetY}px)` }}>
                    {visibleItems.map((item, index) =>
                        renderItem(item, visibleStart + index)
                    )}
                </div>
            </div>
        </div>
    );
});

// Debounced search hook
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Optimized data processing
export const useOptimizedData = (rawData, dependencies = []) => {
    return useMemo(() => {
        if (!rawData) return null;

        // Process and normalize data
        const processed = {
            models: rawData.models?.map(model => ({
                ...model,
                id: model.id || model.name,
                status: model.status || 'unknown',
                progress: Math.max(0, Math.min(100, model.progress || 0))
            })) || [],

            datasets: rawData.datasets?.map(dataset => ({
                ...dataset,
                id: dataset.id || dataset.name,
                size: dataset.size || 0,
                format: dataset.format || 'unknown'
            })) || [],

            activities: rawData.activities?.map(activity => ({
                ...activity,
                timestamp: new Date(activity.timestamp || Date.now()),
                id: activity.id || Math.random().toString(36)
            })) || []
        };

        return processed;
    }, [rawData, ...dependencies]);
};

// Lazy component wrapper
export const LazyComponent = ({ component: Component, fallback, ...props }) => {
    const LazyComponent = lazy(() =>
        Promise.resolve({ default: Component })
    );

    return (
        <Suspense fallback={fallback || <SkeletonLoader type="card" />}>
            <LazyComponent {...props} />
        </Suspense>
    );
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
    const [metrics, setMetrics] = React.useState({
        renderCount: 0,
        lastRenderTime: 0,
        averageRenderTime: 0
    });

    React.useEffect(() => {
        const startTime = performance.now();

        return () => {
            const endTime = performance.now();
            const renderTime = endTime - startTime;

            setMetrics(prev => ({
                renderCount: prev.renderCount + 1,
                lastRenderTime: renderTime,
                averageRenderTime: (prev.averageRenderTime + renderTime) / 2
            }));
        };
    });

    // Log performance warnings
    React.useEffect(() => {
        if (metrics.lastRenderTime > 16) { // More than 16ms (60fps)
            console.warn(`${componentName} render took ${metrics.lastRenderTime.toFixed(2)}ms`);
        }
    }, [metrics.lastRenderTime, componentName]);

    return metrics;
};

// Image lazy loading component
export const LazyImage = memo(({ src, alt, placeholder, ...props }) => {
    const [loaded, setLoaded] = React.useState(false);
    const [error, setError] = React.useState(false);

    const handleLoad = useCallback(() => {
        setLoaded(true);
    }, []);

    const handleError = useCallback(() => {
        setError(true);
    }, []);

    return (
        <div className="lazy-image-container" {...props}>
            {!loaded && !error && (
                <div className="lazy-image-placeholder">
                    {placeholder || <SkeletonLoader type="default" count={1} />}
                </div>
            )}
            <img
                src={src}
                alt={alt}
                onLoad={handleLoad}
                onError={handleError}
                style={{
                    display: loaded && !error ? 'block' : 'none',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
                loading="lazy"
            />
            {error && (
                <div className="lazy-image-error">
                    <span>خطا در بارگذاری تصویر</span>
                </div>
            )}
        </div>
    );
});

// Bundle size optimization
export const BundleOptimizer = {
    // Remove unused imports
    removeUnusedImports: () => {
        console.log('Checking for unused imports...');
        // This would typically be handled by build tools
    },

    // Code splitting suggestions
    suggestCodeSplitting: (bundleSize) => {
        if (bundleSize > 250000) { // 250KB
            console.warn('Bundle size is large, consider code splitting');
            return [
                'Split vendor libraries',
                'Lazy load non-critical components',
                'Use dynamic imports for routes'
            ];
        }
        return [];
    }
};

export default {
    MemoizedCard,
    MemoizedActivityItem,
    VirtualList,
    useDebounce,
    useOptimizedData,
    LazyComponent,
    usePerformanceMonitor,
    LazyImage,
    BundleOptimizer
};
