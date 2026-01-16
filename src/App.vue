<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <div class="header-left">
          <h1>🤖 全球AI动态情报站</h1>
          <p class="subtitle">实时追踪人工智能前沿动态</p>
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
        最后更新: {{ lastUpdate }}
      </div>
    </header>

    <main class="app-main">
      <NewsGrid />
    </main>

    <footer class="app-footer">
      <p>© 2025 全球AI动态情报站 | 数据每4小时自动更新</p>
      <el-button type="primary" link @click="goToAdmin">管理后台</el-button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NewsGrid from './components/NewsGrid.vue'
import { themes, applyTheme, loadTheme } from './config/themes'

const lastUpdate = ref('')
const currentTheme = ref('minimal')

onMounted(async () => {
  // 加载保存的主题
  currentTheme.value = loadTheme()

  // 获取最新更新时间
  try {
    const response = await fetch('/data/global-ai.json')
    const data = await response.json()
    lastUpdate.value = data.last_update || '未知'
  } catch (error) {
    console.error('获取更新时间失败:', error)
  }
})

const changeTheme = (themeKey) => {
  currentTheme.value = themeKey
  applyTheme(themeKey)
  // 通知NewsGrid组件主题已改变
  window.dispatchEvent(new Event('themeChanged'))
}

const goToAdmin = () => {
  window.location.href = '/admin.html'
}
</script>

<style scoped>
#app {
  min-height: 100vh;
  background: var(--morandi-bg);
}

.app-header {
  background: linear-gradient(135deg, var(--morandi-primary), var(--morandi-accent));
  padding: 30px 20px;
  color: white;
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

.app-header h1 {
  font-size: 2.2rem;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
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
