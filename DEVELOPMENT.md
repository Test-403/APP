# 协同开发指南

## 项目概述

- **技术栈**：Expo SDK 52 + React Native 0.76.6
- **核心功能**：蓝牙设备连接 + 大语言模型 API 调用
- **UI 组件库**：React Native Paper

## 一、开发环境准备

### 1. 基础环境
```bash
# Node.js 18+ (推荐 20+)
node -v

# 安装依赖
npm install
```

### 2. 项目依赖
```bash
# 核心依赖（已安装）
- expo: ~52.0.49
- react-native-ble-plx: ^3.5.1  # 蓝牙库
- react-native-paper: ^6.x  # UI 组件库
- react-native-vector-icons: ^10.x  # 图标库
- expo-asset: ~11.0.5  # 资源管理
- expo-dev-client: ~5.0.20  # 开发客户端
```

## 二、开发流程

### 1. 启动开发服务器
```bash
npx expo start
```

### 2. 连接手机调试

**方式一：扫码连接（推荐）**
- 手机安装 Development Build APK（见第三章）
- 手机和电脑连接**同一 Wi-Fi**
- 打开 APP 扫描二维码

**方式二：手动输入地址连接**
- 手机安装 Development Build APK
- 手机和电脑连接**同一 Wi-Fi**
- 在 APP 登录界面手动输入开发服务器地址
- 格式：`exp://电脑IP地址:8081`
- 例如：`exp://192.168.1.100:8081`

**如果扫码失败，请使用手动输入地址方式连接**

### 3. 热更新机制
✅ **以下修改会自动同步到手机（无需重新打包）：**
- 修改界面代码（`.js`, `.jsx`）
- 修改业务逻辑（蓝牙连接、API 调用）
- 修改样式（`StyleSheet`）
- 添加纯 JavaScript 文件

❌ **以下情况需要重新打包：**
- 安装/更新原生模块（如 `expo-camera`、`expo-location` 等）
- 修改 `app.json` 配置（权限、包名等）
- 升级 Expo SDK 版本

## 三、APK 打包说明（负责人专属）

⚠️ **注意：只有项目负责人需要进行 APK 打包，界面开发人员无需打包！**

### 1. 打包 Development Build
```bash
# 开发版本（用于调试）
eas build --profile development --platform android

# 预览版本（用于测试）
eas build --profile preview --platform android

# 生产版本（用于发布）
eas build --profile production --platform android
```

### 2. 下载安装
- 打包完成后，EAS 会提供下载链接
- 下载 APK 文件
- 分发给所有开发/测试人员安装

### 3. 重要提醒
⚠️ **每次安装新的原生依赖后，负责人必须重新打包 APK！**

```bash
# 错误示例：只安装依赖不打包
npx expo install expo-camera  # ❌ 开发人员手机会报错

# 正确流程
npx expo install expo-camera
eas build --profile development --platform android  # ✅ 重新打包
# 下载新 APK 分发给所有开发人员
```

### 4. 界面开发人员
✅ **界面开发人员只需：**
1. 安装负责人提供的 APK
2. 运行 `npx expo start` 启动开发服务器
3. 手机扫描二维码进行调试
4. 修改界面代码会自动热更新，**无需重新打包**

## 四、代码协作规范

### 1. Git 分支管理
```bash
# 主分支（稳定版本）
main

# 开发分支
dev

# 功能分支
feature/bluetooth-connection
feature/llm-api
```

### 2. 提交规范
```bash
# 格式：type(scope): description
git commit -m "feat(bluetooth): 添加设备扫描功能"
git commit -m "fix(api): 修复网络请求超时问题"
git commit -m "docs: 更新开发文档"
```

### 3. 依赖管理
- ✅ 使用 `npx expo install <package>` 安装依赖
- ✅ 提交 `package.json` 和 `package-lock.json`
- ❌ 不要提交 `node_modules/` 目录

