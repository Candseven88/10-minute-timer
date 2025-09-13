# Build Instructions for Cloudflare Pages

## 🔧 正确的构建配置

### 问题分析
Cloudflare Pages自动检测到了Next.js配置并尝试运行`npx next build`，但这是一个Vite项目。

### 解决方案

#### 方法1: 在Cloudflare Dashboard中手动配置 (推荐)

1. **登录Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 进入Pages项目设置

2. **正确的构建设置**
   ```
   Framework preset: None (不要选择Next.js)
   Build command: npm run build
   Build output directory: dist
   Root directory: (留空)
   Node.js version: 18
   ```

3. **环境变量 (可选)**
   ```
   NODE_ENV=production
   ```

#### 方法2: 删除错误的配置文件

如果Cloudflare仍然检测为Next.js，检查是否有以下文件：
- `next.config.js` (删除)
- `pages/` 目录 (删除)
- `app/` 目录 (删除)

### 验证构建

在本地测试构建：
```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm install

# 测试构建
npm run build

# 预览构建结果
npm run preview
```

### 预期构建输出

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
├── robots.txt
├── sitemap.xml
├── timer-icon.svg
├── site.webmanifest
├── _headers
└── _redirects
```

### 故障排除

1. **Framework Detection Error**
   - 在Cloudflare设置中选择 "None" 而不是 "Next.js"
   - 确保build command是 `npm run build`

2. **Build Command Error**
   - 使用 `npm run build` 而不是 `npx next build`
   - 确保package.json中有正确的脚本

3. **Output Directory Error**
   - 输出目录应该是 `dist` 而不是 `.next`

### 重新部署步骤

1. 在Cloudflare Pages项目中，进入 "Settings" → "Builds & deployments"
2. 更新构建配置：
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: dist
   ```
3. 点击 "Save"
4. 进入 "Deployments" 并点击 "Retry deployment"

如果问题仍然存在，可以选择删除当前项目并重新创建，确保不选择任何框架预设。 