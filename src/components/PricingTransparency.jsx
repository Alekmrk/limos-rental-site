import React, { useState } from 'react';
import { FaClock, FaRoute, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { popularRoutes } from '../data/cars';

const PricingTransparency = () => {
  const [selectedTab, setSelectedTab] = useState('popular');

  const internationalRoutes = [
    {
      from: "Zurich Airport",
      to: "Innsbruck, Austria",
      distance: "145km",
      duration: "2h-2h10min",
      businessClass: "550 CHF",
      firstClass: "650 CHF"
    },
    {
      from: "Zurich Airport", 
      to: "Munich, Germany",
      distance: "315km",
      duration: "3h30min",
      businessClass: "920 CHF",
      firstClass: "1,100 CHF"
    },
    {
      from: "Zurich Airport",
      to: "Milan, Italy",
      distance: "280km", 
      duration: "3h15min",
      businessClass: "850 CHF",
      firstClass: "1,020 CHF"
    }
  ];

  const RouteCard = ({ route }) => (
    <div className="bg-zinc-800/60 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-zinc-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-blue-400" />
          <span className="font-medium text-white">{route.from}</span>
        </div>
        <FaArrowRight className="text-gray-500" />
        <div className="flex items-center gap-3">
          <FaMapMarkerAlt className="text-green-400" />
          <span className="font-medium text-white">{route.to}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <FaClock />
          <span>{route.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaRoute />
          <span>{route.distance}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-zinc-700/50 rounded-lg border border-zinc-600/50">
          <div className="text-sm text-gray-400 mb-1">Business Class</div>
          <div className="text-lg font-semibold text-blue-400">from {route.businessClass}</div>
        </div>
        <div className="text-center p-3 bg-zinc-700/50 rounded-lg border border-zinc-600/50">
          <div className="text-sm text-gray-400 mb-1">First Class</div>
          <div className="text-lg font-semibold text-yellow-400">from {route.firstClass}</div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 bg-zinc-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Transparent Pricing
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            No hidden fees. Clear pricing for popular destinations. All prices include VAT, 
            fuel, and professional chauffeur service.
          </p>
        </div>

        {/* Tab Navigation - Dark Theme */}
        <div className="flex justify-center mb-8">
          <div className="bg-zinc-900/60 rounded-lg p-1 shadow-lg border border-zinc-700/50">
            <button
              onClick={() => setSelectedTab('popular')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                selectedTab === 'popular'
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              Popular Routes
            </button>
            <button
              onClick={() => setSelectedTab('international')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-300 ${
                selectedTab === 'international'
                  ? 'bg-yellow-400 text-black'
                  : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              International
            </button>
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(selectedTab === 'popular' ? popularRoutes : internationalRoutes).map((route, index) => (
            <RouteCard key={index} route={route} />
          ))}
        </div>

        {/* Additional Info - Dark Theme */}
        <div className="mt-12 text-center">
          <div className="bg-zinc-900/60 rounded-lg p-6 shadow-lg max-w-4xl mx-auto border border-zinc-700/50">
            <h3 className="text-xl font-semibold text-white mb-4">What's Included</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-300">
              <div>✓ Professional chauffeur</div>
              <div>✓ Fuel & tolls</div>
              <div>✓ Airport waiting time (60min)</div>
              <div>✓ Flight tracking</div>
              <div>✓ Vehicle insurance</div>
              <div>✓ VAT included</div>
              <div>✓ Meet & greet service</div>
              <div>✓ 24/7 customer support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingTransparency;