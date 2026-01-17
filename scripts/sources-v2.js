/**
 * 三维词库配置 v2.0
 * 基于 sousuotishici.md 和 sousuopipeiluoji.md
 * 包含：品牌词 + 逻辑/动作词 + 深度情报源站点
 */

export const enhancedCategories = {
  'global-ai': {
    name: '全球AI动态',
    file: 'global-ai.json',
    // 核心品牌词
    brands: [
      'OpenAI', 'Google Gemini', 'Anthropic Claude', 'Meta Llama',
      'NVIDIA', 'Microsoft CoPilot', 'xAI Grok', 'Mistral AI',
      'Apple Intelligence', 'Groq', 'Cerebras', 'Hugging Face',
      'Midjourney', 'Adobe Firefly', 'Perplexity AI', 'Sam Altman',
      'Jensen Huang', 'Demis Hassabis', 'Dario Amodei'
    ],
    // 逻辑/动作词
    logicWords: [
      'SOTA', 'Benchmarks', '多模态', '推理能力', 'Scaling Law',
      '显存优化', '算力集群', '闭源领先', '发布', '更新',
      '爆料', 'CEO采访', '刷新纪录', '战略结盟', '突破',
      'performance', 'launch', 'breakthrough', 'partnership',
      'investment', 'acquisition', 'milestone'
    ],
    // 深度情报源站点
    sources: [
      'site:techcrunch.com',
      'site:theverge.com',
      'site:news.ycombinator.com',
      'site:wired.com',
      'site:huggingface.co',
      'site:arxiv.org',
      'site:digitaltrends.com'
    ],
    ratio: { en: 0.6, zh: 0.4 }
  },

  'china-ai': {
    name: '中国AI动态',
    file: 'china-ai.json',
    brands: [
      '智谱AI', 'GLM', 'DeepSeek', 'deepseek', '通义千问', 'Qwen',
      '文心一言', '腾讯混元', '月之暗面', 'Kimi', '商汤日日新',
      '百川智能', '阶跃星辰', '零一万物', 'Yi', '昆仑万维',
      '字节豆包', '华为昇腾', '百度飞桨', '阿里魔搭', '科大讯飞',
      '星火', 'MiniMax', 'Step', '百度AI', '阿里AI', '腾讯AI', '字节AI'
    ],
    logicWords: [
      '内测', '备案', 'API降价', '出海', '国产适配', '融资',
      '万卡集群', '算力补贴', '开源', '落地案例', '价格战',
      '独角兽', '官方回应', '发布', '更新', '合作', '融资',
      '估值', 'IPO', '上市', '监管', '合规'
    ],
    sources: [
      'site:jiqizhixin.com',
      'site:qbitai.com',
      'site:xinzhiyuan.com',
      'site:zhidx.com',
      'site:36kr.com',
      'site:tmtpost.com',
      'site:ifanr.com',
      'site:geekpark.net'
    ],
    ratio: { en: 0.3, zh: 0.7 }
  },

  'llm': {
    name: '大模型动态',
    file: 'llm.json',
    brands: [
      'GPT', 'ChatGPT', 'Claude', 'Gemini', 'LLM', 'language model',
      'large language model', 'GPT-5', 'OpenAI', 'Anthropic',
      '智谱AI', 'GLM', '文心一言', '通义千问', 'DeepSeek',
      'Llama', 'Mistral', 'o1', 'o1-preview', 'Grok'
    ],
    logicWords: [
      'MoE架构', '长文本处理', '推理模型', 'Reasoning',
      '量化技术', 'Quantization', '长上下文', '幻觉优化',
      '提示工程', 'Prompt', 'RAG', '思维链', 'CoT',
      '逻辑推理', '上下文突破', '参数压缩', '数学能力',
      '强化学习', '架构创新', '解决幻觉', '性能测评',
      '论文发布', '模型对齐', 'benchmark', 'evaluation'
    ],
    sources: [
      'site:arxiv.org',
      'site:huggingface.co',
      'site:techcrunch.com',
      'site:theverge.com',
      'site:jiqizhixin.com'
    ],
    ratio: { en: 0.5, zh: 0.5 }
  },

  'video-model': {
    name: '视频模型动态',
    file: 'video-model.json',
    brands: [
      'Sora', 'Sora 2', '可灵', 'Kling', 'Vidu', 'Luma Dream Machine',
      'Runway Gen-3', 'Pika', '智谱清影', 'Haiper', 'CogVideo',
      'Minimax视频', 'HeyGen', 'Dreamina', '豆包视频', '即梦'
    ],
    logicWords: [
      '生视频', '图生视频', 'text to video', '一致性',
      '物理模拟', '运动控制', '时长突破', '高帧率',
      '运镜控制', '效果炸裂', '正式上线', '物理反馈',
      'video generation', 'AI video', 'consistency', 'motion control'
    ],
    sources: [
      'site:techcrunch.com',
      'site:theverge.com',
      'site:runwayml.com',
      'site:qbitai.com',
      'site:jiqizhixin.com'
    ],
    ratio: { en: 0.6, zh: 0.4 }
  },

  'coding-tools': {
    name: 'AI编程工具进化',
    file: 'coding-tools.json',
    brands: [
      'Cursor', 'GitHub Copilot', 'Claude Code', 'Windsurf',
      '豆包MarsCode', 'Trae', 'Replit Agent', 'Baidu Comate',
      'Codeium', 'v0.dev', 'Bolt.new', 'Devin', 'Tabnine',
      'Sourcegraph', 'Cody', 'Amazon CodeWhisperer'
    ],
    logicWords: [
      '自动修复', '全栈生成', 'Agentic Workflow', '编程效率',
      '代码审计', '自然语言编程', '自动Debug', '结对编程',
      '修复漏洞', '降本增效', 'auto-fix', 'code generation',
      'AI IDE', 'programming assistant', 'developer tools'
    ],
    sources: [
      'site:news.ycombinator.com',
      'site:github.com',
      'site:producthunt.com',
      'site:techcrunch.com'
    ],
    ratio: { en: 0.5, zh: 0.5 }
  },

  'applications': {
    name: '当前主流应用',
    file: 'applications.json',
    brands: [
      'AI搜索', 'NotebookLM', 'Character.ai', 'Figma AI',
      'Canva Magic', '智能体', 'Agents', 'GPTs', 'AI智能眼镜',
      'Ray-Ban Meta', '秘塔搜索', '钉钉AI', '飞书智能伙伴',
      'ChatGPT', 'Claude', 'Perplexity', 'Gemini'
    ],
    logicWords: [
      '爆款应用', '交互体验', '工作流自动化', '场景落地',
      '商业化', 'DAU', '订阅增长', '体验升级', '交互革新',
      '规模化普及', 'viral app', 'user experience', 'monetization',
      'product launch', 'feature update'
    ],
    sources: [
      'site:producthunt.com',
      'site:techcrunch.com',
      'site:theverge.com',
      'site:36kr.com',
      'site:ifanr.com'
    ],
    ratio: { en: 0.5, zh: 0.5 }
  }
}

