import { useEffect } from 'react';
import { DateTime } from 'luxon';
import useCookieConsent from '../../hooks/useCookieConsent';

const PrivacyPolicy = ({ scrollUp }) => {
  const { showSettings } = useCookieConsent();

  useEffect(() => {
    scrollUp();
  }, [scrollUp]);

  const lastUpdated = "June 18, 2025";

  return (
    <div className="container-default mt-28">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-semibold mb-8 text-center">
          <span className="text-gold">Privacy Policy</span>
        </h1>
        
        <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
          <p className="text-zinc-400 text-sm mb-8">
            Last updated: {lastUpdated}
          </p>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Introduction</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                Elite Way Limo ("we," "our," or "us") is committed to protecting your privacy and ensuring 
                the security of your personal information. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you visit our website or use our services.
              </p>
              <p>
                We operate in compliance with the Swiss Federal Act on Data Protection (FADP), the European 
                Union's General Data Protection Regulation (GDPR), and other applicable privacy laws.
              </p>
            </div>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-white mb-3">Personal Information You Provide</h3>
            <div className="text-zinc-300 space-y-4 mb-6">
              <p>We collect information you voluntarily provide when you:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Make a reservation or booking</li>
                <li>Contact us for customer service</li>
                <li>Subscribe to our newsletter</li>
                <li>Fill out forms on our website</li>
              </ul>
              <p>This may include:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Name and contact information (email, phone number)</li>
                <li>Pickup and drop-off locations</li>
                <li>Travel dates and times</li>
                <li>Special requests or requirements</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Flight information (for airport transfers)</li>
              </ul>
            </div>

            <h3 className="text-xl font-medium text-white mb-3">Information Automatically Collected</h3>
            <div className="text-zinc-300 space-y-4">
              <p>When you visit our website, we may automatically collect:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website information</li>
                <li>Location data (with your consent)</li>
              </ul>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">How We Use Your Information</h2>
            <div className="text-zinc-300 space-y-4">
              <p>We use your personal information for the following purposes:</p>
              
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30 mb-4">
                <h4 className="text-white font-medium mb-2">Service Provision (Legal Basis: Contract Performance)</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Processing and fulfilling your transportation bookings</li>
                  <li>Communicating with you about your reservations</li>
                  <li>Providing customer support</li>
                  <li>Processing payments</li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30 mb-4">
                <h4 className="text-white font-medium mb-2">Business Operations (Legal Basis: Legitimate Interest)</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Improving our services and website functionality</li>
                  <li>Analyzing usage patterns and preferences</li>
                  <li>Preventing fraud and ensuring security</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </div>

              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                <h4 className="text-white font-medium mb-2">Marketing (Legal Basis: Consent)</h4>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                  <li>Sending promotional emails (only with your consent)</li>
                  <li>Personalizing your website experience</li>
                  <li>Showing relevant advertisements</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Cookies and Tracking Technologies</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience. 
                You can manage your cookie preferences at any time.
              </p>

              {/* Cookie Management Button */}
              <div className="bg-gold/10 p-4 rounded-lg border border-gold/20 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-gold font-medium mb-2">🍪 Cookie Preferences</h4>
                    <p className="text-sm text-zinc-300">
                      Control which cookies you want to accept and manage your privacy settings.
                    </p>
                  </div>
                  <button
                    onClick={showSettings}
                    className="px-6 py-3 bg-gold text-black font-semibold hover:bg-gold/90 rounded-lg transition-all duration-200 whitespace-nowrap"
                  >
                    Manage Cookies
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                  <h4 className="text-white font-medium mb-2">Essential Cookies</h4>
                  <p className="text-sm">Required for website functionality, security, and user authentication.</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                  <h4 className="text-white font-medium mb-2">Analytics Cookies</h4>
                  <p className="text-sm">Help us understand website usage and improve user experience.</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                  <h4 className="text-white font-medium mb-2">Marketing Cookies</h4>
                  <p className="text-sm">Used for targeted advertising and measuring campaign effectiveness.</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                  <h4 className="text-white font-medium mb-2">Functional Cookies</h4>
                  <p className="text-sm">Enable enhanced features like language preferences and chat widgets.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">How We Share Your Information</h2>
            <div className="text-zinc-300 space-y-4">
              <p>We may share your information with:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Stripe (payment processing), Google Maps (location services), email service providers</li>
                <li><strong>Business Partners:</strong> Chauffeurs and transportation partners (only necessary booking details)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
              <p className="mt-4 font-medium text-white">
                We never sell your personal information to third parties for marketing purposes.
              </p>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Data Security</h2>
            <div className="text-zinc-300 space-y-4">
              <p>We implement appropriate security measures to protect your information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>SSL/TLS encryption for data transmission</li>
                <li>Secure payment processing through Stripe</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and employee training</li>
                <li>Data backup and recovery procedures</li>
              </ul>
              <p className="mt-4 text-yellow-400 text-sm">
                While we strive to protect your information, no method of transmission over the internet 
                or electronic storage is 100% secure.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Your Privacy Rights</h2>
            <div className="text-zinc-300 space-y-4">
              <p>Under GDPR and Swiss data protection law, you have the right to:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                  <h4 className="text-white font-medium mb-2">Access & Portability</h4>
                  <p className="text-sm">Request a copy of your personal data and receive it in a portable format.</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                  <h4 className="text-white font-medium mb-2">Rectification</h4>
                  <p className="text-sm">Correct inaccurate or incomplete personal information.</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                  <h4 className="text-white font-medium mb-2">Erasure</h4>
                  <p className="text-sm">Request deletion of your personal data (subject to legal requirements).</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                  <h4 className="text-white font-medium mb-2">Restriction & Objection</h4>
                  <p className="text-sm">Limit how we process your data or object to certain processing activities.</p>
                </div>
              </div>

              <div className="bg-gold/10 p-4 rounded-lg border border-gold/20 mt-6">
                <h4 className="text-gold font-medium mb-2">How to Exercise Your Rights</h4>
                <p className="text-sm">
                  Contact us at{' '}
                  <a href="mailto:info@elitewaylimo.ch" className="text-gold hover:underline">
                    info@elitewaylimo.ch
                  </a>
                  {' '}or use the contact information below. We will respond within 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Data Retention</h2>
            <div className="text-zinc-300 space-y-4">
              <p>We retain your personal information for as long as necessary to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide our services and fulfill contractual obligations</li>
                <li>Comply with legal, tax, and accounting requirements</li>
                <li>Resolve disputes and enforce our agreements</li>
              </ul>
              <p className="mt-4">
                <strong>Typical retention periods:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Booking information: 7 years (for tax and accounting purposes)</li>
                <li>Marketing communications: Until you unsubscribe</li>
                <li>Website analytics: 26 months (Google Analytics default)</li>
                <li>Customer support records: 3 years</li>
                <li>Cookie consent: 12 months (re-consent required annually)</li>
              </ul>
            </div>
          </section>

          {/* International Transfers */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">International Data Transfers</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                Some of our service providers may be located outside Switzerland and the EU. 
                When we transfer your data internationally, we ensure adequate protection through:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>European Commission adequacy decisions</li>
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Certification schemes and codes of conduct</li>
              </ul>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Children's Privacy</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                Our services are not directed to children under 16. We do not knowingly collect 
                personal information from children under 16. If you are a parent or guardian and 
                believe your child has provided us with personal information, please contact us 
                immediately.
              </p>
            </div>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Changes to This Privacy Policy</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any 
                material changes by posting the new Privacy Policy on this page and updating the 
                "Last updated" date. For significant changes, we may also send you an email notification.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Contact Us</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-700/30">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white font-medium mb-3">General Inquiries</h4>
                    <p className="text-sm space-y-1">
                      <strong>Email:</strong> info@elitewaylimo.ch<br />
                      <strong>Phone:</strong> +41 78 264 79 70<br />
                      <strong>Address:</strong> Switzerland
                    </p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-3">Privacy Officer</h4>
                    <p className="text-sm space-y-1">
                      <strong>Email:</strong> info@elitewaylimo.ch<br />
                      <strong>Subject:</strong> "Privacy Rights Request"<br />
                      <strong>Response Time:</strong> Within 30 days
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20 mt-4">
                <h4 className="text-yellow-400 font-medium mb-2">Supervisory Authority</h4>
                <p className="text-sm">
                  You have the right to lodge a complaint with the Swiss Federal Data Protection 
                  and Information Commissioner (FDPIC) if you believe we have not handled your 
                  personal data in accordance with applicable law.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;