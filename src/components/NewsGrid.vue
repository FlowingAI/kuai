<template>
  <div class="news-grid" :class="`layout-${currentLayout}`">
    <!-- 1. 网格布局 - 极简黑白 -->
    <template v-if="currentLayout === 'grid'">
      <el-row :gutter="20">
        <el-col v-for="(category, index) in categories" :key="index" :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <div class="category-card">
            <div class="category-header">
              <h2 class="category-title">{{ category.name }}</h2>
              <div class="header-right">
                <el-badge :value="getNewsCount(category.key)" class="badge" />
                <el-button type="primary" link @click="$emit('showMore', category)" class="more-btn">
                  更多 &gt;&gt;
                </el-button>
              </div>
            </div>
            <div class="category-content">
              <el-skeleton v-if="loading" :rows="3" animated />
              <div v-else-if="getNewsList(category.key).length === 0" class="no-data">
                <el-empty description="暂无数据" :image-size="80" />
              </div>
              <div v-else class="news-list">
                <NewsCard v-for="(news, idx) in getDisplayNews(category.key)" :key="news.id" :news="news" :index="idx" @click="handleNewsClick(news)" />
                <el-button v-if="shouldShowMore(category.key)" type="primary" link class="load-more" @click="loadMore(category.key)">查看更多 ({{ getRemainingCount(category.key) }})</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </template>

    <!-- 2. 工业风 - 直角硬朗 -->
    <template v-else-if="currentLayout === 'industrial'">
      <div class="industrial-container">
        <div v-for="(category, index) in categories" :key="index" class="industrial-section">
          <div class="industrial-header">
            <div class="industrial-header-left">
              <h2 class="industrial-title">{{ category.name }}</h2>
            </div>
            <div class="industrial-header-right">
              <el-badge :value="getNewsCount(category.key)" />
              <el-button type="primary" link @click="$emit('showMore', category)" class="more-btn">
                更多 &gt;&gt;
              </el-button>
            </div>
          </div>
          <div class="industrial-content">
            <el-skeleton v-if="loading" :rows="3" animated />
            <div v-else-if="getNewsList(category.key).length === 0" class="no-data">
              <el-empty description="暂无数据" :image-size="60" />
            </div>
            <div v-else class="industrial-news">
              <NewsCard v-for="(news, idx) in getDisplayNews(category.key)" :key="news.id" :news="news" :index="idx" @click="handleNewsClick(news)" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 3. 复古像素 - 像素风格 -->
    <template v-else-if="currentLayout === 'pixel'">
      <div class="pixel-container">
        <div v-for="(category, index) in categories" :key="index" class="pixel-section">
          <div class="pixel-header">
            <div class="pixel-header-left">
              <h2 class="pixel-title">{{ category.name }}</h2>
            </div>
            <div class="pixel-header-right">
              <el-badge :value="getNewsCount(category.key)" />
              <el-button type="primary" link @click="$emit('showMore', category)" class="more-btn">
                更多 &gt;&gt;
              </el-button>
            </div>
          </div>
          <div class="pixel-content">
            <el-skeleton v-if="loading" :rows="3" animated />
            <div v-else-if="getNewsList(category.key).length === 0" class="no-data">
              <el-empty description="暂无数据" :image-size="60" />
            </div>
            <div v-else class="pixel-grid">
              <div v-for="(news, idx) in getDisplayNews(category.key).slice(0, 6)" :key="news.id" class="pixel-item" @click="handleNewsClick(news)">
                {{ news.title.substring(0, 20) }}...
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 4. 玻璃拟态 - 毛玻璃效果 -->
    <template v-else-if="currentLayout === 'glass'">
      <div class="glass-container">
        <div v-for="(category, index) in categories" :key="index" class="glass-card">
          <div class="glass-header">
            <div class="glass-header-left">
              <h2 class="glass-title">{{ category.name }}</h2>
            </div>
            <div class="glass-header-right">
              <el-badge :value="getNewsCount(category.key)" />
              <el-button type="primary" link @click="$emit('showMore', category)" class="more-btn">
                更多 &gt;&gt;
              </el-button>
            </div>
          </div>
          <div class="glass-content">
            <el-skeleton v-if="loading" :rows="3" animated />
            <div v-else-if="getNewsList(category.key).length === 0" class="no-data">
              <el-empty description="暂无数据" :image-size="60" />
            </div>
            <div v-else class="glass-news">
              <NewsCard v-for="(news, idx) in getDisplayNews(category.key)" :key="news.id" :news="news" :index="idx" @click="handleNewsClick(news)" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 5. 新粗野主义 - 粗边框 -->
    <template v-else-if="currentLayout === 'brutalist'">
      <div class="brutalist-container">
        <div v-for="(category, index) in categories" :key="index" class="brutalist-section">
          <div class="brutalist-header">
            <div class="brutalist-header-left">
              <h2 class="brutalist-title">{{ category.name }}</h2>
            </div>
            <div class="brutalist-header-right">
              <el-badge :value="getNewsCount(category.key)" />
              <el-button type="primary" link @click="$emit('showMore', category)" class="more-btn">
                更多 &gt;&gt;
              </el-button>
            </div>
          </div>
          <div class="brutalist-content">
            <el-skeleton v-if="loading" :rows="3" animated />
            <div v-else-if="getNewsList(category.key).length === 0" class="no-data">
              <el-empty description="暂无数据" :image-size="60" />
            </div>
            <div v-else class="brutalist-list">
              <div v-for="(news, idx) in getDisplayNews(category.key)" :key="news.id" class="brutalist-item" @click="handleNewsClick(news)">
                <div class="brutalist-number">{{ idx + 1 }}</div>
                <div class="brutalist-text">{{ news.title }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 6. 樱粉粉嫩 -->
    <template v-else-if="currentLayout === 'sakura'">
      <div class="sakura-container">
        <div v-for="(category, index) in categories" :key="index" class="sakura-section">
          <div class="sakura-header">
            <div class="sakura-header-left">
              <h2 class="sakura-title">{{ category.name }}</h2>
            </div>
            <div class="sakura-header-right">
              <el-badge :value="getNewsCount(category.key)" />
              <el-button type="primary" link @click="$emit('showMore', category)" class="more-btn">
                更多 &gt;&gt;
              </el-button>
            </div>
          </div>
          <div class="sakura-content">
            <el-skeleton v-if="loading" :rows="3" animated />
            <div v-else-if="getNewsList(category.key).length === 0" class="no-data">
              <el-empty description="暂无数据" :image-size="60" />
            </div>
            <div v-else class="sakura-news">
              <NewsCard v-for="(news, idx) in getDisplayNews(category.key)" :key="news.id" :news="news" :index="idx" @click="handleNewsClick(news)" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 7. 波普艺术 -->
    <template v-else-if="currentLayout === 'pop'">
      <div class="pop-container">
        <div v-for="(category, index) in categories" :key="index" class="pop-card">
          <div class="pop-header">
            <div class="pop-header-left">
              <h2 class="pop-title">{{ category.name }}</h2>
            </div>
            <div class="pop-header-right">
              <el-badge :value="getNewsCount(category.key)" />
              <el-button type="primary" link @click="$emit('showMore', category)" class="more-btn">
                更多 &gt;&gt;
              </el-button>
            </div>
          </div>
          <div class="pop-content">
            <el-skeleton v-if="loading" :rows="3" animated />
            <div v-else-if="getNewsList(category.key).length === 0" class="no-data">
              <el-empty description="暂无数据" :image-size="60" />
            </div>
            <div v-else class="pop-grid">
              <div v-for="(news, idx) in getDisplayNews(category.key).slice(0, 4)" :key="news.id" class="pop-item" @click="handleNewsClick(news)">
                <div class="pop-circle">🎯</div>
                <div class="pop-text">{{ news.title.substring(0, 25) }}...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 8. 春天蓝天 -->
    <template v-else-if="currentLayout === 'spring'">
      <div class="spring-container">
        <div v-for="(category, index) in categories" :key="index" class="spring-card">
          <div class="spring-sky">
            <div class="cloud cloud-1">☁️</div>
            <div class="cloud cloud-2">☁️</div>
            <div class="sun">☀️</div>
            <div class="spring-header">
              <div class="spring-header-left">
                <h2 class="spring-title">{{ category.name }}</h2>
              </div>
              <div class="spring-header-right">
                <el-badge :value="getNewsCount(category.key)" />
                <el-button type="primary" link @click="$emit('showMore', category)" class="more-btn">
                  更多 &gt;&gt;
                </el-button>
              </div>
            </div>
          </div>
          <div class="spring-grass">
            <div class="spring-content">
              <el-skeleton v-if="loading" :rows="3" animated />
              <div v-else-if="getNewsList(category.key).length === 0" class="no-data">
                <el-empty description="暂无数据" :image-size="60" />
              </div>
              <div v-else class="spring-news">
                <div v-for="(news, idx) in getDisplayNews(category.key)" :key="news.id" class="spring-item" @click="handleNewsClick(news)">
                  <div class="flower">🌸</div>
                  <div class="spring-text">{{ news.title.substring(0, 35) }}...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 9. 海洋渐变 -->
    <template v-else-if="currentLayout === 'ocean'">
      <div class="ocean-container">
        <div v-for="(category, index) in categories" :key="index" class="ocean-section">
          <div class="ocean-card">
            <div class="ocean-header">
              <div class="ocean-header-left">
                <h2 class="ocean-title">{{ category.name }}</h2>
              </div>
              <div class="ocean-header-right">
                <el-badge :value="getNewsCount(category.key)" />
                <el-button type="primary" link @click="$emit('showMore', category)" class="more-btn">
                  更多 &gt;&gt;
                </el-button>
              </div>
            </div>
            <div class="ocean-content">
              <el-skeleton v-if="loading" :rows="3" animated />
              <div v-else-if="getNewsList(category.key).length === 0" class="no-data">
                <el-empty description="暂无数据" :image-size="60" />
              </div>
              <div v-else class="ocean-news">
                <NewsCard v-for="(news, idx) in getDisplayNews(category.key)" :key="news.id" :news="news" :index="idx" @click="handleNewsClick(news)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 详情弹窗 -->
    <NewsDetailDialog v-model="dialogVisible" :news="currentNews" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import NewsCard from './NewsCard.vue'
import NewsDetailDialog from './NewsDetailDialog.vue'
import { themes } from '../config/themes'

const categories = [
  { key: 'global-ai', name: '🌍 全球AI动态', file: 'global-ai.json', icon: '🌏' },
  { key: 'china-ai', name: '🇨🇳 中国AI动态', file: 'china-ai.json', icon: '🏯' },
  { key: 'llm', name: '🤖 大模型动态', file: 'llm.json', icon: '🧠' },
  { key: 'video-model', name: '🎬 视频模型动态', file: 'video-model.json', icon: '🎥' },
  { key: 'coding-tools', name: '💻 AI编程工具进化', file: 'coding-tools.json', icon: '⌨️' },
  { key: 'applications', name: '⚡ 当前主流应用', file: 'applications.json', icon: '🚀' }
]

const loading = ref(true)
const newsData = ref({})
const displayCounts = ref({})
const dialogVisible = ref(false)
const currentNews = ref(null)
const currentTheme = ref('minimal')

categories.forEach(cat => {
  displayCounts.value[cat.key] = 10
})

const currentLayout = computed(() => {
  return themes[currentTheme.value]?.layout || 'grid'
})

const loadAllData = async () => {
  loading.value = true
  try {
    const promises = categories.map(async (category) => {
      try {
        const response = await fetch(`./data/${category.file}`)
        if (!response.ok) {
          return { key: category.key, data: { news: [] } }
        }
        const data = await response.json()
        return { key: category.key, data }
      } catch (error) {
        return { key: category.key, data: { news: [] } }
      }
    })

    const results = await Promise.all(promises)
    results.forEach(({ key, data }) => {
      newsData.value[key] = data.news || []
    })
  } catch (error) {
    ElMessage.error('加载数据失败，请刷新重试')
  } finally {
    loading.value = false
  }
}

const getNewsList = (key) => newsData.value[key] || []
const getNewsCount = (key) => getNewsList(key).length
const getDisplayNews = (key) => {
  const list = getNewsList(key)
  const count = displayCounts.value[key] || 10
  return list.slice(0, count)
}
const shouldShowMore = (key) => {
  const total = getNewsCount(key)
  const displayed = displayCounts.value[key] || 10
  return total > displayed
}
const getRemainingCount = (key) => {
  const total = getNewsCount(key)
  const displayed = displayCounts.value[key] || 10
  return Math.max(0, total - displayed)
}
const loadMore = (key) => {
  displayCounts.value[key] = getNewsCount(key)
}
const handleNewsClick = (news) => {
  currentNews.value = news
  dialogVisible.value = true
}
const updateTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'minimal'
  currentTheme.value = savedTheme
}

