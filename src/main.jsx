// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx'; // Import your main App component
// Import your CSS file if you create one for React components
import './react-styles.css'; // Example CSS import

const rootElement = document.getElementById('react-root');

if (!rootElement) {
  const div = document.createElement('div');
  div.id = 'react-root';
  document.body.appendChild(div);
}

ReactDOM.createRoot(rootElement || document.getElementById('react-root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);