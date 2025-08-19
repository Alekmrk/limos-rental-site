import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const BackToTopButton = ({ scrollUp }) => {
  const [bttVisible, setBttVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Only consider showing button if we've scrolled down enough
      const shouldShow = window.scrollY > 200;
      
      if (!shouldShow) {
        setBttVisible(false);
        setIsScrolling(false);
        // Clear any pending timeouts
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        return;
      }

      // User is scrolling
      setIsScrolling(true);
      setBttVisible(false); // Hide button while scrolling

      // Clear existing timeouts
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Show button after user stops scrolling (300ms delay)
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        setBttVisible(true);

        // Auto-hide after 3 seconds
        hideTimeoutRef.current = setTimeout(() => {
          setBttVisible(false);
        }, 3000);
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listeners and timeouts on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Handle button click - show button briefly after scroll
  const handleClick = () => {
    scrollUp();
    
    // Clear hide timeout and show button briefly after scrolling to top
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    // Keep button visible for a short time after clicking
    hideTimeoutRef.current = setTimeout(() => {
      setBttVisible(false);
    }, 1000);
  };

  // Don't render the button at all when not visible
  if (!bttVisible) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      className="fixed mobile-touch-target bg-primary-gold/90 hover:bg-primary-gold w-14 h-14 rounded-full bottom-6 left-6 z-50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-gold/50 focus:ring-offset-2 animate-fadeInUp"
      aria-label="Back to top"
    >
      <FontAwesomeIcon icon={faArrowUp} className="text-white text-lg" />
    </button>
  );
};

export default BackToTopButton;
