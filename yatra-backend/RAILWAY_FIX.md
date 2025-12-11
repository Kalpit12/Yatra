# Railway Deployment Fix

## Problem
Error: Cannot find module './config/database'

## Solution

### Option 1: Verify All Files Are Pushed to GitHub

1. Check your GitHub repository has these folders:
   - ✅ `config/` folder with `database.js`
   - ✅ `routes/` folder with all route files
   - ✅ `server.js`
   - ✅ `package.json`

2. If files are missing, add them:
   ```bash
   git add config/
   git add routes/
   git commit -m "Add missing config and routes"
   git push
   ```

### Option 2: Check Railway Deployment

1. Go to Railway dashboard
2. Click on your project
3. Go to "Settings" → "Source"
4. Make sure it's connected to the right GitHub repo
5. Click "Redeploy" or "Deploy Latest Commit"

### Option 3: Manual File Check

Make sure these files exist in your GitHub repo:
```
yatra-backend/
├── server.js
├── package.json
├── config/
│   └── database.js  ← MUST EXIST
├── routes/
│   ├── admin.js
│   ├── checkIns.js
│   ├── hotels.js
│   ├── itinerary.js
│   ├── posts.js
│   ├── roomPairs.js
│   ├── settings.js
│   ├── travelers.js
│   └── vehicles.js
└── .env (or set in Railway variables)
```

### Option 4: Force Redeploy

1. In Railway, go to "Deployments"
2. Click "Redeploy" on the latest deployment
3. Or trigger a new deployment by pushing an empty commit:
   ```bash
   git commit --allow-empty -m "Trigger redeploy"
   git push
   ```

## Quick Fix Checklist

- [ ] All files pushed to GitHub
- [ ] `config/database.js` exists in GitHub repo
- [ ] Railway connected to correct repo
- [ ] Environment variables set in Railway
- [ ] Redeployed after adding files

