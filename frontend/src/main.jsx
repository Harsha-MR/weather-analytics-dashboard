import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
// ✅ TEMP DEBUG - Check env variables
// console.log('🔥 Firebase Environment Variables:');
// console.log('API Key:', import.meta.env.VITE_FIREBASE_API_KEY ? '✅ Loaded' : '❌ Missing');
// console.log('Auth Domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
// console.log('Project ID:', import.meta.env.VITE_FIREBASE_PROJECT_ID);
// console.log('App ID:', import.meta.env.VITE_FIREBASE_APP_ID);
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