onMounted(() => {
  loadAllData()
  updateTheme()
  window.addEventListener('storage', updateTheme)
  window.addEventListener('themeChanged', updateTheme)
})
</script>

<style scoped>
.news-grid { padding: 0; }

/* 通用样式 */
.no-data { display: flex; align-items: center; justify-content: center; min-height: 200px; }
.load-more { margin-top: 12px; width: 100%; font-weight: 600; }
.more-btn { font-weight: 600; font-size: 0.9rem; }

/* header 左右布局通用样式 */
.header-right,
.industrial-header-right,
.pixel-header-right,
.glass-header-right,
.brutalist-header-right,
.sakura-header-right,
.pop-header-right,
.spring-header-right,
.ocean-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left,
.industrial-header-left,
.pixel-header-left,
.glass-header-left,
.brutalist-header-left,
.sakura-header-left,
.pop-header-left,
.spring-header-left,
.ocean-header-left {
  flex: 1;
}

/* 1. 极简黑白 - 网格布局 */
.layout-grid .category-card {
  background: var(--morandi-card);
  border-radius: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  height: 600px;
  display: flex;
  flex-direction: column;
}
.layout-grid .category-header {
  background: var(--morandi-primary);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}
.layout-grid .category-header .header-left {
  flex: 1;
}
.layout-grid .category-header .header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.layout-grid .category-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin: 0;
}
.layout-grid .category-content { flex: 1; overflow-y: auto; padding: 16px; }
.layout-grid .news-list { display: flex; flex-direction: column; }

