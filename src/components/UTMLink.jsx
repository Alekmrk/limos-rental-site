import React from 'react';
import { Link } from 'react-router-dom';
import { useUTMPreservation } from '../hooks/useUTMPreservation';

/**
 * UTM-aware Link component that automatically preserves UTM parameters
 * Use this instead of regular Link components to maintain UTM tracking
 * 
 * Example:
 * <UTMLink to="/booking">Book Now</UTMLink>
 * 
 * If current URL has UTMs: /?utm_source=google&utm_medium=cpc
 * The link will automatically become: /booking?utm_source=google&utm_medium=cpc
 */
export const UTMLink = ({ to, children, className, ...props }) => {
  const { buildURLWithUTMs } = useUTMPreservation();
  
  // Build URL with UTMs preserved
  const href = buildURLWithUTMs(to);
  
  return (
    <Link to={href} className={className} {...props}>
      {children}
    </Link>
  );
};

/**
 * UTM-aware button component that navigates with preserved UTMs
 * Use this for buttons that need to navigate while preserving UTMs
 * 
 * Example:
 * <UTMButton to="/contact" className="btn-primary">Contact Us</UTMButton>
 */
export const UTMButton = ({ to, children, className, onClick, ...props }) => {
  const { navigateWithUTMs } = useUTMPreservation();
  
  const handleClick = (e) => {
    e.preventDefault();
    
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }
    
    // Navigate with UTMs preserved
    navigateWithUTMs(to);
  };
  
  return (
    <button className={className} onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

export default UTMLink;
