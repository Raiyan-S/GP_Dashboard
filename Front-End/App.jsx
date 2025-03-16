import React, { useState } from 'react'; // useState for managing state
import { Helmet } from 'react-helmet-async'; // Helmet for changing page title dynamically
import { Route, Routes, useNavigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardStats from './components/dashboard/DashboardStats';
import ClientOverview from './components/dashboard/ClientOverview';
import ModelTrial from './components/model-trial/ModelTrial';
import ClientsPage from './components/clients/ClientsPage';
import Setting from './components/settings/Settings';

// Main Component
// Used in main.jsx
function App() {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState('dashboard');
  // State to manage the sidebar
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
    navigate('clients');
  };

  return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        {/* Title */}
        <Helmet>
            <title>{getPageTitle() || ""} - FL-ALL</title> 
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
              <Route path="/settings" element={<Setting />} />
            </Routes>
          </main>
        </div>
      </div>
  );
}

export default App;