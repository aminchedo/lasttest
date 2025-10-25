import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

// Hook for managing background dataset downloads
export const useBackgroundDownload = () => {
    const [backgroundDownloads, setBackgroundDownloads] = useState(new Map());
    const [isSupported, setIsSupported] = useState(false);

    // Check if Background Fetch is supported
    useEffect(() => {
        const checkSupport = async () => {
            if ('serviceWorker' in navigator && 'BackgroundFetchManager' in self) {
                try {
                    const registration = await navigator.serviceWorker.ready;
                    setIsSupported(!!registration.backgroundFetch);
                } catch (error) {
                    console.warn('Background Fetch not supported:', error);
                    setIsSupported(false);
                }
            } else {
                setIsSupported(false);
            }
        };

        checkSupport();
    }, []);

    // Listen for service worker messages
    useEffect(() => {
        const handleMessage = (event) => {
            const { type, datasetId, status, error } = event.data;

            switch (type) {
                case 'DATASET_DOWNLOAD_STARTED':
                    setBackgroundDownloads(prev => {
                        const newMap = new Map(prev);
                        newMap.set(datasetId, { status: 'downloading', progress: 0 });
                        return newMap;
                    });
                    toast.success(`📥 شروع دانلود پس‌زمینه: ${datasetId}`);
                    break;

                case 'DATASET_DOWNLOAD_SUCCESS':
                    setBackgroundDownloads(prev => {
                        const newMap = new Map(prev);
                        newMap.set(datasetId, { status: 'completed', progress: 100 });
                        return newMap;
                    });
                    toast.success(`✅ دانلود تکمیل شد: ${datasetId}`);
                    break;

                case 'DATASET_DOWNLOAD_ERROR':
                    setBackgroundDownloads(prev => {
                        const newMap = new Map(prev);
                        newMap.set(datasetId, { status: 'error', error: error });
                        return newMap;
                    });
                    toast.error(`❌ خطا در دانلود: ${datasetId} - ${error}`);
                    break;

                case 'DATASET_DOWNLOAD_ABORTED':
                    setBackgroundDownloads(prev => {
                        const newMap = new Map(prev);
                        newMap.delete(datasetId);
                        return newMap;
                    });
                    toast.info(`⏹️ دانلود متوقف شد: ${datasetId}`);
                    break;

                default:
                    break;
            }
        };

        navigator.serviceWorker?.addEventListener('message', handleMessage);
        return () => {
            navigator.serviceWorker?.removeEventListener('message', handleMessage);
        };
    }, []);

    // Start background download
    const startBackgroundDownload = useCallback(async (datasetId, urls, options = {}) => {
        if (!isSupported) {
            toast.error('❌ دانلود پس‌زمینه پشتیبانی نمی‌شود');
            return false;
        }

        try {
            const registration = await navigator.serviceWorker.ready;

            // Send message to service worker
            registration.active?.postMessage({
                type: 'START_BACKGROUND_DOWNLOAD',
                datasetId,
                urls,
                options: {
                    estimatedSize: options.estimatedSize || 1024 * 1024 * 10, // 10MB default
                    ...options
                }
            });

            console.log(`[Background Download] Started: ${datasetId}`);
            return true;
        } catch (error) {
            console.error('[Background Download] Failed to start:', error);
            toast.error(`❌ خطا در شروع دانلود: ${error.message}`);
            return false;
        }
    }, [isSupported]);

    // Get download status
    const getDownloadStatus = useCallback((datasetId) => {
        return backgroundDownloads.get(datasetId) || { status: 'idle', progress: 0 };
    }, [backgroundDownloads]);

    // Check if dataset is downloading
    const isDownloading = useCallback((datasetId) => {
        const status = getDownloadStatus(datasetId);
        return status.status === 'downloading';
    }, [getDownloadStatus]);

    // Check if dataset is completed
    const isCompleted = useCallback((datasetId) => {
        const status = getDownloadStatus(datasetId);
        return status.status === 'completed';
    }, [getDownloadStatus]);

    // Get all active downloads
    const getActiveDownloads = useCallback(() => {
        return Array.from(backgroundDownloads.entries())
            .filter(([_, status]) => status.status === 'downloading')
            .map(([datasetId, status]) => ({ datasetId, ...status }));
    }, [backgroundDownloads]);

    return {
        isSupported,
        startBackgroundDownload,
        getDownloadStatus,
        isDownloading,
        isCompleted,
        getActiveDownloads,
        backgroundDownloads: Object.fromEntries(backgroundDownloads)
    };
};

export default useBackgroundDownload;
