// client/src/config.js

// Detectamos si estamos en producción (Vercel) o en desarrollo (Localhost)
const isProduction = import.meta.env.MODE === 'production';

export const API_URL = isProduction 
  ? 'https://transporte-mvp.onrender.com/api' // <--- URL REAL DE RENDER
  : 'http://localhost:3001/api';               // <--- TU PC LOCAL