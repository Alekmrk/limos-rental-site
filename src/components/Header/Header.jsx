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
      className={`py-3 fixed z-[100] bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800 left-0 right-0 top-0 ${
        shadowVisible && "shadow-default"
      }`}
    >
      <div className="container-big flex justify-between">
        <a href="/">
          <Image
            src={logo}
            alt="Elite Way Limo"
            className="w-28"
            imageType="logo"
            priority={true}
            sizes="112px"
          />
        </a>
        <PrimaryNav
          screenSize={screenSize}
          navHidden={navHidden}
          setNavHidden={setNavHidden}
        />

        {screenSize >= screenMd && <LanguageSelector />}

        {screenSize < screenMd && (
          <button onClick={() => setNavHidden(!navHidden)} className="text-lg">
            <FontAwesomeIcon
              icon={navHidden ? faBars : faXmark}
              style={{ color: "#ffffff" }}
            />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
