#!/usr/bin/env node

/**
 * 主脚本：获取AI新闻并更新数据文件
 * 数据源：RSS Feeds（主要） + Google Custom Search（补充）
 * 流程：采集 → AI处理 → 去重 → 保存
 */

import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// 加载.env文件
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import { categories, fetchConfig } from './sources.js'
import { processNewsBatch, deduplicateNews } from './zhipu-api.js'
import { fetchAllRSSFeeds, fetchRSSByLanguage } from './rss-fetcher.js'
import { checkGoogleAPIConfig, batchGoogleSearch } from './google-search.js'

/**
 * 获取某个类别的新闻（混合数据源）
 */
async function fetchCategoryNews(categoryKey) {
  const category = categories[categoryKey]
  console.log(`\n📡 正在采集: ${category.name}`)

  const allResults = []

  // 1. 采集RSS源（主要数据源）
  console.log('  📰 步骤1: 采集RSS源...')

  // 特殊处理：中国AI动态只使用中文RSS源
  let rssItems
  if (categoryKey === 'china-ai') {
    console.log('  🇨🇳 只采集中文RSS源...')
    rssItems = await fetchRSSByLanguage('zh')
  } else {
    rssItems = await fetchAllRSSFeeds()
  }

  // 根据关键词筛选相关RSS文章
  const keywords = category.keywords
  let filteredRSS = rssItems.filter(item => {
    const text = (item.title + ' ' + item.description).toLowerCase()
    return keywords.some(keyword =>
      text.toLowerCase().includes(keyword.toLowerCase())
    )
  })

  // 中国AI动态：额外过滤，确保只有中国内容
  if (categoryKey === 'china-ai') {
    const beforeCount = filteredRSS.length
    filteredRSS = filteredRSS.filter(item => {
      const text = (item.title + ' ' + item.description + ' ' + (item.source || '')).toLowerCase()

      // 排除明确的美国/国外公司
      const excludeKeywords = [
        'microsoft', 'meta', 'amazon', 'google', 'openai', 'anthropic',
        '微软', '谷歌', '亚马逊', '美国', '硅谷'
      ]

      // 必须包含中国相关关键词
      const includeKeywords = [
        'deepseek', '百度', '阿里', '腾讯', '字节', '华为', '小米',
        '通义', '文心', '豆包', '混元', 'kimi', '智谱', '月之暗面',
        '科大讯飞', '百川', '零一万物', 'minimax',
        '中国', '国产', '国内'
      ]

      const hasExclude = excludeKeywords.some(k => text.includes(k))
      const hasInclude = includeKeywords.some(k => text.includes(k))

      return !hasExclude && hasInclude
    })

    console.log(`  🇨🇳 中国内容筛选: ${beforeCount} → ${filteredRSS.length} 条`)
  }

  console.log(`  ✅ RSS筛选: ${filteredRSS.length} 条相关文章`)
  allResults.push(...filteredRSS.map(item => ({
    title: item.title,
    description: item.description,
    url: item.url,
    lang: item.language || 'unknown'
  })))

  // 2. 使用Google搜索补充（如果配置了）
  const hasGoogleAPI = checkGoogleAPIConfig()

  if (hasGoogleAPI) {
    console.log('  🔍 步骤2: 使用Google搜索补充...')
    const googleResults = await batchGoogleSearch(
      keywords.slice(0, 5), // 使用前5个关键词
      process.env.GOOGLE_API_KEY,
      process.env.GOOGLE_SEARCH_CX,
      10 // 每个关键词10条
    )

    allResults.push(...googleResults.map(item => ({
      title: item.title,
      description: item.description,
      url: item.url,
      lang: 'unknown'
    })))
  } else {
    console.log('  ℹ️  步骤2: Google API未配置，仅使用RSS源\n')
  }

  console.log(`  📊 共采集到 ${allResults.length} 条原始新闻`)
  return allResults
}

/**
 * 保存数据到JSON文件
 */
