#!/usr/bin/env node
/**
 * 双轨制新闻采集脚本 v2.0
 *
 * 轨道1: RSS 采集（60%）- 权威、实时、高质量
 * 轨道2: 搜索采集（40%）- 覆盖广、补充遗漏
 *
 * 功能:
 * - RSS 并发拉取
 * - 三维词库智能搜索
 * - Jina Reader 内容清洗
 * - AI 语义分类纠偏
 * - 去重与合并
 */

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Parser from 'rss-parser'
import fetch from 'node-fetch'

// 导入配置和工具
import { rssSources, rssConfig, getEnabledSources } from './rss-sources.js'
import { enhancedCategories, enhancedConfig, checkDirectMatch, checkLogicMatch } from './sources-v2.js'
import { buildMultipleQueries, getStrategyDescription } from './search-query-builder.js'
import { fetchWithJinaReader, extractKeyInfo } from './jina-reader.js'
import { processNews, processNewsBatch, deduplicateNews } from './zhipu-api.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 初始化 RSS Parser
const parser = new Parser({
  timeout: rssConfig.timeout,
  customFields: {
    item: ['description', 'content:encoded', 'pubDate']
  }
})

/**
 * 轨道1: RSS 采集
 */
async function fetchRSSNews(categoryKey) {
  console.log(`\n📡 [轨道1: RSS] 开始采集 ${categoryKey}...`)

  const sources = getEnabledSources()
  const categorySources = sources.filter(source =>
    source.modules.includes('all') || source.modules.includes(categoryKey)
  )

  console.log(`  📍 找到 ${categorySources.length} 个相关RSS源`)

  const allArticles = []

  // 分批并发拉取
  for (let i = 0; i < categorySources.length; i += rssConfig.batchSize) {
    const batch = categorySources.slice(i, i + rssConfig.batchSize)
    console.log(`\n  📦 批次 ${Math.floor(i / rssConfig.batchSize) + 1}/${Math.ceil(categorySources.length / rssConfig.batchSize)}:`)

    const promises = batch.map(async (source) => {
      try {
        console.log(`    🔗 ${source.name}...`)
        const feed = await parser.parseURL(source.url)

        // 提取文章（只取前20条）
        const articles = feed.items.slice(0, 20).map(item => ({
          title: item.title || '',
          description: item.contentSnippet || item.content || '',
          url: item.link || item.guid || '',
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          source: source.name,
          language: source.language,
          track: 'rss' // 标记为RSS轨道
        }))

        console.log(`      ✅ 获取 ${articles.length} 条`)
        return articles

      } catch (error) {
        console.warn(`      ⚠️  ${source.name} 失败:`, error.message)
        return []
      }
    })

    const batchResults = await Promise.allSettled(promises)
    batchResults.forEach(result => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value)
      }
    })

    // 批次间延迟
    if (i + rssConfig.batchSize < categorySources.length) {
      console.log(`  ⏳ 等待 ${rssConfig.batchDelay}ms...`)
      await sleep(rssConfig.batchDelay)
    }
  }

  console.log(`\n  📊 [轨道1: RSS] 共获取 ${allArticles.length} 条原始文章`)
  return allArticles
}

/**
 * 轨道2: 搜索采集
 */
async function fetchSearchNews(categoryKey) {
  console.log(`\n🔍 [轨道2: 搜索] 开始采集 ${categoryKey}...`)

  const category = enhancedCategories[categoryKey]
  if (!category) {
    console.warn(`  ⚠️  未找到分类配置: ${categoryKey}`)
    return []
  }

  // 构建多个搜索 Query（使用3个公式）
  const queries = buildMultipleQueries(categoryKey, 5)
  console.log(`  📝 构建了 ${queries.length} 个搜索Query`)
  console.log(`  🎯 策略: ${getStrategyDescription('auto')}`)

  const allArticles = []

  // 执行搜索（这里简化处理，实际需要调用 Bing Search API）
  // 由于没有 Bing Search API，我们使用现有的 google-search.js
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i]
    console.log(`\n  🔍 Query ${i + 1}/${queries.length}`)
    console.log(`    ${query.substring(0, 100)}...`)

    // 这里应该调用搜索 API
    // 由于限制，暂时使用模拟数据
    const mockArticles = await mockSearchFetch(query, categoryKey)

    console.log(`    ✅ 获取 ${mockArticles.length} 条`)
    allArticles.push(...mockArticles.map(a => ({ ...a, track: 'search' })))
  }

  console.log(`\n  📊 [轨道2: 搜索] 共获取 ${allArticles.length} 条原始文章`)
  return allArticles
}

