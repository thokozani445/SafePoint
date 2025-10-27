// src/App.jsx
import { useState } from 'react';
import LandingPage from './components/LandingPage';
import StaffApp from './components/StaffApp';
import WhatsAppBot from './components/WhatsAppBot';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  const renderView = () => {
    switch (currentView) {
      case 'staff':
        return <StaffApp onBack={() => setCurrentView('landing')} />;
      case 'whatsapp':
        return <WhatsAppBot onBack={() => setCurrentView('landing')} />;
      case 'admin':
        return <AdminDashboard onBack={() => setCurrentView('landing')} />;
      default:
        return <LandingPage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderView()}
    </div>
  );
}

export default App;