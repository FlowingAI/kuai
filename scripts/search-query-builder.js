/**
 * 搜索 Query 构造器
 * 基于 sousuopipeiluoji.md 的 3 个搜索公式
 */

import { enhancedCategories, getSourceSites, getSearchKeywords } from './sources-v2.js'

/**
 * 公式1：品牌优先
 * (栏目核心词) (site:站点1 OR site:站点2 OR site:站点3)
 */
export function buildBrandPriorityQuery(categoryKey, maxSites = 3) {
  const category = enhancedCategories[categoryKey]
  if (!category) return ''

  // 获取核心品牌词（取前5个）
  const brands = category.brands.slice(0, 5).join(' OR ')

  // 获取站点源
  const sites = getSourceSites(categoryKey).slice(0, maxSites)

  if (sites.length === 0) {
    return brands
  }

  // 构造 Query: (brand1 OR brand2) (site:site1 OR site:site2)
  const siteQuery = sites.map(site => site).join(' OR ')
  return `(${brands}) (${siteQuery})`
}

/**
 * 公式2：动态优先
 * (栏目动作词1 OR 栏目动作词2) (站点关键词) -site:无关垃圾站.com
 */
export function buildDynamicPriorityQuery(categoryKey, maxWords = 5) {
  const category = enhancedCategories[categoryKey]
  if (!category) return ''

  // 获取逻辑/动作词
  const logicWords = category.logicWords.slice(0, maxWords).join(' OR ')

  // 获取品牌词作为站点关键词
  const brands = category.brands.slice(0, 5).join(' OR ')

  // 构造 Query: (logic1 OR logic2) (brand1 OR brand2) -site:spam.com
  const query = `(${logicWords}) (${brands})`

  // 排除垃圾站点
  const spamSites = [
    '-site:spam.com',
    '-site:fake-news.com',
    '-site:clickbait.com'
  ]

  return `${query} ${spamSites.join(' ')}`
}

/**
 * 公式3：模糊嗅探
 * 若标题未发现品牌名，但在标题+正文前100字中同时命中 2个或以上的行业逻辑词/动作词，则强制标记为候选数据
 */
export function buildFuzzyQuery(categoryKey, maxKeywords = 10) {
  const category = enhancedCategories[categoryKey]
  if (!category) return ''

  // 组合品牌词 + 逻辑词
  const allKeywords = [
    ...category.brands.slice(0, 5),
    ...category.logicWords.slice(0, 5)
  ]

  // 随机组合关键词
  const selectedKeywords = allKeywords
    .sort(() => Math.random() - 0.5)
    .slice(0, maxKeywords)
    .join(' OR ')

  return selectedKeywords
}

/**
 * 智能构造搜索 Query（选择最佳公式）
 */
export function buildSmartQuery(categoryKey, strategy = 'auto') {
  const category = enhancedCategories[categoryKey]
  if (!category) return ''

  // 策略1：品牌优先（默认）
  if (strategy === 'brand' || strategy === 'auto') {
    return buildBrandPriorityQuery(categoryKey)
  }

  // 策略2：动态优先
  if (strategy === 'dynamic') {
    return buildDynamicPriorityQuery(categoryKey)
  }

  // 策略3：模糊嗅探
  if (strategy === 'fuzzy') {
    return buildFuzzyQuery(categoryKey)
  }

  // 默认使用品牌优先
  return buildBrandPriorityQuery(categoryKey)
}

/**
 * 批量构造多个搜索 Query（提高覆盖率）
 */
export function buildMultipleQueries(categoryKey, count = 5) {
  const queries = []

  // 1. 品牌优先 Query（2个）
  queries.push(buildBrandPriorityQuery(categoryKey, 3))
  queries.push(buildBrandPriorityQuery(categoryKey, 5))

  // 2. 动态优先 Query（2个）
  queries.push(buildDynamicPriorityQuery(categoryKey, 3))
  queries.push(buildDynamicPriorityQuery(categoryKey, 5))

  // 3. 模糊嗅探 Query（1个）
  queries.push(buildFuzzyQuery(categoryKey, 10))

  // 去重
  return [...new Set(queries)]
}

/**
 * 验证 Query 是否有效
 */
export function validateQuery(query) {
  if (!query || typeof query !== 'string') return false
  if (query.trim().length < 3) return false
  return true
}

/**
 * 格式化 Query（用于日志输出）
 */
export function formatQuery(query, maxLength = 100) {
  if (!query) return ''

  const formatted = query.trim()
  if (formatted.length > maxLength) {
    return formatted.substring(0, maxLength) + '...'
  }

  return formatted
}

/**
 * 获取搜索策略说明
 */
export function getStrategyDescription(strategy) {
  const descriptions = {
    'brand': '公式1：品牌优先 - (核心词) (site:权威站点)',
    'dynamic': '公式2：动态优先 - (动作词) (品牌词) -site:垃圾站',
    'fuzzy': '公式3：模糊嗅探 - 宽泛关键词组合',
    'auto': '自动选择最佳策略'
  }

  return descriptions[strategy] || '未知策略'
}
