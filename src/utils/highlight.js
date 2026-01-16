/**
 * 关键词高亮工具
 */

/**
 * AI领域的关键词列表
 */
export const AI_KEYWORDS = [
  // 大模型/产品
  'GPT', 'ChatGPT', 'Claude', 'Gemini', 'DeepSeek', 'deepseek',
  '通义千问', '文心一言', '豆包', 'Kimi', 'GLM', '混元', '腾讯元宝',
  'Copilot', 'Cursor', 'Sora', 'Runway', 'Pika',

  // 技术术语
  '大模型', '语言模型', 'LLM', '人工智能', 'AI', '机器学习', '深度学习',
  '视频生成', '文生视频', '文本生成', '代码生成',

  // 公司/机构
  'OpenAI', 'Anthropic', 'Google', '微软', '百度', '阿里', '腾讯', '字节',
  '智谱AI', '月之暗面', '零一万物', '科大讯飞',

  // 其他
  '神经网络', 'Transformer', 'GPT-4', 'GPT-5'
]

/**
 * 在文本中高亮关键词
 * @param {string} text - 原始文本
 * @returns {string} - 带有HTML标记的文本
 */
export function highlightKeywords(text) {
  if (!text) return ''

  let highlightedText = text

  // 按关键词长度降序排序（避免短词匹配长词的一部分）
  const sortedKeywords = [...AI_KEYWORDS].sort((a, b) => b.length - a.length)

  // 创建正则表达式（全局匹配，忽略大小写）
  const keywordsPattern = sortedKeywords
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) // 转义特殊字符
    .join('|')

  const regex = new RegExp(`(${keywordsPattern})`, 'gi')

  // 替换匹配的关键词为带加粗标记的版本
  highlightedText = highlightedText.replace(regex, '<strong>$1</strong>')

  return highlightedText
}

/**
 * 创建带有高亮的VNode（用于Vue组件）
 * @param {string} text - 原始文本
 * @returns {Array} - VNode数组
 */
export function createHighlightedVNodes(text) {
  if (!text) return []

  const nodes = []
  let lastIndex = 0

  // 按关键词长度降序排序
  const sortedKeywords = [...AI_KEYWORDS].sort((a, b) => b.length - a.length)
  const keywordsPattern = sortedKeywords
    .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')

  const regex = new RegExp(`(${keywordsPattern})`, 'gi')

  let match
  while ((match = regex.exec(text)) !== null) {
    // 添加匹配前的普通文本
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }

    // 添加加粗的关键词
    nodes.push({ tag: 'strong', children: match[0] })

    lastIndex = match.index + match[0].length
  }

  // 添加剩余的文本
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return nodes
}
