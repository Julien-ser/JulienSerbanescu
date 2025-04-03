// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx'; // Import your main App component
// Import your CSS file if you create one for React components
import './react-styles.css'; // Example CSS import

// Handle GitHub Pages routing
// This is needed for client-side routing to work on GitHub Pages
(function(l) {
  if (l.search[1] === '/' ) {
    var decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, null,
        l.pathname.slice(0, -1) + decoded + l.hash
    );
  }
}(window.location))

// Get the root element
const rootElement = document.getElementById('react-root');

// Create the root and render the app
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);