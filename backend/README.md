# Weather Analytics Dashboard - Backend API

Node.js + Express + MongoDB backend for the Weather Analytics Dashboard application.

## 🚀 Features

- ✅ RESTful API architecture
- ✅ Google OAuth authentication
- ✅ JWT-based authorization
- ✅ MongoDB database with Mongoose
- ✅ Weather data integration (OpenWeatherMap API)
- ✅ User favorites management
- ✅ Request caching for performance
- ✅ Rate limiting and security
- ✅ Input validation and sanitization
- ✅ Comprehensive error handling
- ✅ Logging with Winston
- ✅ ES6 Modules

## 📋 Prerequisites

- Node.js v16 or higher
- MongoDB v5 or higher
- OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))
- Firebase project (optional, for Google Auth)

## 🛠️ Installation

1. **Install dependencies:**
npm install


2. **Configure environment variables:**
cp .env.example .env


Edit `.env` and add your actual values:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A strong random string for JWT signing
- `OPENWEATHER_API_KEY` - Your OpenWeatherMap API key
- `FIREBASE_*` - Firebase credentials (optional)

3. **Start MongoDB:**
If using local MongoDB
mongod

Or use MongoDB Atlas (cloud)

## 🏃 Running the Application

### Development mode (with hot reload):
npm run dev

### Production mode:
npm start

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
http://localhost:5000/api

### Endpoints Overview

#### Authentication (`/api/auth`)
- `POST /auth/google` - Google OAuth login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

#### Weather (`/api/weather`)
- `GET /weather/current/:city` - Get current weather
- `GET /weather/forecast/:city` - Get 5-day forecast
- `GET /weather/hourly/:city` - Get hourly forecast
- `GET /weather/search?q=query` - Search cities
- `GET /weather/coords?lat=xx&lon=xx` - Get weather by coordinates

#### User (`/api/users`)
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `DELETE /users/profile` - Delete user account
- `PUT /users/preferences` - Update user preferences

#### Favorites (`/api/favorites`)
- `GET /favorites` - Get all favorites
- `POST /favorites` - Add city to favorites
- `DELETE /favorites/:id` - Remove city from favorites
- `PUT /favorites/order` - Update favorites order

### Authentication

Protected routes require a JWT token in the Authorization header:

Authorization: Bearer <your_jwt_token>

## 🗄️ Database Schema

### User
{
googleId: String,
email: String,
name: String,
avatar: String,
preferences: {
temperatureUnit: String,
theme: String,
notifications: Boolean
},
isActive: Boolean,
lastLogin: Date
}
### Favorite
{
userId: ObjectId,
cityName: String,
cityId: String,
country: String,
coordinates: { lat: Number, lon: Number },
order: Number
}

## 🔐 Security Features

- Helmet.js for security headers
- CORS protection
- Rate limiting on all endpoints
- Input validation and sanitization
- JWT authentication
- Password hashing (if implementing email/password auth)
- XSS protection
- MongoDB injection prevention

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (development/production) | Yes |
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Yes |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key | Yes |
| `FIREBASE_PROJECT_ID` | Firebase project ID | No |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | No |
| `FIREBASE_CLIENT_EMAIL` | Firebase client email | No |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |

## 🧪 Testing

npm test

## 📦 Project Structure

backend/
├── src/
│ ├── config/ # Configuration files
│ ├── controllers/ # Request handlers
│ ├── middleware/ # Express middleware
│ ├── models/ # Database models
│ ├── routes/ # API routes
│ ├── services/ # Business logic
│ ├── utils/ # Helper functions
│ ├── validators/ # Input validation
│ ├── app.js # Express app setup
│ └── server.js # Server entry point
├── logs/ # Log files
├── .env # Environment variables
├── .gitignore
├── package.json
└── README.md