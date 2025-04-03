// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx'; // Import your main App component
// Import your CSS file if you create one for React components
import './react-styles.css'; // Example CSS import

// Find the div in your index.html where React will mount
const rootElement = document.getElementById('react-root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  console.error("Failed to find the root element '#react-root'. Make sure it exists in your index.html.");
}