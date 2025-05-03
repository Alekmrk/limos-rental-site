import LanguageSelector from "./LanguageSelector";
import { NavLink } from "react-router-dom";

const PrimaryNav = ({ navHidden, screenSize, setNavHidden }) => {
  const handleNavClick = () => {
    if (screenSize < 800) {
      setNavHidden(true);
    }
  };

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
        <li>
          <NavLink className="nav-link" to="/services" onClick={handleNavClick}>
            Services
          </NavLink>
        </li>
        <li>
          <a className="nav-link" href="#" onClick={handleNavClick}>
            Contact
          </a>
        </li>
      </ul>

      {screenSize < 800 && <LanguageSelector />}
    </nav>
  );
};

export default PrimaryNav;
