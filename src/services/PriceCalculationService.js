export const calculatePrice = (distance, duration, vehicleType, extraStops = 0) => {
  // Base rates per vehicle type (CHF)
  const baseRates = {
    'Mersedes Benz S Class': 2.5,
    'Mersedes Benz V Class': 3.0,
    'Audi A8': 2.5,
    'Cadillac Escalade': 3.5,
    'Rolls Royce Ghost': 4.0
  };

  // Get base rate for vehicle type, default to highest rate if type not found
  const baseRate = baseRates[vehicleType] || Math.max(...Object.values(baseRates));

  // Calculate base price based on distance and duration
  const distancePrice = distance * baseRate;
  const durationPrice = (duration / 60) * 50; // 50 CHF per hour waiting time

  // Extra stops charge
  const extraStopCharge = extraStops * 20; // 20 CHF per extra stop

  // Calculate total
  const totalPrice = distancePrice + durationPrice + extraStopCharge;

  // Minimum charge
  const minimumCharge = 100;
  return Math.max(totalPrice, minimumCharge);
};

export const formatPrice = (price) => {
  return `CHF ${price.toFixed(2)}`;
};