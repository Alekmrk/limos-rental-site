import { useEffect } from 'react';

const TermsOfService = ({ scrollUp }) => {
  useEffect(() => {
    scrollUp();
  }, [scrollUp]);

  const lastUpdated = "June 30, 2025";

  return (
    <div className="container-default mt-28">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-semibold mb-8 text-center">
          <span className="text-gold">Terms of Service</span>
        </h1>
        
        <div className="bg-zinc-800/30 p-8 rounded-lg border border-zinc-700/50">
          <p className="text-zinc-400 text-sm mb-8">
            Last updated: {lastUpdated}
          </p>

          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">1. Introduction</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                Welcome to Elite Way Limo. These Terms of Service ("Terms") govern your use of our luxury transportation services and website located at elitewaylimo.ch (the "Service") operated by Elite Way Limo ("we," "us," or "our").
              </p>
              <p>
                By booking our services or using our website, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not use our Service.
              </p>
              <p>
                These Terms are governed by Swiss law and comply with Swiss transportation regulations.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">2. Service Description</h2>
            <div className="text-zinc-300 space-y-4">
              <p>Elite Way Limo provides luxury chauffeur and transportation services including:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Airport transfers</li>
                <li>Point-to-point transportation</li>
                <li>Hourly chauffeur services</li>
                <li>Special event transportation</li>
                <li>Corporate transportation</li>
              </ul>
              <p>
                Our primary service area is Switzerland. International transfers to neighboring countries may be arranged upon special request.
              </p>
            </div>
          </section>

          {/* Booking and Reservations */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">3. Booking and Reservations</h2>
            <div className="text-zinc-300 space-y-4">
              <h3 className="text-xl font-medium text-white mb-3">3.1 Booking Requirements</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Bookings must be made at least 3 hours in advance</li>
                <li>You must be 18 years or older to make a reservation</li>
                <li>Valid contact information is required</li>
                <li>At least one location (pickup or drop-off) must be within Switzerland</li>
              </ul>
              
              <h3 className="text-xl font-medium text-white mb-3">3.2 Booking Confirmation</h3>
              <p>
                Your booking is confirmed once payment is processed and you receive a confirmation email. 
                We reserve the right to cancel bookings if payment fails or if service cannot be provided due to circumstances beyond our control.
              </p>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">4. Payment Terms</h2>
            <div className="text-zinc-300 space-y-4">
              <h3 className="text-xl font-medium text-white mb-3">4.1 Payment Methods</h3>
              <p>We accept the following payment methods:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Credit cards (Visa, Mastercard, etc...)</li>
              </ul>
              
              <h3 className="text-xl font-medium text-white mb-3">4.2 Pricing</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All prices are in Swiss Francs (CHF) and include VAT</li>
                <li>Prices are calculated based on distance, vehicle type, and service duration</li>
                <li>Additional charges may apply for special requests, waiting time beyond included limits, or route changes</li>
                <li>Tolls and parking fees are included in quoted prices</li>
              </ul>
              
              <h3 className="text-xl font-medium text-white mb-3">4.3 Payment Processing</h3>
              <p>
                Payment is required at the time of booking. For special requests, payment may be arranged after quote approval. 
                Credit card payments are processed securely through Stripe.
              </p>
            </div>
          </section>

          {/* Cancellation Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">5. Cancellation and Modification Policy</h2>
            <div className="text-zinc-300 space-y-4">
              <h3 className="text-xl font-medium text-white mb-3">5.1 Cancellation by Customer</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Full refund:</strong> Cancellations made 3 hours or more before scheduled pickup time</li>
                <li><strong>Late cancellation:</strong> Less than 3 hours notice may result in partial or full charge</li>
                <li><strong>No-show:</strong> Full charges apply if customer is not present at pickup time without prior notice</li>
              </ul>
              
              <h3 className="text-xl font-medium text-white mb-3">5.2 Modifications</h3>
              <p>
                Booking modifications are subject to availability and may result in price adjustments. 
                Please contact us at info@elitewaylimo.ch or +41 78 264 79 70 for changes.
              </p>
              
              <h3 className="text-xl font-medium text-white mb-3">5.3 Cancellation by Elite Way Limo</h3>
              <p>
                We reserve the right to cancel services due to weather conditions, vehicle breakdown, or other circumstances beyond our control. 
                In such cases, we will provide full refund or alternative arrangements.
              </p>
            </div>
          </section>

          {/* Service Conditions */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">6. Service Conditions</h2>
            <div className="text-zinc-300 space-y-4">
              <h3 className="text-xl font-medium text-white mb-3">6.1 Passenger Responsibilities</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Be ready at the designated pickup time and location</li>
                <li>Provide accurate contact information and pickup details</li>
                <li>Respect the vehicle and chauffeur</li>
                <li>No smoking, illegal substances, or dangerous materials in vehicles</li>
                <li>Comply with Swiss traffic laws and regulations</li>
              </ul>
              
              <h3 className="text-xl font-medium text-white mb-3">6.2 Baggage and Luggage Policy</h3>
              <div className="text-zinc-300 space-y-3">
                <p>
                  Customers must accurately declare the number of bags during booking. Vehicle capacity varies by model, and exceeding declared baggage limits may result in:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Additional charges for excess baggage handling</li>
                  <li>Requirement to upgrade to a larger vehicle (subject to availability and additional cost)</li>
                  <li>Service cancellation if baggage cannot be safely accommodated</li>
                </ul>
                <p>
                  <strong>Important:</strong> If your actual baggage significantly exceeds what was declared during booking, we reserve the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Charge additional fees on the spot (minimum CHF 50 per excess bag)</li>
                  <li>Cancel the service if safe transport cannot be guaranteed</li>
                  <li>Require rebooking with appropriate vehicle size</li>
                </ul>
                <p className="text-sm text-amber-300">
                  No refunds will be provided for cancellations due to undeclared excess baggage.
                </p>
              </div>
              
              <h3 className="text-xl font-medium text-white mb-3">6.3 Additional Equipment and Services</h3>
              <div className="text-zinc-300 space-y-3">
                <p>We provide the following additional equipment and services upon request:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Child and Baby Seats:</strong> Provided free of charge when declared during booking. Must specify exact ages and weights of children.</li>
                  <li><strong>Ski Equipment Transport:</strong> Subject to vehicle capacity and must be declared during booking. Additional charges may apply for oversized or excess equipment.</li>
                  <li><strong>Special Equipment:</strong> Other special equipment requests subject to availability and additional charges.</li>
                </ul>
                <p>
                  <strong>Equipment Requirements:</strong> All additional equipment must be declared at time of booking. Failure to declare required equipment may result in service delays, additional charges, or cancellation if accommodation cannot be safely provided.
                </p>
              </div>
              
              <h3 className="text-xl font-medium text-white mb-3">6.4 Vehicle Availability and Substitution</h3>
              <div className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-700/30 mb-4">
                <p className="mb-3">
                  Elite Way Limo reserves the right to provide vehicles of similar class, quality, and passenger capacity when the exact vehicle model displayed or selected during booking is not available. This may occur due to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-sm mb-3">
                  <li>Scheduled maintenance or mandatory safety inspections</li>
                  <li>Unexpected mechanical issues or repairs</li>
                  <li>Prior booking conflicts or operational requirements</li>
                  <li>Force majeure events, including but not limited to severe weather, natural disasters, or government restrictions</li>
                </ul>
                <div className="space-y-2 text-sm">
                  <p><strong>Substitution Standards:</strong> Any substitute vehicle will:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Maintain equivalent or superior luxury standards and comfort features</li>
                    <li>Accommodate the same number of passengers as originally booked</li>
                    <li>Provide similar or better amenities (Wi-Fi, climate control, premium interior)</li>
                    <li>Meet all safety and insurance requirements</li>
                  </ul>
                  <p><strong>No Price Adjustment:</strong> Vehicle substitutions within the same class will not affect the agreed-upon price. If a superior vehicle class is provided, no additional charges will apply.</p>
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-white mb-3">6.5 Waiting Time</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Airport transfers: 60 minutes free waiting time for international flights, 30 minutes for domestic</li>
                <li>Other pickups: 15 minutes free waiting time</li>
                <li>Additional waiting time charged at hourly rates</li>
              </ul>
            </div>
          </section>

          {/* Liability and Insurance */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">7. Liability and Insurance</h2>
            <div className="text-zinc-300 space-y-4">
              <h3 className="text-xl font-medium text-white mb-3">7.1 Insurance Coverage</h3>
              <p>
                All our vehicles are fully insured according to Swiss law requirements. Our insurance covers liability for property damage and personal injury during transportation.
              </p>
              
              <h3 className="text-xl font-medium text-white mb-3">7.2 Limitation of Liability</h3>
              <p>
                Our liability is limited to the value of the transportation service provided. We are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Indirect, consequential, or punitive damages</li>
                <li>Lost luggage or personal belongings (passengers responsible for their items)</li>
                <li>Delays due to traffic, weather, or circumstances beyond our control</li>
                <li>Missed flights, meetings, or appointments due to unforeseen circumstances</li>
              </ul>
              
              <h3 className="text-xl font-medium text-white mb-3">7.3 Passenger Liability</h3>
              <p>
                Passengers are liable for any damage to the vehicle caused by their actions or negligence.
              </p>
            </div>
          </section>

          {/* Data Protection */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">8. Data Protection and Privacy</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We collect and process personal data in accordance with our Privacy Policy and Swiss data protection laws. 
                By using our services, you consent to the collection and use of your personal information as described in our 
                <a href="/privacy-policy" className="text-gold hover:underline ml-1">Privacy Policy</a>.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">9. Dispute Resolution</h2>
            <div className="text-zinc-300 space-y-4">
              <h3 className="text-xl font-medium text-white mb-3">9.1 Governing Law</h3>
              <p>
                These Terms are governed by and construed in accordance with Swiss law. Any disputes arising from these Terms or our services shall be subject to the exclusive jurisdiction of Swiss courts.
              </p>
              
              <h3 className="text-xl font-medium text-white mb-3">9.2 Dispute Resolution Process</h3>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact us directly at info@elitewaylimo.ch to resolve any issues</li>
                <li>If unresolved, disputes may be submitted to mediation</li>
                <li>Legal proceedings may be initiated in Swiss courts as a last resort</li>
              </ol>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">10. Changes to Terms</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated revision date. 
                Continued use of our services after changes constitutes acceptance of the modified Terms.
              </p>
              <p>
                For significant changes affecting your rights, we will notify customers via email when possible.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gold mb-4">11. Contact Information</h2>
            <div className="text-zinc-300 space-y-4">
              <p>If you have questions about these Terms of Service, please contact us:</p>
              
              <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-700/30">
                <div className="space-y-2">
                  <p><strong>Email:</strong> info@elitewaylimo.ch</p>
                  <p><strong>Phone:</strong> +41 78 264 79 70</p>
                  <p><strong>Address:</strong> Zurich, Switzerland</p>
                  <p><strong>Website:</strong> elitewaylimo.ch</p>
                </div>
              </div>
            </div>
          </section>

          {/* Effective Date */}
          <section>
            <div className="bg-gold/10 p-4 rounded-lg border border-gold/20">
              <p className="text-sm text-gold">
                These Terms of Service are effective as of {lastUpdated} and apply to all bookings made after this date.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;