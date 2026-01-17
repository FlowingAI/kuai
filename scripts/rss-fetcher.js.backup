/**
 * RSS Feed 采集器
 * 从各大AI媒体的RSS源获取最新文章
 */

import Parser from 'rss-parser'

const parser = new Parser({
  timeout: 10000,
  customFields: {
    item: [
      ['media:content', 'media'],
      ['dc:creator', 'creator']
    ]
  }
})

/**
 * 可用的RSS源配置
 * 按语言和地区分类
 */
export const rssSources = {
  // 中文RSS源
  zh: [
    {
      name: '量子位',
      url: 'https://www.qbitai.com/feed',
      category: ['global-ai', 'china-ai', 'llm'],
      language: 'zh'
    },
    {
      name: '机器之心',
      url: 'https://www.jiqizhixin.com/rss',
      category: ['global-ai', 'china-ai', 'llm', 'video-model'],
      language: 'zh'
    },
    {
      name: '新智元',
      url: 'https://www.thepaper.cn/rss/news.xml', // 备用，可能需要替换
      category: ['china-ai', 'llm'],
      language: 'zh'
    },
    {
      name: '36氪AI',
      url: 'https://36kr.com/api/rss',
      category: ['china-ai', 'applications'],
      language: 'zh'
    },
    {
      name: '虎嗅AI',
      url: 'https://www.huxiu.com/rss/0.xml',
      category: ['china-ai', 'applications'],
      language: 'zh'
    }
  ],

  // 英文RSS源
  en: [
    {
      name: 'TechCrunch AI',
      url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
      category: ['global-ai', 'llm', 'applications'],
      language: 'en'
    },
    {
      name: 'The Verge AI',
      url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
      category: ['global-ai', 'applications', 'llm'],
      language: 'en'
    },
    {
      name: 'MIT Technology Review AI',
      url: 'https://www.technologyreview.com/feed/',
      category: ['global-ai', 'llm'],
      language: 'en'
    },
    {
      name: 'OpenAI Blog',
      url: 'https://openai.com/blog/rss.xml',
      category: ['llm', 'applications'],
      language: 'en'
    },
    {
      name: 'Google AI Blog',
      url: 'https://blog.google/technology/ai/rss/',
      category: ['llm', 'global-ai'],
      language: 'en'
    },
    {
      name: 'VentureBeat AI',
      url: 'https://venturebeat.com/ai/feed/',
      category: ['global-ai', 'llm', 'coding-tools'],
      language: 'en'
    },
    {
      name: 'Ars Technica AI',
      url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
      category: ['global-ai', 'applications'],
      language: 'en'
    }
  ]
}

/**
 * 从单个RSS源获取文章
 */
export async function fetchRSSFeed(source) {
  try {
    console.log(`  📡 正在获取 ${source.name}...`)
    const feed = await parser.parseURL(source.url)

    const items = feed.items.slice(0, 20).map(item => ({
      title: item.title || '',
      description: item.contentSnippet || item.content || '',
      url: item.link || item.guid || '',
      pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
      source: source.name,
      language: source.language,
      categories: source.category
    }))

    console.log(`  ✅ ${source.name}: 获取到 ${items.length} 条`)
    return items

  } catch (error) {
    console.warn(`  ⚠️  ${source.name} 获取失败:`, error.message)
    return []
  }
}

/**
 * 批量获取所有RSS源的文章
 * 按分类整理
 */
export async function fetchAllRSSFeeds() {
  console.log('\n📰 开始采集RSS源...\n')

  const allSources = [...rssSources.zh, ...rssSources.en]
  const allItems = []

  // 逐个获取RSS源（避免并发过高）
  for (const source of allSources) {
    try {
      const items = await fetchRSSFeed(source)
      allItems.push(...items)
      // 延迟1秒，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`❌ ${source.name} 处理失败:`, error.message)
    }
  }

  console.log(`\n📊 RSS采集完成: 共获取 ${allItems.length} 条文章\n`)

  return allItems
}

/**
 * 根据语言筛选RSS源并获取文章
 */
export async function fetchRSSByLanguage(language) {
  console.log(`\n📰 开始采集${language === 'zh' ? '中文' : '英文'}RSS源...\n`)

  const sources = language === 'zh' ? rssSources.zh : rssSources.en
  const allItems = []

  for (const source of sources) {
    try {
      const items = await fetchRSSFeed(source)
      allItems.push(...items)
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`❌ ${source.name} 处理失败:`, error.message)
    }
  }

  console.log(`\n📊 RSS采集完成: 共获取 ${allItems.length} 条文章\n`)

  return allItems
}

/**
 * 根据分类筛选RSS文章
 */
export function filterRSSByCategory(items, categoryKey) {
  // 根据关键词匹配分类
  const categoryKeywords = {
    'global-ai': ['AI', 'artificial intelligence', '人工智能', 'machine learning', 'deep learning'],
    'china-ai': ['中国', 'China', '百度', '阿里', '腾讯', '字节', '智谱', '月之暗面'],
    'llm': ['GPT', 'ChatGPT', 'Claude', 'Gemini', 'LLM', '大模型', 'language model', 'OpenAI', 'Anthropic'],
    'video-model': ['Sora', 'Runway', 'Pika', 'video', '视频生成', 'video generation', 'text to video'],
    'coding-tools': ['Cursor', 'Copilot', '编程', 'coding', 'programming', 'code', 'IDE', 'Replit'],
    'applications': ['应用', 'app', 'application', 'ChatGPT', '工具', 'tool', 'platform']
  }

  const keywords = categoryKeywords[categoryKey] || []

  return items.filter(item => {
    const text = (item.title + ' ' + item.description).toLowerCase()
    return keywords.some(keyword =>
      text.toLowerCase().includes(keyword.toLowerCase())
    )
  })
}

/**
 * 获取某个分类的RSS文章
 */
export async function fetchRSSByCategory(categoryKey) {
  const allItems = await fetchAllRSSFeeds()
  const filtered = filterRSSByCategory(allItems, categoryKey)

  console.log(`\n📂 ${categoryKey} 分类: ${filtered.length} 条相关文章\n`)

  return filtered
}
