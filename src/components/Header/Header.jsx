import Image from "../../components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import PrimaryNav from "./PrimaryNav";
import LanguageSelector from "./LanguageSelector";
import logo from "../../assets/elitewaylogo.png";

const Header = () => {
  const screenMd = 800;

  // shodow for header only when the page is a bit scrolled down
  const [shadowVisible, setShadowVisible] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) setShadowVisible(true);
      else setShadowVisible(false);
    });
  }, []);

  // state for knowing when the navigation bar is hidden or not(for mobile)
  const [navHidden, setNavHidden] = useState(true);

  // state for the width of the screen
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  // setting the screen size every time the window is resized
  useEffect(() => {
    window.addEventListener("resize", () => setScreenSize(window.innerWidth));
  }, []);

  // always showing the navigation once the desktop size is reached because there's enough space on the page
  useEffect(() => {
    if (screenSize >= screenMd) setNavHidden(false);
    else setNavHidden(true);
  }, [screenSize]);

  return (
    <header
      className={`py-3 fixed z-[100] bg-cream/95 backdrop-blur-sm border-b border-royal-blue/20 left-0 right-0 top-0 ${
        shadowVisible && "shadow-default"
      }`}
    >
      <div className="container-big flex items-center">
        <a href="/" className="flex-shrink-0">
          <Image
            src={logo}
            alt="Elite Way Limo"
            className="w-36 m-0"
            imageType="logo"
            priority={true}
            sizes="144px"
          />
        </a>

        <div className="flex-1 flex justify-center">
          <PrimaryNav
            screenSize={screenSize}
            navHidden={navHidden}
            setNavHidden={setNavHidden}
          />
        </div>

        <div className="flex-shrink-0 w-36 flex justify-end">
          {/* Language Selector temporarily hidden - see TODO */}
          {/* {screenSize >= screenMd && <LanguageSelector />} */}

          {screenSize < screenMd && (
            <button
              onClick={() => setNavHidden(!navHidden)}
              className="flex items-center justify-center w-12 h-12 rounded-lg bg-royal-blue/10 hover:bg-royal-blue/20 transition-all duration-200 text-2xl border border-royal-blue/20"
            >
              <FontAwesomeIcon
                icon={navHidden ? faBars : faXmark}
                style={{ color: "#4169E1" }}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
