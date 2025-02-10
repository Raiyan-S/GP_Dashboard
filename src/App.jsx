import React, { useState } from 'react'; // useState for managing state
import { Helmet } from 'react-helmet'; // Helmet for changing page title dynamically
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardStats from './components/DashboardStats';
import ClientOverview from './components/ClientOverview';
import ModelTrial from './components/ModelTrial';
import ClientsPage from './components/clients/ClientsPage';
import SettingsPage from './components/settings/SettingsPage';

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
      default: return '';
    }
  };

  // Function to handle "See All" button
  const handleSeeAll = () => {
    setActiveTab('clients');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Title */}
      <Helmet>
        <title>FL-ALL - {getPageTitle()}</title>
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
          {/* Conditionally render components based on the active tab */}
          {activeTab === 'dashboard' && (
            <>
              <DashboardStats />
              <ClientOverview onSeeAll={handleSeeAll} />
            </>
          )}
          {activeTab === 'model-trial' && <ModelTrial />}
          {activeTab === 'clients' && <ClientsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;