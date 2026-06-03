import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SensorContext = createContext();

export function SensorProvider({ children }) {
  const [sensorData, setSensorData] = useState({
    pm25: 45,
    co2: 410,
    temperature: 22.5,
    humidity: 58,
  });
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchAiAnalysis = useCallback(() => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAiAnalysis('当前空气质量良好，建议开窗通风。');
      setIsAnalyzing(false);
    }, 2000);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => {
        const newData = {
          pm25: Math.max(0, Math.min(100, prev.pm25 + (Math.random() - 0.5) * 10)),
          co2: Math.max(300, Math.min(1000, prev.co2 + (Math.random() - 0.5) * 20)),
          temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 0.5)),
          humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 2)),
        };
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (sensorData) {
      setHistory(prev => [...prev, {
        timestamp: Date.now(),
        data: { ...sensorData },
      }]);
    }
  }, [sensorData]);

  const value = {
    sensorData,
    aiAnalysis,
    isAnalyzing,
    fetchAiAnalysis,
    history,
    clearHistory,
  };

  return (
    <SensorContext.Provider value={value}>
      {children}
    </SensorContext.Provider>
  );
}

export function useSensor() {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error('useSensor must be used within a SensorProvider');
  }
  return context;
}
