# RSS 新闻源配置

## 📡 项目说明

本文档配置了 **双轨制采集系统** 的 RSS 新闻源，结合 RSS 优先 + 搜索补充的策略。

**更新日期**: 2026-01-17
**维护者**: Bob Jery

---

## 🎯 采集策略

```
┌─────────────────────────────────────────────────┐
│              双轨制采集（100条/模块）             │
├─────────────────────────────────────────────────┤
│  轨道1：RSS 采集（优先）- 权威、实时、高质量      │
│  轨道2：搜索采集（补充）- 覆盖广、补充遗漏        │
└─────────────────────────────────────────────────┘
```

---

## 🇨🇳 中文硬核信源（8个）

### 1️⃣ 机器之心 ⭐⭐⭐⭐⭐
```
RSS: https://www.jiqizhixin.com/rss
覆盖模块: 全球AI动态、大模型动态
特点: 深度技术分析、访谈、行业观察
语言: 中文
更新频率: 日更 5-10 篇
```

### 2️⃣ 量子位 ⭐⭐⭐⭐⭐
```
RSS: https://www.qbitai.com/feed
覆盖模块: 全模块覆盖（全球AI、中国AI、大模型、视频、编程、应用）
特点: 最全面的中文AI媒体，快讯 + 深度
语言: 中文
更新频率: 日更 10-20 篇
```

### 3️⃣ 36氪AI ⭐⭐⭐⭐
```
RSS: https://36kr.com/feed
覆盖模块: 中国AI动态、当前主流应用
特点: 创业投资、产品发布、商业化
语言: 中文
更新频率: 日更 5-10 篇
```

### 4️⃣ 新智元 ⭐⭐⭐⭐⭐
```
RSS: https://www.xinzhiyuan.com/rss
覆盖模块: 全球AI动态、中国AI动态
特点: 学术界动态、论文解读、专家观点
语言: 中文
更新频率: 日更 8-15 篇
```

### 5️⃣ 智东西 ⭐⭐⭐⭐
```
RSS: https://www.zhidx.com/rss
覆盖模块: 中国AI动态、大模型动态
特点: 硬件AI、芯片、边缘计算
语言: 中文
更新频率: 日更 5-8 篇
```

### 6️⃣ 钛媒体 ⭐⭐⭐
```
RSS: https://www.tmtpost.com/rss
覆盖模块: 中国AI动态、当前主流应用
特点: 产业分析、企业报道
语言: 中文
更新频率: 日更 3-6 篇
```

### 7️⃣ 爱范儿AI ⭐⭐⭐
```
RSS: https://www.ifanr.com/rss
覆盖模块: 当前主流应用、视频模型动态
特点: 消费级AI产品、评测、体验
语言: 中文
更新频率: 日更 3-5 篇
```

### 8️⃣ 极客公园 ⭐⭐⭐
```
RSS: https://www.geekpark.net/rss
覆盖模块: 全球AI动态、当前主流应用
特点: 创新产品、开发者视角
语言: 中文
更新频率: 日更 3-5 篇
```

---

## 🌍 全球权威信源（9个）

### 1️⃣ The Verge AI ⭐⭐⭐⭐⭐
```
RSS: https://www.theverge.com/ai-artificial-intelligence/rss/index.xml
覆盖模块: 全球AI动态、大模型动态
特点: 深度报道、行业趋势、技术解析
语言: 英文
更新频率: 日更 5-10 篇
```

### 2️⃣ Hacker News ⭐⭐⭐⭐⭐
```
RSS: https://news.ycombinator.com/rss
覆盖模块: 全球AI动态、AI编程工具进化
特点: 开发者社区、技术讨论、开源项目
语言: 英文
更新频率: 实时（每小时 5-10 篇）
```

### 3️⃣ Hugging Face Blog ⭐⭐⭐⭐
```
RSS: https://huggingface.co/blog/feed.xml
覆盖模块: 大模型动态（开源模型）
特点: 开源模型发布、技术教程、社区动态
语言: 英文
更新频率: 日更 2-5 篇
```

### 4️⃣ TechCrunch AI ⭐⭐⭐⭐⭐
```
RSS: https://techcrunch.com/category/artificial-intelligence/feed/
覆盖模块: 全球AI动态、当前主流应用
特点: 硅谷视角、创业投资、产品发布
语言: 英文
更新频率: 日更 10-15 篇
```

### 5️⃣ Wired AI ⭐⭐⭐⭐
```
RSS: https://www.wired.com/feed/tag/ai/latest/rss
覆盖模块: 全球AI动态、当前主流应用
特点: 文化视角、科技伦理、深度特写
语言: 英文
更新频率: 日更 3-6 篇
```

