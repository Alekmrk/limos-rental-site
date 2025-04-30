# Deployment Plan for Limos Rental Site

## 1. Prerequisites
- [ ] Azure account with active subscription
- [ ] GitHub account with repository
- [ ] Domain name (to be purchased)

## 2. Email Service Setup (SendGrid)
1. Create SendGrid Account in Azure:
   - Go to Azure Portal > Create Resource > SendGrid
   - Select Free Tier (100 emails/day)
   - Complete verification process
2. Configure SendGrid:
   - Create API Key
   - Verify sender domain
   - Update DNS records for sender authentication

## 3. Azure Resources Setup

### Frontend Setup (Static Web App)
1. Create Static Web App in Azure:
   ```
   Resource Group: limos-rental-rg
   Name: limos-rental-frontend
   Plan: Free tier
   ```

2. Environment Variables for Frontend:
   ```
   VITE_GOOGLE_MAPS_API_KEY=[Your API Key]
   VITE_API_URL=https://limos-rental-api.azurewebsites.net
   ```

### Backend Setup (App Service)
1. Create App Service:
   ```
   Resource Group: limos-rental-rg
   Name: limos-rental-api
   Runtime: Node.js 18 LTS
   Plan: Basic B1 (can be scaled later)
   ```

2. Environment Variables for Backend:
   ```
   NODE_ENV=production
   PORT=8080
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=[SendGrid API Key]
   EMAIL_FROM=[Verified Sender Email]
   ADMIN_EMAIL=[Your Admin Email]
   FRONTEND_URL=https://[your-domain]
   ```

## 4. GitHub Actions Setup

### Frontend Deployment
1. Create `.github/workflows/frontend-deploy.yml`:
   ```yaml
   name: Deploy Frontend
   on:
     push:
       branches: [ main ]
       paths:
         - 'src/**'
         - 'public/**'
         - 'package.json'
         - 'vite.config.js'

   jobs:
     build_and_deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '18'
         - run: npm install
         - run: npm run build
         - name: Deploy
           uses: Azure/static-web-apps-deploy@v1
           with:
             azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
             repo_token: ${{ secrets.GITHUB_TOKEN }}
             action: "upload"
             app_location: "/" 
             output_location: "dist"
   ```

### Backend Deployment
1. Create `.github/workflows/backend-deploy.yml`:
   ```yaml
   name: Deploy Backend
   on:
     push:
       branches: [ main ]
       paths:
         - 'backend/**'

   jobs:
     build_and_deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: azure/webapps-deploy@v2
           with:
             app-name: 'limos-rental-api'
             publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
             package: './backend'
   ```

## 5. Domain and SSL Setup
1. Purchase domain from any provider
2. In Azure Static Web App:
   - Add custom domain
   - Configure SSL certificate (auto-provisioned)
3. Update DNS records:
   - Add A record for apex domain
   - Add CNAME for www subdomain
   - Add required SendGrid DNS records

## 6. Post-Deployment Checks
- [ ] Verify frontend loads correctly
- [ ] Test API endpoints
- [ ] Confirm email sending works
- [ ] Validate Google Maps integration
- [ ] Check SSL certificates
- [ ] Test form submissions
- [ ] Verify booking flow
- [ ] Test responsive design

## 7. Monitoring Setup
1. Enable Application Insights:
   - Frontend error tracking
   - Backend performance monitoring
   - Set up alerts for critical errors

## 8. Backup Plan
1. Export Azure resource configurations
2. Document deployment process
3. Save all environment variables securely
4. Keep local backup of latest working code

## Deployment Commands
```bash
# Frontend Local Build Test
npm run build

# Backend Local Test
cd backend
npm run start
```

## Important Notes
- Keep SendGrid API keys secure
- Monitor email sending limits (100/day on free tier)
- Keep Google Maps API key restricted
- Regular monitoring of Azure resources
- Test deployments in staging if needed