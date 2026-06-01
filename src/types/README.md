# 类型定义目录

存放 TypeScript 类型定义和接口（如果使用 TypeScript）。

## 文件说明

- `index.js` - 类型导出
- `device.js` - 设备相关类型
- `reading.js` - 读数相关类型
- `api.js` - API 相关类型

## 使用示例（JSDoc 形式）

```javascript
/**
 * @typedef {Object} Device
 * @property {string} id - 设备 ID
 * @property {string} name - 设备名称
 * @property {boolean} isConnected - 连接状态
 */

/**
 * @typedef {Object} Reading
 * @property {number} temperature - 温度
 * @property {number} humidity - 湿度
 * @property {string} timestamp - 时间戳
 */
```

## 如果使用 TypeScript

```typescript
// types/device.ts
export interface Device {
  id: string;
  name: string;
  isConnected: boolean;
}

// types/reading.ts
export interface Reading {
  temperature: number;
  humidity: number;
  timestamp: string;
}
```
