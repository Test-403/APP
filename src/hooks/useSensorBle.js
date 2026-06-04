import { useState, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { decode as atob, encode as btoa } from 'base-64';

const bleManager = new BleManager();

const base64ToHexArray = (base64Str) => {
  if (!base64Str) return [];
  const binary = atob(base64Str);
  const hexArray = [];
  for (let i = 0; i < binary.length; i++) {
    hexArray.push(binary.charCodeAt(i).toString(16).padStart(2, '0').toUpperCase());
  }
  return hexArray;
};

const hexArrayToBase64 = (hexArray) => {
  const binary = hexArray.map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
  return btoa(binary);
};
//啊啊啊测试
export const useSensorBle = () => {
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectedDeviceRef = useRef(null);
  const subscriptionRef = useRef(null);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return (
        granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const startScan = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setDevices([]);
    setIsScanning(true);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setIsScanning(false);
        return;
      }
      if (device && device.name) {
        setDevices((prevDevices) => {
          if (!prevDevices.find((d) => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 5000);
  };

  const connectAndRead = async (device) => {
    try {
      setIsConnecting(true);
      bleManager.stopDeviceScan();
      setIsScanning(false);

      const connectedDevice = await device.connect();
      connectedDeviceRef.current = connectedDevice;
      await connectedDevice.discoverAllServicesAndCharacteristics();
      console.log(`成功连接到: ${connectedDevice.name}`);

      // ==========================================
      // 根据你的 nRF Connect 截图，完全纠正的 UUID
      // ==========================================
      const SERVICE_UUID = '0000ffe0-0000-1000-8000-00805f9b34fb'; 
      const WRITE_UUID = '0000ffe1-0000-1000-8000-00805f9b34fb';    // 截图显示 FFE1 是 WRITE NO RESPONSE
      const NOTIFY_UUID = '0000ffe2-0000-1000-8000-00805f9b34fb';   // 截图显示 FFE2 只有 NOTIFY 属性

      // 1. 既然不能 Read，我们必须用回监听！
      console.log('-> 正在开启监听通道等待回传数据...');
      subscriptionRef.current = connectedDevice.monitorCharacteristicForService(
        SERVICE_UUID,
        NOTIFY_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('接收数据报错:', error);
            return;
          }
          if (characteristic && characteristic.value) {
            const responseHex = base64ToHexArray(characteristic.value);
            console.log('<- 收到传感器响应:', responseHex.join(' '));
            
            // 解析数据逻辑
            if (responseHex[0] === '01' && responseHex[1] === '04' && responseHex[2] === '02') {
              const co2Value = parseInt(responseHex[3] + responseHex[4], 16);
              console.log(`✅ 成功解析出 CO2 浓度: ${co2Value} ppm`);
            }
          }
        },
        'sensor_tx'
      );

      // 2. 发送 Modbus 查询指令
      const modbusCommandHex = ['01', '04', '00', '09', '00', '01', 'E1', 'C8'];
      const commandBase64 = hexArrayToBase64(modbusCommandHex);
      
      console.log('-> 正在发送指令:', modbusCommandHex.join(' '));
      
      await connectedDevice.writeCharacteristicWithoutResponseForService(
        SERVICE_UUID,
        WRITE_UUID,
        commandBase64
      );

      setIsConnecting(false);
      return true;

    } catch (error) {
      console.error('连接或数据交互失败:', error);
      setIsConnecting(false);
      return false;
    }
  };

  useEffect(() => {
    return () => {
      if (subscriptionRef.current) subscriptionRef.current.remove();
      if (connectedDeviceRef.current) {
        connectedDeviceRef.current.cancelConnection().catch(() => {});
      }
    };
  }, []);

  return { devices, isScanning, isConnecting, startScan, connectAndRead };
};