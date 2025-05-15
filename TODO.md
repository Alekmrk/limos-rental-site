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

# Email Service Configuration TODO

## Current Email Setup
1. Azure Communication Services (Primary)
- [x] DKIM configuration completed
- [x] SPF record configured
- [x] DMARC record set up
- [ ] Set up email tracking and analytics
- [ ] Implement email queue system
- [ ] Add retry mechanism for failed emails
- [ ] Set up monitoring dashboard

2. Microsoft Graph API (Secondary)
- [x] Basic integration completed
- [ ] Fix deliverability issues (550 5.7.708 error)
- [ ] Improve IP reputation with email providers
- [ ] Set up proper throttling

## Recommendations
1. Service Consolidation
- [ ] Remove email sending via Microsoft Graph API
- [ ] Update all customer-facing endpoints to use Azure Communication Services
- [ ] Keep Graph API for calendar and inbox management only
- [ ] Document the separation of concerns

2. Monitoring & Analytics
- [ ] Set up email delivery tracking
- [ ] Implement bounce rate monitoring
- [ ] Create alert system for failed emails
- [ ] Set up weekly email performance reports

3. Performance Improvements
- [ ] Implement email queue system
- [ ] Add retry mechanism with exponential backoff
- [ ] Set up rate limiting
- [ ] Add email template caching

4. Security Enhancements
- [ ] Regular rotation of Azure Communication Services keys
- [ ] Implement email sanitization
- [ ] Set up IP allowlist for admin operations
- [ ] Add email sending audit logs

## Integration Points
1. Customer Communications
- [ ] Booking confirmations (Azure Communication Services)
- [ ] Payment receipts (Azure Communication Services)
- [ ] Special request notifications (Azure Communication Services)
- [ ] Status updates (Azure Communication Services)

2. Internal Operations
- [ ] Calendar management (Microsoft Graph API)
- [ ] Inbox monitoring (Microsoft Graph API)
- [ ] Meeting scheduling (Microsoft Graph API)
- [ ] Internal notifications (Microsoft Graph API)

## Testing & Validation
- [ ] Create comprehensive email test suite
- [ ] Set up automated email validation
- [ ] Implement spam score checking
- [ ] Create email template validation system

---
Last updated: [Current Date]