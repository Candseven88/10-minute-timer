# 🚀 Cloudflare Pages + Workers 部署指南

本项目包含静态前端和WebSocket后端，需要同时部署到 Cloudflare Pages 和 Workers。

## 🎯 部署方式

### 方式一：通过 GitHub 连接（推荐）

1. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Clean timer app"
   git push origin main
   ```

2. **在 Cloudflare Pages 创建项目**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 进入 Pages 部分
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 选择你的 GitHub 仓库

3. **配置构建设置**
   - **Project name**: `10-minute-timer`
   - **Production branch**: `main`
   - **Build command**: 留空（静态站点无需构建）
   - **Build output directory**: `/`（根目录）

4. **部署**
   - 点击 "Save and Deploy"
   - 等待部署完成

### 方式二：使用 Wrangler CLI（推荐）

1. **安装依赖**
   ```bash
   npm install
   ```

2. **登录 Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **部署 Worker（WebSocket 后端）**
   ```bash
   npx wrangler deploy
   ```

4. **部署 Pages（前端）**
   ```bash
   npm run deploy
   ```

## 🔧 配置说明

### Durable Objects 配置
项目使用 Durable Objects 来管理 WebSocket 会话状态，配置在 `wrangler.toml` 中：

```toml
[[durable_objects.bindings]]
name = "TIMER_SESSIONS"
class_name = "TimerSession"

[[migrations]]
tag = "v1"
new_classes = ["TimerSession"]
```

### 环境变量
- **前端**：不需要环境变量，所有配置存储在浏览器本地存储中
- **后端**：使用 Durable Objects 绑定，无需额外环境变量

### 自定义域名
如需使用自定义域名，在 Cloudflare Pages 项目设置中添加：
1. 进入项目的 "Custom domains" 设置
2. 添加你的域名
3. 按照指示配置 DNS 记录

### HTTPS 和安全
- Cloudflare Pages 自动提供 HTTPS
- 自动获得 SSL/TLS 证书
- CDN 全球加速
- DDoS 防护

## 📊 性能优化

### 已实现的优化
- ✅ 静态文件压缩
- ✅ HTTP/2 支持
- ✅ CDN 缓存
- ✅ 响应式图片
- ✅ 最小化 CSS/JS
- ✅ WebSocket 长连接复用
- ✅ Durable Objects 状态持久化
- ✅ 自动重连和心跳检测

### Cache 配置
- **静态资源**：Cloudflare 自动处理缓存
- **WebSocket 连接**：使用 Durable Objects 维持状态
- **会话数据**：持久化存储，支持断线恢复

## 🌐 访问地址

部署完成后，你的应用将在以下地址可用：
- **前端（Pages）**: `https://10-minute-timer.pages.dev`
- **后端（Worker）**: `https://10-minute-timer.[your-subdomain].workers.dev`
- **分支域名**: `https://[branch-name].10-minute-timer.pages.dev`

> **注意**：WebSocket 连接会自动路由到正确的 Worker 端点，无需手动配置。

## 🔄 更新部署

### 自动部署
每次推送到 `main` 分支都会自动触发部署。

### 手动部署
```bash
# 方式一：推送代码（自动部署 Pages）
git add .
git commit -m "Update timer app"
git push origin main

# 方式二：使用 Wrangler
# 部署 Worker
npx wrangler deploy

# 部署 Pages
npm run deploy
```

## 📋 部署检查清单

- [ ] 代码推送到 GitHub
- [ ] Cloudflare Pages 项目已创建
- [ ] Cloudflare Worker 已部署
- [ ] Durable Objects 绑定配置正确
- [ ] 构建设置正确配置
- [ ] 部署成功完成
- [ ] 网站可正常访问
- [ ] 本地计时功能正常工作
- [ ] 同步计时功能正常工作
- [ ] WebSocket 连接正常
- [ ] 会话创建和加入功能正常
- [ ] 移动端适配正常
- [ ] 性能指标良好

## 🚨 故障排除

### 常见问题

**Q: Pages 部署失败怎么办？**
A: 检查构建日志，确认所有文件都已正确推送。

**Q: Worker 部署失败怎么办？**
A: 检查 `wrangler.toml` 配置，确认 Durable Objects 绑定正确。

**Q: 网站无法访问？**
A: 检查 DNS 设置和 Cloudflare Pages 状态页面。

**Q: WebSocket 连接失败？**
A: 确认 Worker 已正确部署，检查浏览器开发者工具的网络选项卡。

**Q: 同步计时功能不工作？**
A: 检查浏览器控制台是否有 WebSocket 连接错误，确认 Durable Objects 配置正确。

**Q: 会话无法创建或加入？**
A: 检查网络连接，确认 API 端点可正常访问。

**Q: 移动端显示异常？**
A: 检查 viewport meta 标签和 CSS 媒体查询。

### 联系支持
如遇到技术问题，可以：
- 查看 [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- 在项目仓库提交 Issue
- 联系 Cloudflare 支持

---

**部署成功后，你就拥有了一个高性能、全球可访问的倒计时器应用！** 🎉 