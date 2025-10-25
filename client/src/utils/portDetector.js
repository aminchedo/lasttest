// Port detection utility for dynamic backend connection
const DEFAULT_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), ms)
        )
    ]);
}

class PortDetector {
    constructor() {
        this.detectedPort = null;
        this.lastCheck = 0;
        this.checkInterval = 30000; // Check every 30 seconds
    }

    async detectBackendPort() {
        const now = Date.now();

        // Return cached result if recent
        if (this.detectedPort && (now - this.lastCheck) < this.checkInterval) {
            return this.detectedPort;
        }

        console.log('🔍 Detecting backend port...');

        // Try the default port first (most common case)
        const defaultUrl = `${DEFAULT_BASE.replace(/\/$/, '')}/api/health`;
        try {
            const response = await withTimeout(
                fetch(defaultUrl, { method: 'GET' }),
                2000
            );
            if (response.ok) {
                const data = await response.json();
                if (data.ok) {
                    console.log(`✅ Backend detected at: ${DEFAULT_BASE}`);
                    this.detectedPort = new URL(DEFAULT_BASE).port || '3001';
                    this.lastCheck = now;
                    return this.detectedPort;
                }
            }
        } catch (error) {
            console.log(`Backend not available at ${DEFAULT_BASE}: ${error.message}`);
        }

        // Fallback to port scanning if default fails
        const POSSIBLE_PORTS = [3001, 30011, 3002, 3000, 8000, 5000];
        for (const port of POSSIBLE_PORTS) {
            try {
                const response = await withTimeout(
                    fetch(`http://localhost:${port}/api/health`, { method: 'GET' }),
                    2000
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.ok) {
                        console.log(`✅ Backend detected on port ${port}`);
                        this.detectedPort = port;
                        this.lastCheck = now;
                        return port;
                    }
                }
            } catch (error) {
                // Port not available, continue to next
                console.log(`❌ Port ${port} not available`);
            }
        }

        console.error('❌ No backend server found on any port');
        return null;
    }

    getApiBaseUrl() {
        if (this.detectedPort) {
            return `http://localhost:${this.detectedPort}/api`;
        }
        return 'http://localhost:3001/api'; // Fallback
    }

    async getHealthStatus() {
        const port = await this.detectBackendPort();
        if (!port) {
            return { ok: false, error: 'Backend server not found' };
        }

        try {
            const response = await fetch(`http://localhost:${port}/api/health`);
            return await response.json();
        } catch (error) {
            return { ok: false, error: 'Health check failed' };
        }
    }
}

// Export singleton instance
export const portDetector = new PortDetector();
export default portDetector;
