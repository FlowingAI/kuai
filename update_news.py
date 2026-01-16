import feedparser
import requests
import os
import json
from datetime import datetime, timedelta

# --- 配置区 ---
RSS_SOURCES = [
    "https://rsshub.app/twitter/user/OpenAI",
    "https://rsshub.app/twitter/user/ClaudeAI",
    "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    "https://feeds.feedburner.com/TechCrunch/AI",
    "https://news.google.com/rss/search?q=AI+Sora+Claude+Cursor+Kling+when:10d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans"
]

def get_ai_summary(text):
    api_key = os.getenv("KUAI_API_KEY")
    if not api_key: return "（未配置 API Key）"
    prompt = f"请将以下AI动态翻译并总结为一句话中文干货，30字以内：\n{text}"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    try:
        response = requests.post(url, headers={'Content-Type': 'application/json'}, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=15)
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except: return "动态总结生成中..."

def classify_news(title):
    t = title.lower()
    if any(w in t for w in ['sora', 'video', 'runway', 'pika', 'kling', 'luma', '视频']): return 'video'
    if any(w in t for w in ['code', 'cursor', 'programming', 'github', 'python', '编程', '代码']): return 'code'
    if any(w in t for w in ['tool', 'agent', 'productivity', 'plugin', 'app', '工具', '助手']): return 'tools'
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
    ten_days_ago = datetime.now() - timedelta(days=10)

    print("开始抓取最新动态...")
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
    # 为四个分类准备内容容器
    html_chunks = {'llm': '', 'video': '', 'code': '', 'tools': ''}
    for item in data:
        card = f'<div class="news-card"><span class="date-tag">{item["date"]}</span><div class="news-title">{item["title"]}</div><p class="news-summary">{item["summary"]}</p></div>\n'
        cat = item.get('category', 'llm')
        if cat in html_chunks:
            html_chunks[cat] += card

    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()

    # 使用更加鲁棒的查找替换逻辑
    for c_id, c_html in html_chunks.items():
        start_tag = f""
        end_tag = f""
        
        # 找到两个标签的位置
        start_pos = content.find(start_tag)
        end_pos = content.find(end_tag)
        
        if start_pos != -1 and end_pos != -1:
            # 提取标签之前的内容
            before = content[:start_pos + len(start_tag)]
            # 提取标签之后的内容
            after = content[end_pos:]
            # 拼接
            content = before + "\n" + c_html + after
        else:
            print(f"跳过分类 {c_id}: 未在 HTML 中找到标记")

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(content)

def commit_changes():
    os.system('git config --global user.name "github-actions[bot]"')
    os.system('git config --global user.email "github-actions[bot]@users.noreply.github.com"')
    os.system('git add index.html data.json')
    status = os.popen('git status --porcelain').read()
    if status:
        os.system('git commit -m "Update content [skip ci]"')
        os.system('git push')

if __name__ == "__main__":
    run()
    commit_changes()
