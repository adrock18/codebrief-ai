// client/my-app/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // <-- IMPORT
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* <-- WRAP HERE */}
      <App />
    </AuthProvider> {/* <-- AND HERE */}
  </React.StrictMode>
);