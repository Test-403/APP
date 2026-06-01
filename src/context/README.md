# 全局状态上下文目录

存放 React Context，用于全局状态管理。

## 文件说明

- `AppContext.js` - 应用全局状态
- `BluetoothContext.js` - 蓝牙连接状态
- `AuthContext.js` - 用户认证状态
- `ThemeContext.js` - 主题状态

## 使用示例

```javascript
// App.js
import { BluetoothProvider } from './context/BluetoothContext';

function App() {
  return (
    <BluetoothProvider>
      <Navigation />
    </BluetoothProvider>
  );
}

// 在组件中使用
import { useContext } from 'react';
import { BluetoothContext } from './context/BluetoothContext';

function DeviceScreen() {
  const { connectedDevice, isConnected } = useContext(BluetoothContext);
  // ...
}
```

## 使用场景

- 全局配置
- 用户信息
- 主题切换
- 蓝牙连接状态
- 其他跨组件共享的状态
