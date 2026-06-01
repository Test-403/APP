# 可复用组件目录

存放通用的、可复用的 UI 组件。

## 文件命名规范

- 使用 PascalCase（大驼峰）命名
- 文件名与组件名一致
- 例如：`DeviceCard.js`, `LoadingSpinner.js`, `ScanButton.js`

## 与 screens 的区别

| 类型 | 位置 | 用途 | 示例 |
|------|------|------|------|
| **screens** | `src/screens/` | 完整页面，对应路由 | `HomeScreen.js` |
| **components** | `src/components/` | 可复用 UI 组件 | `DeviceCard.js` |

## 组件分类

### 基础组件
- Button、Input、Card 等通用组件
- 通常是对 `react-native-paper` 的封装

### 业务组件
- 与业务相关的组件
- 例如：`DeviceDashboard.js`（设备仪表盘）
- 例如：`HistoryTrend.js`（历史趋势图）
- 例如：`ScanModal.js`（扫描弹窗）

## 使用示例

```javascript
// src/components/DeviceCard.js
import React from 'react';
import { Card, Text } from 'react-native-paper';
import { COLORS } from '../constants/colors';

export default function DeviceCard({ device, onPress }) {
  return (
    <Card onPress={onPress}>
      <Card.Content>
        <Text variant="titleMedium">{device.name}</Text>
        <Text variant="bodySmall">
          状态：{device.isConnected ? '已连接' : '未连接'}
        </Text>
      </Card.Content>
    </Card>
  );
}

// 在 screen 中使用
import DeviceCard from '../components/DeviceCard';

function DeviceScreen() {
  return (
    <DeviceCard 
      device={currentDevice} 
      onPress={handleConnect} 
    />
  );
}
```

## 设计原则

- 保持组件小而专注（单一职责）
- 使用 props 传递数据和回调
- 避免在组件中包含业务逻辑
- 尽量保持无状态（使用函数组件）
- 易于在多个 screens 中复用
