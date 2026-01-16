import feedparser
import requests
import os
import json
import re
from datetime import datetime, timedelta

# --- 抓取源配置：覆盖大模型、工具、视频、创业 ---
RSS_SOURCES = [
    "https://rsshub.app/twitter/user/OpenAI",
    "https://rsshub.app/twitter/user/ClaudeAI",
    "https://rsshub.app/twitter/user/OpenCode",
    "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    "https://feeds.feedburner.com/TechCrunch/AI",
    "https://news.google.com/rss/search?q=AI+funding+acquisition+Sora+Claude+when:10d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans"
]

def get_ai_summary(text):
    api_key = os.getenv("KUAI_API_KEY")
    if not api_key: return "（未配置 API Key）"
    prompt = f"请用中文总结以下AI资讯核心干货，不超过30字：\n{text}"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    try:
        response = requests.post(url, headers={'Content-Type': 'application/json'}, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=15)
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except: return "动态总结生成中..."

def run():
    db_file = 'data.json'
    # 1. 加载数据库
    if os.path.exists(db_file):
        with open(db_file, 'r', encoding='utf-8') as f:
            try: db_data = json.load(f)
            except: db_data = []
    else:
        db_data = []

    # 2. 抓取与去重
    print("开始多维度抓取...")
    existing_titles = {item['title'] for item in db_data}
    new_found = 0
    ten_days_ago = datetime.now() - timedelta(days=10)

    for url in RSS_SOURCES:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                pub_date = datetime(*entry.published_parsed[:6]) if 'published_parsed' in entry else datetime.now()
                # 存10天内的且不重复
                if pub_date > ten_days_ago and entry.title not in existing_titles:
                    summary = get_ai_summary(entry.title)
                    db_data.append({
                        "title": entry.title,
                        "date": pub_date.strftime("%Y-%m-%d"),
                        "summary": summary,
                        "timestamp": pub_date.timestamp()
                    })
                    existing_titles.add(entry.title)
                    new_found += 1
        except: continue

    if new_found == 0:
        print("今日无新发现，仅重新渲染页面。")
    else:
        # 3. 排序并保存数据库
        db_data.sort(key=lambda x: x['timestamp'], reverse=True)
        with open(db_file, 'w', encoding='utf-8') as f:
            json.dump(db_data, f, ensure_ascii=False, indent=2)
        print(f"成功保存 {new_found} 条新数据到 JSON。")

    # 4. 渲染 HTML
    render_html(db_data)

def render_html(data):
    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()

    news_html = '<div id="news-container" class="news-preview">'
    for item in data:
        news_html += f'''
        <div class="news-card">
            <span class="date-tag">{item["date"]}</span>
            <div class="news-title">{item["title"]}</div>
            <p class="news-summary">{item["summary"]}</p>
        </div>'''
    news_html += '</div>'

    pattern = r'<div id="news-container" class="news-preview">.*?</div>'
    new_content = re.sub(pattern, news_html, content, flags=re.DOTALL)

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(new_content)
    print("网页渲染完成。")

if __name__ == "__main__":
    run()
