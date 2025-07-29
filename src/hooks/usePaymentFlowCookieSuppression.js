import { useEffect } from 'react';

/**
 * Custom hook to suppress cookie consent banner during payment flows
 * This prevents the banner from showing during sensitive payment processes
 * @param {boolean} isActive - Whether to activate suppression
 * @param {number} duration - Duration in milliseconds to keep suppression active (default: 30 seconds)
 */
const usePaymentFlowCookieSuppression = (isActive = true, duration = 30000) => {
  useEffect(() => {
    if (!isActive) return;

    console.log('🔒 Activating cookie consent suppression for payment flow');
    sessionStorage.setItem('cookie-consent-suppressed', 'true');

    // Clean up suppression after the specified duration
    const cleanup = setTimeout(() => {
      console.log('🔓 Removing cookie consent suppression');
      sessionStorage.removeItem('cookie-consent-suppressed');
    }, duration);

    return () => {
      clearTimeout(cleanup);
      // Don't immediately remove suppression on component unmount
      // Let the timeout handle it to avoid premature showing during redirects
    };
  }, [isActive, duration]);

  // Return a function to manually clear suppression
  const clearSuppression = () => {
    console.log('🔓 Manually clearing cookie consent suppression');
    sessionStorage.removeItem('cookie-consent-suppressed');
  };

  return { clearSuppression };
};

export default usePaymentFlowCookieSuppression;
