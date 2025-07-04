import { useEffect } from 'react';

const LegalNotice = ({ scrollUp }) => {
  useEffect(() => {
    scrollUp();
  }, [scrollUp]);

  const lastUpdated = "June 30, 2025";

  return (
    <div className="container-default mt-28">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-semibold mb-8 text-center">
          <span className="text-gold">Legal Notice</span>
        </h1>
        
        <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
          <p className="text-zinc-400 text-sm mb-8">
            Last updated: {lastUpdated}
          </p>

          {/* Company Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Company Information</h2>
            <div className="text-zinc-300 space-y-4">
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-700/30">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-white font-medium mb-3">Business Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Company Name:</strong> Elite Way Limo</p>
                      <p><strong>Business Type:</strong> Luxury Transportation Services</p>
                      <p><strong>Country of Operation:</strong> Switzerland</p>
                      <p><strong>Primary Location:</strong> Zurich, Switzerland</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> info@elitewaylimo.ch</p>
                      <p><strong>Phone:</strong> +41 78 264 79 70</p>
                      <p><strong>Website:</strong> elitewaylimo.ch</p>
                      <p><strong>Service Hours:</strong> 24/7 Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Licenses */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Professional Licenses and Compliance</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                Elite Way Limo operates in full compliance with Swiss transportation regulations and holds all necessary permits for commercial passenger transportation services.
              </p>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                <h3 className="text-white font-medium mb-3">Regulatory Compliance</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Swiss Federal Act on Road Transport (SVG)</li>
                  <li>Ordinance on Commercial Road Transport (ARV)</li>
                  <li>Swiss Data Protection Act (FADP)</li>
                  <li>EU General Data Protection Regulation (GDPR) compliance</li>
                  <li>Swiss VAT registration and compliance</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Website Disclaimer */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Website Disclaimer</h2>
            <div className="text-zinc-300 space-y-4">
              <h3 className="text-xl font-medium text-white mb-3">Information Accuracy</h3>
              <p>
                While we strive to ensure that all information on this website is accurate and up-to-date, 
                we make no warranties or representations regarding the completeness, accuracy, or reliability of any information.
              </p>
              
              <h3 className="text-xl font-medium text-white mb-3">Service Availability</h3>
              <p>
                Service availability is subject to vehicle availability, weather conditions, and operational capacity. 
                Prices displayed are indicative and may vary based on specific requirements and booking conditions.
              </p>
              
              <h3 className="text-xl font-medium text-white mb-3">Vehicle Availability and Substitution</h3>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                <p className="mb-3">
                  Elite Way Limo reserves the right to provide vehicles of similar class, quality, and capacity when the exact vehicle model displayed or selected during booking is not available due to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4 text-sm mb-3">
                  <li>Maintenance requirements or safety inspections</li>
                  <li>Unexpected mechanical issues</li>
                  <li>Prior booking conflicts or operational necessities</li>
                  <li>Force majeure events beyond our control</li>
                </ul>
                <p className="text-sm">
                  Any substitute vehicle will maintain the same luxury standards, passenger capacity, and amenities as the originally selected vehicle category. 
                </p>
              </div>
              
              <h3 className="text-xl font-medium text-white mb-3">External Links</h3>
              <p>
                Our website may contain links to external websites. We are not responsible for the content, 
                privacy policies, or practices of any external sites.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Intellectual Property Rights</h2>
            <div className="text-zinc-300 space-y-4">
              <h3 className="text-xl font-medium text-white mb-3">Copyright</h3>
              <p>
                All content on this website, including text, graphics, logos, images, and software, is the property of Elite Way Limo 
                or its content suppliers and is protected by Swiss and international copyright laws.
              </p>
              
              <h3 className="text-xl font-medium text-white mb-3">Trademarks</h3>
              <p>
                "Elite Way Limo" and associated logos are trademarks of Elite Way Limo. 
                All other trademarks mentioned on this website are the property of their respective owners.
              </p>
              
              <h3 className="text-xl font-medium text-white mb-3">Usage Rights</h3>
              <p>
                You may view, download, and print content from this website for personal, non-commercial use only. 
                Any other use requires prior written permission from Elite Way Limo.
              </p>
            </div>
          </section>

          {/* Insurance and Safety */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Insurance and Safety</h2>
            <div className="text-zinc-300 space-y-4">
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                <h3 className="text-white font-medium mb-3">Insurance Coverage</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Comprehensive vehicle insurance for all fleet vehicles</li>
                  <li>Professional liability insurance</li>
                  <li>Passenger insurance coverage</li>
                  <li>Third-party liability coverage as required by Swiss law</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-medium text-white mb-3">Safety Standards</h3>
              <p>
                All vehicles undergo regular maintenance and safety inspections in accordance with Swiss transport regulations. 
                Our chauffeurs are professionally trained and hold valid commercial driving licenses.
              </p>
            </div>
          </section>

          {/* Data Protection Officer */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Data Protection</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                For all data protection inquiries, privacy rights requests, or concerns about how we handle your personal information, 
                please contact our data protection officer:
              </p>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> info@elitewaylimo.ch</p>
                  <p><strong>Subject:</strong> "Data Protection Inquiry"</p>
                  <p><strong>Response Time:</strong> Within 30 days</p>
                </div>
              </div>
              <p className="text-sm">
                Detailed information about our data processing practices can be found in our 
                <a href="/privacy-policy" className="text-gold hover:underline ml-1">Privacy Policy</a>.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Dispute Resolution</h2>
            <div className="text-zinc-300 space-y-4">
              <h3 className="text-xl font-medium text-white mb-3">Customer Complaints</h3>
              <p>
                We are committed to resolving any issues promptly and fairly. For complaints or disputes:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact us directly at info@elitewaylimo.ch</li>
                <li>We will acknowledge receipt within 48 hours</li>
                <li>Investigation and response within 7 business days</li>
                <li>If unresolved, you may seek mediation or legal remedy under Swiss law</li>
              </ol>
              
              <h3 className="text-xl font-medium text-white mb-3">Governing Law</h3>
              <p>
                This legal notice and all aspects of our service are governed by Swiss law. 
                Any legal disputes shall be subject to the jurisdiction of Swiss courts.
              </p>
            </div>
          </section>

          {/* Environmental Responsibility */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Environmental Responsibility</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                Elite Way Limo is committed to environmental sustainability and responsible business practices:
              </p>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Regular vehicle maintenance for optimal fuel efficiency</li>
                  <li>Route optimization to minimize environmental impact</li>
                  <li>Consideration of hybrid and electric vehicles for fleet expansion</li>
                  <li>Digital-first approach to reduce paper usage</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Technical Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Technical Information</h2>
            <div className="text-zinc-300 space-y-4">
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30">
                <h3 className="text-white font-medium mb-3">Website Technology</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Secure HTTPS connection for all data transmission</li>
                  <li>SSL/TLS encryption for payment processing</li>
                  <li>Google Maps integration for route planning</li>
                  <li>Stripe payment gateway for secure transactions</li>
                  <li>Responsive design for optimal mobile and desktop experience</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-medium text-white mb-3">Browser Compatibility</h3>
              <p>
                This website is optimized for modern browsers including Chrome, Firefox, Safari, and Edge. 
                For the best experience, please ensure your browser is up to date.
              </p>
            </div>
          </section>

          {/* Updates and Changes */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">Updates and Changes</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We reserve the right to update this legal notice at any time. Changes will be posted on this page 
                with an updated revision date. We recommend reviewing this notice periodically.
              </p>
              <p>
                Significant changes will be communicated through our website or via email to registered customers when appropriate.
              </p>
            </div>
          </section>

          {/* Contact for Legal Matters */}
          <section>
            <h2 className="text-2xl font-semibold text-gold mb-4">Legal Inquiries</h2>
            <div className="text-zinc-300 space-y-4">
              <p>For legal inquiries, licensing questions, or business partnership opportunities:</p>
              
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-700/30">
                <div className="space-y-2">
                  <p><strong>Business Email:</strong> info@elitewaylimo.ch</p>
                  <p><strong>Phone:</strong> +41 78 264 79 70</p>
                  <p><strong>Subject Line:</strong> "Legal Inquiry"</p>
                </div>
              </div>
              
              <div className="bg-gold/10 p-4 rounded-lg border border-gold/20 mt-4">
                <p className="text-sm text-gold">
                  This legal notice is effective as of {lastUpdated} and supersedes all previous versions.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalNotice;