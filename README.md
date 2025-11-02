# 🌤️ Weather Analytics Dashboard

A full-stack weather analytics application with real-time weather data, forecasts, interactive charts, and Google authentication.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-demo-link.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🌍 Weather Data
- Real-time weather information for any city worldwide
- 7-day weather forecast
- Hourly weather predictions
- Detailed weather statistics (temperature, humidity, wind, pressure)

### 📊 Data Visualization
- Interactive temperature trend charts
- Precipitation probability graphs
- Wind speed and direction visualization
- Responsive charts with Recharts

### 🔐 Authentication
- Google OAuth 2.0 authentication
- Secure JWT token-based sessions
- Firebase Admin SDK integration
- Protected routes and user profiles

### ⭐ User Features
- Save favorite cities
- Personalized dashboard
- Temperature unit toggle (°C/°F)
- Dark mode support
- City search with autocomplete

### 🎨 UI/UX
- Modern, responsive design
- Mobile-first approach
- Dark/Light theme
- Smooth animations and transitions
- Accessible components

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.0
- **State Management:** Redux Toolkit
- **Routing:** React Router v6
- **Styling:** Tailwind CSS 3.4
- **Charts:** Recharts 2.10
- **Icons:** Lucide React
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.18
- **Database:** MongoDB (Mongoose 8.0)
- **Authentication:** Firebase Admin SDK
- **Security:** Helmet, CORS, bcrypt
- **Validation:** Joi, Express Validator
- **Logging:** Winston
- **Caching:** Node-Cache

### External APIs
- **Weather Data:** OpenWeatherMap API
- **Authentication:** Firebase Auth
- **Database:** MongoDB Atlas

## 🏗️ Architecture

weather-analytics-dashboard/
├── frontend/ # React frontend application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page components
│ │ ├── services/ # API services
│ │ ├── store/ # Redux store
│ │ ├── hooks/ # Custom React hooks
│ │ ├── utils/ # Utility functions
│ │ ├── context/ # React contexts
│ │ └── styles/ # CSS files
│ └── package.json
│
├── backend/ # Node.js backend API
│ ├── src/
│ │ ├── controllers/ # Request handlers
│ │ ├── models/ # Mongoose models
│ │ ├── routes/ # Express routes
│ │ ├── middleware/ # Custom middleware
│ │ ├── services/ # Business logic
│ │ ├── utils/ # Helper functions
│ │ ├── config/ # Configuration files
│ │ └── validators/ # Input validation
│ └── package.json
│
├── .gitignore
├── package.json # Root package.json for concurrent scripts
└── README.md

text

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn
- MongoDB Atlas account
- OpenWeatherMap API key
- Firebase project (for authentication)

## 📦 Installation

### 1. Clone the repository

git clone https://github.com/Harsha-MR/weather-analytics-dashboard.git
cd weather-analytics-dashboard

text

### 2. Install dependencies

Install root dependencies
npm install

Install all project dependencies (backend + frontend)
npm run install:all

text

## ⚙️ Configuration

### Backend Configuration

Create `backend/.env`:

Server
NODE_ENV=development
PORT=5000

MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather-dashboard

JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-characters
JWT_REFRESH_EXPIRES_IN=30d

OpenWeatherMap API
OPENWEATHER_API_KEY=your_openweathermap_api_key
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

Firebase Admin SDK
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com

Frontend URL
FRONTEND_URL=http://localhost:5173

text

### Frontend Configuration

Create `frontend/.env`:

API Configuration
VITE_API_URL=http://localhost:5000/api

Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

text

### Getting API Keys

#### OpenWeatherMap API
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Wait 10-15 minutes for activation

#### Firebase Setup
1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Google Authentication
3. Get Web App config for frontend
4. Download Service Account JSON for backend

## 🏃 Running the Application

### Development Mode

Run both frontend and backend concurrently:

npm run dev

text

Or run separately:

Backend only
npm run dev:backend

Frontend only
npm run dev:frontend

text

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5000
- **API Docs:** http://localhost:5000/api/docs

## 🌐 Deployment

### Backend (Railway)

1. Sign up at [Railway](https://railway.app/)
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add environment variables
5. Deploy

### Frontend (Vercel)

1. Sign up at [Vercel](https://vercel.com/)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Framework: Vite
5. Add environment variables
6. Deploy

### Post-Deployment

1. Update `FRONTEND_URL` in Railway backend
2. Add Vercel domain to Firebase authorized domains
3. Test all features in production

## 📚 API Documentation

### Weather Endpoints

GET /api/weather/current/:city
GET /api/weather/forecast/:city
GET /api/weather/hourly/:city
GET /api/weather/search?q=query
GET /api/weather/coords?lat=&lon=

text

### Authentication Endpoints

POST /api/auth/google
POST /api/auth/refresh
POST /api/auth/logout
GET /api/auth/me

text

### User Endpoints

GET /api/users/profile
PUT /api/users/profile
PUT /api/users/preferences

text

### Favorites Endpoints

GET /api/favorites
POST /api/favorites
DELETE /api/favorites/:id
PUT /api/favorites/order

text

## 🎨 Features Showcase

### Dashboard
- Grid view of weather cards
- Real-time weather updates
- Quick search functionality
- Favorite cities quick access

### City Detail View
- Current weather conditions
- 7-day forecast
- Hourly predictions
- Interactive charts
- Weather statistics

### Profile
- User information
- Favorite cities management
- Settings and preferences
- Temperature unit toggle

## 🔒 Security

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Firebase token verification
- Rate limiting on API endpoints
- Input validation and sanitization
- Helmet.js security headers
- CORS configuration

## 🧪 Testing

Run backend tests
cd backend
npm test

Run frontend tests
cd frontend
npm test

text

## 📝 Environment Variables

See `.env.example` files in `backend/` and `frontend/` directories for all required environment variables.