### 4. 环境变量
- API Key 等敏感信息使用 `.env` 文件
- `.env` 文件已加入 `.gitignore`，不会上传
- 示例：
```env
LLM_API_KEY=your_api_key_here
API_BASE_URL=https://api.example.com
```

## 五、蓝牙开发注意事项

### 1. 权限配置
已在 `app.json` 中配置：
- Android: 蓝牙、位置权限
- iOS: 蓝牙权限

### 2. 真机调试
- ❌ 模拟器不支持蓝牙
- ✅ 必须使用真实手机
- ✅ Android 手机需要开启定位服务

### 3. 开发工具
推荐安装 **nRF Connect**（Android/iOS）：
- 扫描周围蓝牙设备
- 查看 Service UUID 和 Characteristic UUID
- 测试设备通信协议

## 六、常见问题

### Q1: 手机扫码后连接失败
**解决：**
- 检查手机和电脑是否在同一 Wi-Fi
- 检查防火墙是否阻止连接
- 重启 `npx expo start`

### Q2: 报错缺少某个包
**解决：**
```bash
# 1. 安装缺失的包
npx expo install <package-name>

# 2. 重新打包 APK
eas build --profile development --platform android

# 3. 下载并安装新 APK 到手机
```

### Q3: 蓝牙无法扫描到设备
**解决：**
- 确认手机已开启蓝牙和定位服务
- 确认设备已开启广播模式
- 使用 nRF Connect 确认设备可被扫描

### Q4: 原生模块报错
**解决：**
```bash
# 清理并重新生成原生代码
npx expo prebuild --clean

# 重新打包
eas build --profile development --platform android
```

## 七、快速开始

### 新成员加入项目步骤

```bash
# 1. 克隆项目
git clone <repository-url>
cd APP

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npx expo start

# 4. 安装 Development Build APK
# 从项目负责人获取最新 APK 文件并安装

# 5. 扫描二维码开始开发
```

### 角色分工

| 角色 | 职责 | 需要打包吗？ |
|------|------|-------------|
| **项目负责人** | 管理依赖、配置权限、打包 APK | ✅ 需要 |
| **界面开发人员** | 开发 UI 界面、修改样式、调试逻辑 | ❌ 不需要 |

## 八、项目结构

### 新架构目录

```
APP/
├── src/                          # 源代码目录
│   ├── components/               # 可复用组件
│   ├── config/                   # 配置文件（API、蓝牙、主题）
│   ├── screens/                  # 屏幕页面（完整页面）
│   ├── services/                 # 服务层（蓝牙、API、存储）
│   ├── utils/                    # 工具函数（格式化、解析）
│   ├── hooks/                    # 自定义 Hooks
│   ├── context/                  # 全局状态
│   ├── constants/                # 常量定义（颜色、文本）
│   └── types/                    # 类型定义
├── assets/                       # 静态资源
├── App.js                        # 应用入口
├── package.json                  # 依赖配置
├── app.json                      # Expo 配置
├── eas.json                      # EAS 构建配置
└── DEVELOPMENT.md                # 开发指南
```

### 文件职责说明

| 文件夹 | 职责 | 示例 |
|--------|------|------|
| `src/components/` | 可复用组件 | DeviceCard.js, ScanModal.js |
| `src/config/` | 配置文件 | API 地址、蓝牙 UUID |
| `src/screens/` | 完整页面 | HomeScreen.js, DeviceScreen.js |
| `src/services/` | 业务服务 | bleService.js, apiService.js |
| `src/utils/` | 工具函数 | formatUtils.js, bleUtils.js |
| `src/hooks/` | 自定义 Hooks | useBluetooth.js |
| `src/context/` | 全局状态 | AppContext.js, BluetoothContext.js |
| `src/constants/` | 常量定义 | colors.js, strings.js |
| `src/types/` | 类型定义 | device.js, reading.js |

### 文件夹说明

每个文件夹内都有 `README.md` 文档，详细说明该文件夹的用途和开发规范。

**开发前请先阅读对应文件夹的 README.md**

## 九、联系方式

如有问题，请在团队群组中提问或查看项目文档。
