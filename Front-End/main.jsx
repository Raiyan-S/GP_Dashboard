import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async'; // Helmet for changing page title dynamically
import { BrowserRouter } from 'react-router-dom'; // BrowserRouter for routing 
import { AuthProvider } from './components/auth/AuthContext'; // AuthProvider for authentication context
// Context provides a way to pass data through the component tree without having to pass props down manually at every level.
// It is used to authenticate user, theme, or preferred language of the application.

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
