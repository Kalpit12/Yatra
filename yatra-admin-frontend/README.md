# Yatra Admin Panel - Static Website

Admin panel for managing the Yatra spiritual journey platform.

## Files Included

- `index.html` - Admin panel (renamed from Yatra_Admin_Working.html)
- `api-integration.js` - API client that connects to the backend

## Admin Login

- Credentials are provisioned securely by the administrator. Do not hardcode or share them in documentation.

## Deployment to Netlify

### Quick Deploy (Drag & Drop)

1. Go to https://app.netlify.com/drop
2. Drag this entire `yatra-admin-frontend` folder
3. Your admin panel will be live!

### Manual Deploy

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy`
3. Follow the prompts

## Configuration

The admin panel automatically connects to:
- **Production:** https://yatra-production.up.railway.app/api
- **Local:** http://localhost:3000/api (when running locally)

## Features

- ✅ Add/Edit/Delete Travelers
- ✅ Manage Posts (Approve/Reject)
- ✅ Manage Vehicles
- ✅ Manage Itinerary
- ✅ Manage Hotels & Room Pairs
- ✅ View Check-ins
- ✅ Manage Settings
- ✅ Export Data (PDF/Excel)

## Notes

- All CSS and JavaScript are embedded in the HTML file
- External libraries are loaded from CDN
- No build process required - just upload and go!
- **Keep admin URL private** - this is for administrators only!