### 6️⃣ arXiv AI ⭐⭐⭐⭐
```
RSS: https://rss.arxiv.org/rss/cs.AI
覆盖模块: 大模型动态（学术论文）
特点: 最新研究成果、论文预印本
语言: 英文
更新频率: 日更 20-50 篇（需过滤）
```

### 7️⃣ Product Hunt ⭐⭐⭐
```
RSS: https://www.producthunt.com/feed
覆盖模块: 当前主流应用、AI编程工具进化
特点: 新产品发现、用户投票、趋势追踪
语言: 英文
更新频率: 日更 10-20 篇
```

### 8️⃣ Digital Trends ⭐⭐⭐
```
RSS: https://www.digitaltrends.com/feed/
覆盖模块: 当前主流应用、视频模型动态
特点: 消费级产品、工具评测、使用指南
语言: 英文
更新频率: 日更 5-8 篇
```

### 9️⃣ The Information ⭐⭐⭐⭐
```
RSS: 🔒 需付费订阅
覆盖模块: 全球AI动态（独家爆料）
特点: 深度内幕、CEO采访、战略分析
语言: 英文
更新频率: 日更 3-5 篇
注意: 如果无订阅权限，可暂时跳过
```

---

## 🔧 技术实现

### 1️⃣ RSS 抓取与关键词过滤逻辑

**扫描逻辑**：每次运行时，先解析上述 RSS 源。

**匹配规则**：提取 RSS 条目的标题与描述，根据 6 大栏目关键词及动作词进行匹配：

- 全球AI动态
- 中国AI动态
- 大模型动态
- 视频模型动态
- AI编程工具进化
- 当前主流应用

**分发策略**：
- 命中的内容直接进入分类环节
- 如果 RSS 抓取到的有效数据总数少于 20 条，则自动启用搜索进行关键词搜索补全

---

### 2️⃣ 内容深度提取与脱水 (Jina Reader)

**清洗提取**：拿到新闻链接后，通过 **Jina Reader** 获取清洗后的纯文本：

```javascript
// Jina Reader API
const cleanUrl = `https://r.jina.ai/${encodeURIComponent(articleUrl)}`;

// 示例：
// 原始链接：https://www.qbitai.com/2025/01/17/openai-gpt5
// 清洗链接：https://r.jina.ai/https%3A%2F%2Fwww.qbitai.com%2F2025%2F01%2F17%2Fopenai-gpt5
```

**AI 处理**：将 Markdown 文本进行总结

**总结要求**：
- 100字以内，极其简练
- 去除废话
- 提取关键信息（什么公司、什么产品、什么突破、什么影响）

**语义归类**：由 AI 根据内容语义，从 6 个栏目中选出最准确的一个

---

### 3️⃣ RSS 解析库

```javascript
// 使用 rss-parser 库
import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: ['description', 'content:encoded', 'pubDate']
  }
});

const feed = await parser.parseURL(rssUrl);
```

---

### 4️⃣ 并发拉取策略

```javascript
// 分批并发拉取（避免过载）
const rssSources = [...]; // 17个源
const batchSize = 5; // 每批5个

for (let i = 0; i < rssSources.length; i += batchSize) {
  const batch = rssSources.slice(i, i + batchSize);
  const results = await Promise.allSettled(
    batch.map(source => fetchRSS(source))
  );
  // 处理结果...
  await sleep(2000); // 批次间等待2秒
}
```

---

### 5️⃣ 数据提取字段

```javascript
{
  id: 自增序号,
  title: 标题,
  description: 描述（RSS摘要）,
  content: 正文（Jina Reader清洗后）,
  summary: AI总结（100字以内）,
  url: 链接,
  source: 来源站点,
  publishTime: 发布时间,
  author: 作者（如果可用）,
  category: AI分类（AI语义标注）,
  tags: 标签（从标题提取）
}
```

---

## ⚙️ 配置文件格式

### scripts/rss-sources.js

```javascript
/**
 * RSS 新闻源配置
 * 17个权威媒体站点
 */

