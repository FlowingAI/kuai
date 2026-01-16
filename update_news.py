import feedparser
import requests
import os
import re
from datetime import datetime

# --- 配置抓取源：包含 OpenAI 的 X 动态和技术新闻 ---
RSS_SOURCES = [
    "https://rsshub.app/twitter/user/OpenAI",           # OpenAI 的 X 动态
    "https://www.theverge.com/ai-artificial-intelligence/rss/index.xml", # AI 行业动态
    "https://news.google.com/rss/search?q=AI+news&hl=zh-CN&gl=CN&ceid=CN:zh-Hans" # 谷歌中文 AI 资讯
]

def get_ai_summary(text):
    """把这一堆乱七八糟的新闻交给 AI 去总结"""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "（配置错误：请检查 API Key）"
    
    # 告诉 AI 怎么写总结
    prompt = f"你是一个资深观察者，请把下面的 AI 资讯总结成一句 50 字以内的中文干货，只要精华：\n{text}"
    
    # 这里我们使用的是 Google Gemini 的官方接口地址
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"
    headers = {'Content-Type': 'application/json'}
    data = {"contents": [{"parts": [{"text": prompt}]}]}
    
    try:
        response = requests.post(url, headers=headers, json=data, timeout=10)
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    except:
        return "AI 总结正在排队中，请刷新查看..."

def update_html(news_items):
    """把总结好的内容，塞进你那个漂亮的 index.html 网页里"""
    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()

    # 制作新闻模块的样式
    news_html = ""
    for item in news_items[:5]: # 只显示最新的 5 条
        news_html += f"""
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 20px; border-radius: 20px; margin-bottom: 15px; border-left: 4px solid #00f5d4;">
            <div style="color: #00f5d4; font-size: 0.8rem; margin-bottom: 5px;">更新时间：{item['time']}</div>
            <div style="font-weight: bold; margin-bottom: 8px;">{item['title']}</div>
            <div style="font-size: 0.9rem; color: #bbb;">{item['summary']}</div>
        </div>
        """

    # 替换网页中的旧占位符
    new_content = re.sub(
        r'<div class="news-preview">.*?</div>',
        f'<div class="news-preview">{news_html}</div>',
        content,
        flags=re.DOTALL
    )

    with open("index.html", "w", encoding="utf-8") as f:
        f.write(new_content)

# --- 主程序运行 ---
all_news = []
for url in RSS_SOURCES:
    try:
        feed = feedparser.parse(url)
        for entry in feed.entries[:2]: # 每一类抓 2 条最火的
            summary = get_ai_summary(entry.title)
            all_news.append({
                "title": entry.title,
                "time": datetime.now().strftime("%H:%M"),
                "summary": summary
            })
    except:
        continue

if all_news:
    update_html(all_news)
