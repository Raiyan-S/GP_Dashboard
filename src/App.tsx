import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardStats from './components/DashboardStats';
import ClientOverview from './components/ClientOverview';
import ModelTrial from './components/ModelTrial';
import ClientsPage from './components/clients/ClientsPage';
import SettingsPage from './components/settings/SettingsPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="pl-64">
        <Header title={getPageTitle()} onTabChange={setActiveTab} />

        <main className="px-8 py-6">
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