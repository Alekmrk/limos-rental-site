const { generatePDFReceipt } = require('./services/emailService');

// Test reservation data with lots of content to test page breaks
const testReservationInfo = {
  email: 'john.doe@company.com',
  phone: '+41 79 123 45 67',
  firstName: 'John Alexander Doe',
  date: '2024-12-25',
  time: '14:30',
  pickup: 'Zurich Airport Terminal 1, Arrival Gate 3, International Arrivals Hall, near the Starbucks Coffee Shop',
  dropoff: 'Grand Hotel des Bains Kempinski, Via Mezdi 27, 7500 St. Moritz, Switzerland',
  extraStops: [
    'Duty Free Shop at Zurich Airport for quick shopping',
    'Panorama Restaurant in Chur for lunch break',
    'Scenic viewpoint at Julier Pass for photography'
  ],
  selectedVehicle: { name: 'Mercedes S-Class Premium with extended leg room' },
  passengers: '4',
  bags: '8',
  boosterSeats: '2',
  childSeats: '1',
  skiEquipment: '6',
  receiveReceipt: true,
  referenceNumber: 'COMPANY-PROJECT-2024-CHRISTMAS-001\nCost Center: Marketing Events\nProject: Annual Company Retreat\nApproval Code: MGR-2024-TRANSPORT-LUXURY',
  paymentDetails: {
    method: 'Corporate Credit Card (Visa Platinum)',
    amount: '1,250.00',
    currency: 'CHF',
    reference: 'pi_3Q4R5T6U7V8W9X0Y1Z2A3B4C',
    timestamp: Date.now()
  },
  flightNumber: 'LX123 (Swiss International Air Lines from London Heathrow)',
  meetingBoard: 'Mr. John Alexander Doe - Company XYZ Annual Retreat',
  additionalRequests: 'Please ensure the vehicle is equipped with complimentary Wi-Fi, bottled water, and Swiss chocolates. The passenger prefers classical music during the journey. Please monitor the flight status and adjust pickup time accordingly. Driver should be familiar with the route to St. Moritz and alternative routes in case of traffic. Vehicle should be thoroughly cleaned and sanitized before pickup. Please provide child seats with the latest safety standards.',
  routeInfo: {
    distance: '215 kilometers via scenic Alpine route',
    duration: 'Approximately 2 hours and 45 minutes depending on traffic and weather conditions'
  }
};

console.log('Testing A4 PDF generation with page breaks...');

try {
  const pdfBase64 = generatePDFReceipt(testReservationInfo);
  console.log('✅ A4 PDF generated successfully!');
  console.log(`📄 PDF size: ${Math.round(pdfBase64.length / 1024)} KB`);
  console.log(`📄 Base64 preview: ${pdfBase64.substring(0, 100)}...`);
  
  // Save to file for manual inspection
  const fs = require('fs');
  const pdfBuffer = Buffer.from(pdfBase64, 'base64');
  fs.writeFileSync('test-receipt-a4.pdf', pdfBuffer);
  console.log('💾 Test A4 PDF saved as test-receipt-a4.pdf');
  console.log('🔍 Please check the PDF file to verify A4 format and page breaks');
  
} catch (error) {
  console.error('❌ A4 PDF generation failed:', error);
}
