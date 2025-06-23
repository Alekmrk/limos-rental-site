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
      className={`absolute z-10 rounded-[1rem] shadow-default md:shadow-none top-20 left-4 md:h-full right-4 sm:w-96 sm:right-4 sm:left-auto py-8 text-center md:py-0 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 md:bg-transparent md:border-0 md:static ${
        navHidden && "hidden"
      }`}
    >
      <ul className="flex flex-col md:flex-row gap-12 md:gap-8 lg:gap-12 mb-8 md:mb-0 justify-center">
        <li>
          <NavLink className="nav-link" to="/" onClick={handleNavClick}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink className="nav-link" to="/vehicles" onClick={handleNavClick}>
            Vehicles
          </NavLink>
        </li>

        {/* Services Dropdown */}
        <li className="relative" ref={servicesDropdownRef}>
          <button
            className="nav-link inline-flex items-center gap-2"
            onClick={toggleServicesDropdown}
          >
            Services
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-sm transition-transform ${
                servicesDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`${
              servicesDropdownOpen ? "block" : "hidden"
            } absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg py-2 z-20`}
          >
            <NavLink
              to="/services"
              className="block px-4 py-3 text-sm text-zinc-300 hover:text-gold hover:bg-zinc-800/50 transition-colors font-medium"
              onClick={handleNavClick}
            >
              All Services
            </NavLink>
            <div className="px-4 py-2">
              <div className="border-t border-zinc-700/50"></div>
            </div>
            <NavLink
              to="/airport-transfer"
              className="block px-4 py-3 text-sm text-zinc-300 hover:text-gold hover:bg-zinc-800/50 transition-colors"
              onClick={handleNavClick}
            >
              Airport Transfer
            </NavLink>
            <NavLink
              to="/distance-transfer"
              className="block px-4 py-3 text-sm text-zinc-300 hover:text-gold hover:bg-zinc-800/50 transition-colors"
              onClick={handleNavClick}
            >
              Distance Transfer
            </NavLink>
            <NavLink
              to="/hourly-transfer"
              className="block px-4 py-3 text-sm text-zinc-300 hover:text-gold hover:bg-zinc-800/50 transition-colors"
              onClick={handleNavClick}
            >
              Hourly Transfer
            </NavLink>
            <NavLink
              to="/services/special-transfer"
              className="block px-4 py-3 text-sm text-zinc-300 hover:text-gold hover:bg-zinc-800/50 transition-colors"
              onClick={handleNavClick}
            >
              Special/Personalized Transfer
            </NavLink>
          </div>
        </li>

        {/* Events Dropdown */}
        <li className="relative" ref={eventsDropdownRef}>
          <button
            className="nav-link inline-flex items-center gap-2"
            onClick={toggleEventsDropdown}
          >
            Events
            <FontAwesomeIcon
              icon={faChevronDown}
              className={`text-sm transition-transform ${
                eventsDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`${
              eventsDropdownOpen ? "block" : "hidden"
            } absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg py-2 z-20`}
          >
            <div className="px-4 py-2 text-xs text-zinc-500 uppercase tracking-wide">
              Premium Events
            </div>
            <NavLink
              to="/davos-forum"
              className="block px-4 py-3 text-sm text-zinc-300 hover:text-gold hover:bg-zinc-800/50 transition-colors"
              onClick={handleNavClick}
            >
              Davos Forum
            </NavLink>
          </div>
        </li>

        <li>
          <NavLink className="nav-link" to="/contact" onClick={handleNavClick}>
            Contact
          </NavLink>
        </li>
      </ul>

      {screenSize < 800 && <LanguageSelector />}
    </nav>
  );
};

export default PrimaryNav;
