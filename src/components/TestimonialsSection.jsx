import React from 'react';
import { FaStar, FaQuoteLeft, FaUser } from 'react-icons/fa';
import { scrollToReservationCard } from '../utils/scrollUtils';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Alexandra Weber",
      role: "CEO, Weber Industries",
      location: "Zurich",
      rating: 5,
      text: "Elite Way Limo provided exceptional service for our corporate events. The professionalism and attention to detail were outstanding. Our international clients were thoroughly impressed.",
      image: null
    },
    {
      id: 2,
      name: "Thomas Müller",
      role: "Private Client",
      location: "Basel",
      rating: 5,
      text: "Exceptional service for our family vacation transfers. The vehicle was immaculate, and our chauffeur was knowledgeable about local attractions. A truly premium experience!",
      image: null
    },
    {
      id: 3,
      name: "David Chen",
      role: "Business Executive",
      location: "Geneva",
      rating: 5,
      text: "I regularly use Elite Way for airport transfers and business meetings. The reliability, comfort, and professional service make them my go-to choice for luxury transportation.",
      image: null
    }
  ];

  const ReviewStars = ({ rating }) => {
    return (
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            className={`text-lg ${
              index < rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-cream to-warm-gray relative overflow-hidden">
      {/* Background Decorations - Harmonious Theme */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-royal-blue/10 to-gold/5 rounded-full opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-gold/15 to-cream/20 rounded-full opacity-30 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-warm-gray/10 to-royal-blue/5 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="container-default relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cream-light/80 text-royal-blue px-4 py-2 rounded-full text-sm font-medium mb-4 border border-royal-blue/20 shadow-md">
            <FaStar />
            <span>Client Testimonials</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-4">
            What Our <span className="text-royal-blue">Clients</span> Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from our satisfied clients who have experienced 
            the luxury and professionalism of Elite Way Limo.
          </p>
        </div>

        {/* Testimonials Grid - Harmonious Theme */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-cream-light/90 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-royal-blue/15 hover:border-royal-blue/30 flex flex-col h-full"
            >
              <FaQuoteLeft className="text-2xl text-gold mb-4" />
              
              <ReviewStars rating={testimonial.rating} />
              
              <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-gradient-to-br from-royal-blue to-royal-blue-light rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <div className="font-semibold text-gray-700">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-xs text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators - Harmonious Theme */}
        <div className="bg-cream-light/90 p-8 rounded-2xl shadow-lg border border-royal-blue/20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-gold">4.9</div>
              <div className="text-sm text-gray-600">Average Rating</div>
              <div className="flex justify-center">
                <ReviewStars rating={5} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-emerald-500">500+</div>
              <div className="text-sm text-gray-600">5-Star Reviews</div>
              <div className="text-xs text-gray-500">Verified clients</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-royal-blue">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
              <div className="text-xs text-gray-500">Client feedback</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-royal-blue-light">24/7</div>
              <div className="text-sm text-gray-600">Customer Support</div>
              <div className="text-xs text-gray-500">Always available</div>
            </div>
          </div>
        </div>

        {/* Call to Action - Harmonious Theme */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Ready to join our satisfied clients?</p>
          <button 
            onClick={scrollToReservationCard}
            className="bg-gradient-to-r from-royal-blue to-royal-blue-light hover:from-royal-blue-light hover:to-royal-blue text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Book Your Experience
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;