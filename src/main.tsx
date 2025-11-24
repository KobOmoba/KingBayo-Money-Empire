import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; 

// CRITICAL: Ensure this file is named main.tsx and is in the src/ folder.

const container = document.getElementById('root');

if (container) {
    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
} else {
    console.error("Root element not found in index.html");
}
