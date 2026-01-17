<template>
  <div id="app">
    <!-- 顶部：悬浮式高对比度动态条 -->
    <div class="floating-header">
      <!-- 左侧：脉冲灯（荧光绿圆点） -->
      <div class="pulse-indicator">
        <div class="pulse-dot"></div>
      </div>

      <!-- 右侧：循环播放希望文案 -->
      <div class="hope-text-container">
        <div class="scanning-line"></div>
        <div class="hope-text">{{ currentHopeText }}</div>
      </div>
    </div>

    <!-- 原有内容 -->
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="typing-title">🤖 全球AI动态情报站</h1>
          <p class="subtitle">AI 秒速更迭，慢一步便成局外。实时锁定动态，变未知为确定的先机。</p>
        </div>
        <div class="header-right">
          <el-popover
            placement="bottom-end"
            :width="520"
            trigger="click"
          >
            <template #reference>
              <el-button class="theme-button" :icon="themes[currentTheme]?.icon">
                {{ themes[currentTheme]?.name }}
              </el-button>
            </template>

            <div class="theme-grid">
              <div
                v-for="(theme, key) in themes"
                :key="key"
                class="theme-item"
                :class="{ 'is-active': currentTheme === key }"
                @click="changeTheme(key)"
              >
                <div class="theme-item-icon">{{ theme.icon }}</div>
                <div class="theme-item-name">{{ theme.name }}</div>
                <div class="theme-item-desc">{{ theme.description }}</div>
              </div>
            </div>
          </el-popover>
        </div>
      </div>
      <div class="last-update" v-if="lastUpdate">
        最新更新时间: {{ lastUpdate }}
      </div>
    </header>

    <main class="app-main">
      <!-- 主页视图 -->
      <NewsGrid v-if="currentView === 'grid'" @showMore="handleShowMore" />

      <!-- 详情页视图 -->
      <CategoryDetail v-else :category="selectedCategory" @back="handleBack" />
    </main>

    <footer class="app-footer">
      <p>© 2026 全球AI动态情报站 | 数据每4小时自动更新 | 锁定秒级迭代，让未来为你而来。</p>
      <el-button type="primary" link @click="goToAdmin">管理后台</el-button>
    </footer>

    <!-- 底部：系统实时状态栏 -->
    <div class="system-status-bar">
      <span class="status-content">[ 智慧网络已联通 | 创新动能：满载 | 正在同步全球 1024+ 实验室的进步成果</span>
      <span class="dots">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </span>
      <span class="status-content"> ]</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import NewsGrid from './components/NewsGrid.vue'
import CategoryDetail from './components/CategoryDetail.vue'
import { themes, applyTheme, loadTheme } from './config/themes'

const lastUpdate = ref('')
const currentTheme = ref('minimal')
const currentView = ref('grid') // 'grid' 或 'detail'
const selectedCategory = ref(null)

// 希望文案循环播放
const hopeTexts = [
  'AI 不是终点，而是人类想象力向星辰大海的延伸。',
  '在算法的辅助下，每一个人都将拥有创造奇迹的超能力。',
  '我们正在见证的，是人类文明智慧最伟大的一次合流。',
  '技术向善，让每一个微小的梦想都能找到实现的路径。',
  '黎明已至，智慧的暖光正照亮每一个创作者的前行之路。'
]
const currentHopeText = ref('')
const currentHopeIndex = ref(0)
const isDeleting = ref(false)
const hopeTextSpeed = 100 // 打字/删除速度

// 希望文案循环效果
const cycleHopeText = () => {
  const fullText = hopeTexts[currentHopeIndex.value]

  if (isDeleting.value) {
    // 删除文字
    currentHopeText.value = fullText.substring(0, currentHopeText.value.length - 1)
    if (currentHopeText.value === '') {
      isDeleting.value = false
      currentHopeIndex.value = (currentHopeIndex.value + 1) % hopeTexts.length
      setTimeout(cycleHopeText, 500) // 删除完成后暂停500ms
    } else {
      setTimeout(cycleHopeText, hopeTextSpeed)
    }
  } else {
    // 输入文字
    currentHopeText.value = fullText.substring(0, currentHopeText.value.length + 1)
    if (currentHopeText.value === fullText) {
      isDeleting.value = true
      setTimeout(cycleHopeText, 3000) // 完整显示后暂停3秒
    } else {
      setTimeout(cycleHopeText, hopeTextSpeed)
    }
  }
}

