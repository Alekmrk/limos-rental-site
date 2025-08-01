import React from 'react';
import { FaCalendarAlt, FaStar, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import { eventDestinations } from '../data/services';
import { UTMLink } from './UTMLink';

const EventsSection = () => {
  const upcomingEvents = [
    {
      name: "World Economic Forum 2026",
      location: "Davos",
      date: "January 2026",
      status: "Booking Open",
      highlights: ["VIP Access Support", "Security Clearance", "Flexible Scheduling"]
    },
    {
      name: "Art Basel 2025",
      location: "Basel", 
      date: "June 2025",
      status: "Available",
      highlights: ["Gallery District Access", "Multiple Venues", "Cultural Guide"]
    },
    {
      name: "Montreux Jazz Festival 2025",
      location: "Montreux",
      date: "July 2025", 
      status: "Early Bird",
      highlights: ["Festival Access", "Late Night Service", "Multi-day Packages"]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-cream to-warm-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-700">
            <span className="text-royal-blue">Premium Event</span> Transportation
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exclusive transportation services for Switzerland's most prestigious events. 
            Experience seamless transfers to world-class venues and gatherings.
          </p>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="bg-cream-light/80 backdrop-blur-sm rounded-lg p-6 hover:bg-cream-light/90 transition-all duration-300 border border-royal-blue/20 shadow-lg hover:shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <FaCalendarAlt className="text-2xl text-royal-blue" />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  event.status === 'Booking Open' ? 'bg-green-100 text-green-700 border border-green-200' :
                  event.status === 'Early Bird' ? 'bg-gold/20 text-royal-blue border border-gold/30' :
                  'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  {event.status}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-gray-700">{event.name}</h3>
              
              <div className="flex items-center gap-2 mb-3 text-gray-600">
                <FaMapMarkerAlt className="text-sm" />
                <span>{event.location}</span>
                <span>•</span>
                <span>{event.date}</span>
              </div>

              <div className="space-y-2">
                {event.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <FaStar className="text-gold text-xs" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Event Destinations with Pricing */}
        <div className="bg-warm-white/80 backdrop-blur-sm rounded-lg p-8 border border-royal-blue/20 shadow-lg">
          <h3 className="text-2xl font-semibold text-center mb-8 text-gray-700">Event Transportation Packages</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventDestinations.map((destination, index) => (
              <div key={index} className="bg-cream-light/90 rounded-lg p-6 border border-royal-blue/15 shadow-md hover:shadow-lg transition-all duration-300 hover:border-royal-blue/30">
                <h4 className="text-lg font-semibold mb-2 text-gray-700">{destination.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{destination.description}</p>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt />
                    <span>{destination.distance}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers />
                    <span>{destination.duration}</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-royal-blue mb-2">
                    from {destination.startingPrice}
                  </div>
                  <div className="text-xs text-gray-500">Starting price</div>
                </div>

                <div className="mt-4 space-y-1">
                  {destination.features.map((feature, idx) => (
                    <div key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                      <span className="w-1 h-1 bg-royal-blue rounded-full"></span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Book Your Event Transportation</h3>
          <p className="text-gray-600 mb-6">
            Secure your premium transportation for upcoming events. Early booking recommended.
          </p>
          <UTMLink 
            to="/booking"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-royal-blue to-royal-blue-light hover:from-royal-blue-light hover:to-royal-blue text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Reserve Now
          </UTMLink>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;