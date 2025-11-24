// index.tsx

import React from 'react';
// We need to use the imported createRoot from the importmap
import * as ReactDOMClient from 'react-dom/client';
import App from './App';

// Find the root element
const container = document.getElementById('root');

if (container) {
    // Create the root
    const root = (ReactDOMClient as any).createRoot(container);
    
    // Initial render
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
