import { StrictMode } from 'react'; // StrictMode for highlighting potential problems in an application
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';

// Root container for the React application
createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <AuthProvider>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </AuthProvider>
  </HelmetProvider>
);
