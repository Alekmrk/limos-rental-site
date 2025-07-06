import LanguageSelector from "./LanguageSelector";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const PrimaryNav = ({ navHidden, screenSize, setNavHidden }) => {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [eventsDropdownOpen, setEventsDropdownOpen] = useState(false);
  const servicesDropdownRef = useRef(null);
  const eventsDropdownRef = useRef(null);

  const handleNavClick = () => {
    if (screenSize < 800) {
      setNavHidden(true);
    }
    setServicesDropdownOpen(false);
    setEventsDropdownOpen(false);
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
      className={`absolute z-10 rounded-[1rem] shadow-xl md:shadow-none top-20 left-4 md:h-full right-4 sm:w-96 sm:right-4 sm:left-auto py-8 text-center md:py-0 bg-warm-white/95 backdrop-blur-md border border-royal-blue/20 md:bg-transparent md:border-0 md:static md:w-auto md:left-auto md:right-auto ${
        navHidden && "hidden"
      }`}
    >
      <ul className="flex flex-col md:flex-row gap-12 md:gap-8 lg:gap-12 mb-8 md:mb-0 justify-center items-center">
        <li>
          <NavLink
            className="block text-gray-700 hover:text-royal-blue font-medium text-xl md:text-2xl transition-all duration-200 hover:bg-royal-blue/10 px-4 py-3 rounded-lg md:bg-transparent md:hover:bg-transparent md:px-2 md:py-1"
            to="/"
            onClick={handleNavClick}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className="block text-gray-700 hover:text-royal-blue font-medium text-xl md:text-2xl transition-all duration-200 hover:bg-royal-blue/10 px-4 py-3 rounded-lg md:bg-transparent md:hover:bg-transparent md:px-2 md:py-1"
            to="/vehicles"
            onClick={handleNavClick}
          >
            Vehicles
          </NavLink>
        </li>

        {/* Services Dropdown - CENTER ITEM */}
        <li className="relative" ref={servicesDropdownRef}>
          <button
            className="block text-gray-700 hover:text-royal-blue font-medium text-xl md:text-2xl transition-all duration-200 hover:bg-royal-blue/10 px-4 py-3 rounded-lg md:bg-transparent md:hover:bg-transparent md:px-2 md:py-1 inline-flex items-center gap-2"
            onClick={toggleServicesDropdown}
          >
            Services
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-base transition-transform ${
                servicesDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`${
              servicesDropdownOpen ? "block" : "hidden"
            } absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-warm-white/95 backdrop-blur-md border border-royal-blue/30 rounded-lg shadow-xl py-2 z-20`}
          >
            <NavLink
              to="/airport-transfer"
              className="block px-5 py-4 text-base text-gray-700 hover:text-royal-blue hover:bg-royal-blue/10 transition-all duration-200"
              onClick={handleNavClick}
            >
              Airport Transfer
            </NavLink>
            <NavLink
              to="/distance-transfer"
              className="block px-5 py-4 text-base text-gray-700 hover:text-royal-blue hover:bg-royal-blue/10 transition-all duration-200"
              onClick={handleNavClick}
            >
              Distance Transfer
            </NavLink>
            <NavLink
              to="/hourly-transfer"
              className="block px-5 py-4 text-base text-gray-700 hover:text-royal-blue hover:bg-royal-blue/10 transition-all duration-200"
              onClick={handleNavClick}
            >
              Hourly Service
            </NavLink>
            <NavLink
              to="/special-request"
              className="block px-5 py-4 text-base text-gray-700 hover:text-royal-blue hover:bg-royal-blue/10 transition-all duration-200"
              onClick={handleNavClick}
            >
              Special/Personalized Transfer
            </NavLink>
          </div>
        </li>

        {/* Events Dropdown */}
        <li className="relative" ref={eventsDropdownRef}>
          <button
            className="block text-gray-700 hover:text-royal-blue font-medium text-xl md:text-2xl transition-all duration-200 hover:bg-royal-blue/10 px-4 py-3 rounded-lg md:bg-transparent md:hover:bg-transparent md:px-2 md:py-1 inline-flex items-center gap-2"
            onClick={toggleEventsDropdown}
          >
            Events
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-base transition-transform ${
                eventsDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`${
              eventsDropdownOpen ? "block" : "hidden"
            } absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-warm-white/95 backdrop-blur-md border border-royal-blue/30 rounded-lg shadow-xl py-2 z-20`}
          >
            <div className="px-5 py-3 text-sm text-royal-blue uppercase tracking-wide font-medium">
              Premium Events
            </div>
            <NavLink
              to="/davos-forum"
              className="block px-5 py-4 text-base text-gray-700 hover:text-royal-blue hover:bg-royal-blue/10 transition-all duration-200"
              onClick={handleNavClick}
            >
              Davos Forum
            </NavLink>
          </div>
        </li>

        <li>
          <NavLink
            className="block text-gray-700 hover:text-royal-blue font-medium text-xl md:text-2xl transition-all duration-200 hover:bg-royal-blue/10 px-4 py-3 rounded-lg md:bg-transparent md:hover:bg-transparent md:px-2 md:py-1"
            to="/contact"
            onClick={handleNavClick}
          >
            Contact
          </NavLink>
        </li>
      </ul>

      {/* Language Selector temporarily hidden - see TODO */}
      {/* {screenSize < 800 && <LanguageSelector />} */}
    </nav>
  );
};

export default PrimaryNav;
