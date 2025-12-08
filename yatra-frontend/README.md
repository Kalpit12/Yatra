# Yatra Frontend - Static Website

This is the frontend static website for the Yatra spiritual journey platform.

## Files Included

- `index.html` - Main website file (renamed from Yatra_Website_With_Room_Pairs (2).html)
- `api-integration.js` - API client that connects to the backend

## Deployment to Netlify

### Quick Deploy (Drag & Drop)

1. Go to https://app.netlify.com/drop
2. Drag this entire `yatra-frontend` folder
3. Your site will be live in seconds!

### Manual Deploy

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy`
3. Follow the prompts

## Configuration

### API Backend URL

Before deploying, update the API URL in `api-integration.js`:

```javascript
// Change line 7 from:
const API_BASE = 'http://localhost:3000/api';

// To your deployed backend URL:
const API_BASE = 'https://your-backend-url.com/api';
```

### Without Backend (localStorage Only)

If you want to use the site without a backend:
- The site will automatically fall back to localStorage
- Some features (login, posts, etc.) will be limited
- Data will be stored locally in the browser

## Features

- ✅ Interactive map with Leaflet
- ✅ Post creation and viewing
- ✅ User profiles
- ✅ Journey tracking
- ✅ Photo/video gallery
- ✅ Responsive design

## Notes

- All CSS and JavaScript are embedded in the HTML file
- External libraries are loaded from CDN (Leaflet, jsPDF, etc.)
- No build process required - just upload and go!

