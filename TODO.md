# Elite Way Rental Site - TODO List

## In Progress 🚧
- [ ] 

## Planned Tasks 📋
- [ ] 🟡 Implement language selection functionality
    - [ ] Re-enable language selector button in navigation (currently hidden in Header.jsx and PrimaryNav.jsx)
    - [ ] Add multi-language support system (i18n)
    - [ ] Create language switching functionality
    - [ ] Add translations for all text content
    - [ ] Implement language persistence in localStorage
    - [ ] Support for German, French, Italian, and English
- [ ] 🔴 Implement complete reservation and confirmation flow
    - [ ] Airport transfer service reservations
    - [ ] Ski resort transportation reservations
    - [ ] Special events service (corporate events, VIP services)
    - [ ] Custom/other reservation types
    - [ ] Service-specific pricing and options
- [ ] 🔴 Implement billing flow and payment processing
    - [x] Integrate real credit card payment processing (Stripe integration completed)
        - [x] Add Stripe/other payment provider integration
        - [x] Handle successful/failed payments
        - [x] Implement error handling and retry logic
        - [x] Webhook handling for payment events
        - [x] Payment session verification
        - [x] Payment success/cancel pages
    - [ ] Implement real crypto payment processing
        - [ ] Generate unique USDT addresses per transaction
        - [ ] Real-time crypto payment detection
        - [ ] Handle blockchain confirmations
        - [ ] Handle failed/incomplete crypto transfers
        - [ ] Re-enable crypto payment UI (currently hidden - see PaymentPage.jsx)
    - [x] Add payment receipt and invoice generation
        - [x] Email delivery of receipts (via webhooks)
        - [x] Store payment records (in reservation context)
        - [ ] PDF generation for invoices
    - [ ] Add payment expiry for crypto payments
        - [ ] Price locking mechanism
        - [ ] Handle expired payment sessions
    - [ ] Admin payment management interface
        - [ ] View and manage payments
        - [ ] Manual payment verification
        - [ ] Refund processing
- [ ] 🟡 Update website content (images and text)
- [x] Migrate location services from current API to Google Places API
- [x] Add validation to ensure pickup OR drop-off location is within Switzerland
- [ ] 🟡 GDPR & Privacy Compliance
    - [x] Implement cookie consent banner and management system
    - [ ] Create comprehensive privacy policy page
    - [ ] Update privacy policy with correct email address (only info@elitewaylimo.ch)
    - [ ] Add Google Analytics integration with cookie consent
    - [ ] Implement marketing tracking (Google Ads, Facebook Pixel) based on consent
    - [ ] Add data export/deletion functionality for customer requests
    - [ ] Create cookie policy documentation
    - [ ] Add consent management for newsletter subscriptions
    - [ ] Implement data retention policies

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
- [x] Cookie consent system implementation (June 18, 2025)
    - [x] Cookie consent banner with accept/reject/customize options
    - [x] Granular cookie category controls (Essential, Analytics, Marketing, Functional)
    - [x] Settings modal for detailed cookie preferences
    - [x] localStorage persistence for user choices
    - [x] GDPR-compliant design matching brand colors

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