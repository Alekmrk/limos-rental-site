import LanguageSelector from "./LanguageSelector";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const PrimaryNav = ({ navHidden, screenSize, setNavHidden }) => {
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleNavClick = () => {
    if (screenSize < 800) {
      setNavHidden(true);
    }
    setServicesDropdownOpen(false);
  };

  const toggleServicesDropdown = () => {
    setServicesDropdownOpen(!servicesDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesDropdownOpen(false);
      }
    };

    if (servicesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [servicesDropdownOpen]);

  return (
    <nav
      className={`absolute z-10 rounded-[1rem] shadow-default md:shadow-none top-20 left-4 md:h-full right-4 sm:w-96 sm:right-4 sm:left-auto py-8 text-center md:py-0 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 md:bg-transparent md:border-0 md:static ${
        navHidden && "hidden"
      }`}
    >
      <ul className="flex flex-col md:flex-row gap-16 mb-8 md:mb-0 justify-center">
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
        <li className="relative" ref={dropdownRef}>
          <button
            className="nav-link inline-flex items-center gap-2 ml-4"
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

          {/* Services Dropdown */}
          <div
            className={`${
              servicesDropdownOpen ? "block" : "hidden"
            } absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-64 bg-zinc-900/95 backdrop-blur-sm border border-zinc-700/50 rounded-lg shadow-lg py-2 z-20`}
          >
            <NavLink
              to="/services"
              className="block px-4 py-3 text-sm text-zinc-300 hover:text-gold hover:bg-zinc-800/50 transition-colors"
              onClick={handleNavClick}
            >
              All Services
            </NavLink>
            <NavLink
              to="/airport-transfer"
              className="block px-4 py-3 text-sm text-zinc-300 hover:text-gold hover:bg-zinc-800/50 transition-colors"
              onClick={handleNavClick}
            >
              Airport Transfer
            </NavLink>
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
