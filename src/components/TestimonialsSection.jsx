import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaUser, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

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
    },
    {
      id: 4,
      name: "Maria Gonzalez",
      role: "Wedding Planner",
      location: "Lucerne",
      rating: 5,
      text: "Elite Way exceeded all expectations for our luxury wedding transfers. The fleet coordination was seamless, vehicles were pristine, and every detail was perfectly executed. Highly recommended!",
      image: null
    },
    {
      id: 5,
      name: "Roberto Martinelli",
      role: "Investment Banker",
      location: "Lugano",
      rating: 5,
      text: "Outstanding service for high-profile client meetings. The discretion, punctuality, and luxury vehicles create the perfect impression. Elite Way is our preferred transportation partner.",
      image: null
    }
  ];

  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPages) % totalPages);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, isAutoPlaying]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const getCurrentTestimonials = () => {
    const start = currentIndex * itemsPerPage;
    return testimonials.slice(start, start + itemsPerPage);
  };

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

        {/* Mobile Navigation - Above testimonials */}
        <div className="flex md:hidden justify-center gap-4 mb-6">
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-cream-light/90 hover:bg-royal-blue/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-royal-blue/20"
            aria-label="Previous testimonials"
          >
            <FaChevronLeft className="text-royal-blue-dark text-lg" />
          </button>
          
          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-cream-light/90 hover:bg-royal-blue/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-royal-blue/20"
            aria-label="Next testimonials"
          >
            <FaChevronRight className="text-royal-blue-dark text-lg" />
          </button>
        </div>

        {/* Testimonials Carousel - Enhanced with Navigation */}
        <div 
          className="relative mb-16"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Desktop Navigation Arrows - Hidden on mobile */}
          <button
            onClick={prevSlide}
            className="hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-cream-light/90 hover:bg-royal-blue/20 rounded-full items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-royal-blue/20"
            aria-label="Previous testimonials"
          >
            <FaChevronLeft className="text-royal-blue-dark text-lg" />
          </button>
          
          <button
            onClick={nextSlide}
            className="hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-cream-light/90 hover:bg-royal-blue/20 rounded-full items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg border border-royal-blue/20"
            aria-label="Next testimonials"
          >
            <FaChevronRight className="text-royal-blue-dark text-lg" />
          </button>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalPages }, (_, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                    {testimonials
                      .slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage)
                      .map((testimonial) => (
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
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-royal-blue-dark scale-125' 
                    : 'bg-royal-blue/30 hover:bg-royal-blue/50'
                }`}
                aria-label={`Go to testimonial page ${index + 1}`}
              />
            ))}
          </div>
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
          <Link 
            to="/booking"
            className="bg-gradient-to-r from-royal-blue to-royal-blue-light hover:from-royal-blue-light hover:to-royal-blue text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Book Your Experience
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;