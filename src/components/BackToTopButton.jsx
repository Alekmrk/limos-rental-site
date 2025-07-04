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
      className="fixed bg-neutral-900 w-12 transition-all duration-200 h-12 text-lg rounded-full p-2 bottom-4 left-4 z-50 hover:bg-neutral-800"
    >
      <FontAwesomeIcon icon={faArrowUp} style={{ color: "#fff" }} />
    </button>
  );
};

export default BackToTopButton;
