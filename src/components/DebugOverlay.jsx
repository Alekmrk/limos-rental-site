import React, { useState, useEffect, useRef } from 'react';

const DebugOverlay = ({ title = "Debug Console", enabled = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const logsRef = useRef(null);
  const maxLogs = 100;

  useEffect(() => {
    if (!enabled) return;

    // Store original console methods
    const originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn,
      info: console.info
    };

    // Override console methods to capture logs
    const interceptConsole = (method, type) => {
      console[method] = (...args) => {
        // Call original method
        originalConsole[method](...args);
        
        // Add to our logs
        const timestamp = new Date().toLocaleTimeString();
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        setLogs(prev => {
          const newLogs = [...prev, { type, message, timestamp }];
          return newLogs.slice(-maxLogs); // Keep only last maxLogs entries
        });
      };
    };

    interceptConsole('log', 'log');
    interceptConsole('error', 'error');
    interceptConsole('warn', 'warn');
    interceptConsole('info', 'info');

    // Cleanup function to restore original console
    return () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    };
  }, [enabled]);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  // Add device info log on mount
  useEffect(() => {
    if (!enabled) return;
    
    const deviceInfo = {
      userAgent: navigator.userAgent,
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      deviceMemory: navigator.deviceMemory || 'unknown',
      connection: navigator.connection?.effectiveType || 'unknown',
      localStorage: typeof localStorage !== 'undefined',
      referrer: document.referrer,
      url: window.location.href
    };
    
    console.log('🔍 Debug Overlay Initialized', deviceInfo);
  }, [enabled]);

  if (!enabled) return null;

  const getLogIcon = (type) => {
    switch (type) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📝';
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-300';
    }
  };

  return (
    <>
      {/* Toggle Button */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 z-[9998] bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition-all duration-200"
          title="Show Debug Console"
        >
          🐛
        </button>
      )}

      {/* Debug Overlay */}
      {isVisible && (
        <div className={`fixed z-[9999] bg-gray-900/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-2xl transition-all duration-300 ${
          isMinimized 
            ? 'bottom-4 right-4 w-80 h-12' 
            : 'bottom-4 right-4 w-96 h-96'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-600 bg-gray-800/90 rounded-t-lg">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">🐛</span>
              <h3 className="text-white font-medium text-sm">{title}</h3>
              <span className="text-gray-400 text-xs">({logs.length})</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogs([])}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
                title="Clear logs"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? '⬆️' : '⬇️'}
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded"
                title="Close"
              >
                ❌
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <div className="h-80 overflow-hidden flex flex-col">
              {/* Logs */}
              <div 
                ref={logsRef}
                className="flex-1 overflow-y-auto p-3 space-y-1 text-xs font-mono"
              >
                {logs.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    No logs yet...
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="flex-shrink-0 text-xs">
                        {getLogIcon(log.type)}
                      </span>
                      <span className="text-gray-500 flex-shrink-0 text-xs">
                        {log.timestamp}
                      </span>
                      <div className={`flex-1 break-words ${getLogColor(log.type)}`}>
                        {log.message}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Actions */}
              <div className="border-t border-gray-600 p-2 bg-gray-800/50">
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => console.log('🍪 localStorage:', {
                      cookieConsent: localStorage.getItem('cookie-consent'),
                      consentTimestamp: localStorage.getItem('cookie-consent-timestamp'),
                      appVersion: localStorage.getItem('app-version'),
                      runtimeMarker: localStorage.getItem('cookie-runtime-marker'),
                      reservation: localStorage.getItem('eliteway-reservation')
                    })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                  >
                    localStorage
                  </button>
                  <button
                    onClick={() => console.log('🌐 Navigation:', {
                      pathname: window.location.pathname,
                      search: window.location.search,
                      referrer: document.referrer,
                      history: window.history.length
                    })}
                    className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                  >
                    Navigation
                  </button>
                  <button
                    onClick={() => console.log('📱 Device:', {
                      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
                      viewport: `${window.innerWidth}x${window.innerHeight}`,
                      deviceMemory: navigator.deviceMemory,
                      connection: navigator.connection?.effectiveType
                    })}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded"
                  >
                    Device
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DebugOverlay;