/* 2. 工业风 */
.layout-industrial .industrial-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
.layout-industrial .industrial-section {
  background: var(--morandi-card);
  border: 3px solid var(--morandi-primary);
  border-radius: 0;
  overflow: hidden;
}
.layout-industrial .industrial-header {
  background: var(--morandi-primary);
  padding: 15px;
  border-bottom: 3px solid var(--morandi-primary);
}
.layout-industrial .industrial-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.layout-industrial .industrial-content {
  padding: 15px;
  max-height: 500px;
  overflow-y: auto;
}
.layout-industrial .industrial-news {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 3. 复古像素 */
.layout-pixel .pixel-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.layout-pixel .pixel-section {
  background: var(--morandi-card);
  border: 4px solid var(--morandi-text);
  box-shadow: 8px 8px 0 var(--morandi-text);
  padding: 20px;
}
.layout-pixel .pixel-header { margin-bottom: 15px; }
.layout-pixel .pixel-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--morandi-primary);
  margin: 0;
  text-transform: uppercase;
}
.layout-pixel .pixel-content {
  max-height: 400px;
  overflow-y: auto;
}
.layout-pixel .pixel-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.layout-pixel .pixel-item {
  background: var(--morandi-bg);
  border: 2px solid var(--morandi-text);
  padding: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.layout-pixel .pixel-item:hover {
  background: var(--morandi-primary);
  color: white;
  transform: translate(4px, 4px);
  box-shadow: none;
}

/* 4. 玻璃拟态 */
.layout-glass .glass-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.layout-glass .glass-card {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}
.layout-glass .glass-header {
  background: rgba(99, 102, 241, 0.1);
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}
.layout-glass .glass-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--morandi-primary);
  margin: 0;
}
.layout-glass .glass-content {
  padding: 20px;
  max-height: 500px;
  overflow-y: auto;
}
.layout-glass .glass-news {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 5. 新粗野主义 */
.layout-brutalist .brutalist-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.layout-brutalist .brutalist-section {
  background: var(--morandi-card);
  border: 5px solid var(--morandi-primary);
  box-shadow: 8px 8px 0 var(--morandi-primary);
  padding: 0;
}
.layout-brutalist .brutalist-header {
  background: var(--morandi-primary);
  padding: 20px;
  border-bottom: 5px solid var(--morandi-text);
}
.layout-brutalist .brutalist-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  margin: 0;
  text-transform: uppercase;
}
.layout-brutalist .brutalist-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}
.layout-brutalist .brutalist-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.layout-brutalist .brutalist-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-bottom: 3px solid var(--morandi-text);
  cursor: pointer;
  transition: all 0.2s;
}
.layout-brutalist .brutalist-item:hover {
  background: var(--morandi-hover);
  padding-left: 25px;
}
.layout-brutalist .brutalist-number {
  font-size: 2rem;
  font-weight: 900;
  color: var(--morandi-primary);
  min-width: 50px;
}
.layout-brutalist .brutalist-text {
  font-weight: 700;
  font-size: 1rem;
  color: var(--morandi-text);
}

