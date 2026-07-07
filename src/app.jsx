import React, { useState } from 'react';
import Authentication from './Authentication'; 
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import DashboardView from './DashboardView'; 
import UrlScannerView from './UrlScannerView'; 
import MessageShieldView from './MessageShieldView'; 
import QrGuardView from './QRguardscanner'; 
import EmailScanner from './EmailScanner'; // 👈 Added EmailScanner Import

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  // View manager router 
  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'url-scanner': return <UrlScannerView />;
      case 'message-shield': return <MessageShieldView />;
      case 'qr-guard': return <QrGuardView />;
      case 'email-scanner': return <EmailScanner />; // 👈 Added Router State Case
      default: return <DashboardView />;
    }
  };

  // Condition 1: If user is not authenticated, load the login screen ONLY
  if (!isAuthenticated) {
    return (
      <Authentication onAuthenticate={() => setIsAuthenticated(true)} />
    );
  }

  // Condition 2: Once logged in, completely replace the window context with the main website architecture
  return (
    <div className="flex h-screen bg-[#090d16] text-gray-200 overflow-hidden font-mono animate-fade-in">
      {/* Structural Website Navigation Sidebar */}
      {/* Note: Ensure you update your <Sidebar /> component internal menu buttons to pass 'email-scanner' to setCurrentView */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      {/* Core Website Panel Content Workspace Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 bg-[#090d16]">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default App;