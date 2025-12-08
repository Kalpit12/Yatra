# Yatra Deployment Guide

## 📁 Folder Structure

Your project has been organized into two separate folders:

### 1. `yatra-frontend/` - Static Website (for Netlify)
**Files to deploy:**
- `index.html` (main website)
- `api-integration.js` (API client)
- `README.md` (deployment instructions)

**Total: 3 files**

### 2. `yatra-backend/` - Node.js API Server (for Railway/Render/Heroku)
**Files included:**
- `server.js` (main server)
- `package.json` (dependencies)
- `routes/` (API endpoints)
- `config/` (database config)
- `scripts/` (utility scripts)
- `.env.example` (environment template)
- `README.md` (deployment instructions)

---

## 🚀 Quick Deployment Steps

### Frontend (Netlify) - 2 Minutes

1. **Go to Netlify:**
   - Visit https://app.netlify.com/drop
   - Or sign up at https://netlify.com

2. **Deploy:**
   - Drag the entire `yatra-frontend` folder
   - Wait 10 seconds
   - Done! You get a URL like `your-site.netlify.app`

3. **Configure API (if you have backend):**
   - Edit `yatra-frontend/api-integration.js`
   - Line 10: Replace with your backend URL
   - Redeploy

### Backend (Railway) - 5 Minutes

1. **Sign up:**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Deploy:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository (or create one)
   - Railway auto-detects Node.js

3. **Configure:**
   - Add environment variables from `.env.example`
   - Set up MySQL database (Railway has MySQL addon)
   - Update database credentials

4. **Get URL:**
   - Railway gives you a URL like `your-app.railway.app`
   - Update frontend `api-integration.js` with this URL

---

## 📋 Deployment Checklist

### Frontend (Netlify)
- [ ] Upload `yatra-frontend` folder to Netlify
- [ ] Get deployment URL
- [ ] Update `api-integration.js` with backend URL (if using backend)
- [ ] Test the website

### Backend (Railway/Render/Heroku)
- [ ] Push `yatra-backend` to GitHub
- [ ] Connect to Railway/Render/Heroku
- [ ] Add environment variables
- [ ] Set up MySQL database
- [ ] Deploy
- [ ] Test API endpoints
- [ ] Update frontend with backend URL

---

## 🔧 Configuration

### Frontend API URL

Edit `yatra-frontend/api-integration.js`:

```javascript
// For production, change line 10:
const API_BASE = 'https://your-backend-url.com/api';
```

### Backend Environment Variables

Copy `yatra-backend/.env.example` to `.env` and fill in:

```
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=yatra_db
PORT=3000
JWT_SECRET=your_secret_key
CORS_ORIGIN=https://your-frontend.netlify.app
```

---

## 🌐 Alternative Hosting Options

### Frontend
- **Netlify** (Recommended) - Free, instant deploy
- **Vercel** - Free, great for static sites
- **GitHub Pages** - Free, simple
- **Firebase Hosting** - Free tier available

### Backend
- **Railway** (Recommended) - Easy, $5/month
- **Render** - Free tier available
- **Heroku** - Free tier discontinued, paid plans
- **DigitalOcean** - VPS, more control

---

## 📝 Notes

1. **Without Backend:**
   - Frontend works with localStorage only
   - Limited functionality (no login, no shared posts)
   - Good for testing/demos

2. **With Backend:**
   - Full functionality
   - Shared data across users
   - Requires database setup

3. **Database:**
   - Use Railway's MySQL addon
   - Or external MySQL (PlanetScale, AWS RDS, etc.)
   - Update connection string in `.env`

---

## 🆘 Troubleshooting

**Frontend not loading?**
- Check browser console for errors
- Verify API URL is correct
- Check CORS settings in backend

**Backend not connecting?**
- Verify database credentials
- Check if MySQL is running
- Review server logs

**API calls failing?**
- Check CORS_ORIGIN includes frontend URL
- Verify backend is deployed and running
- Test `/health` endpoint

---

## ✅ You're Ready!

1. Deploy frontend to Netlify (drag & drop)
2. Deploy backend to Railway (connect GitHub)
3. Update frontend with backend URL
4. Done! 🎉

