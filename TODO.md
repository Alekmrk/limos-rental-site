# Limos Rental Site - TODO List

## In Progress 🚧
- [ ] 

## Planned Tasks 📋
- [ ] 🔴 Implement complete reservation and confirmation flow
    - [ ] Airport transfer service reservations
    - [ ] Ski resort transportation reservations
    - [ ] Special events service (weddings, proms, corporate events)
    - [ ] Custom/other reservation types
    - [ ] Service-specific pricing and options
- [ ] 🔴 Implement billing flow and payment processing
    - [ ] Integrate real credit card payment processing (currently just UI)
        - [ ] Add Stripe/other payment provider integration
        - [ ] Handle successful/failed payments
        - [ ] Implement error handling and retry logic
    - [ ] Implement real crypto payment processing
        - [ ] Generate unique USDT addresses per transaction
        - [ ] Real-time crypto payment detection
        - [ ] Handle blockchain confirmations
        - [ ] Handle failed/incomplete crypto transfers
    - [ ] Add payment receipt and invoice generation
        - [ ] PDF generation for invoices
        - [ ] Email delivery of receipts
        - [ ] Store payment records
    - [ ] Add payment expiry for crypto payments
        - [ ] Price locking mechanism
        - [ ] Handle expired payment sessions
    - [ ] Admin payment management interface
        - [ ] View and manage payments
        - [ ] Manual payment verification
        - [ ] Refund processing
- [ ] 🟡 Update website content (images and text)
- [ ] 🟢 Migrate location services from current API to Google Places API
- [ ] 🟢 Add validation to ensure pickup OR drop-off location is within Switzerland

## Completed ✅
- [x] Add payment page UI with credit card and crypto options
- [x] Implement price calculation engine
    - [x] Base rate per vehicle type
    - [x] Distance-based pricing
    - [x] Duration-based pricing
    - [x] Extra stops charges
    - [x] Minimum charge enforcement
- [x] Update progress bar to include payment step
- [x] Basic payment page navigation flow

## Notes 📝
- Priority levels: High (🔴), Medium (🟡), Low (🟢)
- Add dates when tasks are completed
- Feel free to add new sections as needed

## Project Milestones 🎯
- [ ] Complete reservation system with billing integration
    - Different service types implementation (Airport, Ski, Events)
    - Service-specific workflows
    - Real payment processing integration (Credit Card & Crypto)
- [ ] Location services upgrade
- [ ] Content refresh and visual updates

---
Last updated: [Current Date]