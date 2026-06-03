export const parseSensorData = (base64Data) => {
  if (!base64Data || typeof base64Data !== 'string') {
    throw new Error('无效的Base64数据');
  }

  try {
    const binaryData = Buffer.from(base64Data, 'base64');
    const hexArray = Array.from(binaryData, byte => 
      byte.toString(16).padStart(2, '0')
    );

    return {
      pm25: parsePM25(hexArray),
      co2: parseCO2(hexArray),
      temperature: parseTemperature(hexArray),
      humidity: parseHumidity(hexArray),
    };
  } catch (error) {
    console.error('数据解析失败:', error);
    throw new Error('数据解析失败');
  }
};

const parsePM25 = (hexArray) => {
  if (hexArray.length < 2) return null;
  return parseInt(hexArray[0] + hexArray[1], 16);
};

const parseCO2 = (hexArray) => {
  if (hexArray.length < 4) return null;
  return parseInt(hexArray[2] + hexArray[3], 16);
};

const parseTemperature = (hexArray) => {
  if (hexArray.length < 6) return null;
  return parseInt(hexArray[4] + hexArray[5], 16) / 10;
};

const parseHumidity = (hexArray) => {
  if (hexArray.length < 8) return null;
  return parseInt(hexArray[6] + hexArray[7], 16) / 10;
};

export const validateData = (data) => {
  if (!data) return false;
  return (
    typeof data.pm25 === 'number' &&
    typeof data.co2 === 'number' &&
    typeof data.temperature === 'number' &&
    typeof data.humidity === 'number'
  );
};

export const formatSensorData = (data) => {
  return {
    pm25: data.pm25?.toFixed(0) || '--',
    co2: data.co2?.toFixed(0) || '--',
    temperature: data.temperature?.toFixed(1) || '--',
    humidity: data.humidity?.toFixed(1) || '--',
  };
};