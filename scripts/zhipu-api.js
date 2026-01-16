/**
 * 智谱AI API 封装
 * 用于：翻译、解读、去水、过滤违规内容
 */

import fetch from 'node-fetch'

const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

/**
 * 调用智谱AI API
 */
async function callZhipuAPI(messages, maxRetries = 3) {
  const apiKey = process.env.ZHIPU_API_KEY

  if (!apiKey) {
    throw new Error('未设置 ZHIPU_API_KEY 环境变量')
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(ZHIPU_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'glm-4-flash', // 使用快速模型
          messages: messages,
          temperature: 0.3, // 降低温度以获得更稳定的结果
          max_tokens: 2000
        }),
        timeout: 30000
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API请求失败: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      return data.choices[0].message.content

    } catch (error) {
      console.error(`智谱API调用失败 (尝试 ${attempt}/${maxRetries}):`, error.message)

      if (attempt === maxRetries) {
        throw error
      }

      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt))
    }
  }
}

/**
 * 处理单条新闻
 * 功能：翻译（如需）、解读、去水、过滤
 */
export async function processNews(title, description, url) {
  try {
    const prompt = `
请分析以下新闻，完成以下任务：

1. **语言检测与翻译**：
   - 检测新闻是中文还是英文
   - 如果是英文内容，完整翻译为中文（保留所有细节和信息）
   - 如果是中文内容，保持原样（去除明显的水词和营销语言）

2. **内容整理**：
   - 保留完整内容，不要压缩或精简
   - 去除营销语言（如"不容错过"、"重磅"等）
   - 去除冗余的水词（如"据悉"、"近日"等）
   - 保持原文所有关键信息和细节

3. **内容过滤**：
   - 判断内容是否违反中国法律法规（政治敏感、违法信息、色情暴力等）
   - 判断是否与AI相关（排除与人工智能无关的内容）
   - 如果标题和摘要明显是营销广告，也应过滤

4. **提取发布时间**：
   - 如果内容中包含明确的时间信息（如"今日"、"1月15日"等），提取出来
   - 格式统一为 YYYY-MM-DD

新闻标题：${title}
新闻内容：${description}
新闻链接：${url}

请严格按照以下JSON格式返回（不要有其他文字）：
{
  "title": "中文标题（翻译后如果是英文）",
  "summary": "完整翻译后的内容（不要压缩，保留所有信息）",
  "is_legal": true/false,
  "is_ai_related": true/false,
  "publish_time": "2025-01-16 或 null",
  "original_language": "en 或 zh"
}
`

    const messages = [
      { role: 'user', content: prompt }
    ]

    const result = await callZhipuAPI(messages)

    // 尝试解析JSON
    let parsed
    try {
      // 清理可能的markdown代码块标记
      const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsed = JSON.parse(cleaned)
    } catch (parseError) {
      console.error('JSON解析失败:', result)
      throw new Error('智谱AI返回的内容格式错误')
    }

    // 验证返回的数据
    if (!parsed.title || !parsed.summary) {
      throw new Error('智谱AI返回的数据缺少必要字段')
    }

    return {
      ...parsed,
      original_title: title,
      source_url: url
    }

  } catch (error) {
    console.error('处理新闻失败:', error.message)
    return null
  }
}

/**
 * 批量处理新闻（支持并发控制）
 */
export async function processNewsBatch(newsList, concurrency = 5) {
  const results = []

  for (let i = 0; i < newsList.length; i += concurrency) {
    const batch = newsList.slice(i, i + concurrency)
    const promises = batch.map(async (news) => {
      const processed = await processNews(news.title, news.description, news.url)
      return processed
    })

    const batchResults = await Promise.all(promises)
    results.push(...batchResults.filter(r => r !== null))

    // 避免API限流
    if (i + concurrency < newsList.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return results
}

/**
 * 去重新闻
 * 根据标题相似度去重
 */
export function deduplicateNews(newsList) {
  const seen = new Set()
  const deduplicated = []

  for (const news of newsList) {
    // 生成标题的简单指纹（去除空格和标点）
    const fingerprint = news.title
      .toLowerCase()
      .replace(/[\s\p{P}]/gu, '')

    if (!seen.has(fingerprint)) {
      seen.add(fingerprint)
      deduplicated.push(news)
    }
  }

  return deduplicated
}