/* 6. 樱粉粉嫩 */
.layout-sakura .sakura-container {
  display: flex;
  flex-direction: column;
  gap: 25px;
}
.layout-sakura .sakura-section {
  background: var(--morandi-card);
  border-radius: 0;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(253, 121, 168, 0.15);
  border-left: 5px solid var(--morandi-primary);
}
.layout-sakura .sakura-header { margin-bottom: 20px; }
.layout-sakura .sakura-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--morandi-primary);
  margin: 0;
}
.layout-sakura .sakura-content {
  max-height: 400px;
  overflow-y: auto;
}
.layout-sakura .sakura-news {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 7. 波普艺术 */
.layout-pop .pop-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}
.layout-pop .pop-card {
  background: var(--morandi-card);
  border: 4px solid var(--morandi-text);
  border-radius: 0;
  box-shadow: 6px 6px 0 var(--morandi-secondary);
  overflow: hidden;
}
.layout-pop .pop-header {
  background: var(--morandi-primary);
  padding: 20px;
  border-bottom: 4px solid var(--morandi-text);
}
.layout-pop .pop-title {
  font-size: 1.3rem;
  font-weight: 900;
  color: var(--morandi-text);
  margin: 0;
  text-transform: uppercase;
}
.layout-pop .pop-content { padding: 20px; }
.layout-pop .pop-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}
.layout-pop .pop-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: var(--morandi-bg);
  border: 3px solid var(--morandi-text);
  cursor: pointer;
  transition: all 0.2s;
}
.layout-pop .pop-item:hover {
  background: var(--morandi-secondary);
  transform: translate(4px, 4px);
  box-shadow: none;
}
.layout-pop .pop-circle {
  width: 50px;
  height: 50px;
  background: var(--morandi-secondary);
  border: 3px solid var(--morandi-text);
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}
.layout-pop .pop-text {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--morandi-text);
}

