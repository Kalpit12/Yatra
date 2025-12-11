# Yatra Backend - Node.js API Server

Backend API server for the Yatra spiritual journey platform.

## Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your database credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=yatra_db
DB_PORT=3306
PORT=3000
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5500,https://your-frontend-url.netlify.app
```

### 3. Create Database

Run the database setup scripts from the main project folder, or manually create the database:

```sql
CREATE DATABASE yatra_db;
```

### 4. Run Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

- `GET /health` - Health check
- `/api/travelers` - Traveler management
- `/api/itinerary` - Journey itinerary
- `/api/vehicles` - Vehicle tracking
- `/api/posts` - Post management
- `/api/room-pairs` - Room pairing
- `/api/check-ins` - Check-in system
- `/api/settings` - App settings
- `/api/hotels` - Hotel management
- `/api/admin` - Admin operations

## Deployment Options

### Railway (Recommended)

1. Push to GitHub
2. Connect to Railway
3. Add environment variables
4. Deploy!

### Render

1. Create new Web Service
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Heroku

1. Install Heroku CLI
2. `heroku create your-app-name`
3. `heroku addons:create cleardb:ignite` (for MySQL)
4. `git push heroku main`

## Environment Variables

Required:
- `DB_HOST` - MySQL host
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret for JWT tokens

Optional:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed CORS origins

## Project Structure

```
yatra-backend/
├── server.js          # Main server file
├── package.json       # Dependencies
├── routes/            # API route handlers
│   ├── travelers.js
│   ├── itinerary.js
│   ├── vehicles.js
│   ├── posts.js
│   └── ...
├── config/            # Configuration files
│   └── database.js
└── scripts/           # Utility scripts
```

## Notes

- Make sure your MySQL database is running before starting the server
- Update CORS_ORIGIN to include your frontend URL
- Set JWT_SECRET environment variable (required)

