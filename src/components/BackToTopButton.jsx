import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

const BackToTopButton = ({ scrollUp }) => {
  const [bttVisible, setBttVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setBttVisible(true);
      else setBttVisible(false);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Don't render the button at all when not visible
  if (!bttVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollUp}
      className="fixed mobile-touch-target bg-royal-blue/90 hover:bg-royal-blue w-14 h-14 rounded-full bottom-6 right-6 z-50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/20 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-royal-blue/50 focus:ring-offset-2 animate-fadeInUp"
      aria-label="Back to top"
    >
      <FontAwesomeIcon icon={faArrowUp} className="text-white text-lg" />
    </button>
  );
};

export default BackToTopButton;
