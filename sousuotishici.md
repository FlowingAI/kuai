🤖 Claude Code 任务：高频情报抓取逻辑重构

请根据以下定义的六大维度词库，彻底重构原来的抓取与筛选引擎。目标是实现“海量扫描、智能留存、语义分类”。



1. 分层抓取策略（放宽限制，增加数量）

搜索时不使用硬性的 AND 匹配，改为执行以下优先级逻辑：



第一优先级（直接命中）： 只要标题或正文前100字中出现任何一个**“核心品牌/关键词”**（如 OpenAI, DeepSeek, Cursor, 可灵等），直接抓取。

第二优先级（组合匹配）： 若未发现核心品牌，但文中同时出现 2个或以上 的**“逻辑词”或“动作词”**（如：SOTA + 刷新纪录，或 智能体 + 场景落地），亦视为有效抓取。

来源扩展： 必须检索文章的标题、描述（Description）以及正文的前 100 个字符，确保不会漏掉那些标题含蓄但内容硬核的文章。

2. 全量扩展词库（各栏目定义）

请将以下词库写入脚本的配置项中：



栏目 A：全球AI动态 (Global AI)

关键词: OpenAI, Google Gemini, Anthropic Claude, Meta Llama, NVIDIA, Microsoft CoPilot, xAI (Grok), Mistral AI, Apple Intelligence, Groq, Cerebras, Hugging Face, Midjourney, Adobe Firefly, Perplexity AI, Sam Altman, Jensen Huang.

逻辑/动作: SOTA, Benchmarks, 多模态, 推理能力, Scaling Law, 显存优化, 算力集群, 闭源领先, 发布, 更新, 爆料, CEO采访, 刷新纪录, 战略结盟, 突破.

栏目 B：中国AI动态 (China AI)

关键词: 智谱AI (GLM), DeepSeek, 通义千问 (Qwen), 文心一言, 腾讯混元, 月之暗面 (Kimi), 商汤日日新, 百川智能, 阶跃星辰, 零一万物, 昆仑万维, 字节豆包, 华为昇腾, 百度飞桨, 阿里魔搭.

逻辑/动作: 内测, 备案, API降价, 出海, 国产适配, 融资, 万卡集群, 算力补贴, 开源, 落地案例, 价格战, 独角兽, 官方回应.

栏目 C：大模型动态 (LLM & Reasoning)

关键词: LLM, MoE架构, 长文本处理, 推理模型 (Reasoning), o1-preview, 量化技术 (Quantization), 长上下文, 幻觉优化, 提示工程 (Prompt), RAG, 思维链 (CoT).

逻辑/动作: 逻辑推理, 上下文突破, 参数压缩, 数学能力, 强化学习, 架构创新, 解决幻觉, 性能测评, 论文发布, 模型对齐.

栏目 D：视频模型动态 (Video Gen)

关键词: Sora, 可灵 (Kling), Vidu, Luma Dream Machine, Runway Gen-3, Pika, 智谱清影, Haiper, CogVideo, Kling 1.5, Minimax视频, HeyGen, Dreamina.

逻辑/动作: 生视频, 图生视频, 一致性, 物理模拟, 运动控制, 时长突破, 高帧率, 运镜控制, 效果炸裂, 正式上线, 物理反馈.

栏目 E：AI编程工具进化 (AI Coding)

关键词: Cursor, GitHub Copilot, Claude Code, Windsurf, 豆包MarsCode, Trae (ByteDance), Replit Agent, Baidu Comate, Codeium, v0.dev, Bolt.new, Devin.

逻辑/动作: 自动修复, 全栈生成, Agentic Workflow, 编程效率, 代码审计, 自然语言编程, 自动Debug, 结对编程, 修复漏洞, 降本增效.

栏目 F：当前主流应用 (AI Applications)

关键词: AI搜索, NotebookLM, Character.ai, Figma AI, Canva Magic, 智能体 (Agents), GPTs, AI智能眼镜, Ray-Ban Meta, 秘塔搜索, 钉钉AI, 飞书智能伙伴.

逻辑/动作: 爆款应用, 交互体验, 工作流自动化, 场景落地, 商业化, DAU, 订阅增长, 体验升级, 交互革新, 规模化普及.

3. 智能处理与输出

AI 语义分类： 抓取后 进行脱水总结，并根据全文语义自动纠正所属栏目（例如：文章虽然提到了 OpenAI，但核心是在讲代码生成，应归入“AI编程工具”）。



 每次运行必须生成带有序号 id 的 json。