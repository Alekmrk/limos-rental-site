import React from 'react';
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactChannels = ({ className = "", position = "fixed" }) => {
  const whatsappNumber = "+41782647970";
  const phoneNumber = "+41782647970";
  const email = "info@elitewaylimo.com";

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello! I'm interested in your luxury transportation services. Could you please provide more information?");
    window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${email}?subject= Luxury Transportation Service Inquiry`;
  };

  if (position === "fixed") {
    return (
      <div className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 ${className}`}>
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          title="Chat on WhatsApp"
        >
          <FaWhatsapp className="text-2xl" />
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chat on WhatsApp
          </span>
        </button>

        {/* Phone Button */}
        <button
          onClick={handlePhoneClick}
          className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          title="Call Us"
        >
          <FaPhone className="text-xl" />
          <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Call {phoneNumber}
          </span>
        </button>
      </div>
    );
  }

  // Inline version for header or footer
  return (
    <div className={`flex gap-4 ${className}`}>
      <button
        onClick={handleWhatsAppClick}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
      >
        <FaWhatsapp className="text-lg" />
        <span className="hidden sm:inline">WhatsApp</span>
      </button>
      
      <button
        onClick={handlePhoneClick}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
      >
        <FaPhone className="text-sm" />
        <span className="hidden sm:inline">{phoneNumber}</span>
      </button>

      <button
        onClick={handleEmailClick}
        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
      >
        <FaEnvelope className="text-sm" />
        <span className="hidden sm:inline">Email</span>
      </button>
    </div>
  );
};

export default ContactChannels;