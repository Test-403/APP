import { useEffect, useCallback } from 'react';
import { useSensor } from '../context/SensorContext';
import { parseSensorData, validateData } from '../utils/dataParser';

export const useSensorData = () => {
  const { sensorData, updateSensorData, saveData } = useSensor();

  const handleDataReceived = useCallback((base64Data) => {
    try {
      const parsedData = parseSensorData(base64Data);
      
      if (validateData(parsedData)) {
        updateSensorData(parsedData);
        saveData(parsedData);
      } else {
        console.warn('数据验证失败:', parsedData);
      }
    } catch (error) {
      console.error('数据处理失败:', error);
    }
  }, [updateSensorData, saveData]);

  return { sensorData, handleDataReceived };
};