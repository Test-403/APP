# 配置文件目录

存放所有配置文件和环境变量。

## 文件说明

- `appConfig.js` - 应用配置（名称、版本、描述等）
- `apiConfig.js` - API 接口配置（基础 URL、超时时间等）
- `bleConfig.js` - 蓝牙配置（Service UUID、Characteristic UUID 等）
- `env.js` - 环境变量管理

## 使用示例

```javascript
import { API_BASE_URL, API_TIMEOUT } from '../config/apiConfig';
import { BLE_SERVICE_UUID } from '../config/bleConfig';
```
