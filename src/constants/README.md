# 常量定义目录

存放项目中使用的各种常量。

## 文件说明

- `colors.js` - 颜色常量
- `strings.js` - 文本常量（提示语、按钮文字等）
- `routes.js` - 路由名称常量
- `storageKeys.js` - 本地存储键名常量

## 使用示例

```javascript
import { COLORS } from '../constants/colors';
import { STRINGS } from '../constants/strings';

function MyComponent() {
  return (
    <Text style={{ color: COLORS.primary }}>
      {STRINGS.welcome}
    </Text>
  );
}
```

## 优点

- 统一管理
- 易于维护
- 支持多语言（将文本提取到 strings.js）
- 避免硬编码
