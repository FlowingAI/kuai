import feedparser
import requests
import os
import json
import re
from datetime import datetime, timedelta

# --- 1. 抓取源配置 ---
RSS_SOURCES = [
    "https://rsshub.app/twitter/user/OpenAI",
    "https://rsshub.app/twitter/user/ClaudeAI",
    "https://rsshub.app/twitter/user/anthropic",
    "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml",
    "https://feeds.feedburner.com/TechCrunch/AI",
    "https://news.google.com/rss/search?q=AI+Sora+Claude+Code+Cursor+Kling+when:10d&hl=zh-CN&gl=CN&ceid=CN:zh-Hans"
]

# --- 2. AI 翻译与总结函数 ---
def get_ai_summary(text):
    # 这里已修改为匹配你的 Secret 名称: KUAI_API_KEY
    api_key = os.getenv("KUAI_API_KEY")
    
    if not api_key:
        print("错误：未找到 KUAI_API_KEY，请检查 GitHub Secrets 配置。")
        return "（API配置错误）"
    
    prompt = f"你是一个AI专家。请将以下动态总结为一句话中文干货（若原内容为英文请务必翻译成中文）。要求：30字以内，极其精炼。内容：\n{text}"
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    
    try:
        response = requests.post(url, headers={'Content-Type': 'application/json'}, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=15)
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print(f"AI总结出错: {e}")
        return "动态总结生成中..."

# --- 3. 自动分类逻辑 ---
def classify_news(title):
    t = title.lower()
    if any(w in t for w in ['sora', 'video', 'runway', 'pika', 'kling', 'luma', '视频', '生成视频']):
        return 'video'
    if any(w in t for w in ['code', 'cursor', 'programming', 'github', 'python', '编程', '代码', 'copilot']):
        return 'code'
    if any(w in t for w in ['tool', 'agent', 'productivity', 'plugin', 'app', '工具', '助手', '插件']):
        return 'tools'
    return 'llm'

# --- 4. 核心运行逻辑 ---
def run():
    db_file = 'data.json'
    if os.path.exists(db_file):
        with open(db_file, 'r', encoding='utf-8') as f:
            try: db_data = json.load(f)
            except: db_data = []
    else:
        db_data = []

    existing_titles = {item['title'] for item in db_data}
    new_found = 0
    ten_days_ago = datetime.now() - timedelta(days=10)

    print("正在搜集并翻译全球 AI 动态...")
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
        print(f"数据库已更新，新增 {new_found} 条动态。")
    
    render_html(db_data)

# --- 5. 渲染 HTML 页面 ---
def render_html(data):
    cats = {'llm': '', 'video': '', 'code': '', 'tools': ''}
    for item in data:
        html = f'''
        <div class="news-card">
            <span class="date-tag">{item["date"]}</span>
            <div class="news-title">{item["title"]}</div>
            <p class="news-summary">{item["summary"]}</p>
        </div>'''
        cats[item['category']] += html

    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()

    for c_id, c_html in cats.items():
        pattern = f'.*?'
        content = re.sub(pattern, f'{c_html}', content, flags=re.DOTALL)

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(content)
    print("网页内容已刷新。")

# --- 6. 自动存盘回仓库 ---
def commit_changes():
    try:
        os.system('git config --global user.name "github-actions[bot]"')
        os.system('git config --global user.email "github-actions[bot]@users.noreply.github.com"')
        os.system('git add index.html data.json')
        os.system('git commit -m "Auto Update News Database [skip ci]"')
        os.system('git push')
        print("成功：数据已保存回 GitHub 仓库。")
    except Exception as e:
        print(f"保存失败: {e}")

if __name__ == "__main__":
    run()
    commit_changes()