/* 8. 海洋渐变 */
.layout-ocean .ocean-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.layout-ocean .ocean-card {
  background: linear-gradient(135deg, var(--morandi-primary), var(--morandi-secondary));
  border-radius: 0;
  padding: 30px;
  box-shadow: 0 8px 30px rgba(9, 132, 227, 0.25);
  position: relative;
  overflow: hidden;
}
.layout-ocean .ocean-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), transparent);
  pointer-events: none;
}
.layout-ocean .ocean-header {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}
.layout-ocean .ocean-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  margin: 0;
}
.layout-ocean .ocean-content {
  position: relative;
  z-index: 1;
  max-height: 400px;
  overflow-y: auto;
}
.layout-ocean .ocean-news {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* 9. 春天蓝天 */
.layout-spring .spring-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}
.layout-spring .spring-card {
  background: var(--morandi-card);
  border: 3px solid var(--morandi-primary);
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(135, 206, 235, 0.2);
}
.layout-spring .spring-sky {
  background: var(--morandi-primary);
  padding: 20px;
  position: relative;
  min-height: 100px;
  border-bottom: 3px solid var(--morandi-accent);
}
.layout-spring .spring-sky .cloud {
  position: absolute;
  font-size: 2rem;
  opacity: 0.9;
  animation: float 6s ease-in-out infinite;
}
.layout-spring .spring-sky .cloud-1 {
  top: 10px;
  left: 20px;
  animation-delay: 0s;
}
.layout-spring .spring-sky .cloud-2 {
  top: 30px;
  right: 20px;
  animation-delay: 3s;
}
.layout-spring .spring-sky .sun {
  position: absolute;
  top: 15px;
  right: 50%;
  transform: translateX(50%);
  font-size: 2.5rem;
  animation: pulse 3s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes pulse {
  0%, 100% { transform: translateX(50%) scale(1); }
  50% { transform: translateX(50%) scale(1.1); }
}
.layout-spring .spring-header {
  position: relative;
  z-index: 1;
  margin-top: 30px;
}
.layout-spring .spring-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
.layout-spring .spring-grass {
  background: var(--morandi-bg);
  padding: 20px;
  min-height: 350px;
}
.layout-spring .spring-content {
  max-height: 350px;
  overflow-y: auto;
}
.layout-spring .spring-news {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.layout-spring .spring-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 2px solid var(--morandi-border);
  cursor: pointer;
  transition: all 0.3s ease;
}
.layout-spring .spring-item:hover {
  background: var(--morandi-hover);
  border-color: var(--morandi-accent);
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(135, 206, 235, 0.15);
}
.layout-spring .spring-item .flower {
  font-size: 1.5rem;
  flex-shrink: 0;
  animation: sway 2s ease-in-out infinite;
}
@keyframes sway {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}
.layout-spring .spring-text {
  flex: 1;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--morandi-text);
  line-height: 1.4;
}

/* 响应式 */
@media (max-width: 1024px) {
  .layout-industrial .industrial-container,
  .layout-glass .glass-container,
  .layout-pop .pop-container,
  .layout-spring .spring-container {
    grid-template-columns: repeat(2, 1fr);
  }
  .layout-ocean .ocean-news {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .layout-grid .category-card { height: 500px; }
  .layout-industrial .industrial-container,
  .layout-glass .glass-container,
  .layout-pop .pop-container,
  .layout-spring .spring-container {
    grid-template-columns: 1fr;
  }
  .layout-pixel .pixel-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
