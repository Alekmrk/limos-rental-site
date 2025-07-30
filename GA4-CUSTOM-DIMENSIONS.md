**Custom Dimensions Setup for GA4**

Create these custom dimensions in Google Analytics 4:

1. **UTM Source**
   - Dimension name: UTM Source
   - Description: Marketing campaign source (google, facebook, etc)
   - Event parameter: utm_source
   - Scope: Event

2. **UTM Medium**
   - Dimension name: UTM Medium  
   - Description: Marketing campaign medium (cpc, social, email, etc)
   - Event parameter: utm_medium
   - Scope: Event

3. **UTM Campaign**
   - Dimension name: UTM Campaign
   - Description: Marketing campaign name
   - Event parameter: utm_campaign
   - Scope: Event

4. **Booking Type**
   - Dimension name: Booking Type
   - Description: Type of booking (hourly vs transfer)
   - Event parameter: booking_type
   - Scope: Event

5. **Vehicle Type**
   - Dimension name: Vehicle Type
   - Description: Selected vehicle name/type
   - Event parameter: vehicle_type
   - Scope: Event

**How to create each dimension:**
1. In GA4, go to Admin → Custom Definitions → Custom Dimensions
2. Click "Create custom dimension"
3. Fill in the details above
4. Click "Save"
5. Repeat for all 5 dimensions

**Important Notes:**
- Use exactly the parameter names listed above (utm_source, utm_medium, etc)
- Set scope to "Event" for all dimensions
- These will automatically capture data once our tracking is active
