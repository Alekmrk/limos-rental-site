import logoFooter from "../../assets/elitewaylogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faTelegram } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const serviceLinks = [
    { name: "Airport Transfers", path: "/airport-transfer" },
    { name: "Distance Transfer", path: "/distance-transfer" },
    { name: "Hourly Service", path: "/hourly-transfer" },
    { name: "Special Requests", path: "/special-request" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Service", path: "#" },
    { name: "Legal Notice", path: "#" },
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
      case "instagram":
        window.open("https://instagram.com/elitewaylimo", "_blank");
        break;
      case "telegram":
        window.open(`https://t.me/${phoneNumber.replace("+", "")}`, "_blank");
        break;
    }
  };

  return (
    <footer className="container-big bg-neutral-800 text-white rounded-[1.5rem] mt-20 mb-[2.5vw] py-12 px-8 md:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <img
              className="w-28 mb-6"
              src={logoFooter}
              alt="Elite Way Limo"
            />
            <p className="text-neutral-400 text-sm mb-4">
              Premium chauffeur service in Switzerland. Professional, reliable,
              and luxurious transportation.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-neutral-300">
                <span className="text-gold">Phone:</span> +41 78 264 79 70
              </p>
              <p className="text-neutral-300">
                <span className="text-gold">Email:</span> info@elitewaylimo.ch
              </p>
              <p className="text-neutral-300">
                <span className="text-gold">Location:</span> Zurich, Switzerland
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-medium text-gold mb-4">Services</h3>
            <ul className="space-y-2">
              {serviceLinks.map((service, index) => (
                <li key={index}>
                  <a
                    href={service.path}
                    className="text-neutral-400 hover:text-gold transition-colors text-sm"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-medium text-gold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="text-neutral-400 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-lg font-medium text-gold mb-4">Connect</h3>
            <p className="text-neutral-400 text-sm mb-4">
              Stay connected for updates and exclusive offers.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleSocialClick("whatsapp")}
                className="w-10 h-10 bg-neutral-700 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="WhatsApp"
              >
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="text-lg group-hover:scale-110 transition-transform"
                />
              </button>
              <button
                onClick={() => handleSocialClick("instagram")}
                className="w-10 h-10 bg-neutral-700 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Instagram"
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-lg group-hover:scale-110 transition-transform"
                />
              </button>
              <button
                onClick={() => handleSocialClick("telegram")}
                className="w-10 h-10 bg-neutral-700 hover:bg-blue-500 rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Telegram"
              >
                <FontAwesomeIcon
                  icon={faTelegram}
                  className="text-lg group-hover:scale-110 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              &copy; {currentYear} Elite Way Limo. All rights reserved.
            </p>
            <p className="text-neutral-500 text-xs">
              Professional chauffeur service in Switzerland
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
