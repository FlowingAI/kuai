/**
 * 数据源配置
 * 配置6个模块的搜索关键词（中英双语）
 */

export const categories = {
  'global-ai': {
    name: '全球AI动态',
    file: 'global-ai.json',
    keywords: [
      // 英文关键词（国际来源）
      'AI news',
      'artificial intelligence breakthrough',
      'AI research',
      'AI technology',
      'machine learning news',
      'deep learning',
      'AI advancement',
      // 中文关键词
      'AI新闻',
      '人工智能突破',
      'AI技术',
      '机器学习新闻'
    ],
    ratio: { en: 0.6, zh: 0.4 } // 60%英文，40%中文
  },
  'china-ai': {
    name: '中国AI动态',
    file: 'china-ai.json',
    keywords: [
      // 中国大模型关键词
      'DeepSeek',
      'deepseek',
      '通义千问',
      '文心一言',
      '豆包',
      '腾讯元宝',
      '混元',
      '智谱',
      'GLM',
      '百川',
      '月之暗面',
      'Kimi',
      '零一万物',
      'Yi',
      '科大讯飞',
      '星火',
      'MiniMax',
      'Step',
      // 国内AI公司
      '百度AI',
      '阿里AI',
      '腾讯AI',
      '字节AI',
      '中国AI',
      '国产AI',
      '国内大模型',
      '中文大模型'
    ],
    ratio: { en: 0.3, zh: 0.7 } // 30%英文，70%中文
  },
  'llm': {
    name: '大模型动态',
    file: 'llm.json',
    keywords: [
      // 英文关键词
      'GPT',
      'ChatGPT',
      'Claude',
      'Gemini',
      'LLM',
      'language model',
      'large language model',
      'GPT-5',
      'OpenAI',
      'Anthropic',
      // 中文关键词
      '大模型',
      '语言模型',
      'ChatGPT',
      'Claude',
      '智谱AI',
      '文心一言',
      '通义千问',
      'DeepSeek',
      'deepseek',
      '豆包',
      'Kimi'
    ],
    ratio: { en: 0.5, zh: 0.5 }
  },
  'video-model': {
    name: '视频模型动态',
    file: 'video-model.json',
    keywords: [
      // 英文关键词
      'Sora',
      'Sora 2',
      'video generation',
      'video AI',
      'Runway',
      'Pika',
      'video model',
      'AI video generator',
      'text to video',
      // 中文关键词
      'Sora2',
      'Sora 2',
      '视频生成',
      'AI视频',
      '视频模型',
      '文生视频',
      '豆包生成',
      '火山引擎',
      '字节跳动视频',
      '可灵',
      'Vidu',
      '即梦'
    ],
    ratio: { en: 0.6, zh: 0.4 }
  },
  'coding-tools': {
    name: 'AI编程工具进化',
    file: 'coding-tools.json',
    keywords: [
      // 英文关键词
      'AI programming',
      'Cursor',
      'Copilot',
      'AI coding assistant',
      'AI code generation',
      'AI IDE',
      'Replit',
      'Codeium',
      // 中文关键词
      'AI编程',
      'AI编程工具',
      '代码助手',
      '智能编程',
      'Cursor编辑器'
    ],
    ratio: { en: 0.5, zh: 0.5 }
  },
  'applications': {
    name: '当前主流应用',
    file: 'applications.json',
    keywords: [
      // 英文关键词
      'AI applications',
      'ChatGPT apps',
      'AI tools',
      'artificial intelligence apps',
      'AI use cases',
      'AI products',
      // 中文关键词
      'AI应用',
      'ChatGPT应用',
      'AI工具推荐',
      '人工智能产品',
      'AI软件'
    ],
    ratio: { en: 0.5, zh: 0.5 }
  }
}

/**
 * 数据源优先级
 * 使用多个数据源以提高覆盖率
 */
export const dataSources = {
  bing: {
    name: 'Bing Search API',
    priority: 1,
    enabled: true
  },
  // 备用数据源（可扩展）
  // google: {
  //   name: 'Google Search API',
  //   priority: 2,
  //   enabled: false
  // }
}

/**
 * 采集配置
 */
export const fetchConfig = {
  // 每次更新每个模块采集的新闻数量
  newsCountPerCategory: 60,

  // 搜索结果数量（需要比目标数量多，因为会有过滤）
  searchResultsMultiplier: 3,

  // API 请求间隔（毫秒）
  requestDelay: 1000,

  // 超时时间（毫秒）
  timeout: 30000
}
