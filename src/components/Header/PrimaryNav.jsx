import LanguageSelector from "./LanguageSelector";
import { useUTMPreservation } from "../../hooks/useUTMPreservation";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const PrimaryNav = ({ navHidden, screenSize, setNavHidden }) => {
  const { navigateWithUTMs, buildURLWithUTMs } = useUTMPreservation();
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef(null);
  const eventsDropdownRef = useRef(null);

  const handleNavClick = (path) => {
    if (screenSize < 800) {
      setNavHidden(true);
    }
    setServicesDropdownOpen(false);
    setEventsDropdownOpen(false);
    
    if (path) {
      navigateWithUTMs(path);
    }
  };

  // Custom UTM-aware NavLink component
  const UTMNavLink = ({ to, className, children, onClick }) => {
    const isActive = window.location.pathname === to;
    const activeClassName = isActive ? 'text-royal-blue' : '';
    
    return (
      <button
        className={`${className} ${activeClassName}`}
        onClick={() => {
          handleNavClick(to);
          onClick && onClick();
        }}
      >
        {children}
      </button>
    );
  };

  const toggleServicesDropdown = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
    setEventsDropdownOpen(false); // Close events dropdown when opening services
  };

  const toggleEventsDropdown = () => {
    setEventsDropdownOpen(!eventsDropdownOpen);
    setServicesDropdownOpen(false); // Close services dropdown when opening events
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target)
      ) {
        setServicesDropdownOpen(false);
      }
      if (
        eventsDropdownRef.current &&
        !eventsDropdownRef.current.contains(event.target)
      ) {
        setEventsDropdownOpen(false);
      }
    };

    if (servicesDropdownOpen || eventsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [servicesDropdownOpen, eventsDropdownOpen]);

  return (
    <nav
      className={`absolute z-10 rounded-2xl shadow-xl md:shadow-none top-20 left-[5%] md:h-full right-[5%] w-[90%] md:w-auto py-6 md:py-0 text-center bg-warm-white/95 backdrop-blur-md border border-royal-blue/20 md:bg-transparent md:border-0 md:static md:left-auto md:right-auto max-h-[calc(100vh-6rem)] md:max-h-none overflow-y-auto md:overflow-visible transition-all duration-300 ${
        navHidden ? "hidden opacity-0 transform translate-y-[-10px]" : "block opacity-100 transform translate-y-0"
      }`}
    >
      <ul className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 justify-center items-center">
        <li>
          <UTMNavLink
            className="mobile-nav-item block text-gray-700 hover:text-royal-blue font-medium text-lg md:text-xl font-sans transition-all duration-300 hover:bg-royal-blue/10 px-4 py-4 rounded-xl md:bg-transparent md:hover:bg-transparent md:px-2 md:py-1 focus:outline-none focus:ring-2 focus:ring-royal-blue/30 w-full"
            to="/"
          >
            Home
          </UTMNavLink>
        </li>
        <li>
          <UTMNavLink
            className="mobile-nav-item block text-gray-700 hover:text-royal-blue font-medium text-lg md:text-xl font-sans transition-all duration-300 hover:bg-royal-blue/10 px-4 py-4 rounded-xl md:bg-transparent md:hover:bg-transparent md:px-2 md:py-1 focus:outline-none focus:ring-2 focus:ring-royal-blue/30 w-full"
            to="/booking"
          >
            Book Now
          </UTMNavLink>
        </li>
        <li>
          <UTMNavLink
            className="mobile-nav-item block text-gray-700 hover:text-royal-blue font-medium text-lg md:text-xl font-sans transition-all duration-300 hover:bg-royal-blue/10 px-4 py-4 rounded-xl md:bg-transparent md:hover:bg-transparent md:px-2 md:py-1 focus:outline-none focus:ring-2 focus:ring-royal-blue/30 w-full"
            to="/vehicles"
          >
            Vehicles
          </UTMNavLink>
        </li>

        {/* Services Dropdown - CENTER ITEM */}
        <li className="relative w-full md:w-auto" ref={servicesDropdownRef}>
          <button
            className="block text-gray-700 hover:text-royal-blue font-medium text-lg md:text-xl font-sans transition-all duration-200 hover:bg-royal-blue/10 px-4 py-4 rounded-lg md:bg-transparent md:hover:bg-transparent md:px-2 md:py-1 inline-flex items-center gap-2 w-full md:w-auto justify-center"
            onClick={toggleServicesDropdown}
          >
            Services
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-lg transition-transform ${
                servicesDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`${
              servicesDropdownOpen ? "block" : "hidden"
            } absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-warm-white border border-royal-blue/30 rounded-lg shadow-xl py-2 z-20`}
          >
            <UTMNavLink
              to="/airport-transfer"
              className="block px-5 py-4 text-base text-gray-700 hover:text-royal-blue hover:bg-royal-blue/10 font-sans transition-all duration-200 w-full"
            >
              Airport Transfer
            </UTMNavLink>
            <UTMNavLink
              to="/distance-transfer"
              className="block px-5 py-4 text-base text-gray-700 hover:text-royal-blue hover:bg-royal-blue/10 font-sans transition-all duration-200 w-full"
            >
              Distance Transfer
            </UTMNavLink>
            <UTMNavLink
              to="/hourly-transfer"
              className="block px-5 py-4 text-base text-gray-700 hover:text-royal-blue hover:bg-royal-blue/10 font-sans transition-all duration-200 w-full"
            >
              Hourly Service
            </UTMNavLink>
            <UTMNavLink
              to="/special-request"
              className="block px-5 py-4 text-base text-gray-700 hover:text-royal-blue hover:bg-royal-blue/10 font-sans transition-all duration-200 w-full"
            >
              Special/Personalized Transfer
            </UTMNavLink>
          </div>
        </li>

        {/* Events Dropdown */}
        <li className="relative w-full md:w-auto" ref={eventsDropdownRef}>
          <button
            className="block text-gray-700 hover:text-royal-blue font-medium text-lg md:text-xl font-sans transition-all duration-200 hover:bg-royal-blue/10 px-4 py-4 rounded-lg md:bg-transparent md:hover:bg-transparent md:px-2 md:py-1 inline-flex items-center gap-2 w-full md:w-auto justify-center"
            onClick={toggleEventsDropdown}
          >
            Events
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-lg transition-transform ${
                eventsDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`${
              eventsDropdownOpen ? "block" : "hidden"
            } absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-warm-white border border-royal-blue/30 rounded-lg shadow-xl py-2 z-20`}
          >
            <div className="px-5 py-3 text-sm text-royal-blue uppercase tracking-wide font-medium font-sans">
              Premium Events
            </div>
            <UTMNavLink
              to="/davos-forum"
              className="block px-5 py-4 text-base text-gray-700 hover:text-royal-blue hover:bg-royal-blue/10 font-sans transition-all duration-200 w-full"
            >
              Davos Forum
            </UTMNavLink>
          </div>
        </li>

        <li>
          <UTMNavLink
            className="block text-gray-700 hover:text-royal-blue font-medium text-lg md:text-xl font-sans transition-all duration-200 hover:bg-royal-blue/10 px-4 py-4 rounded-lg md:bg-transparent md:hover:bg-transparent md:px-2 md:py-1 w-full"
            to="/contact"
          >
            Contact
          </UTMNavLink>
        </li>
      </ul>

      {/* Language Selector temporarily hidden - see TODO */}
      {/* {screenSize < 800 && <LanguageSelector />} */}
    </nav>
  );
};

export default PrimaryNav;
