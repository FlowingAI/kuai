/**
 * Jina Reader API 封装
 * 用于提取网页的纯文本内容
 */

import fetch from 'node-fetch'

const JINA_READER_BASE_URL = 'https://r.jina.ai/'

/**
 * 使用 Jina Reader 提取网页内容
 */
export async function fetchWithJinaReader(url, timeout = 15000) {
  try {
    // 构造 Jina Reader URL
    const jinaUrl = `${JINA_READER_BASE_URL}${encodeURIComponent(url)}`

    console.log(`  📖 正在使用 Jina Reader 提取内容...`)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(jinaUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-News-Bot/1.0)'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Jina Reader 请求失败: ${response.status}`)
    }

    const content = await response.text()

    if (!content || content.trim().length < 50) {
      throw new Error('提取的内容为空或过短')
    }

    console.log(`  ✅ 成功提取 ${content.length} 字符`)
    return content

  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn(`  ⚠️  Jina Reader 超时 (${timeout}ms)`)
    } else {
      console.warn(`  ⚠️  Jina Reader 失败:`, error.message)
    }
    return null
  }
}

/**
 * 批量提取多个URL的内容（带并发控制）
 */
export async function fetchMultipleWithJinaReader(urls, concurrency = 3, delay = 2000) {
  const results = []

  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency)

    const promises = batch.map(async (url) => {
      const content = await fetchWithJinaReader(url)
      return { url, content }
    })

    const batchResults = await Promise.all(promises)
    results.push(...batchResults)

    // 批次间延迟，避免过载
    if (i + concurrency < urls.length) {
      console.log(`  ⏳ 等待 ${delay}ms 后继续...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  return results
}

/**
 * 清理提取的文本内容
 */
export function cleanJinaContent(content) {
  if (!content) return ''

  // 移除多余的空行
  let cleaned = content.replace(/\n{3,}/g, '\n\n')

  // 移除首尾空白
  cleaned = cleaned.trim()

  return cleaned
}

/**
 * 从提取的内容中提取关键信息
 */
export function extractKeyInfo(content, maxLength = 500) {
  if (!content) return ''

  // 清理内容
  const cleaned = cleanJinaContent(content)

  // 如果内容太长，截取前面部分
  if (cleaned.length > maxLength) {
    return cleaned.substring(0, maxLength) + '...'
  }

  return cleaned
}
