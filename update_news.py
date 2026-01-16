import feedparser
import requests
import os
import json
from datetime import datetime, timedelta

# --- 1. 配置区 ---
RSS_SOURCES = [
    "https://rsshub.app/twitter/user/OpenAI",
    "https://rsshub.app/twitter/user/ClaudeAI",
    "https://rsshub.app/twitter/user/deepseek_ai",
    "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    "https://feeds.feedburner.com/TechCrunch/AI",
    "https://news.google.com/rss/search?q=AI+Sora+Claude+Cursor+DeepSeek+when:7d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans"
]

def get_ai_summary(text):
    api_key = os.getenv("ZHIPU_API_KEY") 
    if not api_key: return "（API未配置）"
    
    url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
    headers = {"Authorization": f"Bearer {api_key}"}
    prompt = f"请将以下AI动态翻译并总结为一句话中文干货，30字以内：\n{text}"
    
    payload = {
        "model": "glm-4-flash",
        "messages": [{"role": "user", "content": prompt}]
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=20)
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content'].strip()
        else:
            print(f"API请求失败: {response.status_code}")
            return "动态总结生成中..."
    except:
        return "动态总结生成中..."

def classify_news(title):
    t = title.lower()
    if any(w in t for w in ['sora', 'video', 'video generation', '视频']): return 'video'
    if any(w in t for w in ['code', 'cursor', 'programming', 'github', '编程']): return 'code'
    if any(w in t for w in ['tool', 'agent', 'productivity', 'app', '工具']): return 'tools'
    return 'llm'

def run():
    db_file = 'data.json'
    db_data = []
    if os.path.exists(db_file):
        with open(db_file, 'r', encoding='utf-8') as f:
            try: db_data = json.load(f)
            except: pass

    existing_titles = {item['title'] for item in db_data}
    new_found = 0
    # 扩大范围：抓取 14 天内的内容
    time_limit = datetime.now() - timedelta(days=14)

    print("🚀 智谱 AI 正在扫描全球情报...")
    for url in RSS_SOURCES:
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                # 处理不同格式的时间
                pub_date = datetime(*entry.published_parsed[:6]) if 'published_parsed' in entry else datetime.now()
                if pub_date > time_limit and entry.title not in existing_titles:
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
                    print(f"✅ 抓取到: {entry.title[:30]}...")
        except: continue

    if new_found > 0:
        db_data.sort(key=lambda x: x['timestamp'], reverse=True)
        db_data = db_data[:100]
        with open(db_file, 'w', encoding='utf-8') as f:
            json.dump(db_data, f, ensure_ascii=False, indent=2)
    
    render_html(db_data)

def render_html(data):
    html_chunks = {'llm': '', 'video': '', 'code': '', 'tools': ''}
    for item in data:
        card = f'<div class="news-card"><span class="date-tag">{item["date"]}</span><div class="news-title">{item["title"]}</div><p class="news-summary">{item["summary"]}</p></div>\n'
        cat = item.get('category', 'llm')
        if cat in html_chunks: html_chunks[cat] += card

    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()

    for c_id, c_html in html_chunks.items():
        start_tag, end_tag = f"", f""
        start_pos, end_pos = content.find(start_tag), content.find(end_tag)
        if start_pos != -1 and end_pos != -1:
            content = content[:start_pos + len(start_tag)] + "\n" + (c_html if c_html else '<p style="color:#ccc;font-size:12px;padding:20px;">暂无近期动态</p>') + content[end_pos:]

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(content)
    print(f"📊 网页渲染完成，新增 {new_found} 条动态")

def commit_changes():
    os.system('git config --global user.name "github-actions[bot]"')
    os.system('git config --global user.email "github-actions[bot]@users.noreply.github.com"')
    os.system('git add index.html data.json')
    if os.popen('git status --porcelain').read():
        os.system('git commit -m "Auto Update News" && git push')

if __name__ == "__main__":
    run(); commit_changes()
