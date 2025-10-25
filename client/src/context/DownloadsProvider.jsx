// client/src/context/DownloadsProvider.jsx - Complete Enhanced Version
import React, { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import endpoints from '../api/endpoints';
import { API, getState, subscribe } from '../state/downloads';

const Ctx = createContext(null);

// Connection states
const ConnectionState = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

export default function DownloadsProvider({ children }) {
  const [connectionState, setConnectionState] = useState(ConnectionState.CONNECTING);
  const [errorCount, setErrorCount] = useState(0);
  const [lastError, setLastError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const retryTimeoutRef = useRef(null);
  const mountedRef = useRef(true);
  const consecutiveErrorsRef = useRef(0);

  const MAX_CONSECUTIVE_ERRORS = 10;
  const BASE_RETRY_DELAY = 1000;
  const MAX_RETRY_DELAY = 30000;

  useEffect(() => {
    mountedRef.current = true;
    console.log('🚀 DownloadsProvider mounted, starting polling...');

    const fetchStatus = async () => {
      if (!mountedRef.current) {
        console.log('⚠️ Component unmounted, skipping fetch');
        return;
      }

      try {
        console.log('📡 Fetching downloader status...');
        setConnectionState(ConnectionState.CONNECTING);

        const res = await endpoints.getDownloaderStatus();

        if (!mountedRef.current) return;

        // Validate response
        if (!res) {
          throw new Error('Empty response from server');
        }

        if (res.ok === false) {
          throw new Error(res.error || 'Failed to fetch downloader status');
        }

        // Success - update state
        const items = res?.items || { datasets: [], models: [], tts: [] };
        API.setItems(items);

        // Reset error tracking
        consecutiveErrorsRef.current = 0;
        setErrorCount(0);
        setLastError(null);
        setIsRetrying(false);
        setConnectionState(ConnectionState.CONNECTED);

        console.log('✅ Downloader status fetched successfully', {
          datasets: items.datasets?.length || 0,
          models: items.models?.length || 0,
          tts: items.tts?.length || 0
        });

      } catch (error) {
        console.error('❌ Failed to fetch downloader status:', error);

        if (!mountedRef.current) return;

        consecutiveErrorsRef.current++;
        setErrorCount(prev => prev + 1);
        setLastError(error.message || error.error || 'Unknown error');
        setConnectionState(ConnectionState.ERROR);

        // Calculate exponential backoff delay
        const retryDelay = Math.min(
          BASE_RETRY_DELAY * Math.pow(2, consecutiveErrorsRef.current - 1),
          MAX_RETRY_DELAY
        );

        console.log(`⏳ Retry ${consecutiveErrorsRef.current}/${MAX_CONSECUTIVE_ERRORS} in ${retryDelay}ms`);

        // Check if we should stop retrying
        if (consecutiveErrorsRef.current >= MAX_CONSECUTIVE_ERRORS) {
          console.error('🛑 Too many consecutive errors, stopped polling');
          setConnectionState(ConnectionState.DISCONNECTED);
          API.stopPolling();
          return;
        }

        // Schedule retry with exponential backoff
        setIsRetrying(true);
        retryTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            fetchStatus();
          }
        }, retryDelay);
      }
    };

    // Start polling with the fetch function
    API.startPolling(fetchStatus);

    // Cleanup function
    return () => {
      console.log('🧹 DownloadsProvider unmounting, cleaning up...');
      mountedRef.current = false;
      API.stopPolling();

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once on mount

  // Manual retry function
  const retry = () => {
    console.log('🔄 Manual retry triggered');
    consecutiveErrorsRef.current = 0;
    setErrorCount(0);
    setLastError(null);
    setIsRetrying(false);
    setConnectionState(ConnectionState.CONNECTING);
    
    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    // Restart polling
    API.stopPolling();
    API.startPolling(async () => {
      try {
        const res = await endpoints.getDownloaderStatus();
        if (res && mountedRef.current) {
          API.setItems(res?.items || { datasets: [], models: [], tts: [] });
          setConnectionState(ConnectionState.CONNECTED);
        }
      } catch (error) {
        console.error('Retry failed:', error);
      }
    });
  };

  // Context value with memoization
  const value = useMemo(() => ({
    // State
    connectionState,
    errorCount,
    lastError,
    isRetrying,
    isConnected: connectionState === ConnectionState.CONNECTED,
    hasError: connectionState === ConnectionState.ERROR,
    isDisconnected: connectionState === ConnectionState.DISCONNECTED,

    // API methods
    subscribe,
    getState,
    api: endpoints,
    setItems: API.setItems,
    upsertJob: API.upsertJob,

    // Control methods
    retry,
    stopPolling: API.stopPolling,
    startPolling: API.startPolling,

    // Stats
    stats: {
      totalErrors: errorCount,
      consecutiveErrors: consecutiveErrorsRef.current,
      maxErrors: MAX_CONSECUTIVE_ERRORS
    }
  }), [
    connectionState,
    errorCount,
    lastError,
    isRetrying
  ]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {/* Optional: Connection status indicator */}
      {connectionState === ConnectionState.ERROR && errorCount > 3 && (
        <ConnectionErrorBanner
          error={lastError}
          errorCount={errorCount}
          onRetry={retry}
          isRetrying={isRetrying}
        />
      )}
    </Ctx.Provider>
  );
}

// Connection Error Banner Component
function ConnectionErrorBanner({ error, errorCount, onRetry, isRetrying }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      right: 20,
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      zIndex: 9999,
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <strong style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
            Connection Error
          </strong>
          <small style={{ fontSize: '12px', opacity: 0.9 }}>
            {error || 'Unable to connect to server'}
          </small>
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '8px',
        borderTop: '1px solid rgba(255,255,255,0.2)'
      }}>
        <small style={{ fontSize: '11px', opacity: 0.8 }}>
          Failed attempts: {errorCount}
        </small>
        <button
          onClick={onRetry}
          disabled={isRetrying}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: isRetrying ? 'not-allowed' : 'pointer',
            opacity: isRetrying ? 0.6 : 1,
            transition: 'all 0.2s'
          }}
        >
          {isRetrying ? '🔄 Retrying...' : '🔄 Retry'}
        </button>
      </div>
    </div>
  );
}

// Custom hook to use the context
export function useDownloadsContext() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error('useDownloadsContext must be used within DownloadsProvider');
  }
  return ctx;
}

// Custom hook for download items
export function useDownloadItems() {
  const { getState, subscribe } = useDownloadsContext();
  const [items, setItems] = useState(getState);

  useEffect(() => {
    const unsubscribe = subscribe(setItems);
    return unsubscribe;
  }, [subscribe]);

  return items;
}

// Custom hook for connection status
export function useConnectionStatus() {
  const { connectionState, isConnected, hasError, retry } = useDownloadsContext();
  
  return {
    state: connectionState,
    isConnected,
    hasError,
    retry
  };
}

// Export connection states for external use
export { ConnectionState };