/**
 * 模拟搜索抓取（实际需要集成 Bing Search API）
 */
async function mockSearchFetch(query, categoryKey) {
  // 这里应该调用实际的搜索 API
  // 暂时返回空数组，等待集成 Bing Search API
  return []

  /* 实际实现示例：
  try {
    const response = await fetch(`https://api.bing.com/search?q=${encodeURIComponent(query)}`, {
      headers: { 'Ocp-Apim-Subscription-Key': process.env.BING_SEARCH_KEY }
    })
    const data = await response.json()
    return data.webPages.value.map(item => ({
      title: item.name,
      description: item.snippet,
      url: item.url,
      source: 'Bing Search',
      language: 'auto'
    }))
  } catch (error) {
    console.warn('搜索失败:', error.message)
    return []
  }
  */
}

/**
 * 内容深度处理（Jina Reader + AI）
 */
async function processArticles(articles, categoryKey) {
  console.log(`\n🤖 开始内容处理 (${articles.length} 条)...`)

  const processed = []

  // 分批处理（避免过载）
  const batchSize = 5 // 减少批次大小，提高稳定性
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize)
    console.log(`  📦 批次 ${Math.floor(i / batchSize) + 1}/${Math.ceil(articles.length / batchSize)}:`)

    for (const article of batch) {
      try {
        // 1. Jina Reader 内容提取（如果启用）
        let fullContent = article.description
        try {
          if (rssConfig.jinaReaderEnabled && article.track === 'rss') {
            const jinaContent = await fetchWithJinaReader(article.url, 20000) // 增加到20秒
            if (jinaContent) {
              fullContent = extractKeyInfo(jinaContent, 1000) // 减少到1000字符
            }
          }
        } catch (jinaError) {
          console.warn(`    ⚠️  Jina Reader 失败，使用原始描述:`, jinaError.message)
          fullContent = article.description
        }

        // 2. AI 处理（翻译、总结、过滤）
        let aiResult
        try {
          aiResult = await processNews(
            article.title,
            fullContent,
            article.url
          )
        } catch (aiError) {
          console.warn(`    ⚠️  AI 处理失败，跳过:`, aiError.message)
          continue // 跳过这篇文章，继续下一篇
        }

        if (aiResult && aiResult.is_legal && aiResult.is_ai_related) {
          processed.push({
            ...aiResult,
            id: 0, // 稍后分配
            track: article.track,
            original_source: article.source
          })
          console.log(`    ✅ [${article.track}] ${article.title.substring(0, 30)}...`)
        } else {
          console.log(`    ⚠️  [${article.track}] 被过滤: ${article.title.substring(0, 30)}...`)
        }

      } catch (error) {
        console.warn(`    ❌ 处理失败:`, error.message)
      }

      // 增加延迟，避免API限流
      await sleep(1000) // 从 500ms 增加到 1000ms
    }

    // 批次间延迟
    if (i + batchSize < articles.length) {
      console.log(`  ⏳ 等待 3 秒后继续...`)
      await sleep(3000) // 批次间增加延迟
    }
  }

  console.log(`\n  📊 处理完成: ${processed.length}/${articles.length} 条通过AI处理`)
  return processed
}

/**
 * 双轨合并与去重
 */
function mergeAndDeduplicate(rssArticles, searchArticles) {
  console.log(`\n🔄 双轨合并与去重...`)
  console.log(`  📊 RSS: ${rssArticles.length} 条`)
  console.log(`  🔍 搜索: ${searchArticles.length} 条`)

  const allArticles = [...rssArticles, ...searchArticles]

  // URL 去重
  const urlSet = new Set()
  const uniqueByUrl = []

  for (const article of allArticles) {
    const url = article.source_url || article.url
    if (!urlSet.has(url)) {
      urlSet.add(url)
      uniqueByUrl.push(article)
    }
  }

  console.log(`  🗑️  URL去重后: ${uniqueByUrl.length} 条`)

  // 标题相似度去重
  const deduplicated = deduplicateNews(uniqueByUrl)

  console.log(`  🗑️  标题去重后: ${deduplicated.length} 条`)

  return deduplicated
}

