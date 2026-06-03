
import React, { useState } from 'react';
import { SensorProvider } from './src/context/SensorContext';
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import HistoryScreen from './src/screens/HistoryScreen';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'scan':
        return <ScanScreen onBack={handleBack} />;
      case 'history':
        return <HistoryScreen onBack={handleBack} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <SensorProvider>
      {renderPage()}
    </SensorProvider>
  );
}
