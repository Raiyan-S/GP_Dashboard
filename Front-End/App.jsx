import React, { useState, useEffect } from 'react'; // useState for managing state and useEffect for side effects
import { Helmet } from 'react-helmet-async'; // Helmet for changing page title dynamically
import { Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom'; // useNavigate for event handling like onClick while Navigate for redirecting and used inside JSX 

// JSX Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardStats from './components/dashboard/DashboardStats';
import ClientOverview from './components/dashboard/ClientOverview';
import ModelTrial from './components/model-trial/ModelTrial';
import ClientsPage from './components/clients/ClientsPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectRoute';
import Unauthorized from './components/auth/Unauthorized'; 

// Importing the backend authentication
import { authDashboard, authModelTrial, authClients } from './services/api'; 

// Main Component
// Used in main.jsx
function App() {
  // Initialize activeTab from localStorage without a default value
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab');
  });
  
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to manage the sidebar
  const navigate = useNavigate(); // useNavigate for event handling like onClick
  const location = useLocation(); // useLocation to get the current route

  // Effect to store the active tab each time in localStorage
  // This effect runs every time the activeTab changes
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  // This function is used to set the title of the page dynamically based on the active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'clients': return 'Clients';
      case 'model-trial': return 'Model Trial';
      case 'settings': return 'Settings';
      case 'login': return 'Login';
      case 'register': return 'Register';
    }
  };

  // Function to handle "See All" button click in the ClientOverview component
  const handleSeeAll = () => {
    setActiveTab('clients');
    navigate('clients');
  };

  // Hide the sidebar and header for login and register routes
  const showSidebarAndHeader = !['/login', '/register'].includes(location.pathname); // Check if it's not login or register route and return true or false

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Title */}
      <Helmet>
        <title>{getPageTitle() || ""} - FL-ALL</title>
      </Helmet>

      <div className={`flex flex-col min-h-screen ${showSidebarAndHeader ? 'lg:pl-64' : ''}`}>
        {/* Conditionally render Sidebar and Header */}
        {showSidebarAndHeader && (
          <>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isSidebarOpen={isSidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <Header
              title={getPageTitle()}
              menuClick={() => setSidebarOpen(true)}
            />
          </>
        )}

        <main className={`flex-1 ${showSidebarAndHeader ? 'px-4 sm:px-6 lg:px-8 py-6' : ''}`}>
          {/* The Routes component is used to define the different routes of the application */}
          {/* Each Route component defines a path and the component to render when that path is matched */}
          {/* The ProtectedRoute component is used to protect certain routes based on user roles */}
          {/* allowedRoles handles the frontend authorization while fetchAuth handles the backend authorization */}
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login setActiveTab={setActiveTab} />} />
            <Route path="/register" element={<Register setActiveTab={setActiveTab} />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<><DashboardStats /><ClientOverview onSeeAll={handleSeeAll} /></>} allowedRoles={['admin']} fetchAuth={authDashboard} />} />
            <Route path="/clients" element={<ProtectedRoute element={<ClientsPage />} allowedRoles={['admin']} fetchAuth={authClients} />} />
            <Route path="/model-trial" element={<ProtectedRoute element={<ModelTrial />} allowedRoles={['admin', 'clinic']} fetchAuth={authModelTrial} />} />
            <Route path="/unauthorized" element={<Unauthorized />} /> 
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;