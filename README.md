# 🤖 全球AI动态情报站

> 实时追踪全球AI动态、中国AI发展、大模型、视频模型、AI编程工具和主流应用的智能情报站

![License](https://img.shields.io/badge/license-MIT-blue)
![Vue 3](https://img.shields.io/badge/Vue-3.4-42b883)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.5-409eff)

## ✨ 项目简介

**全球AI动态情报站**是一个自动化的AI新闻聚合和分析平台，通过搜索引擎和AI技术，实时采集、翻译、分析和展示全球AI领域的最新动态。

### 核心特性

- 🌍 **6大模块**：全球AI、中国AI、大模型、视频模型、编程工具、主流应用
- 🤖 **AI处理**：智谱AI自动翻译、解读、去水、过滤违规内容
- 🔄 **自动更新**：每4小时自动采集60条最新新闻
- 🌐 **中英双语**：自动翻译英文新闻为中文
- 🎨 **莫兰迪UI**：优雅的低饱和冷色调界面
- 📱 **响应式设计**：完美适配手机、平板、电脑

## 🚀 快速开始

### 在线访问

网站地址：`https://你的用户名.github.io/flowingai/`

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/你的用户名/flowingai.git
cd flowingai

# 2. 安装依赖
npm install

# 3. 配置环境变量
# 创建 .env 文件：
# ZHIPU_API_KEY=你的智谱AI密钥
# BING_API_KEY=你的Bing搜索密钥（可选）

# 4. 启动开发服务器
npm run dev

# 5. 访问 http://localhost:5173
```

## 📦 部署到GitHub Pages

### 1. 准备API密钥

- [智谱AI API密钥](https://open.bigmodel.cn/)（必需）
- [Bing Search API密钥](https://portal.azure.com/)（可选但推荐）

### 2. 配置GitHub Secrets

在仓库设置中添加以下Secrets：

| 密钥名称 | 说明 |
|---------|------|
| `ZHIPU_API_KEY` | 智谱AI API密钥 |
| `BING_API_KEY` | Bing搜索API密钥 |
| `ADMIN_PASSWORD` | 管理后台密码（可选） |

### 3. 启用GitHub Pages

1. Settings → Pages
2. Source 选择：`GitHub Actions`

### 4. 手动触发首次更新

Actions → 更新AI动态 → Run workflow

详细部署指南：[docs/DEPLOY.md](docs/DEPLOY.md)

## 🎯 6大模块

| 模块 | 说明 |
|------|------|
| 🌍 全球AI动态 | 国际AI技术突破和行业动态 |
| 🇨🇳 中国AI动态 | 国内AI企业、政策、应用动态 |
| 🤖 大模型动态 | GPT、Claude、Gemini等LLM进展 |
| 🎬 视频模型动态 | Sora、Runway等视频生成技术 |
| 💻 AI编程工具 | Cursor、Copilot等编程助手 |
| ⚡ 当前主流应用 | ChatGPT等AI应用生态 |

## 🛠️ 技术栈

### 前端
- **Vue 3** - 渐进式JavaScript框架
- **Element Plus** - Vue 3组件库
- **Vite** - 下一代前端构建工具

### 后端（GitHub Actions）
- **Node.js** - JavaScript运行时
- **智谱AI API** - 翻译、解读、过滤
- **Bing Search API** - 新闻搜索

### 部署
- **GitHub Pages** - 静态网站托管
- **GitHub Actions** - CI/CD自动化

## 📖 文档

- [部署指南](docs/部署指南.md) - 详细部署步骤
- [使用指南](docs/使用指南.md) - 功能使用说明
- [故障排除](docs/故障排除.md) - 常见问题解决

## 🔧 常用命令

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建生产版本
npm run build

# 手动更新数据（需要配置.env）
npm run fetch
```

## ⚙️ 配置说明

### 修改更新频率

编辑 `.github/workflows/update-news.yml`：

```yaml
schedule:
  - cron: '0 */4 * * *'  # 每4小时
```

### 修改每次更新数量

编辑 `scripts/sources.js`：

```javascript
export const fetchConfig = {
  newsCountPerCategory: 60,  // 修改为你的目标数量
}
```

## 🎨 自定义主题

编辑 `src/styles/global.css`：

```css
:root {
  --morandi-primary: #A8B5C9;    /* 主色 */
  --morandi-secondary: #D7DDE2;  /* 次要色 */
  --morandi-accent: #E6E6FA;     /* 强调色 */
}
```

## 📊 数据处理流程

```
搜索新闻（Bing API）
    ↓
AI处理（智谱API）
  - 翻译英文 → 中文
  - 解读和去水
  - 过滤违规内容
    ↓
去重和排序
    ↓
保存到GitHub
    ↓
自动部署
```

## 🔐 管理后台

访问 `/admin.html` 进入管理后台（需要密码）

**功能**：
- 查看所有模块数据
- 删除单条新闻
- 清空某个模块
- 跳转原文链接

## 📝 项目开发日志

- 2025-01-16：项目初始化，完成Vue 3 + Element Plus前端开发、数据采集脚本、GitHub Actions自动化部署

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 📧 联系方式

如有问题或建议，请在GitHub提Issue

---

**注意**：本项目仅用于学习交流，请勿用于商业用途。