async function saveCategoryData(categoryKey, newsList) {
  const category = categories[categoryKey]
  const filePath = path.join(__dirname, '..', 'data', category.file)

  // 读取现有数据
  let existingData = { news: [] }
  try {
    const content = await fs.readFile(filePath, 'utf-8')
    existingData = JSON.parse(content)
  } catch (error) {
    console.log(`  ℹ️  文件不存在，将创建新文件`)
  }

  // 合并新旧数据（去重）
  const existingNews = existingData.news || []
  const allNews = [...newsList, ...existingNews]
  const deduplicated = deduplicateNews(allNews)

  // 只保留最新的1000条
  const finalNews = deduplicated.slice(0, 1000).map((news, index) => ({
    ...news,
    id: index + 1
  }))

  // 更新数据
  const newData = {
    category: category.name,
    last_update: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }),
    news: finalNews
  }

  // 保存文件
  await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf-8')
  console.log(`  ✅ 已保存 ${finalNews.length} 条新闻到 ${category.file}`)

  return {
    total: finalNews.length,
    new: newsList.length
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始采集AI动态\n')
  console.log(`⏰ 开始时间: ${new Date().toLocaleString('zh-CN')}\n`)
  console.log('📡 数据源: RSS Feeds (主要) + Google Custom Search (补充)\n')

  // 检查API配置
  const hasZhipuKey = !!process.env.ZHIPU_API_KEY
  const hasGoogleAPI = checkGoogleAPIConfig()

  if (!hasZhipuKey) {
    console.error('❌ 错误: 未设置 ZHIPU_API_KEY 环境变量')
    console.log('💡 提示: 请在 .env 文件中配置 ZHIPU_API_KEY\n')
    process.exit(1)
  }

  if (!hasGoogleAPI) {
    console.log('⚠️  警告: 未配置Google API，仅使用RSS源（免费但数据量可能较少）')
    console.log('💡 提示: 获取Google API可提升数据量\n')
    await new Promise(resolve => setTimeout(resolve, 3000))
  }

  const stats = {}

  // 遍历所有类别
  for (const [key, category] of Object.entries(categories)) {
    try {
      // 1. 搜索获取原始新闻
      const rawNews = await fetchCategoryNews(key)

      if (rawNews.length === 0) {
        console.log(`  ⚠️  ${category.name} 没有采集到新数据，跳过\n`)
        continue
      }

      // 2. AI处理（翻译、解读、过滤）
      console.log(`  🤖 正在用智谱AI处理 ${rawNews.length} 条新闻...`)
      const processedNews = await processNewsBatch(rawNews)

      // 3. 过滤掉违规和无关内容
      const validNews = processedNews.filter(n => n.is_legal && n.is_ai_related)

      console.log(`  ✅ 处理完成: ${validNews.length}/${rawNews.length} 条有效新闻`)

      if (validNews.length === 0) {
        console.log(`  ⚠️  ${category.name} 没有有效新闻，跳过\n`)
        continue
      }

      // 4. 保存数据
      const saveResult = await saveCategoryData(key, validNews)
      stats[key] = saveResult

    } catch (error) {
      console.error(`❌ ${category.name} 处理失败:`, error.message)
      stats[key] = { error: error.message }
    }
  }

  // 输出统计
  console.log('\n' + '='.repeat(50))
  console.log('📊 采集统计:\n')

  for (const [key, stat] of Object.entries(stats)) {
    if (stat.error) {
      console.log(`❌ ${categories[key].name}: ${stat.error}`)
    } else {
      console.log(`✅ ${categories[key].name}: 总计 ${stat.total} 条，新增 ${stat.new} 条`)
    }
  }

  console.log('\n⏰ 结束时间:', new Date().toLocaleString('zh-CN'))
  console.log('='.repeat(50) + '\n')
}

// 运行主函数
main().catch(error => {
  console.error('❌ 程序执行失败:', error)
  process.exit(1)
})
