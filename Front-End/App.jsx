import React, { useState, useEffect } from 'react'; // useState for managing state
import { Helmet } from 'react-helmet-async'; // Helmet for changing page title dynamically
import { Route, Routes, useNavigate, useLocation, Navigate } from 'react-router-dom'; // useNavigate for event handling like onClick while Navigate for redirecting and used inside JSX 
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
import { authDashboard, authModelTrial, authClients } from './services/api'; // Importing the backend authentication

// Main Component
// Used in main.jsx
function App() {
  // Initialize activeTab from localStorage without a default value
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab');
  });
  
  // State to manage the sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

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

  // Function to handle "See All" button
  const handleSeeAll = () => {
    setActiveTab('clients');
    navigate('clients');
  };

  const showSidebarAndHeader = !['/login', '/register'].includes(location.pathname); // Check if it's not login or register route

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
              setActiveTab={setActiveTab}
              menuClick={() => setSidebarOpen(true)}
            />
          </>
        )}

        {/* The allowedRoles is ghetto but works. I'll have to authenticate from the backend to make it extra secure */}
        <main className={`flex-1 ${showSidebarAndHeader ? 'px-4 sm:px-6 lg:px-8 py-6' : ''}`}>
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