/**
 * 分配序号并排序
 */
function assignIdsAndSort(articles) {
  // 按发布时间排序（最新的在前）
  const sorted = articles.sort((a, b) => {
    const dateA = a.publish_time ? new Date(a.publish_time) : new Date(0)
    const dateB = b.publish_time ? new Date(b.publish_time) : new Date(0)
    return dateB - dateA
  })

  // 分配序号
  sorted.forEach((article, index) => {
    article.id = index + 1
  })

  return sorted
}

/**
 * 保存到 JSON 文件
 */
function saveToFile(categoryKey, articles, maxCount = 100) {
  const category = enhancedCategories[categoryKey]
  const filename = category.file
  const filepath = path.join(__dirname, '..', 'public', 'data', filename)

  // 只保留前 N 条
  const sliced = articles.slice(0, maxCount)

  // 添加更新时间
  const output = {
    category: category.name,
    last_update: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '/'),
    news: sliced
  }

  // 确保目录存在
  const dir = path.dirname(filepath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // 写入文件
  fs.writeFileSync(filepath, JSON.stringify(output, null, 2), 'utf-8')

  console.log(`\n💾 已保存到: ${filename}`)
  console.log(`  📊 共 ${sliced.length} 条新闻`)
}

/**
 * 辅助函数：延迟
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 主函数：采集单个分类
 */
async function fetchCategory(categoryKey) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`🎯 开始采集: ${categoryKey}`)
  console.log(`${'='.repeat(80)}`)

  try {
    // 轨道1: RSS 采集
    const rssArticles = await fetchRSSNews(categoryKey)

    // 轨道2: 搜索采集（如果RSS数量不足）
    let searchArticles = []
    if (rssArticles.length < rssConfig.targetCount) {
      searchArticles = await fetchSearchNews(categoryKey)
    } else {
      console.log(`\n✅ RSS数量充足 (${rssArticles.length} >= ${rssConfig.targetCount})，跳过搜索`)
    }

    // 内容处理（AI）
    console.log(`\n${'='.repeat(80)}`)
    console.log(`🤖 AI 内容处理`)
    console.log(`${'='.repeat(80)}`)

    const processedRSS = await processArticles(rssArticles, categoryKey)
    const processedSearch = await processArticles(searchArticles, categoryKey)

    // 双轨合并与去重
    console.log(`\n${'='.repeat(80)}`)
    console.log(`🔄 双轨合并`)
    console.log(`${'='.repeat(80)}`)

    const merged = mergeAndDeduplicate(processedRSS, processedSearch)

    // 分配序号并排序
    const sorted = assignIdsAndSort(merged)

    // 保存到文件
    saveToFile(categoryKey, sorted, enhancedConfig.newsCountPerCategory)

    console.log(`\n✅ ${categoryKey} 采集完成!`)

    return sorted

  } catch (error) {
    console.error(`\n❌ ${categoryKey} 采集失败:`, error)
    return []
  }
}

/**
 * 主函数：采集所有分类
 */
async function main() {
  console.log('\n🚀 双轨制新闻采集系统 v2.0')
  console.log(`📅 开始时间: ${new Date().toLocaleString('zh-CN')}`)

  const startTime = Date.now()

  try {
    const categories = Object.keys(enhancedCategories)

    for (const categoryKey of categories) {
      await fetchCategory(categoryKey)

      // 分类间延迟
      if (categories.indexOf(categoryKey) < categories.length - 1) {
        console.log(`\n⏳ 等待 3 秒后继续...`)
        await sleep(3000)
      }
    }

    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000 / 60).toFixed(2)

    console.log(`\n${'='.repeat(80)}`)
    console.log(`🎉 全部采集完成!`)
    console.log(`⏱️  总耗时: ${duration} 分钟`)
    console.log(`📅 结束时间: ${new Date().toLocaleString('zh-CN')}`)
    console.log(`${'='.repeat(80)}\n`)

  } catch (error) {
    console.error('\n❌ 采集失败:', error)
    process.exit(1)
  }
}

// 运行主函数
main()
