/**
 * Simplified Price Calculation Service
 * Only considers distance for transfers and hourly rate for hourly bookings
 */

// Vehicle rates (in CHF)
const VEHICLE_RATES = {
  // Base per km rates for point-to-point transfers
  BASE_KM_RATE: {
    'First Class': 5.5,
    'First Class Van': 4.5,
    'Business Class Van': 4.0,
    'Business Class': 3.8
  },
  
  // Hourly rates (CHF per hour)
  HOURLY_RATE: {
    'First Class': 130,
    'First Class Van': 110,
    'Business Class Van': 100,
    'Business Class': 90
  },
  
  // Minimum charges (in CHF) for point-to-point transfers
  MINIMUM_TRANSFER_CHARGE: {
    'First Class': 130,
    'First Class Van': 110,
    'Business Class Van': 95,
    'Business Class': 95
  },
  
  // Minimum hours for hourly bookings
  MINIMUM_HOURS: 3
};

// Legacy vehicle category mappings (for backward compatibility)
const VEHICLE_CATEGORIES = {
  'First Class': 'luxury',
  'First Class Van': 'premium', 
  'Business Class Van': 'premium',
  'Business Class': 'business'
};

// Legacy price per km (for backward compatibility with calculatePriceByDistance)
const PRICE_PER_KM = {
  standard: 3.0,
  premium: 4.0,
  luxury: 5.5,
  business: 3.8,
};

// Legacy minimum charges (for backward compatibility with calculatePriceByDistance)
const MINIMUM_CHARGES = {
  standard: 95,
  premium: 95,
  luxury: 130,
  business: 95,
};

/**
 * Simplified price calculation function for both transfer and hourly bookings
 * 
 * @param {number} distance - Distance in kilometers for point-to-point transfers
 * @param {number} duration - Not used in simplified calculation, maintained for backward compatibility
 * @param {string} vehicleType - Type of vehicle
 * @param {number} extraStops - Not used in simplified calculation, maintained for backward compatibility
 * @param {boolean} isHourly - Whether this is an hourly booking (default: false)
 * @param {number} hours - Number of hours for hourly booking (default: 0)
 * @returns {number} - Calculated total price
 */
export const calculatePrice = (distance = 0, duration = 0, vehicleType = 'First Class Van', extraStops = 0, isHourly = false, hours = 0) => {
  try {
    // Get rates for selected vehicle, fallback to highest rates if vehicle not found
    const kmRate = VEHICLE_RATES.BASE_KM_RATE[vehicleType] || 
      Math.max(...Object.values(VEHICLE_RATES.BASE_KM_RATE));
    
    const hourlyRate = VEHICLE_RATES.HOURLY_RATE[vehicleType] || 
      Math.max(...Object.values(VEHICLE_RATES.HOURLY_RATE));
    
    const minimumCharge = VEHICLE_RATES.MINIMUM_TRANSFER_CHARGE[vehicleType] || 
      Math.max(...Object.values(VEHICLE_RATES.MINIMUM_TRANSFER_CHARGE));
    
    let totalPrice = 0;
    
    if (isHourly) {
      // Hourly booking - ensure minimum hours
      const validHours = Math.max(VEHICLE_RATES.MINIMUM_HOURS, hours);
      totalPrice = validHours * hourlyRate;
    } else {
      // Point-to-point transfer - distance-based only
      totalPrice = Math.max(
        distance * kmRate, // Distance-based price
        minimumCharge // Minimum charge
      );
    }
    
    // Round to nearest CHF
    return Math.ceil(totalPrice);
  } catch (error) {
    console.error('Error calculating price:', error);
    return 0; // Return 0 if there's an error
  }
};

/**
 * Legacy function - Calculate price based on distance and vehicle category
 * Maintained for backward compatibility with VehicleSelection.jsx
 * 
 * @param {number} distanceInMeters - Distance in meters
 * @param {string} vehicleCategory - Vehicle category (standard, premium, luxury, suv)
 * @param {number} routeDuration - Not used in simplified calculation
 * @returns {number} - Calculated price
 */
export const calculatePriceByDistance = (distanceInMeters, vehicleType, routeDuration = 0) => {
  try {
    // Convert vehicle type to category if needed
    const vehicleCategory = VEHICLE_CATEGORIES[vehicleType] || 'premium';
    
    const distanceInKm = distanceInMeters / 1000;
    
    // Calculate price by distance
    const distancePrice = distanceInKm * (PRICE_PER_KM[vehicleCategory] || 3.5);
    
    // Get minimum charge
    const minimumCharge = MINIMUM_CHARGES[vehicleCategory] || 180;
    
    // Take the highest
    const finalPrice = Math.max(distancePrice, minimumCharge);
    
    return Math.ceil(finalPrice); // Round up to nearest CHF
  } catch (error) {
    console.error('Error in calculatePriceByDistance:', error);
    return 0;
  }
};

/**
 * Legacy function - Add surcharges to base price
 * Maintained for backward compatibility with VehicleSelection.jsx
 * In simplified pricing, we don't use surcharges anymore
 */
export const addSurcharges = (basePrice, { isAirport = false, isNightTime = false, isWeekend = false }) => {
  // In simplified pricing, we're not using surcharges, 
  // but return the base price unchanged for backward compatibility
  return basePrice;
};

/**
 * Format a price value to display currency
 */
export const formatPrice = (price) => {
  if (isNaN(price) || price === null) return 'CHF 0.00';
  return `CHF ${Number(price).toFixed(2)}`;
};

/**
 * Get estimated price range for display on the website
 * Returns an object with min price and hourly rate for a vehicle type
 */
export const getEstimatedPriceRange = (vehicleType) => {
  try {
    const hourlyRate = VEHICLE_RATES.HOURLY_RATE[vehicleType];
    const minimumCharge = VEHICLE_RATES.MINIMUM_TRANSFER_CHARGE[vehicleType];
    
    return {
      minPrice: minimumCharge,
      hourlyRate: hourlyRate,
      formattedMinPrice: formatPrice(minimumCharge),
      formattedHourlyRate: formatPrice(hourlyRate)
    };
  } catch (error) {
    return {
      minPrice: 0,
      hourlyRate: 0,
      formattedMinPrice: formatPrice(0),
      formattedHourlyRate: formatPrice(0)
    };
  }
};