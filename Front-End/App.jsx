import React, { useState } from 'react'; // useState for managing state
import { Helmet, HelmetProvider } from 'react-helmet-async'; // Helmet for changing page title dynamically
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardStats from './components/DashboardStats';
import ClientOverview from './components/ClientOverview';
import ModelTrial from './components/ModelTrial';
import ClientsPage from './components/clients/ClientsPage';
import SettingsPage from './components/settings/SettingsPage';
import HealthCheck from './components/HealthCheck'; // Import the HealthCheck component

// Main Component
// Used in main.jsx
function App() {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  // State to manage the sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'clients': return 'Clients';
      case 'model-trial': return 'Model Trial';
      case 'settings': return 'Settings';
    }
  };

  // Function to handle "See All" button
  const handleSeeAll = () => {
    setActiveTab('clients');
  };

  return (
    <HelmetProvider>
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Title */}
        <Helmet>
          <title>FL-ALL</title>
        </Helmet>

        {/* Sidebar component on mobile view */}
        <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isSidebarOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        />
        
        <div className="lg:pl-64 flex flex-col min-h-screen">
          {/* Header */}
          <Header 
              title={getPageTitle()} 
              setActiveTab={setActiveTab}
              menuClick={() => setSidebarOpen(true)}
            />

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/dashboard" element={<><DashboardStats /><ClientOverview onSeeAll={handleSeeAll} /></>} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/model-trial" element={<ModelTrial />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/health-check" element={<HealthCheck />} /> {/* Add the HealthCheck route */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
    </HelmetProvider>
  );
}

export default App;