import LanguageSelector from "./LanguageSelector";
import { NavLink } from "react-router-dom";

const PrimaryNav = ({ navHidden, screenSize }) => {
  return (
    <nav
      className={`absolute z-10 rounded-[1rem] shadow-default md:shadow-none top-20 left-4 md:h-full right-4 sm:w-96 sm:right-4 sm:left-auto py-8 text-center md:py-0 bg-zinc-900/95 backdrop-blur-sm border border-zinc-800 md:bg-transparent md:border-0 md:static ${
        navHidden && "hidden"
      }`}
    >
      <ul className="flex flex-col md:flex-row gap-16 mb-8 md:mb-0 justify-center">
        <li className="">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>
        </li>
        <li className="">
          <NavLink className="nav-link" to="/vehicles">
            Vehicles
          </NavLink>
        </li>
        <li className="">
          <NavLink className="nav-link" to="/services">
            Services
          </NavLink>
        </li>
        <li className="">
          <a className="nav-link" href="#">
            Contact
          </a>
        </li>
      </ul>

      {/* Language Selector changes its place from header to nav bar at smaller screen sizes */}
      {screenSize < 800 && <LanguageSelector />}
    </nav>
  );
};

export default PrimaryNav;
