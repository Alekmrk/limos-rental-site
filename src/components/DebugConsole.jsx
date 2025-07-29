import { useState, useEffect, useRef } from 'react';

const DebugConsole = () => {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [filter, setFilter] = useState('all'); // all, cookie, stripe, error
  const logsRef = useRef([]);
  const consoleRef = useRef(null);

  // Store original console methods
  const originalConsole = useRef({
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
  });

  const addLog = (level, args, source = 'general') => {
    const timestamp = new Date().toLocaleTimeString();
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp,
      level,
      message,
      source,
      raw: args
    };

    logsRef.current = [...logsRef.current.slice(-99), logEntry]; // Keep last 100 logs
    setLogs([...logsRef.current]);

    // Auto-scroll to bottom
    setTimeout(() => {
      if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
      }
    }, 10);
  };

  const determineSource = (message) => {
    const msg = String(message).toLowerCase();
    if (msg.includes('🍪') || msg.includes('cookie')) return 'cookie';
    if (msg.includes('stripe') || msg.includes('payment')) return 'stripe';
    if (msg.includes('localstorage')) return 'storage';
    if (msg.includes('mobile') || msg.includes('device')) return 'mobile';
    return 'general';
  };

  useEffect(() => {
    // Override console methods
    console.log = (...args) => {
      originalConsole.current.log(...args);
      addLog('log', args, determineSource(args[0]));
    };

    console.warn = (...args) => {
      originalConsole.current.warn(...args);
      addLog('warn', args, determineSource(args[0]));
    };

    console.error = (...args) => {
      originalConsole.current.error(...args);
      addLog('error', args, determineSource(args[0]));
    };

    console.info = (...args) => {
      originalConsole.current.info(...args);
      addLog('info', args, determineSource(args[0]));
    };

    // Add initial system info
    addLog('info', ['🔧 Debug Console Initialized'], 'system');
    addLog('info', [`📱 User Agent: ${navigator.userAgent}`], 'system');
    addLog('info', [`🌐 Current URL: ${window.location.href}`], 'system');
    addLog('info', [`📄 Referrer: ${document.referrer || 'Direct'}`], 'system');
    addLog('info', [`💾 localStorage available: ${typeof localStorage !== 'undefined'}`], 'system');

    // Detect payment/Stripe scenarios
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const isPaymentPage = window.location.pathname.includes('payment');
    const isFromStripe = document.referrer.includes('stripe');
    
    if (sessionId || isPaymentPage || isFromStripe) {
      addLog('warn', ['💳 PAYMENT SCENARIO DETECTED'], 'stripe');
      addLog('info', [`💳 Session ID: ${sessionId || 'none'}`], 'stripe');
      addLog('info', [`💳 Payment page: ${isPaymentPage}`], 'stripe');
      addLog('info', [`💳 From Stripe: ${isFromStripe}`], 'stripe');
      
      // Check cookie consent immediately in payment scenarios
      const consent = localStorage.getItem('cookie-consent');
      const timestamp = localStorage.getItem('cookie-consent-timestamp');
      addLog('info', [`🍪 Consent on payment page: ${!!consent}`], 'cookie');
      addLog('info', [`🍪 Timestamp on payment page: ${timestamp || 'none'}`], 'cookie');
    }

    // Listen for localStorage events
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = function(key, value) {
      if (key.includes('cookie') || key.includes('app-version')) {
        addLog('info', [`💾 localStorage.setItem: ${key} = ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`], 'storage');
      }
      return originalSetItem.call(this, key, value);
    };

    localStorage.getItem = function(key) {
      const result = originalGetItem.call(this, key);
      if (key.includes('cookie') || key.includes('app-version')) {
        addLog('info', [`💾 localStorage.getItem: ${key} = ${result ? result.substring(0, 100) + (result.length > 100 ? '...' : '') : 'null'}`], 'storage');
      }
      return result;
    };

    localStorage.removeItem = function(key) {
      if (key.includes('cookie') || key.includes('app-version')) {
        addLog('info', [`💾 localStorage.removeItem: ${key}`], 'storage');
      }
      return originalRemoveItem.call(this, key);
    };

    // Cleanup function
    return () => {
      console.log = originalConsole.current.log;
      console.warn = originalConsole.current.warn;
      console.error = originalConsole.current.error;
      console.info = originalConsole.current.info;
      localStorage.setItem = originalSetItem;
      localStorage.getItem = originalGetItem;
      localStorage.removeItem = originalRemoveItem;
    };
  }, []);

  // Auto-show console if cookie-related logs appear or Stripe redirects detected
  useEffect(() => {
    const recentCookieLogs = logs.filter(log => 
      log.source === 'cookie' || log.message.includes('🍪') || log.message.includes('🔍') || log.message.includes('STRIPE')
    ).slice(-5);

    const hasStripeActivity = logs.some(log => 
      log.message.toLowerCase().includes('stripe') || 
      log.message.includes('payment') ||
      window.location.search.includes('session_id') ||
      document.referrer.includes('stripe')
    );

    if ((recentCookieLogs.length > 0 || hasStripeActivity) && !isVisible) {
      console.log('🔧 Auto-showing debug console due to cookie/payment activity');
      setIsVisible(true);
    }
  }, [logs, isVisible]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + Shift + D to toggle debug console
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
      // Escape to hide
      if (e.key === 'Escape' && isVisible) {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'cookie') return log.source === 'cookie' || log.message.includes('🍪');
    if (filter === 'stripe') return log.source === 'stripe' || log.message.toLowerCase().includes('stripe');
    if (filter === 'error') return log.level === 'error';
    return log.source === filter;
  });

  const clearLogs = () => {
    logsRef.current = [];
    setLogs([]);
  };

  const exportLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      case 'info': return 'text-blue-400';
      default: return 'text-gray-300';
    }
  };

  const getSourceBadge = (source) => {
    const colors = {
      cookie: 'bg-orange-500',
      stripe: 'bg-purple-500',
      storage: 'bg-blue-500',
      mobile: 'bg-green-500',
      system: 'bg-gray-500',
      general: 'bg-gray-600'
    };
    return colors[source] || 'bg-gray-600';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition-colors text-sm font-mono"
        title="Show Debug Console (Ctrl+Shift+D)"
      >
        🐛 Debug
      </button>
    );
  }

  return (
    <div className={`fixed z-[9999] bg-gray-900 border border-gray-600 rounded-lg shadow-2xl font-mono text-sm transition-all duration-300 ${
      isMinimized 
        ? 'bottom-4 right-4 w-80 h-12' 
        : 'bottom-4 right-4 w-96 h-96'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded-t-lg border-b border-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-green-400">🐛</span>
          <span className="text-white font-semibold">Debug Console</span>
          <span className="text-gray-400 text-xs">({filteredLogs.length})</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-400 hover:text-white px-2 py-1 rounded"
            title="Minimize"
          >
            {isMinimized ? '□' : '_'}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white px-2 py-1 rounded"
            title="Close (ESC)"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Controls */}
          <div className="flex items-center gap-2 p-2 bg-gray-800 border-b border-gray-600">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600"
            >
              <option value="all">All</option>
              <option value="cookie">🍪 Cookies</option>
              <option value="stripe">💳 Stripe</option>
              <option value="storage">💾 Storage</option>
              <option value="mobile">📱 Mobile</option>
              <option value="error">❌ Errors</option>
            </select>
            <button
              onClick={clearLogs}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
            >
              Clear
            </button>
            <button
              onClick={exportLogs}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded"
            >
              Export
            </button>
          </div>

          {/* Logs */}
          <div
            ref={consoleRef}
            className="overflow-y-auto h-80 p-2 bg-gray-900 text-xs leading-relaxed"
          >
            {filteredLogs.length === 0 ? (
              <div className="text-gray-500 text-center py-4">No logs to display</div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="mb-1 flex items-start gap-2">
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {log.timestamp}
                  </span>
                  <span className={`inline-block w-2 h-2 rounded-full mt-1 ${getSourceBadge(log.source)}`}></span>
                  <span className={`flex-1 break-words ${getLevelColor(log.level)}`}>
                    {log.message}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-1 bg-gray-800 rounded-b-lg border-t border-gray-600 text-xs text-gray-400">
            Press Ctrl+Shift+D to toggle • ESC to close
          </div>
        </>
      )}
    </div>
  );
};

export default DebugConsole;
