// Base rates per vehicle type (CHF)
const baseRates = {
  'Mersedes Benz S Class': 2.5,
  'Mersedes Benz V Class': 3.0,
  'Audi A8': 2.5,
  'Cadillac Escalade': 3.5,
  'Rolls Royce Ghost': 4.0
};

// Hourly rates (CHF per hour)
const hourlyRates = {
  'Mersedes Benz S Class': 80,
  'Mersedes Benz V Class': 100,
  'Audi A8': 80,
  'Cadillac Escalade': 120,
  'Rolls Royce Ghost': 150
};

// Base rates per vehicle category (in CHF)
const BASE_RATES = {
  standard: 120,
  premium: 180,
  luxury: 250,
  suv: 200,
};

// Minimum charges (in CHF)
const MINIMUM_CHARGES = {
  standard: 240, // 2 hours minimum
  premium: 360,
  luxury: 500,
  suv: 400,
};

// Price per kilometer (in CHF)
const PRICE_PER_KM = {
  standard: 3.5,
  premium: 4.5,
  luxury: 6.0,
  suv: 5.0,
};

export const calculatePrice = (distance, duration, vehicleType, extraStops = 0, isHourly = false, hours = 0) => {
  // Get base rate for vehicle type, default to highest rate if type not found
  const baseRate = baseRates[vehicleType] || Math.max(...Object.values(baseRates));
  const hourlyRate = hourlyRates[vehicleType] || Math.max(...Object.values(hourlyRates));

  let totalPrice;
  
  if (isHourly) {
    // Ensure hours are within limits (2-24)
    const validHours = Math.max(2, Math.min(24, hours));
    // Calculate price based on hourly rate
    totalPrice = validHours * hourlyRate;
  } else {
    // Calculate base price based on distance and duration
    const distancePrice = distance * baseRate;
    const durationPrice = (duration / 60) * 50; // 50 CHF per hour waiting time
    totalPrice = distancePrice + durationPrice;
  }

  // Extra stops charge
  const extraStopCharge = extraStops * 20; // 20 CHF per extra stop
  totalPrice += extraStopCharge;

  // Minimum charge
  const minimumCharge = 100;
  return Math.max(totalPrice, minimumCharge);
};

// Calculate price based on distance and vehicle type
export const calculatePriceByDistance = (distanceInMeters, vehicleCategory, routeDuration) => {
  const distanceInKm = distanceInMeters / 1000;
  const durationInHours = routeDuration / 3600;

  // Calculate base price by distance
  const distancePrice = distanceInKm * PRICE_PER_KM[vehicleCategory];
  
  // Calculate time-based minimum charge
  const timeBasedMinimum = BASE_RATES[vehicleCategory] * Math.ceil(durationInHours);
  
  // Get the category minimum charge
  const categoryMinimum = MINIMUM_CHARGES[vehicleCategory];
  
  // Take the highest of all calculations
  const finalPrice = Math.max(distancePrice, timeBasedMinimum, categoryMinimum);
  
  return Math.ceil(finalPrice); // Round up to nearest CHF
};

// Calculate hourly rate
export const calculateHourlyRate = (hours, vehicleCategory) => {
  const rate = BASE_RATES[vehicleCategory];
  const minimum = MINIMUM_CHARGES[vehicleCategory];
  const total = rate * hours;
  return Math.max(total, minimum);
};

// Add surcharges
export const addSurcharges = (basePrice, { isAirport, isNightTime, isWeekend }) => {
  let finalPrice = basePrice;
  
  if (isAirport) finalPrice *= 1.1; // 10% airport surcharge
  if (isNightTime) finalPrice *= 1.15; // 15% night surcharge
  if (isWeekend) finalPrice *= 1.2; // 20% weekend surcharge
  
  return Math.ceil(finalPrice);
};

export const formatPrice = (price) => {
  return `CHF ${price.toFixed(2)}`;
};