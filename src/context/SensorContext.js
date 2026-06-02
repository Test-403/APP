import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateMockSensorData, generateHistoryData } from '../utils/mockData';

const SensorContext = createContext(null);

export const SensorProvider = ({ children, useMock = true }) => {
  const [sensorData, setSensorData] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateSensorData = useCallback((data) => {
    setSensorData(data);
    setHistory(prev => {
      const newHistory = [...prev, { data, timestamp: Date.now() }];
      return newHistory.slice(-50);
    });
  }, []);

  const saveData = useCallback(async (data) => {
    try {
      await AsyncStorage.setItem(
        'latestSensorData', 
        JSON.stringify({ data, timestamp: Date.now() })
      );
      await AsyncStorage.setItem(
        'sensorHistory', 
        JSON.stringify(history)
      );
    } catch (error) {
      console.warn('保存数据失败:', error);
    }
  }, [history]);

  const loadLatestData = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem('latestSensorData');
      const savedHistory = await AsyncStorage.getItem('sensorHistory');
      
      if (saved) {
        const parsed = JSON.parse(saved);
        setSensorData(parsed.data);
      } else if (useMock) {
        setSensorData(generateMockSensorData());
      }
      
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      } else if (useMock) {
        setHistory(generateHistoryData(10));
      }
    } catch (error) {
      console.warn('读取历史数据失败:', error);
      if (useMock) {
        setSensorData(generateMockSensorData());
        setHistory(generateHistoryData(10));
      }
    } finally {
      setIsLoading(false);
    }
  }, [useMock]);

  const generateMockData = useCallback(() => {
    const mockData = generateMockSensorData();
    updateSensorData(mockData);
    saveData(mockData);
    return mockData;
  }, [updateSensorData, saveData]);

  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('sensorHistory');
      await AsyncStorage.removeItem('latestSensorData');
      setHistory([]);
      setSensorData(null);
    } catch (error) {
      console.warn('清除数据失败:', error);
    }
  }, []);

  const fetchAiAnalysis = useCallback(async () => {
    if (!sensorData) return;
    
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const pm25Level = sensorData.pm25;
      const co2Level = sensorData.co2;
      
      let analysis = '';
      if (pm25Level < 35 && co2Level < 1000) {
        analysis = '当前空气质量良好，适合户外活动。建议保持室内通风，呼吸新鲜空气有益健康。';
      } else if (pm25Level >= 35 && pm25Level < 75) {
        analysis = '当前空气质量轻度污染，敏感人群应减少户外活动时间。建议佩戴口罩出行。';
      } else if (co2Level >= 1000 && co2Level < 1500) {
        analysis = '室内二氧化碳浓度偏高，建议及时开窗通风，保持空气流通。';
      } else {
        analysis = '当前空气质量较差，建议减少外出，保持室内空气净化设备开启。';
      }
      setAiAnalysis(analysis);
    } catch (error) {
      setAiAnalysis('获取分析失败，请稍后重试');
    } finally {
      setIsAnalyzing(false);
    }
  }, [sensorData]);

  useEffect(() => {
    loadLatestData();
  }, [loadLatestData]);

  return (
    <SensorContext.Provider value={{
      sensorData,
      history,
      isLoading,
      aiAnalysis,
      isAnalyzing,
      updateSensorData,
      saveData,
      clearHistory,
      fetchAiAnalysis,
      generateMockData,
    }}>
      {children}
    </SensorContext.Provider>
  );
};

export const useSensor = () => {
  const context = useContext(SensorContext);
  if (!context) {
    throw new Error('useSensor must be used within a SensorProvider');
  }
  return context;
};