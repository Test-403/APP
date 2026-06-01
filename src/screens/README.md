# 屏幕页面目录

存放所有完整的屏幕页面组件。

## 文件命名规范

- 使用 PascalCase（大驼峰）命名
- 文件名与组件名一致
- 例如：`HomeScreen.js`, `DeviceScreen.js`, `HistoryScreen.js`

## 目录结构建议

```
screens/
├── HomeScreen.js          # 首页
├── DeviceScreen.js        # 设备连接页
├── HistoryScreen.js       # 历史数据页
├── SettingsScreen.js      # 设置页
└── LoginScreen.js         # 登录页
```

## 与 components 的区别

- **screens**: 完整的页面，对应导航路由
- **components**: 可复用的 UI 组件，被 screens 引用
