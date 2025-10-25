// real-backend-integration.js - Integration with Real ML Backend
import apiClient from './client';

class RealBackendIntegration {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3001/api';
        this.isConnected = false;
        this.healthCheckInterval = null;
    }

    // Check if real backend is available
    async checkBackendHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            const data = await response.json();

            if (data.ok && data.status === 'healthy') {
                this.isConnected = true;
                console.log('✅ Real backend connected:', data);
                return true;
            }
            return false;
        } catch (error) {
            console.warn('⚠️ Real backend not available, using fallback mode');
            this.isConnected = false;
            return false;
        }
    }

    // Start real ML training
    async startRealTraining(config) {
        if (!this.isConnected) {
            throw new Error('Real backend not connected');
        }

        try {
            const response = await fetch(`${this.baseURL}/training/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: config.name,
                    modelType: config.modelType,
                    datasetPath: config.datasetPath,
                    baseModel: config.baseModel,
                    epochs: config.epochs || 10,
                    learningRate: config.learningRate || 0.001,
                    batchSize: config.batchSize || 32,
                    validationSplit: config.validationSplit || 0.2,
                    config: config.advanced || {}
                })
            });

            const data = await response.json();

            if (data.ok) {
                console.log('🚀 Real ML training started:', data);
                return data;
            } else {
                throw new Error(data.error || 'Failed to start training');
            }
        } catch (error) {
            console.error('❌ Real training start error:', error);
            throw error;
        }
    }

    // Get real training status
    async getRealTrainingStatus(jobId) {
        if (!this.isConnected) {
            return this.getMockTrainingStatus(jobId);
        }

        try {
            const response = await fetch(`${this.baseURL}/training/status/${jobId}`);
            const data = await response.json();

            if (data.ok) {
                return data.data;
            } else {
                throw new Error(data.error || 'Failed to get training status');
            }
        } catch (error) {
            console.error('❌ Real training status error:', error);
            return this.getMockTrainingStatus(jobId);
        }
    }

    // Get real models
    async getRealModels() {
        if (!this.isConnected) {
            return this.getMockModels();
        }

        try {
            const response = await fetch(`${this.baseURL}/models`);
            const data = await response.json();

            if (data.ok) {
                return data.data;
            } else {
                throw new Error(data.error || 'Failed to get models');
            }
        } catch (error) {
            console.error('❌ Real models error:', error);
            return this.getMockModels();
        }
    }

    // Get real downloader status
    async getRealDownloaderStatus() {
        if (!this.isConnected) {
            return this.getMockDownloaderStatus();
        }

        try {
            const response = await fetch(`${this.baseURL}/downloader/status`);
            const data = await response.json();

            if (data.ok) {
                return data.data;
            } else {
                throw new Error(data.error || 'Failed to get downloader status');
            }
        } catch (error) {
            console.error('❌ Real downloader status error:', error);
            return this.getMockDownloaderStatus();
        }
    }

    // Get real analysis metrics
    async getRealAnalysisMetrics(metricType = 'accuracy', timeRange = '7d') {
        if (!this.isConnected) {
            return this.getMockAnalysisMetrics();
        }

        try {
            const response = await fetch(`${this.baseURL}/analysis/metrics?metricType=${metricType}&timeRange=${timeRange}`);
            const data = await response.json();

            // Normalize response structure
            if (data.ok && data.data) {
                return data.data;
            } else if (data && !data.ok && !data.data) {
                // If response doesn't have ok/data structure, return the data directly
                return data;
            } else {
                throw new Error(data.error || 'Failed to get analysis metrics');
            }
        } catch (error) {
            console.error('❌ Real analysis metrics error:', error);
            return this.getMockAnalysisMetrics();
        }
    }

    // Get real menu counts
    async getRealMenuCounts() {
        if (!this.isConnected) {
            return this.getMockMenuCounts();
        }

        try {
            const response = await fetch(`${this.baseURL}/menu/counts`);
            const data = await response.json();

            if (data.ok) {
                return data.data;
            } else {
                throw new Error(data.error || 'Failed to get menu counts');
            }
        } catch (error) {
            console.error('❌ Real menu counts error:', error);
            return this.getMockMenuCounts();
        }
    }

    // Start real download
    async startRealDownload(downloadConfig) {
        if (!this.isConnected) {
            throw new Error('Real backend not connected');
        }

        try {
            const response = await fetch(`${this.baseURL}/downloader/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fileName: downloadConfig.fileName,
                    url: downloadConfig.url,
                    type: downloadConfig.type || 'model',
                    sizeMb: downloadConfig.sizeMb,
                    source: downloadConfig.source || 'huggingface'
                })
            });

            const data = await response.json();

            if (data.ok) {
                console.log('📥 Real download started:', data);
                return data;
            } else {
                throw new Error(data.error || 'Failed to start download');
            }
        } catch (error) {
            console.error('❌ Real download start error:', error);
            throw error;
        }
    }

    // Stop real training
    async stopRealTraining(jobId) {
        if (!this.isConnected) {
            throw new Error('Real backend not connected');
        }

        try {
            const response = await fetch(`${this.baseURL}/training/stop/${jobId}`, {
                method: 'POST'
            });

            const data = await response.json();

            if (data.ok) {
                console.log('⏹️ Real training stopped:', data);
                return data;
            } else {
                throw new Error(data.error || 'Failed to stop training');
            }
        } catch (error) {
            console.error('❌ Real training stop error:', error);
            throw error;
        }
    }

    // Fallback mock methods
    getMockTrainingStatus(jobId) {
        return {
            id: jobId,
            name: 'Mock Training Job',
            status: 'running',
            progress: 65,
            currentEpoch: 7,
            totalEpochs: 10,
            accuracy: 0.89,
            loss: 0.18,
            metrics: []
        };
    }

    getMockModels() {
        return [
            {
                id: 'mock-model-1',
                name: 'مدل پردازش متن فارسی',
                type: 'transformer',
                accuracy: 0.94,
                status: 'ready',
                size_mb: 450.5
            }
        ];
    }

    getMockDownloaderStatus() {
        return {
            isActive: false,
            currentDownloads: [],
            queuedDownloads: [],
            completedToday: 0,
            totalDownloaded: 0
        };
    }

    getMockAnalysisMetrics() {
        return {
            totalAnalyses: 42,
            successRate: 95.5,
            averageTime: 3.2,
            recentAnalyses: []
        };
    }

    getMockMenuCounts() {
        return {
            models: 3,
            training: 1,
            datasets: 4,
            downloads: 0,
            tts: 0,
            users: 1
        };
    }

    // Start health monitoring
    startHealthMonitoring() {
        this.healthCheckInterval = setInterval(async () => {
            await this.checkBackendHealth();
        }, 30000); // Check every 30 seconds
    }

    // Stop health monitoring
    stopHealthMonitoring() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
    }

    // Get connection status
    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            baseURL: this.baseURL,
            lastCheck: new Date().toISOString()
        };
    }

    // Get real users
    async getRealUsers() {
        if (!this.isConnected) {
            return this.getMockUsers();
        }

        try {
            const response = await fetch(`${this.baseURL}/users`);
            const data = await response.json();

            // Normalize response structure
            if (data.ok && data.data) {
                return data.data;
            } else if (data && !data.ok && !data.data) {
                // If response doesn't have ok/data structure, return the data directly
                return data;
            } else {
                throw new Error(data.error || 'Failed to get users');
            }
        } catch (error) {
            console.error('❌ Real users error:', error);
            return this.getMockUsers();
        }
    }

    // Get mock users for fallback
    getMockUsers() {
        return [
            { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
            { id: 2, name: 'Test User', email: 'test@example.com', role: 'user', status: 'active' }
        ];
    }
}

// Create singleton instance
const realBackendIntegration = new RealBackendIntegration();

// Initialize connection check
realBackendIntegration.checkBackendHealth();

export default realBackendIntegration;
