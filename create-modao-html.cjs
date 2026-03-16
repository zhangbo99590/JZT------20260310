const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const htmlPath = path.join(distPath, 'index.html');
const cssPath = path.join(distPath, 'assets', 'index-DN2LNgQV.css');
const outputPath = path.join(__dirname, 'modao-preview.html');

// Read files
const html = fs.readFileSync(htmlPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

// Create standalone HTML with inline CSS
let output = html;

// Remove all script tags
output = output.replace(/<script[^>]*>.*?<\/script>/gs, '');
output = output.replace(/<script[^>]*\/>/g, '');

// Remove all link tags
output = output.replace(/<link[^>]*>/g, '');

// Add inline CSS before </head>
output = output.replace('</head>', `  <style>\n${css}\n  </style>\n  </head>`);

// Add static content to the root div for preview
const staticContent = `
    <div id="root">
      <div style="padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <h1 style="color: #1890ff; margin-bottom: 20px;">璟智通管理系统</h1>
        <p style="color: #666; margin-bottom: 30px;">这是一个静态预览版本，可在墨刀中编辑。</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-bottom: 15px;">系统功能</h2>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 10px; background: white; margin-bottom: 10px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">📋 政策查询与匹配</li>
            <li style="padding: 10px; background: white; margin-bottom: 10px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">🤖 AI智能搜索</li>
            <li style="padding: 10px; background: white; margin-bottom: 10px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">📊 数据分析与报表</li>
            <li style="padding: 10px; background: white; margin-bottom: 10px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">⚙️ 系统管理</li>
          </ul>
        </div>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px; color: white; text-align: center;">
          <h3 style="margin-bottom: 10px;">开始使用</h3>
          <p style="margin-bottom: 20px; opacity: 0.9;">登录系统以访问完整功能</p>
          <button style="background: white; color: #667eea; border: none; padding: 12px 30px; border-radius: 4px; font-size: 16px; cursor: pointer; font-weight: bold;">立即登录</button>
        </div>
      </div>
    </div>`;

output = output.replace('<div id="root"></div>', staticContent);

// Write output
fs.writeFileSync(outputPath, output, 'utf8');
console.log('✓ 成功创建 modao-preview.html');
console.log('文件位置:', outputPath);
