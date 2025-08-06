/**
 * Determine if an image needs top padding (First Class Van interior images only)
 */
export const needsTopPadding = (imageSrc) => {
  if (typeof imageSrc !== 'string') return false;
  
  const lowerSrc = imageSrc.toLowerCase();
  // Only First Class Van interior images need padding
  return lowerSrc.includes('firstclassvan') && (lowerSrc.includes('(i') || lowerSrc.includes('_i'));
};

/**
 * Get appropriate CSS classes for vehicle image display
 */
export const getVehicleImageClasses = (imageSrc) => {
  const baseClasses = "w-full h-full object-contain";
  
  if (needsTopPadding(imageSrc)) {
    return `${baseClasses} pt-6 pb-2`;
  }
  
  return baseClasses;
};
