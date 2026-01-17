/**
 * 跨模块去重和历史去重功能
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 获取所有模块的历史数据URL集合
 * 用于避免重复采集
 */
export function loadHistoricalURLs() {
  const urlSet = new Set()
  const dataDir = path.join(__dirname, '..', 'data')

  try {
    // 读取data目录下所有JSON文件
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'))

    files.forEach(file => {
      try {
        const filepath = path.join(dataDir, file)
        const content = fs.readFileSync(filepath, 'utf-8')
        const data = JSON.parse(content)

        // 提取所有URL
        if (data.news && Array.isArray(data.news)) {
          data.news.forEach(article => {
            const url = article.source_url || article.url
            if (url) {
              urlSet.add(url)
            }
          })
        }
      } catch (error) {
        console.warn(`⚠️  读取 ${file} 失败:`, error.message)
      }
    })

    console.log(`  📚 加载历史数据: ${files.length} 个文件，${urlSet.size} 个URL`)
    return urlSet
  } catch (error) {
    console.warn(`⚠️  加载历史数据失败:`, error.message)
    return new Set()
  }
}

/**
 * 从新采集的文章中过滤掉已存在的
 * @param {Array} articles - 新采集的文章
 * @param {Set} historicalURLs - 历史URL集合
 * @returns {Array} - 过滤后的文章
 */
export function filterHistoricalDuplicates(articles, historicalURLs) {
  if (!historicalURLs || historicalURLs.size === 0) {
    return articles
  }

  const filtered = articles.filter(article => {
    const url = article.source_url || article.url
    return !historicalURLs.has(url)
  })

  const duplicateCount = articles.length - filtered.length
  if (duplicateCount > 0) {
    console.log(`  🗑️  历史去重: 过滤 ${duplicateCount} 条已存在的文章`)
  }

  return filtered
}

/**
 * 全局跨模块去重
 * 确保同一篇文章不会出现在多个模块中
 *
 * @param {Object} allModuleArticles - 所有模块的文章对象
 * @returns {Object} - 去重后的各模块文章
 */
export function crossModuleDeduplicate(allModuleArticles) {
  console.log(`\n🔄 跨模块去重...`)

  const globalURLSet = new Set()
  const deduplicated = {}
  let totalDuplicates = 0

  // 按优先级处理模块
  // 优先级：全球AI > 中国AI > 大模型 > 视频模型 > 编程工具 > 主流应用
  const priority = ['global-ai', 'china-ai', 'llm', 'video-model', 'coding-tools', 'applications']

  priority.forEach(moduleKey => {
    const articles = allModuleArticles[moduleKey] || []
    const unique = []

    articles.forEach(article => {
      const url = article.source_url || article.url
      if (!globalURLSet.has(url)) {
        globalURLSet.add(url)
        unique.push(article)
      } else {
        totalDuplicates++
      }
    })

    deduplicated[moduleKey] = unique
  })

  if (totalDuplicates > 0) {
    console.log(`  🗑️  跨模块去重: 移除 ${totalDuplicates} 条重复文章`)
  }

  return deduplicated
}
