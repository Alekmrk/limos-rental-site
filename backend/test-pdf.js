const { generatePDFReceipt } = require('./services/emailService');

// Test reservation data
const testReservationInfo = {
  email: 'test@example.com',
  phone: '+41 12 345 67 89',
  firstName: 'John Doe',
  date: '2024-12-25',
  time: '14:30',
  pickup: 'Zurich Airport',
  dropoff: 'St. Moritz Hotel',
  selectedVehicle: { name: 'Mercedes S-Class' },
  passengers: '2',
  bags: '3',
  receiveReceipt: true,
  referenceNumber: 'COMPANY-2024-001',
  paymentDetails: {
    method: 'Credit Card',
    amount: '450.00',
    currency: 'CHF',
    reference: 'pi_test123456',
    timestamp: Date.now()
  },
  flightNumber: 'LX123',
  meetingBoard: 'Mr. John Doe',
  additionalRequests: 'Please wait at Terminal 1 arrival gate.'
};

console.log('Testing PDF generation...');

try {
  const pdfBase64 = generatePDFReceipt(testReservationInfo);
  console.log('✅ PDF generated successfully!');
  console.log(`📄 PDF size: ${Math.round(pdfBase64.length / 1024)} KB`);
  console.log(`📄 Base64 preview: ${pdfBase64.substring(0, 100)}...`);
  
  // Save to file for manual inspection
  const fs = require('fs');
  const pdfBuffer = Buffer.from(pdfBase64, 'base64');
  fs.writeFileSync('test-receipt.pdf', pdfBuffer);
  console.log('💾 Test PDF saved as test-receipt.pdf');
  
} catch (error) {
  console.error('❌ PDF generation failed:', error);
}
