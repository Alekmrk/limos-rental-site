import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const UTM_PARAMS = [
  'utm_source',
  'utm_medium', 
  'utm_campaign',
  'utm_term',
  'utm_content',
  'utm_id'  // Added for Google Ads
];

/**
 * Hook for preserving UTM parameters across navigation
 * Use this throughout your app to maintain UTM parameters in URLs
 */
export const useUTMPreservation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get current UTMs from URL
  const getCurrentUTMs = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    const utms = {};
    
    UTM_PARAMS.forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        utms[param] = value;
      }
    });
    
    return Object.keys(utms).length > 0 ? utms : null;
  }, [location.search]);

  // Navigate while preserving UTMs
  const navigateWithUTMs = useCallback((path, options = {}) => {
    const currentUTMs = getCurrentUTMs();
    
    if (currentUTMs) {
      const utmParams = new URLSearchParams();
      Object.entries(currentUTMs).forEach(([key, value]) => {
        if (value && UTM_PARAMS.includes(key)) {
          utmParams.set(key, value);
        }
      });
      
      const separator = path.includes('?') ? '&' : '?';
      const urlWithUTMs = `${path}${separator}${utmParams.toString()}`;
      console.log('🔗 Navigating with UTMs preserved:', urlWithUTMs);
      navigate(urlWithUTMs, options);
    } else {
      console.log('🔗 Navigating without UTMs:', path);
      navigate(path, options);
    }
  }, [navigate, getCurrentUTMs]);

  // Build URL with UTMs for Link components
  const buildURLWithUTMs = useCallback((path) => {
    const currentUTMs = getCurrentUTMs();
    
    if (currentUTMs) {
      const utmParams = new URLSearchParams();
      Object.entries(currentUTMs).forEach(([key, value]) => {
        if (value && UTM_PARAMS.includes(key)) {
          utmParams.set(key, value);
        }
      });
      
      const separator = path.includes('?') ? '&' : '?';
      return `${path}${separator}${utmParams.toString()}`;
    }
    
    return path;
  }, [getCurrentUTMs]);

  return {
    currentUTMs: getCurrentUTMs(),
    navigateWithUTMs,
    buildURLWithUTMs,
    hasUTMs: getCurrentUTMs() !== null
  };
};

export default useUTMPreservation;
