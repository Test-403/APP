# 工具函数目录

存放纯工具函数，不包含业务逻辑。

## 文件说明

- `formatUtils.js` - 格式化工具（日期、数字、单位转换）
- `validationUtils.js` - 验证工具（表单验证、数据校验）
- `cryptoUtils.js` - 加密工具（Base64、MD5、AES）
- `bleUtils.js` - 蓝牙工具（数据解析、编码）

## 使用示例

```javascript
import { formatDate } from '../utils/formatUtils';
import { base64ToHex } from '../utils/bleUtils';

const dateStr = formatDate(new Date());
const hexData = base64ToHex(characteristic.value);
```

## 特点

- 纯函数，无副作用
- 可被任何地方调用
- 易于测试