// 格式化更新时间
const formatUpdateTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${year}年${month}月${day}日 ${hours}:${minutes}`
}

const changeTheme = (themeKey) => {
  currentTheme.value = themeKey
  applyTheme(themeKey)
  // 通知NewsGrid组件主题已改变
  window.dispatchEvent(new Event('themeChanged'))
}

const goToAdmin = () => {
  window.location.href = '/admin.html'
}

// 处理"更多>>"按钮点击
const handleShowMore = (category) => {
  selectedCategory.value = category
  currentView.value = 'detail'
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 处理返回主页
const handleBack = () => {
  currentView.value = 'grid'
  selectedCategory.value = null
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  // 加载保存的主题
  currentTheme.value = loadTheme()

  // 启动希望文案循环
  setTimeout(cycleHopeText, 1000) // 延迟1秒启动

  // 获取最新更新时间
  try {
    const files = ['global-ai.json', 'china-ai.json', 'llm.json', 'video-model.json', 'coding-tools.json', 'applications.json']
    const promises = files.map(file => fetch(`/data/${file}`).then(res => res.json()).catch(() => ({ last_update: '' })))
    const results = await Promise.all(promises)

    // 找到最新的更新时间
    const validDates = results
      .map(r => r.last_update)
      .filter(date => date)
      .map(dateStr => new Date(dateStr.replace(/\//g, '-')))

    if (validDates.length > 0) {
      const latestDate = new Date(Math.max(...validDates))
      lastUpdate.value = formatUpdateTime(latestDate)
    } else {
      lastUpdate.value = '未知'
    }
  } catch (error) {
    console.error('获取更新时间失败:', error)
    lastUpdate.value = '未知'
  }
})
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: var(--morandi-bg);
  padding-bottom: 60px; /* 为底部状态栏留出空间 */
}

/* ========== 顶部：悬浮式高对比度动态条 ========== */
.floating-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  z-index: 9999;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
}

/* 左侧：脉冲灯（荧光绿圆点） */
.pulse-indicator {
  display: flex;
  align-items: center;
}

.pulse-dot {
  width: 16px;
  height: 16px;
  background: #00ff00;
  border-radius: 50%;
  box-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00;
  animation: heartbeat 1.2s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00;
  }
  10% {
    transform: scale(1.15);
    box-shadow: 0 0 25px #00ff00, 0 0 50px #00ff00;
  }
  20% {
    transform: scale(1);
    box-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00;
  }
  30% {
    transform: scale(1.1);
    box-shadow: 0 0 25px #00ff00, 0 0 50px #00ff00;
  }
  50% {
    transform: scale(1);
    box-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00;
  }
}

/* 右侧：循环播放希望文案 */
.hope-text-container {
  flex: 1;
  margin-left: 40px;
  position: relative;
  height: 60px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.scanning-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%);
  animation: scan 2s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes scan {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.hope-text {
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
  line-height: 1.6;
  text-align: left;
  position: relative;
  z-index: 1;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

/* ========== 底部：系统实时状态栏 ========== */
.system-status-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: #00ff00;
  padding: 15px 30px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  z-index: 9999;
  box-shadow: 0 -4px 20px rgba(0, 255, 0, 0.3), 0 -2px 10px rgba(0, 0, 0, 0.5);
  border-top: 2px solid #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.status-content {
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.dots {
  display: inline-flex;
  gap: 3px;
  margin: 0 4px;
}

.dot {
  animation: breathe 1.5s ease-in-out infinite;
  font-size: 1.2rem;
  color: #00ff00;
  text-shadow: 0 0 15px rgba(0, 255, 0, 0.8);
}

.dot:nth-child(1) { animation-delay: 0s; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes breathe {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.3);
    text-shadow: 0 0 20px rgba(0, 255, 0, 1);
  }
}

.app-header {
  background: linear-gradient(135deg, var(--morandi-primary), var(--morandi-accent));
  padding: 30px 20px;
  color: white;
  margin-top: 60px; /* 为顶部状态栏留出空间 */
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.header-left {
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.typing-title {
  font-size: 2.2rem;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 500;
  line-height: 1.6;
}

.last-update {
  max-width: 1400px;
  margin: 15px auto 0;
  font-size: 0.85rem;
  opacity: 0.85;
  text-align: left;
}

/* 主题切换按钮 */
.theme-button {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
  font-weight: 600;
  padding: 12px 20px;
  transition: all 0.3s ease;
}

.theme-button:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  transform: translateY(-2px);
}

/* 主题网格样式 */
.theme-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 12px;
}

.theme-item {
  background: var(--morandi-bg);
  border: 2px solid var(--morandi-border);
  border-radius: 0;
  padding: 16px 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.theme-item:hover {
  background: var(--morandi-hover);
  border-color: var(--morandi-primary);
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.theme-item.is-active {
  background: var(--morandi-primary);
  border-color: var(--morandi-primary);
  color: white;
}

.theme-item.is-active .theme-item-desc {
  color: rgba(255, 255, 255, 0.8);
}

.theme-item-icon {
  font-size: 2rem;
  line-height: 1;
}

.theme-item-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.theme-item-desc {
  font-size: 0.75rem;
  color: var(--morandi-text-light);
}

.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.app-footer {
  text-align: center;
  padding: 30px 20px;
  background: var(--morandi-card);
  color: var(--morandi-text);
  border-top: 1px solid var(--morandi-secondary);
}

/* 响应式 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
  }

  .header-right {
    width: 100%;
    justify-content: flex-end;
  }

  .app-header h1 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .theme-desc {
    display: none;
  }
}
</style>
