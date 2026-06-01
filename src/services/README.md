# 服务层目录

存放所有业务逻辑和服务类，负责与外部 API、数据库、蓝牙设备等交互。

## 文件说明

- `bleService.js` - 蓝牙服务（扫描、连接、读写）
- `apiService.js` - API 服务（HTTP 请求、数据上传下载）
- `storageService.js` - 存储服务（本地缓存、数据库）
- `authService.js` - 认证服务（登录、注册、Token 管理）

## 使用示例

```javascript
// 在屏幕或组件中调用服务
import { bleService } from '../services/bleService';
import { apiService } from '../services/apiService';

async function handleConnect() {
  const device = await bleService.connectToDevice('device_001');
  const data = await apiService.uploadReading(device);
}
```

## 设计原则

- 服务层只负责业务逻辑，不包含 UI 代码
- 使用 async/await 处理异步操作
- 统一错误处理
- 可被多个屏幕复用
