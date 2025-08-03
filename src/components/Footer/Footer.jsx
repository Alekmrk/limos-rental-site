import Image from "../../components/Image";
import logoFooter from "../../assets/elitewaylogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { UTMLink } from "../UTMLink";
import { useUTMPreservation } from "../../hooks/useUTMPreservation";
import { useState, useEffect } from "react";

const Footer = () => {
  const location = useLocation();
  const { navigateWithUTMs } = useUTMPreservation();
  const currentYear = new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(false);

  // Check if it's phone/mobile version
  useEffect(() => {
    const checkIfMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // Tailwind's md breakpoint
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Hide footer or make it basic for reservation flow pages
  const reservationFlowPages = [
    "/booking",
    "/vehicle-selection",
    "/customer-details",
    "/payment",
    "/payment-success",
    "/payment-cancel",
    "/thankyou",
    "/thankyouspecial"
  ];

  const isReservationFlow = reservationFlowPages.includes(location.pathname);

  const serviceLinks = [
    { name: "Airport Transfers", path: "/airport-transfer" },
    { name: "Distance Transfer", path: "/distance-transfer" },
    { name: "Hourly Service", path: "/hourly-transfer" },
    { name: "Special Requests", path: "/special-request" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "/terms-of-service" },
    { name: "Legal Notice", path: "/legal-notice" },
  ];

  const handleSocialClick = (platform) => {
    const phoneNumber = "+41782647970";
    const message = encodeURIComponent(
      "Hello! I'm interested in your luxury transportation services."
    );

    switch (platform) {
      case "whatsapp":
        window.open(
          `https://wa.me/${phoneNumber.replace("+", "")}?text=${message}`,
          "_blank"
        );
        break;
      case "telegram":
        window.open(`https://t.me/${phoneNumber.replace("+", "")}`, "_blank");
        break;
    }
  };

  // Basic footer for reservation flow pages - only on mobile
  if (isReservationFlow && isMobile) {
    return (
      <footer className="container-big bg-neutral-800 text-white rounded-[1.5rem] mt-8 mb-[2.5vw] py-8 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <Image
              src={logoFooter}
              alt="Elite Way Limo"
              className="w-20 mx-auto mb-4"
              imageType="logo"
              sizes="80px"
            />
            <p className="text-neutral-400 text-sm mb-4">
              &copy; {currentYear} Elite Way Limo. All rights reserved.
            </p>
            <p className="text-neutral-500 text-xs">
              Professional chauffeur service in Switzerland
            </p>
          </div>
        </div>
      </footer>
    );
  }

  // Regular footer for desktop reservation pages and all other pages
  return (
    <footer className={`container-big bg-gradient-to-br from-cream-light to-darker-cream rounded-[1.5rem] ${isReservationFlow ? 'mt-8' : 'mt-20'} mb-[2.5vw] py-12 px-8 md:px-20 border border-royal-blue/20 shadow-lg`}>
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-center md:text-left">
          {/* Company Info */}
          <div className="md:col-span-1">
            <img
              className="w-28 mb-6 mx-auto md:mx-0"
              src={logoFooter}
              alt="Elite Way Limo"
            />
            <p className="text-gray-600 text-sm mb-4">
              Premium chauffeur service in Switzerland. Professional, reliable,
              and luxurious transportation.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="text-royal-blue font-medium">Phone:</span> +41 78 264 79 70
              </p>
              <p className="text-gray-700">
                <span className="text-royal-blue font-medium">Email:</span> info@elitewaylimo.ch
              </p>
              <p className="text-gray-700">
                <span className="text-royal-blue font-medium">Location:</span> Zurich, Switzerland
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-medium text-royal-blue-dark mb-4">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((service, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigateWithUTMs(service.path)}
                    className="text-gray-600 hover:text-royal-blue transition-colors text-sm text-left"
                  >
                    {service.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-medium text-royal-blue-dark mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigateWithUTMs(link.path)}
                    className="text-gray-600 hover:text-royal-blue transition-colors text-sm text-left"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-medium text-royal-blue-dark mb-4">Connect</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <UTMLink
                  to="/contact"
                  className="text-gray-600 hover:text-royal-blue transition-colors text-sm"
                >
                  Contact Us
                </UTMLink>
              </li>
            </ul>
            <div className="flex gap-3 justify-center md:justify-start">
              <button
                onClick={() => handleSocialClick("whatsapp")}
                className="w-10 h-10 bg-warm-gray hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors group border border-royal-blue/20"
                aria-label="WhatsApp"
              >
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="text-lg group-hover:scale-110 transition-transform text-gray-700 group-hover:text-white"
                />
              </button>
              <UTMLink
                to="/contact"
                className="w-10 h-10 bg-warm-gray hover:bg-royal-blue rounded-lg flex items-center justify-center transition-colors group border border-royal-blue/20"
                aria-label="Contact"
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-lg group-hover:scale-110 transition-transform text-gray-700 group-hover:text-white"
                />
              </UTMLink>
              <button
                onClick={() => handleSocialClick("telegram")}
                className="w-10 h-10 bg-warm-gray hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors group border border-royal-blue/20"
                aria-label="Telegram"
              >
                <FontAwesomeIcon
                  icon={faTelegram}
                  className="text-lg group-hover:scale-110 transition-transform text-gray-700 group-hover:text-white"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-royal-blue/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-gray-600 text-sm">
              &copy; {currentYear} Elite Way Limo. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs">
              Professional chauffeur service in Switzerland
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
