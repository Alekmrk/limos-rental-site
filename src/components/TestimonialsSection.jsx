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
    <section className="py-20 bg-zinc-900 relative overflow-hidden">
      {/* Background Decorations - Dark Theme */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-zinc-700/20 to-zinc-600/20 rounded-full opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-yellow-400/10 to-yellow-300/10 rounded-full opacity-30 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-zinc-600/10 to-zinc-700/10 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="container-default relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-zinc-800/60 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-zinc-700/50">
            <FaStar />
            <span>Client Testimonials</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it. Hear from our satisfied clients who have experienced 
            the luxury and professionalism of Elite Way Limo.
          </p>
        </div>

        {/* Testimonials Grid - Dark Theme */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-zinc-800/60 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-zinc-700/50"
            >
              <FaQuoteLeft className="text-2xl text-yellow-400 mb-4" />
              
              <ReviewStars rating={testimonial.rating} />
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center">
                  <FaUser className="text-black" />
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                  <div className="text-xs text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators - Dark Theme */}
        <div className="bg-zinc-800/60 p-8 rounded-2xl shadow-lg border border-zinc-700/50">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-yellow-400">4.9</div>
              <div className="text-sm text-gray-300">Average Rating</div>
              <div className="flex justify-center">
                <ReviewStars rating={5} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-green-400">500+</div>
              <div className="text-sm text-gray-300">5-Star Reviews</div>
              <div className="text-xs text-gray-500">Verified clients</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-blue-400">98%</div>
              <div className="text-sm text-gray-300">Satisfaction Rate</div>
              <div className="text-xs text-gray-500">Client feedback</div>
            </div>
            
            <div className="space-y-2">
              <div className="text-4xl font-bold text-purple-400">24/7</div>
              <div className="text-sm text-gray-300">Customer Support</div>
              <div className="text-xs text-gray-500">Always available</div>
            </div>
          </div>
        </div>

        {/* Call to Action - Dark Theme */}
        <div className="text-center mt-12">
          <p className="text-gray-300 mb-4">Ready to join our satisfied clients?</p>
          <button 
            onClick={scrollToReservationCard}
            className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Book Your Experience
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;