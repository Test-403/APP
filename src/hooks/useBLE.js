// 蓝牙状态管理Hook - 封装蓝牙状态和操作方法
// 提供给UI组件使用，实现状态与UI的解耦
import { useState, useCallback, useEffect } from 'react';
import BLEService from '../services/BLEService';

export const useBLE = () => {
  // ========== 状态定义 ==========
  
  // 蓝牙连接状态
  // 可选值: 'disconnected'（未连接）| 'scanning'（扫描中）| 'connecting'（连接中）| 'connected'（已连接）
  const [status, setStatus] = useState('disconnected');
  
  // 扫描到的设备列表
  // 每个设备对象: { id, name, rssi }
  const [devices, setDevices] = useState([]);
  
  // 已连接设备的名称
  const [connectedDeviceName, setConnectedDeviceName] = useState('');

  // ========== 方法定义 ==========

  /**
   * 请求蓝牙和位置权限
   * @returns {boolean} - 是否获取到权限
   */
  const requestPermissions = useCallback(async () => {
    return await BLEService.requestPermissions();
  }, []);

  /**
   * 开始扫描蓝牙设备
   * 先检查权限，然后启动扫描，更新状态
   */
  const scanDevices = useCallback(async () => {
    // 先请求权限
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      alert('请先授予蓝牙和位置权限');
      return;
    }
    
    // 更新状态为扫描中
    setStatus('scanning');
    // 清空之前的设备列表
    setDevices([]);

    // 调用BLEService开始扫描
    BLEService.startScan((foundDevices) => {
      // 更新设备列表
      setDevices(foundDevices);
      // 如果没有找到设备，更新状态为未连接
      if (foundDevices.length === 0) {
        setStatus('disconnected');
      }
    });
  }, [requestPermissions]);

  /**
   * 连接到指定设备
   * @param {Object} device - 设备对象，包含id和name
   * @returns {boolean} - 是否连接成功
   */
  const connectDevice = useCallback(async (device) => {
    // 更新状态为连接中
    setStatus('connecting');
    
    // 调用BLEService连接设备
    const success = await BLEService.connectToDevice(device.id);
    
    if (success) {
      // 连接成功，更新状态和设备名称
      setStatus('connected');
      setConnectedDeviceName(device.name);
    } else {
      // 连接失败，更新状态并提示
      setStatus('disconnected');
      alert('连接失败，请重试');
    }
    
    return success;
  }, []);

  /**
   * 断开蓝牙连接
   * 调用BLEService断开连接，并重置所有状态
   */
  const disconnect = useCallback(() => {
    BLEService.disconnect();
    setStatus('disconnected');
    setConnectedDeviceName('');
    setDevices([]);
  }, []);

  /**
   * 开始监听传感器数据
   * @param {Function} callback - 数据回调函数，参数为Base64编码的数据
   */
  const startDataMonitoring = useCallback((callback) => {
    // 检查当前状态是否为已连接
    if (status !== 'connected') {
      throw new Error('设备未连接');
    }
    // 调用BLEService开始监听
    BLEService.startMonitoring(callback);
  }, [status]);

  // ========== 生命周期管理 ==========

  /**
   * 组件卸载时自动断开蓝牙连接
   * 防止内存泄漏和不必要的蓝牙连接
   */
  useEffect(() => {
    // 返回清理函数，组件卸载时执行
    return () => {
      BLEService.disconnect();
    };
  }, []);

  // ========== 返回状态和方法 ==========

  return {
    // 状态
    status,              // 连接状态
    devices,             // 扫描到的设备列表
    connectedDeviceName, // 已连接设备名称
    
    // 方法
    scanDevices,         // 开始扫描设备
    connectDevice,       // 连接到指定设备
    disconnect,          // 断开连接
    startDataMonitoring, // 开始监听数据
  };
};