/**
 * 采集配置
 */
export const enhancedConfig = {
  // 每次更新每个模块采集的新闻数量（从 60 减少到 40，最激进优化）
  newsCountPerCategory: 40,

  // 搜索结果数量倍数
  searchResultsMultiplier: 5,

  // API 请求间隔（毫秒）
  requestDelay: 1000,

  // 超时时间（毫秒）
  timeout: 30000,

  // 第一优先级：直接命中品牌词
  directMatchThreshold: 1, // 命中1个品牌词即抓取

  // 第二优先级：逻辑词组合匹配
  logicMatchThreshold: 2, // 命中2个逻辑词即抓取

  // 是否启用 AI 语义分类纠偏
  aiClassificationEnabled: true
}

/**
 * 获取模块的所有搜索关键词（品牌 + 逻辑）
 */
export function getSearchKeywords(categoryKey) {
  const category = enhancedCategories[categoryKey]
  if (!category) return []

  return [
    ...category.brands,
    ...category.logicWords
  ]
}

/**
 * 获取模块的站点源
 */
export function getSourceSites(categoryKey) {
  const category = enhancedCategories[categoryKey]
  return category ? category.sources : []
}

/**
 * 检查文本是否命中品牌词（第一优先级）
 */
export function checkDirectMatch(text, categoryKey) {
  const category = enhancedCategories[categoryKey]
  if (!category) return false

  const lowerText = text.toLowerCase()

  return category.brands.some(brand =>
    lowerText.includes(brand.toLowerCase())
  )
}

/**
 * 检查文本是否命中逻辑词组合（第二优先级）
 */
export function checkLogicMatch(text, categoryKey) {
  const category = enhancedCategories[categoryKey]
  if (!category) return false

  const lowerText = text.toLowerCase()

  // 统计命中的逻辑词数量
  const matchedCount = category.logicWords.filter(word =>
    lowerText.includes(word.toLowerCase())
  ).length

  return matchedCount >= enhancedConfig.logicMatchThreshold
}
