import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaWhatsapp, FaPhone, FaEnvelope, FaTimes } from 'react-icons/fa';

const ContactChannels = ({ className = "", position = "fixed" }) => {
  const whatsappNumber = "+41782647970";
  const phoneNumber = "+41782647970";
  const email = "info@elitewaylimo.ch";
  const location = useLocation();
  
  // State for confirmation popup
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');
  const [confirmationData, setConfirmationData] = useState({});

  // Hide floating badges during reservation flow
  const isReservationFlow = [
    '/booking',
    '/vehicle-selection', 
    '/customer-details', 
    '/payment', 
    '/payment-success', 
    '/payment-cancel',
    '/thankyou'
  ].includes(location.pathname);

  const handleWhatsAppClick = () => {
    if (position === "fixed") {
      setConfirmationType('whatsapp');
      setConfirmationData({
        title: 'Open WhatsApp',
        message: 'This will open WhatsApp to start a chat with our luxury transportation team.',
        action: () => {
          const message = encodeURIComponent("Hello! I'm interested in your luxury transportation services. Could you please provide more information?");
          window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
        }
      });
      setShowConfirmation(true);
    } else {
      // Direct action for inline version
      const message = encodeURIComponent("Hello! I'm interested in your luxury transportation services. Could you please provide more information?");
      window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${message}`, '_blank');
    }
  };

  const handlePhoneClick = () => {
    if (position === "fixed") {
      setConfirmationType('phone');
      setConfirmationData({
        title: 'Call Us',
        message: `This will call our 24/7 support line: ${phoneNumber}`,
        action: () => {
          window.location.href = `tel:${phoneNumber}`;
        }
      });
      setShowConfirmation(true);
    } else {
      // Direct action for inline version
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleEmailClick = () => {
    if (position === "fixed") {
      setConfirmationType('email');
      setConfirmationData({
        title: 'Send Email',
        message: `This will open your email client to send a message to: ${email}`,
        action: () => {
          window.location.href = `mailto:${email}?subject=Luxury Transportation Service Inquiry`;
        }
      });
      setShowConfirmation(true);
    } else {
      // Direct action for inline version
      window.location.href = `mailto:${email}?subject=Luxury Transportation Service Inquiry`;
    }
  };

  const handleConfirm = () => {
    confirmationData.action();
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  // Don't render floating badges during reservation flow
  if (position === "fixed" && isReservationFlow) {
    return null;
  }

  if (position === "fixed") {
    return (
      <>
        <div className={`fixed bottom-6 right-6 z-50 flex flex-col gap-3 ${className}`}>
          {/* WhatsApp Button */}
          <div className="relative group">
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              title="Chat on WhatsApp"
            >
              <FaWhatsapp className="text-2xl" />
            </button>
            <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              Chat on WhatsApp
            </span>
          </div>

          {/* Phone Button */}
          <div className="relative group">
            <button
              onClick={handlePhoneClick}
              className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              title="Call Us"
            >
              <FaPhone className="text-xl" />
            </button>
            <span className="absolute right-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              Call {phoneNumber}
            </span>
          </div>
        </div>

        {/* Confirmation Popup */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-zinc-800 rounded-lg border border-zinc-700/50 p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {confirmationData.title}
                </h3>
                <button
                  onClick={handleCancel}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-zinc-300 mb-6">
                {confirmationData.message}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                    confirmationType === 'whatsapp' 
                      ? 'bg-green-500 hover:bg-green-600'
                      : confirmationType === 'phone'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-zinc-600 hover:bg-zinc-500'
                  }`}
                >
                  {confirmationType === 'whatsapp' && <FaWhatsapp className="inline mr-2" />}
                  {confirmationType === 'phone' && <FaPhone className="inline mr-2" />}
                  {confirmationType === 'email' && <FaEnvelope className="inline mr-2" />}
                  {confirmationType === 'whatsapp' ? 'Open WhatsApp' : 
                   confirmationType === 'phone' ? 'Call Now' : 'Send Email'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
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