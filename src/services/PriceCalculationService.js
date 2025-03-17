export const calculatePrice = (distance, duration, vehicleType, extraStops = 0, isHourly = false, hours = 0) => {
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

export const formatPrice = (price) => {
  return `CHF ${price.toFixed(2)}`;
};