/**
 * AI名称过滤配置
 * 用于区分中国AI和国外AI，实现精准过滤
 */

/**
 * 国外AI名称列表（英文）
 * 在"中国AI动态"模块中，如果标题包含这些名称，应被过滤
 */
export const foreignAINames = [
  // OpenAI系列
  'OpenAI', 'ChatGPT', 'GPT-4', 'GPT-4o', 'GPT-5', 'GPT-3', 'o1',

  // Anthropic系列
  'Claude', 'Anthropic', 'Claude 3', 'Claude 3.5', 'Sonnet',

  // Google系列
  'Gemini', 'Google DeepMind', 'Gemini Pro', 'Gemini Ultra', 'Bard',

  // Meta系列
  'Llama', 'LLaMA', 'Meta AI', 'Llama 2', 'Llama 3', 'Llama 4',

  // Mistral系列
  'Mistral', 'Mistral AI', 'Mixtral', 'Codestral',

  // xAI系列
  'Grok', 'xAI', 'Grok 2', 'Grok-3',

  // 其他
  'Perplexity', 'Character.AI', 'Replit', 'Midjourney', 'Stable Diffusion',
  'Hugging Face', 'Cohere', 'Adept AI', 'Inflection', 'Pi',

  // 芯片公司（国外）
  'NVIDIA', 'Intel', 'AMD', 'Qualcomm', 'Tesla'
]

/**
 * 中国AI名称列表
 * 在"全球AI动态"模块中，如果标题包含这些名称，应被过滤
 */
export const chineseAINames = [
  // 智谱AI
  '智谱AI', '智谱', 'GLM', 'GLM-4', 'GLM-4-Air', 'ChatGLM', '清言',

  // 深度求索
  'DeepSeek', '深度求索', 'deepseek', 'DeepSeek-R1', 'DeepSeek-V3',

  // 阿里
  '通义千问', 'Qwen', '通义', '阿里AI', '千问',

  // 百度
  '文心一言', '文心', 'ERNIE', '百度AI', '千帆',

  // 腾讯
  '混元', '腾讯混元', 'Hunyuan', '腾讯AI',

  // 字节
  '豆包', '字节AI', '字节跳动AI', '云雀',

  // 月之暗面
  'Kimi', '月之暗面', 'Moonshot',

  // 百川智能
  '百川', '百川智能', 'Baichuan',

  // 阶跃星辰
  '阶跃星辰', 'Step', '跃问',

  // 零一万物
  '零一万物', 'Yi', 'Yi Model',

  // 商汤
  '商汤', '商汤日日新', 'SenseTime', '日日新',

  // 科大讯飞
  '科大讯飞', '讯飞', '星火', 'Spark',

  // MiniMax
  'MiniMax', '海螺',

  // 昆仑万维
  '昆仑万维', '天工',

  // 其他
  '360AI', '奇安信', '第四范式', '追一科技',
  '出门问问', '云知声', '依图', '旷视'
]

/**
 * 检查标题是否包含国外AI名称
 * @param {string} title - 新闻标题
 * @returns {boolean} - 是否包含国外AI名称
 */
export function containsForeignAI(title) {
  if (!title) return false

  for (const name of foreignAINames) {
    if (title.includes(name)) {
      return true
    }
  }
  return false
}

/**
 * 检查标题是否包含中国AI名称
 * @param {string} title - 新闻标题
 * @returns {boolean} - 是否包含中国AI名称
 */
export function containsChineseAI(title) {
  if (!title) return false

  for (const name of chineseAINames) {
    if (title.includes(name)) {
      return true
    }
  }
  return false
}

/**
 * 根据模块类型过滤AI名称
 * @param {string} categoryKey - 模块标识
 * @param {string} title - 新闻标题
 * @returns {boolean} - 是否应该被过滤
 */
export function shouldFilterByAIName(categoryKey, title) {
  if (!title) return false

  if (categoryKey === 'china-ai') {
    // 中国AI模块：过滤包含国外AI名称的
    return containsForeignAI(title)
  }

  if (categoryKey === 'global-ai') {
    // 全球AI模块：过滤包含中国AI名称的
    return containsChineseAI(title)
  }

  return false
}
