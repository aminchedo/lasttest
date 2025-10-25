// Service Worker for Background Dataset Downloads
// Updated: 2025-10-23
// Purpose: Handle background downloads of Persian NLP datasets

const CACHE_NAME = 'persian-datasets-v1';
const DATASETS_CACHE = 'datasets-cache-v1';

// Install event
self.addEventListener('install', (event) => {
    console.log('[SW] Service Worker installing...');
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('[SW] Service Worker activating...');
    event.waitUntil(clients.claim());
});

// Background Fetch Success Handler
self.addEventListener('backgroundfetchsuccess', (event) => {
    console.log('[SW] Background fetch successful:', event.registration.id);

    event.waitUntil(async function () {
        const bgFetch = event.registration;
        const records = await bgFetch.matchAll();

        for (const record of records) {
            try {
                const response = await record.responseReady;
                const datasetId = bgFetch.id;

                // Save to IndexedDB
                await saveDatasetToIndexedDB(datasetId, response);

                // Notify client about successful download
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'DATASET_DOWNLOAD_SUCCESS',
                        datasetId: datasetId,
                        status: 'completed'
                    });
                });

                console.log(`[SW] Dataset ${datasetId} downloaded and saved successfully`);
            } catch (error) {
                console.error('[SW] Error processing downloaded dataset:', error);

                // Notify client about error
                const clients = await self.clients.matchAll();
                clients.forEach(client => {
                    client.postMessage({
                        type: 'DATASET_DOWNLOAD_ERROR',
                        datasetId: bgFetch.id,
                        error: error.message
                    });
                });
            }
        }
    }());
});

// Background Fetch Fail Handler
self.addEventListener('backgroundfetchfail', (event) => {
    console.log('[SW] Background fetch failed:', event.registration.id);

    event.waitUntil(async function () {
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'DATASET_DOWNLOAD_ERROR',
                datasetId: event.registration.id,
                error: 'Download failed'
            });
        });
    }());
});

// Background Fetch Abort Handler
self.addEventListener('backgroundfetchabort', (event) => {
    console.log('[SW] Background fetch aborted:', event.registration.id);

    event.waitUntil(async function () {
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'DATASET_DOWNLOAD_ABORTED',
                datasetId: event.registration.id
            });
        });
    }());
});

// Save dataset to IndexedDB
async function saveDatasetToIndexedDB(datasetId, response) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('PersianDatasets', 1);

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['datasets'], 'readwrite');
            const store = transaction.objectStore('datasets');

            // Convert response to blob
            response.clone().blob().then(blob => {
                const datasetData = {
                    id: datasetId,
                    data: blob,
                    timestamp: new Date().toISOString(),
                    size: blob.size,
                    type: blob.type
                };

                const putRequest = store.put(datasetData);
                putRequest.onsuccess = () => {
                    console.log(`[SW] Dataset ${datasetId} saved to IndexedDB`);
                    resolve();
                };
                putRequest.onerror = () => reject(putRequest.error);
            });
        };

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('datasets')) {
                const store = db.createObjectStore('datasets', { keyPath: 'id' });
                store.createIndex('timestamp', 'timestamp', { unique: false });
            }
        };
    });
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data.type === 'START_BACKGROUND_DOWNLOAD') {
        const { datasetId, urls, options } = event.data;
        startBackgroundDownload(datasetId, urls, options);
    }
});

// Start background download
async function startBackgroundDownload(datasetId, urls, options) {
    try {
        if ('serviceWorker' in navigator && 'BackgroundFetchManager' in self) {
            const bgFetch = await self.registration.backgroundFetch.fetch(
                datasetId,
                urls,
                {
                    title: `Downloading ${datasetId}`,
                    icons: [{
                        sizes: '192x192',
                        src: '/favicon.svg',
                        type: 'image/svg+xml',
                    }],
                    downloadTotal: options.estimatedSize || 1024 * 1024 * 10, // 10MB default
                }
            );

            console.log(`[SW] Background download started for ${datasetId}`);

            // Notify client
            const clients = await self.clients.matchAll();
            clients.forEach(client => {
                client.postMessage({
                    type: 'DATASET_DOWNLOAD_STARTED',
                    datasetId: datasetId
                });
            });

        } else {
            throw new Error('Background Fetch API not supported');
        }
    } catch (error) {
        console.error('[SW] Failed to start background download:', error);

        // Notify client about error
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
            client.postMessage({
                type: 'DATASET_DOWNLOAD_ERROR',
                datasetId: datasetId,
                error: error.message
            });
        });
    }
}

console.log('[SW] Service Worker loaded successfully');
