import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faMapMarkerAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook, faLinkedin, faTwitter } from "@fortawesome/free-brands-svg-icons";
import Button from "../../components/Button";

const Contact = ({ scrollUp }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    scrollUp();
  }, [scrollUp]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Here you would typically send the data to your backend
      // For now, we'll simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: faPhone,
      title: "Phone",
      content: "+41 78 264 79 70",
      link: "tel:+41782647970"
    },
    {
      icon: faEnvelope,
      title: "Email",
      content: "info@elitewaylimo.ch",
      link: "mailto:info@elitewaylimo.ch"
    },
    {
      icon: faMapMarkerAlt,
      title: "Location",
      content: "Zurich, Switzerland",
      link: null
    },
    {
      icon: faClock,
      title: "Hours",
      content: "24/7 Available",
      link: null
    }
  ];

  const socialLinks = [
    {
      icon: faInstagram,
      name: "Instagram",
      url: "#",
      color: "text-pink-500"
    },
    {
      icon: faFacebook,
      name: "Facebook", 
      url: "#",
      color: "text-blue-600"
    },
    {
      icon: faLinkedin,
      name: "LinkedIn",
      url: "#",
      color: "text-blue-500"
    },
    {
      icon: faTwitter,
      name: "Twitter",
      url: "#",
      color: "text-blue-400"
    }
  ];

  return (
    <div className="container-default mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-semibold mb-6">
            <span className="text-gold">Contact</span> Us
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Get in touch with our team for any questions about our premium chauffeur services. 
            We're here to make your luxury travel experience unforgettable.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
            <h2 className="text-3xl font-semibold mb-6 text-gold">Send us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
                <p className="text-green-400">Thank you! Your message has been sent successfully.</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400">Sorry, there was an error sending your message. Please try again.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-zinc-800/30 rounded-lg py-3 px-4 w-full border border-zinc-700/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-zinc-800/30 rounded-lg py-3 px-4 w-full border border-zinc-700/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-zinc-800/30 rounded-lg py-3 px-4 w-full border border-zinc-700/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                    placeholder="+41 XX XXX XX XX"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="bg-zinc-800/30 rounded-lg py-3 px-4 w-full border border-zinc-700/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200"
                  >
                    <option value="">Select a subject</option>
                    <option value="booking">New Booking Inquiry</option>
                    <option value="quote">Request a Quote</option>
                    <option value="support">Customer Support</option>
                    <option value="partnership">Business Partnership</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className="bg-zinc-800/30 rounded-lg py-3 px-4 w-full border border-zinc-700/50 focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20 transition-all duration-200 resize-vertical"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
              <h2 className="text-3xl font-semibold mb-6 text-gold">Get in Touch</h2>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={item.icon} className="text-gold text-lg" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">{item.title}</h3>
                      {item.link ? (
                        <a 
                          href={item.link} 
                          className="text-zinc-300 hover:text-gold transition-colors"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-zinc-300">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
              <h3 className="text-2xl font-semibold mb-6 text-gold">Follow Us</h3>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`w-12 h-12 bg-zinc-700/50 rounded-lg flex items-center justify-center hover:bg-zinc-600/50 transition-all duration-200 group ${social.color}`}
                    aria-label={social.name}
                  >
                    <FontAwesomeIcon 
                      icon={social.icon} 
                      className="text-lg group-hover:scale-110 transition-transform" 
                    />
                  </a>
                ))}
              </div>
              <p className="text-zinc-400 text-sm mt-4">
                Stay connected for exclusive offers and luxury travel inspiration.
              </p>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-br from-gold/20 to-gold/5 p-8 rounded-lg border border-gold/20">
              <h3 className="text-2xl font-semibold mb-4 text-gold">Need Immediate Assistance?</h3>
              <p className="text-zinc-300 mb-6">
                For urgent bookings or immediate support, call us directly. Our team is available 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="secondary"
                  onClick={() => window.location.href = 'tel:+41782647970'}
                  className="flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faPhone} />
                  Call Now
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:info@elitewaylimo.ch'}
                  className="flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email Us
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
          <h2 className="text-3xl font-semibold mb-8 text-center text-gold">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-white mb-2">How far in advance should I book?</h3>
                <p className="text-zinc-400 text-sm">We recommend booking at least 3 hours in advance for regular transfers. For special events or peak seasons, booking 24-48 hours ahead is preferred.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Do you provide child seats?</h3>
                <p className="text-zinc-400 text-sm">Yes, we provide child and baby seats free of charge. Please specify your requirements when booking.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">What payment methods do you accept?</h3>
                <p className="text-zinc-400 text-sm">We accept credit cards (Visa, Mastercard, American Express) and cryptocurrency (USDT) for your convenience.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-white mb-2">Can I modify or cancel my booking?</h3>
                <p className="text-zinc-400 text-sm">Yes, you can modify or cancel your booking. Please contact us at least 2 hours before your scheduled pickup time.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Do you operate outside Switzerland?</h3>
                <p className="text-zinc-400 text-sm">Our primary service area is Switzerland, but we can arrange special transfers to neighboring countries upon request.</p>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Are your vehicles insured?</h3>
                <p className="text-zinc-400 text-sm">Yes, all our vehicles are fully insured and regularly maintained to the highest standards for your safety and comfort.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;