export const rssSources = {
  中文: [
    {
      name: '机器之心',
      url: 'https://www.jiqizhixin.com/rss',
      priority: 5,
      modules: ['global-ai', 'llm'],
      language: 'zh'
    },
    {
      name: '量子位',
      url: 'https://www.qbitai.com/feed',
      priority: 5,
      modules: ['all'], // 全模块
      language: 'zh'
    },
    {
      name: '36氪',
      url: 'https://36kr.com/feed',
      priority: 4,
      modules: ['china-ai', 'applications'],
      language: 'zh'
    },
    {
      name: '新智元',
      url: 'https://www.xinzhiyuan.com/rss',
      priority: 5,
      modules: ['global-ai', 'china-ai'],
      language: 'zh'
    },
    // ... 其他中文源
  ],

  全球: [
    {
      name: 'The Verge AI',
      url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
      priority: 5,
      modules: ['global-ai', 'llm'],
      language: 'en'
    },
    {
      name: 'Hacker News',
      url: 'https://news.ycombinator.com/rss',
      priority: 5,
      modules: ['global-ai', 'coding-tools'],
      language: 'en'
    },
    {
      name: 'Hugging Face',
      url: 'https://huggingface.co/blog/feed.xml',
      priority: 5,
      modules: ['llm'],
      language: 'en'
    },
    // ... 其他全球源
  ]
}

/**
 * 采集配置
 */
export const rssConfig = {
  // RSS 抓取目标数量（动态）
  targetCount: 60,

  // 搜索补充的触发阈值
  searchThreshold: 20,

  // 并发拉取批次大小
  batchSize: 5,

  // 批次间延迟（毫秒）
  batchDelay: 2000,

  // 超时时间（毫秒）
  timeout: 10000,

  // 保留的天数（旧新闻清理）
  retainDays: 30
}
```

---

## 🔄 去重逻辑

### 1️⃣ RSS 去重

```javascript
// URL 去重（主要）
const urlSet = new Set();

// 标题相似度去重（辅助）
function isSimilarTitle(title1, title2) {
  // 简单的相似度算法
  const similarity = calculateSimilarity(title1, title2);
  return similarity > 0.85;
}
```

### 2️⃣ RSS 与搜索去重

```javascript
// 先采集 RSS，记录所有 URL
const rssUrls = new Set(rssArticles.map(a => a.url));

// 搜索时过滤掉已抓取的 URL
searchArticles = searchArticles.filter(a => !rssUrls.has(a.url));
```

---

## 🚀 使用流程

### 1. 安装依赖

```bash
npm install rss-parser
```

### 2. 本地测试

```bash
# 测试 RSS 拉取
node scripts/rss-fetcher.js

# 测试完整采集流程
node scripts/fetch-news-v2.js
```

### 3. 验证数据

检查 `public/data/*.json` 文件：
- 每个模块约 100 条
- 来源包含 RSS 和搜索
- 按时间倒序排列
- 有序号 ID
- 有 AI 总结字段

---

## 📊 采集优先级

### 按优先级分层

| 优先级 | 站点数量 | 说明 | 权重 |
|-------|---------|------|------|
| ⭐⭐⭐⭐⭐ | 8个 | 核心必抓 | 50% |
| ⭐⭐⭐⭐ | 6个 | 重点抓取 | 30% |
| ⭐⭐⭐ | 3个 | 补充抓取 | 20% |

### 优先级调整规则

- 如果某个站点数据质量高，可提升优先级
- 如果某个站点长期无更新，可降低优先级
- The Information 如无订阅权限，可设置为 `enabled: false`

---

## 📝 维护日志

### 2026-01-17
- ✅ 创建 RSS.MD 文档
- ✅ 配置 17 个权威 RSS 源
- ✅ 设计双轨制采集策略
- ✅ 集成 Jina Reader 内容清洗
- ✅ 添加 AI 总结和语义分类

### 待办
- [ ] 实现 RSS 采集器
- [ ] 集成 Jina Reader API
- [ ] 实现去重逻辑
- [ ] 集成到主采集脚本

---

## ❓ 常见问题

### Q1: RSS 源失效怎么办？
**A**: 定期检查源可用性，失效源自动降级或移除，记录到日志

### Q2: arXiv 论文太多怎么办？
**A**: 设置关键词过滤，只抓取与 AI 相关的高引论文

### Q3: The Information 需要付费怎么办？
**A**: 暂时跳过，或使用其他站点补充

### Q4: RSS 和搜索数据重复怎么办？
**A**: 实现 URL 去重 + 标题相似度去重

### Q5: Jina Reader 有调用限制吗？
**A**: Jina Reader 免费版有速率限制，建议添加缓存和重试机制

---

## 📧 反馈与更新

如有新增 RSS 源建议或配置问题，请联系：
- **维护者**: Bob Jery
- **项目**: 全球AI动态情报站 (kuai)
- **GitHub**: https://github.com/flowingai/kuai
