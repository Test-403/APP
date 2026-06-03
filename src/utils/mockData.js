export const generateMockSensorData = () => {
  return {
    pm25: Math.floor(Math.random() * 50) + 10,
    co2: Math.floor(Math.random() * 300) + 350,
    temperature: (Math.random() * 15 + 18).toFixed(1) * 1,
    humidity: (Math.random() * 30 + 30).toFixed(1) * 1,
  };
};

export const generateMockBase64 = () => {
  const data = generateMockSensorData();
  
  const pm25Bytes = [
    Math.floor(data.pm25 / 256),
    data.pm25 % 256
  ];
  
  const co2Bytes = [
    Math.floor(data.co2 / 256),
    data.co2 % 256
  ];
  
  const tempInt = Math.floor(data.temperature * 10);
  const tempBytes = [
    Math.floor(tempInt / 256),
    tempInt % 256
  ];
  
  const humidityInt = Math.floor(data.humidity * 10);
  const humidityBytes = [
    Math.floor(humidityInt / 256),
    humidityInt % 256
  ];
  
  const allBytes = [...pm25Bytes, ...co2Bytes, ...tempBytes, ...humidityBytes];
  const buffer = Buffer.from(allBytes);
  return buffer.toString('base64');
};

export const generateHistoryData = (count = 20) => {
  const history = [];
  const now = Date.now();
  
  for (let i = count - 1; i >= 0; i--) {
    history.push({
      data: generateMockSensorData(),
      timestamp: now - i * 60000,
    });
  }
  
  return history;
};