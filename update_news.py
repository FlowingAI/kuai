import feedparser
import requests
import os
import re
from datetime import datetime

# --- 配置区：抓取源 ---
RSS_SOURCES = [
    "https://rsshub.app/twitter/user/OpenAI",           # OpenAI 的 X 动态
    "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml", 
    "https://news.google.com/rss/search?q=AI+news&hl=zh-CN&gl=CN&ceid=CN:zh-Hans"
]

def get_ai_summary(text):
    """调用 Gemini AI 进行总结"""
    api_key = os.getenv("KUAI_API_KEY")
    if not api_key:
        return "（未配置 API Key）"
    
    # 提示词：要求总结成20字以内干货
    prompt = f"请将以下 AI 资讯总结为一句 25 字以内的中文精华，剔除废话：\n{text}"
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=15)
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print(f"AI 总结出错: {e}")
        return "精华总结生成中..."

def run_update():
    all_news = []
    print("正在搜集全球 AI 资讯...")

    for url in RSS_SOURCES:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:2]: # 每个源取前2条
                # 仅保留日期
                today_date = datetime.now().strftime("%Y-%m-%d")
                summary = get_ai_summary(entry.title)
                
                all_news.append({
                    "title": entry.title,
                    "date": today_date,
                    "summary": summary
                })
        except:
            continue

    if not all_news:
        print("未抓取到新闻，跳过更新。")
        return

    # 读取并替换 HTML 内容
    with open("index.html", "r", encoding="utf-8") as f:
        html_content = f.read()

    # 构建新的 HTML 块
    news_html_blocks = '<div class="news-preview">'
    for item in all_news:
        news_html_blocks += f'''
        <div class="news-card">
            <span class="date-tag">{item["date"]}</span>
            <div class="news-title">{item["title"]}</div>
            <p class="news-summary">{item["summary"]}</p>
        </div>
        '''
    news_html_blocks += '</div>'

    # 使用正则替换
    new_content = re.sub(
        r'<div class="news-preview">.*?</div>',
        news_html_blocks,
        html_content,
        flags=re.DOTALL
    )

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("网站内容已成功更新！")

if __name__ == "__main__":
    run_update()
