import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';

// Root container for the React application
createRoot(document.getElementById('root')).render(
  <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
  </HelmetProvider>
);
