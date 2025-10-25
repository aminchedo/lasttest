// hooks/useConnectionStatus.js - Connection monitoring hook
import { useState, useEffect } from 'react';

export const useConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverOnline, setServerOnline] = useState(false);
  const [lastCheck, setLastCheck] = useState(null);

  const checkServer = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('http://localhost:30011/api/health', {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      const isServerOnline = response.ok;
      setServerOnline(isServerOnline);
      setLastCheck(new Date());
      
      return isServerOnline;
    } catch (error) {
      setServerOnline(false);
      setLastCheck(new Date());
      return false;
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkServer();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setServerOnline(false);
    };

    // Check initial status
    checkServer();

    // Set up interval for ongoing checks (every 30 seconds)
    const interval = setInterval(checkServer, 30000);

    // Event listeners for browser online/offline
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { 
    isOnline, 
    serverOnline, 
    lastCheck,
    checkServer 
  };
};

export default useConnectionStatus;