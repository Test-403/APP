import { useState } from 'react';
import Constants from 'expo-constants';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const FALLBACK_API_KEY = 'sk-9078091e27f64714a56d52eee058ae68';

const getApiKey = () => {
  const fromConfig = Constants.expoConfig?.extra?.DEEPSEEK_API_KEY;
  const fromEnv = process.env.DEEPSEEK_API_KEY;
  
  if (fromConfig) {
    console.log('API Key loaded from expo config');
    return fromConfig;
  }
  
  if (fromEnv) {
    console.log('API Key loaded from env');
    return fromEnv;
  }
  
  console.log('API Key not found, using fallback');
  return FALLBACK_API_KEY;
};

const API_KEY = getApiKey();

export default function useAIReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [reportText, setReportText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const generateReport = async (sensorData) => {
    if (!API_KEY) {
      setErrorMsg('API Key 未配置');
      return;
    }

    if (!sensorData || typeof sensorData !== 'object') {
      setErrorMsg('无效的传感器数据');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setReportText('');

    try {
      const { temp, co2, pm25, hcho } = sensorData;
      
      const prompt = `请分析以下环境传感器数据：
温度：${temp}°C
二氧化碳：${co2} ppm
PM2.5：${pm25} μg/m³
甲醛：${hcho} mg/m³

请给出环境质量评估和健康建议。并固定按照下列格式返回给我：
环境质量评估：‘’；

健康建议：‘’；

温度分析：‘’；

二氧化碳数值分析：‘’；

PM2.5数值分析：‘’；

甲醛数值分析：‘’。
`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 15000);

      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error?.message || `HTTP 错误: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        const result = data.choices[0].message?.content || '';
        setReportText(result);
      } else {
        throw new Error('API 返回格式异常');
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        setErrorMsg('请求超时，已自动中断');
      } else {
        setErrorMsg(error.message || '请求失败');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    reportText,
    errorMsg,
    generateReport,
  };
}