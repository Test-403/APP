// 蓝牙通信相关的UUID常量配置
// UUID (Universally Unique Identifier) 用于标识蓝牙设备的服务和特征

export const BLE_UUIDS = {
  // 服务UUID - 标识蓝牙设备提供的服务类型
  // ZG906R传感器使用的标准服务UUID: 0xFFE0
  // 16位短UUID转换为完整128位UUID格式: 0000XXXX-0000-1000-8000-00805F9B34FB
  SERVICE: '0000FFE0-0000-1000-8000-00805F9B34FB',
  
  // 特征UUID - 标识服务中的具体数据点
  // 数据传输特征，通常支持Notify属性，用于接收传感器数据
  CHARACTERISTIC: '0000FFE1-0000-1000-8000-00805F9B34FB',
};

// 扫描超时时间（毫秒）
// 设置扫描设备的最大时长，超时后自动停止扫描
export const SCAN_TIMEOUT = 10000; // 10秒