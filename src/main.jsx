// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx'; // Import your main App component
// Import your CSS file if you create one for React components
import './react-styles.css'; // Example CSS import

// Get the root element
const rootElement = document.getElementById('react-root');

// Create the root and render the app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);