# 部署指南：Cloudflare Workers与自定义域名

本指南将帮助您将倒计时应用部署到Cloudflare Workers，并绑定自定义域名(10-minute-timer.website)。

## 前提条件

1. 已注册Cloudflare账户
2. 已购买域名(10-minute-timer.website)
3. 已安装Node.js和npm

## 步骤1：安装Wrangler CLI

Wrangler是Cloudflare Workers的命令行工具，用于开发和部署Workers应用。

```bash
npm install -g wrangler
```

## 步骤2：登录Cloudflare账户

```bash
wrangler login
```

这将打开浏览器窗口，要求您授权Wrangler访问您的Cloudflare账户。

## 步骤3：将域名添加到Cloudflare

1. 登录Cloudflare控制台(https://dash.cloudflare.com/)
2. 点击"添加站点"
3. 输入您的域名(10-minute-timer.website)
4. 按照指示更改域名的DNS服务器

> **注意**：更改DNS服务器可能需要24-48小时生效。

## 步骤4：获取Cloudflare账户ID和区域ID

1. 在Cloudflare控制台，选择您的域名
2. 在右侧边栏，找到"账户ID"和"区域ID"

## 步骤5：创建KV命名空间

KV命名空间用于存储应用状态。

```bash
wrangler kv:namespace create STATE_KV
```

这将输出一个命名空间ID，如：`b0453bbd0f5647c581adc4a1a27183af`

## 步骤6：配置wrangler.toml

确保您的wrangler.toml文件包含以下配置：

```toml
name = "10-minute-timer"
workers_dev = true
main = "workers-site/index.js"
compatibility_date = "2025-08-18"

[site]
bucket = "./"

# 自定义域名配置
routes = [
  { pattern = "10-minute-timer.website/*", zone_name = "10-minute-timer.website" }
]

[[kv_namespaces]]
binding = "STATE_KV"
id = "您的KV命名空间ID" # 替换为步骤5中的ID

# 环境变量配置
[vars]
ADMIN_TOKEN = "您的管理员令牌" # 可以自定义
```

## 步骤7：部署应用

```bash
npm run deploy
```

或者直接使用wrangler：

```bash
wrangler publish
```

## 步骤8：配置自定义域名

1. 在Cloudflare控制台，选择您的域名
2. 点击"Workers Routes"选项卡
3. 点击"添加路由"
4. 输入路由模式：`10-minute-timer.website/*`
5. 选择您的Worker：`10-minute-timer`
6. 点击"保存"

## 步骤9：验证部署

访问您的自定义域名：`https://10-minute-timer.website`

## 故障排除

### DNS问题

如果域名无法访问，请检查DNS记录是否正确配置：

1. 在Cloudflare控制台，选择您的域名
2. 点击"DNS"选项卡
3. 确保有一条A记录指向Cloudflare的IP地址

### Workers路由问题

如果Workers路由不生效：

1. 确保域名已完全激活在Cloudflare上
2. 检查wrangler.toml中的routes配置
3. 尝试清除浏览器缓存

### KV存储问题

如果状态同步不工作：

1. 确保KV命名空间ID正确
2. 检查ADMIN_TOKEN是否正确设置

## 更新应用

要更新已部署的应用，只需修改代码后再次运行：

```bash
npm run deploy
```

## 监控和分析

Cloudflare Workers提供了监控和分析功能：

1. 在Cloudflare控制台，选择您的域名
2. 点击"Workers"选项卡
3. 选择您的Worker
4. 查看"指标"选项卡

## 自定义域名SSL证书

Cloudflare自动为您的域名提供SSL证书，无需额外配置。 