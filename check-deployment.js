#!/usr/bin/env node
/**
 * 部署状态检查脚本
 * 检查Cloudflare Pages部署状态
 */

const https = require('https');

const urls = [
    'https://10-minute-timer.pages.dev',
    'https://head.10-minute-timer.pages.dev'
];

console.log('🔍 检查部署状态...\n');

async function checkUrl(url) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            const status = res.statusCode;
            const statusText = status === 200 ? '✅ 在线' : 
                               status === 404 ? '❌ 未找到' :
                               `⚠️  状态码: ${status}`;
            
            console.log(`${url}: ${statusText}`);
            resolve({ url, status, ok: status === 200 });
        });
        
        req.on('error', (err) => {
            console.log(`${url}: ❌ 连接失败 - ${err.message}`);
            resolve({ url, status: 0, ok: false, error: err.message });
        });
        
        req.setTimeout(10000, () => {
            req.destroy();
            console.log(`${url}: ⏱️  超时`);
            resolve({ url, status: 0, ok: false, error: 'timeout' });
        });
    });
}

async function main() {
    const results = await Promise.all(urls.map(checkUrl));
    
    console.log('\n📊 检查结果:');
    
    const onlineCount = results.filter(r => r.ok).length;
    const totalCount = results.length;
    
    if (onlineCount === totalCount) {
        console.log('🎉 所有服务都在线！');
    } else if (onlineCount > 0) {
        console.log(`⚠️  ${onlineCount}/${totalCount} 服务在线`);
    } else {
        console.log('❌ 所有服务都离线');
    }
    
    console.log('\n💡 提示:');
    console.log('- 如果主站 (10-minute-timer.pages.dev) 在线，说明部署成功');
    console.log('- head 子域名需要有对应的分支才能访问');
    console.log('- 部署通常需要1-3分钟生效');
}

main().catch(console.error); 