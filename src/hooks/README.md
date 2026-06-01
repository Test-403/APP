# 自定义 Hooks 目录

存放 React Hooks 函数，用于复用状态逻辑。

## 文件说明

- `useBluetooth.js` - 蓝牙连接 Hook
- `useApi.js` - API 请求 Hook
- `useStorage.js` - 本地存储 Hook
- `useAuth.js` - 认证状态 Hook

## 使用示例

```javascript
import { useBluetooth } from '../hooks/useBluetooth';

function DeviceScreen() {
  const { devices, connect, disconnect } = useBluetooth();
  
  return (
    <View>
      {devices.map(device => (
        <Button onPress={() => connect(device)} title={device.name} />
      ))}
    </View>
  );
}
```

## 命名规范

- 文件名：`useXxx.js`
- Hook 名：与文件名一致
- 返回值：对象形式，包含状态和方法
