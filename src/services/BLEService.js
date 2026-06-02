// 蓝牙服务类 - 封装所有蓝牙底层操作
// 使用单例模式，确保全局只有一个蓝牙管理器实例
import { BleManager } from 'react-native-ble-plx';
import { BLE_UUIDS, SCAN_TIMEOUT } from '../constants/bleUUIDs';

class BLEService {
  // 构造函数 - 初始化蓝牙管理器和状态
  constructor() {
    this.manager = new BleManager();  // 创建蓝牙管理器实例
    this.connectedDevice = null;      // 当前已连接的设备对象
    this.dataCallback = null;         // 数据接收回调函数
    this.scanTimeout = null;          // 扫描超时定时器ID
  }

  /**
   * 请求蓝牙和位置权限（Android必需）
   * @returns {boolean} - 是否获取到权限
   */
  async requestPermissions() {
    try {
      // 动态导入expo-permissions以避免打包体积过大
      const { Permissions } = await import('expo-permissions');
      // 请求蓝牙权限
      const bluetoothStatus = await Permissions.askAsync(Permissions.BLUETOOTH);
      // 请求位置权限（Android扫描蓝牙需要位置权限）
      const locationStatus = await Permissions.askAsync(Permissions.LOCATION);
      // 返回是否同时获取到两个权限
      return bluetoothStatus.status === 'granted' && locationStatus.status === 'granted';
    } catch (error) {
      console.error('权限申请失败:', error);
      return false;
    }
  }

  /**
   * 开始扫描蓝牙设备
   * @param {Function} callback - 扫描结果回调函数，参数为设备列表
   */
  startScan(callback) {
    // 先停止之前的扫描（如果正在扫描）
    this.stopScan();
    
    // 设置扫描超时定时器，超时后停止扫描并返回空列表
    this.scanTimeout = setTimeout(() => {
      this.stopScan();
      callback([]);
    }, SCAN_TIMEOUT);

    // 开始扫描设备
    // 参数1: 服务UUID数组 - 只扫描支持指定服务的设备
    // 参数2: 扫描选项
    // 参数3: 回调函数 - 每发现一个设备或发生错误时调用
    this.manager.startDeviceScan(
      [BLE_UUIDS.SERVICE],  // 只扫描支持我们服务UUID的设备
      null,
      (error, device) => {
        // 如果发生错误，停止扫描并返回空列表
        if (error) {
          console.error('扫描错误:', error);
          this.stopScan();
          callback([]);
          return;
        }
        
        // 如果发现设备，停止扫描并返回设备信息
        if (device) {
          this.stopScan();
          callback([{
            id: device.id,           // 设备唯一标识
            name: device.name || '未知设备', // 设备名称（默认"未知设备"）
            rssi: device.rssi,       // 信号强度
          }]);
        }
      }
    );
  }

  /**
   * 停止扫描设备
   * 清除超时定时器并停止蓝牙扫描
   */
  stopScan() {
    // 清除扫描超时定时器
    if (this.scanTimeout) {
      clearTimeout(this.scanTimeout);
      this.scanTimeout = null;
    }
    // 停止蓝牙扫描
    this.manager.stopDeviceScan();
  }

  /**
   * 连接到指定设备
   * @param {string} deviceId - 设备ID
   * @returns {boolean} - 是否连接成功
   */
  async connectToDevice(deviceId) {
    try {
      // 通过设备ID连接设备
      const device = await this.manager.connectToDevice(deviceId);
      // 保存连接的设备对象
      this.connectedDevice = device;
      // 发现设备的所有服务和特征（必须调用此方法才能操作特征）
      await device.discoverAllServicesAndCharacteristics();
      // 连接成功
      return true;
    } catch (error) {
      console.error('连接失败:', error);
      return false;
    }
  }

  /**
   * 开始监听传感器数据
   * 订阅特征值的Notify，当特征值变化时自动触发回调
   * @param {Function} callback - 数据回调函数，参数为接收到的Base64编码数据
   */
  startMonitoring(callback) {
    // 检查是否已连接设备
    if (!this.connectedDevice) {
      throw new Error('未连接设备');
    }
    
    // 保存数据回调函数
    this.dataCallback = callback;
    
    // 监听指定服务的特征值变化
    // 参数1: 服务UUID
    // 参数2: 特征UUID
    // 参数3: 回调函数 - 当特征值变化时调用
    this.connectedDevice.monitorCharacteristicForService(
      BLE_UUIDS.SERVICE,
      BLE_UUIDS.CHARACTERISTIC,
      (error, characteristic) => {
        // 如果发生错误，打印日志并返回
        if (error) {
          console.error('监听错误:', error);
          return;
        }
        
        // 如果收到数据且回调函数存在，调用回调传递数据
        // characteristic.value 是Base64编码的字符串
        if (characteristic?.value && this.dataCallback) {
          this.dataCallback(characteristic.value);
        }
      }
    );
  }

  /**
   * 断开蓝牙连接
   * 取消设备连接并重置状态
   */
  async disconnect() {
    // 如果有已连接的设备
    if (this.connectedDevice) {
      // 取消设备连接
      await this.manager.cancelDeviceConnection(this.connectedDevice.id);
      // 重置设备对象
      this.connectedDevice = null;
      // 重置数据回调
      this.dataCallback = null;
    }
  }
}

// 导出单例实例 - 全局共享同一个BLEService对象
export default new BLEService();