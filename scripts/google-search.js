/**
 * Google Custom Search API 封装
 * 作为RSS源的补充
 */

import fetch from 'node-fetch'

const GOOGLE_API_URL = 'https://www.googleapis.com/customsearch/v1'

/**
 * 使用Google Custom Search API搜索
 */
export async function searchWithGoogle(keyword, apiKey, cx, count = 10) {
  if (!apiKey || !cx) {
    console.warn('⚠️  未配置Google API，跳过Google搜索')
    return []
  }

  try {
    const url = `${GOOGLE_API_URL}?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(keyword)}&num=${count}`

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      },
      timeout: 10000
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Google API错误')
    }

    const data = await response.json()

    return (data.items || []).map(item => ({
      title: item.title,
      description: item.snippet,
      url: item.link,
      source: 'Google Search',
      language: keyword === keyword ? 'unknown' : 'unknown'
    }))

  } catch (error) {
    console.warn(`⚠️  Google搜索失败 (${keyword}):`, error.message)
    return []
  }
}

/**
 * 批量搜索（补充RSS源）
 */
export async function batchGoogleSearch(keywords, apiKey, cx, resultsPerKeyword = 5) {
  if (!apiKey || !cx) {
    return []
  }

  console.log('🔍 使用Google搜索补充数据源...')

  const allResults = []

  for (const keyword of keywords.slice(0, 5)) { // 限制搜索5个关键词
    try {
      const results = await searchWithGoogle(keyword, apiKey, cx, resultsPerKeyword)
      allResults.push(...results)
      console.log(`  ✅ Google "${keyword}": ${results.length} 条`)
      await new Promise(resolve => setTimeout(resolve, 1000)) // 延迟1秒
    } catch (error) {
      console.warn(`  ⚠️  Google "${keyword}" 失败`)
    }
  }

  console.log(`📊 Google搜索共获取: ${allResults.length} 条\n`)

  return allResults
}

/**
 * 检查Google API配置
 */
export function checkGoogleAPIConfig() {
  const apiKey = process.env.GOOGLE_API_KEY
  const cx = process.env.GOOGLE_SEARCH_CX

  if (!apiKey || !cx) {
    console.log('ℹ️  Google API未配置，仅使用RSS源')
    return false
  }

  console.log('✅ Google API已配置')
  return true
}
