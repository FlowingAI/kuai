import feedparser
import requests
import os
import json
import re
from datetime import datetime, timedelta

# --- 抓取源配置 ---
RSS_SOURCES = [
    "https://rsshub.app/twitter/user/OpenAI",
    "https://rsshub.app/twitter/user/ClaudeAI",
    "https://rsshub.app/twitter/user/anthropic",
    "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    "https://feeds.feedburner.com/TechCrunch/AI",
    "https://news.google.com/rss/search?q=AI+Sora+Claude+Code+Cursor+Kling+when:10d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans"
]

def get_ai_summary(text):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key: return "（未配置 API Key）"
    # 增加翻译指令
    prompt = f"你是一个AI专家。请将以下动态总结为一句话中文干货（若原内容为英文请翻译）。要求：30字以内，不含废话。内容：\n{text}"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    try:
        response = requests.post(url, headers={'Content-Type': 'application/json'}, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=15)
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except: return "动态总结生成中..."

def classify_news(title):
    """简单的关键词分类逻辑"""
    title_lower = title.lower()
    if any(word in title_lower for word in ['sora', 'video', 'runway', 'pika', 'kling', 'luma', '视频']):
        return 'video'
    if any(word in title_lower for word in ['code', 'cursor', 'programming', 'github', 'python', '编程', '代码']):
        return 'code'
    if any(word in title_lower for word in ['tool', 'agent', 'productivity', 'plugin', 'app', '工具', '助手']):
        return 'tools'
    return 'llm' # 默认归类为大模型

def run():
    db_file = 'data.json'
    if os.path.exists(db_file):
        with open(db_file, 'r', encoding='utf-8') as f:
            try: db_data = json.load(f)
            except: db_data = []
    else: db_data = []

    existing_titles = {item['title'] for item in db_data}
    new_found = 0
    ten_days_ago = datetime.now() - timedelta(days=10)

    for url in RSS_SOURCES:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                pub_date = datetime(*entry.published_parsed[:6]) if 'published_parsed' in entry else datetime.now()
                if pub_date > ten_days_ago and entry.title not in existing_titles:
                    summary = get_ai_summary(entry.title)
                    db_data.append({
                        "title": entry.title,
                        "date": pub_date.strftime("%Y-%m-%d"),
                        "summary": summary,
                        "category": classify_news(entry.title),
                        "timestamp": pub_date.timestamp()
                    })
                    existing_titles.add(entry.title)
                    new_found += 1
        except: continue

    if new_found > 0:
        db_data.sort(key=lambda x: x['timestamp'], reverse=True)
        with open(db_file, 'w', encoding='utf-8') as f:
            json.dump(db_data, f, ensure_ascii=False, indent=2)
    
    render_html(db_data)

def render_html(data):
    # 分别筛选四个分类的数据
    cats = {'llm': '', 'video': '', 'code': '', 'tools': ''}
    for item in data:
        html = f'''
        <div class="news-card" data-cat="{item['category']}">
            <span class="date-tag">{item["date"]}</span>
            <div class="news-title">{item["title"]}</div>
            <p class="news-summary">{item["summary"]}</p>
        </div>'''
        cats[item['category']] += html

    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()

    # 使用正则分别替换四个区域
    for c_id, c_html in cats.items():
        pattern = f'.*?'
        content = re.sub(pattern, f'{c_html}', content, flags=re.DOTALL)

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    run()
