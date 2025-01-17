import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardStats from './components/DashboardStats';
import ClientOverview from './components/ClientOverview';
import ModelTrial from './components/ModelTrial';
import ClientsPage from './components/clients/ClientsPage';
import SettingsPage from './components/settings/SettingsPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const handleSeeAll = () => {
    setActiveTab('clients');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Helmet>
        <title>{getPageTitle()} - FL-ALL Dashboard</title>
      </Helmet>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header 
          title={getPageTitle()} 
          onTabChange={setActiveTab}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
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