import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { setAuthToken } from './services/api';
import './index.css'; // global styles (optional)

// Attach token (if present)
const token = localStorage.getItem('token');
if (token) setAuthToken(token);

// Render the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
