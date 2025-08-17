# 自定义倒计时器

一个功能丰富的倒计时应用，支持自定义时间设置，可以部署到Cloudflare Workers。

## 功能特点

- **双窗口设计**：倒计时显示窗口 + 管理员设置窗口
- **灵活时间设置**：支持天、时、分、秒的任意组合
- **快速预设**：5分钟、10分钟、25分钟、1小时、1天等常用时间
- **本地存储**：自动保存用户设置，刷新页面后保持
- **开始、暂停、重置**：完整的计时器控制功能
- **响应式设计**：支持桌面和移动设备

## 项目结构

```
/
├── index.html         # 主HTML文件（双窗口界面）
├── script.js          # 计时器功能和窗口切换逻辑
├── styles.css         # CSS样式（双窗口布局）
├── workers-site/      # Cloudflare Workers配置
│   └── index.js
├── wrangler.toml      # Wrangler配置
└── package.json       # 项目依赖
```

## 使用方法

### 倒计时窗口
- 显示当前设置的倒计时时间
- 使用开始、暂停、重置按钮控制计时器
- 显示当前的时间设置信息

### 设置窗口
- 设置天数（0-365）
- 设置小时数（0-23）
- 设置分钟数（0-59）
- 设置秒数（0-59）
- 保存设置或重置为默认值
- 使用快速预设按钮

## 本地开发

1. 安装依赖:
   ```
   npm install
   ```

2. 运行开发服务器:
   ```
   npm start
   ```

3. 浏览器访问:
   ```
   http://localhost:3000
   ```

## 部署到 Cloudflare

1. 安装 Wrangler CLI（如果尚未安装）:
   ```
   npm install -g wrangler
   ```

2. 登录 Cloudflare:
   ```
   wrangler login
   ```

3. 更新 `wrangler.toml` 文件，填入你的 Cloudflare 账户 ID 和区域 ID（如果使用自定义域名）。

4. 部署到 Cloudflare Workers:
   ```
   npm run deploy
   ```

## 技术特性

- **纯前端实现**：无需后端服务器
- **本地存储**：使用 localStorage 保存用户设置
- **响应式设计**：适配各种屏幕尺寸
- **模块化代码**：清晰的代码结构和功能分离

## 许可证

MIT 