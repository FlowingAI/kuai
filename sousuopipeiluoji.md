1. 深度情报源站点库 (Trusted Sources)

请将以下站点作为搜索 Query 的 site: 限定范围或高权重来源：



中文硬核信源： jiqizhixin.com (机器之心), qbitai.com (量子位), zhidx.com (智东西), 36kr.com (36氪AI), xinzhiyuan.com (新智元), tmtpost.com (钛媒体), ifanr.com (爱范儿AI), geekpark.net (极客公园).

全球权威信源： theinformation.com, techcrunch.com, theverge.com, news.ycombinator.com (Hacker News), huggingface.co/papers, producthunt.com, arxiv.org, wired.com, digitaltrends.com.

2. 搜索 Query 构造逻辑

请在拼接搜索词时放弃单一匹配，改用以下组合公式：



公式 1 (品牌优先)： (栏目核心词) (site:站点1 OR site:站点2 OR site:站点3)

公式 2 (动态优先)： (栏目动作词1 OR 栏目动作词2) (站点关键词) -site:无关垃圾站.com

公式 3 (模糊嗅探)： 若标题未发现品牌名，但在标题+正文前100字中同时命中 2个或以上 的行业逻辑词/动作词，则强制标记为候选数据。



3. 自动化归类要求

抓取后，将提取到的全文摘要进行分析。

指令要求： “请根据本文语义，将其归入 [全球AI, 中国AI, 大模型, 视频模型, AI编程, 主流应用] 其中的一个最相关栏目。”