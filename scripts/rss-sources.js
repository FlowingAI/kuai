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
      language: 'zh',
      enabled: true
    },
    {
      name: '量子位',
      url: 'https://www.qbitai.com/feed',
      priority: 5,
      modules: ['all'], // 全模块覆盖
      language: 'zh',
      enabled: true
    },
    {
      name: '36氪',
      url: 'https://36kr.com/feed',
      priority: 4,
      modules: ['china-ai', 'applications'],
      language: 'zh',
      enabled: true
    },
    {
      name: '新智元',
      url: 'https://www.xinzhiyuan.com/rss',
      priority: 5,
      modules: ['global-ai', 'china-ai'],
      language: 'zh',
      enabled: true
    },
    {
      name: '智东西',
      url: 'https://www.zhidx.com/rss',
      priority: 4,
      modules: ['china-ai', 'llm'],
      language: 'zh',
      enabled: true
    },
    {
      name: '钛媒体',
      url: 'https://www.tmtpost.com/rss',
      priority: 3,
      modules: ['china-ai', 'applications'],
      language: 'zh',
      enabled: true
    },
    {
      name: '爱范儿',
      url: 'https://www.ifanr.com/rss',
      priority: 3,
      modules: ['applications', 'video-model'],
      language: 'zh',
      enabled: true
    },
    {
      name: '极客公园',
      url: 'https://www.geekpark.net/rss',
      priority: 3,
      modules: ['global-ai', 'applications'],
      language: 'zh',
      enabled: true
    }
  ],

  全球: [
    {
      name: 'The Verge AI',
      url: 'https://www.theverge.com/ai-artificial-intelligence/rss/index.xml',
      priority: 5,
      modules: ['global-ai', 'llm'],
      language: 'en',
      enabled: true
    },
    {
      name: 'Hacker News',
      url: 'https://news.ycombinator.com/rss',
      priority: 5,
      modules: ['global-ai', 'coding-tools'],
      language: 'en',
      enabled: true
    },
    {
      name: 'Hugging Face',
      url: 'https://huggingface.co/blog/feed.xml',
      priority: 5,
      modules: ['llm'],
      language: 'en',
      enabled: true
    },
    {
      name: 'TechCrunch AI',
      url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
      priority: 5,
      modules: ['global-ai', 'applications'],
      language: 'en',
      enabled: true
    },
    {
      name: 'Wired AI',
      url: 'https://www.wired.com/feed/tag/ai/latest/rss',
      priority: 4,
      modules: ['global-ai', 'applications'],
      language: 'en',
      enabled: true
    },
    {
      name: 'arXiv AI',
      url: 'https://rss.arxiv.org/rss/cs.AI',
      priority: 4,
      modules: ['llm'], // 学术论文
      language: 'en',
      enabled: true
    },
    {
      name: 'Product Hunt',
      url: 'https://www.producthunt.com/feed',
      priority: 3,
      modules: ['applications', 'coding-tools'],
      language: 'en',
      enabled: true
    },
    {
      name: 'Digital Trends',
      url: 'https://www.digitaltrends.com/feed/',
      priority: 3,
      modules: ['applications', 'video-model'],
      language: 'en',
      enabled: true
    },
    {
      name: 'The Information',
      url: '', // 需要付费订阅，暂时跳过
      priority: 5,
      modules: ['global-ai'],
      language: 'en',
      enabled: false // 已禁用
    }
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

  // 并发拉取批次大小（从 8 增加到 17，一次性拉取所有RSS源）
  batchSize: 17, // 17个RSS源一次性拉完

  // 批次间延迟（毫秒，从 1000 减少到 500）
  batchDelay: 500,

  // 超时时间（毫秒，从 15000 增加到 20000）
  timeout: 20000,

  // 保留的天数（旧新闻清理）
  retainDays: 30,

  // Jina Reader API（可选，如果遇到超时可关闭）
  jinaReaderEnabled: false, // 暂时关闭，提高稳定性
  jinaReaderBaseUrl: 'https://r.jina.ai/',

  // AI 总结配置
  aiSummaryEnabled: true,
  aiSummaryMaxLength: 100 // 最大字数
}

/**
 * 获取所有启用的RSS源
 */
export function getEnabledSources() {
  const allSources = [...rssSources.中文, ...rssSources.全球]
  return allSources.filter(source => source.enabled)
}

/**
 * 根据模块获取相关RSS源
 */
export function getSourcesByModule(moduleKey) {
  const allSources = [...rssSources.中文, ...rssSources.全球]
  return allSources.filter(source =>
    source.enabled &&
    (source.modules.includes('all') || source.modules.includes(moduleKey))
  )
}
