import { StrictMode } from 'react'; // StrictMode for highlighting potential problems in an application
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Root container for the React application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
