<template>
  <div class="category-detail" :class="`layout-${currentLayout}`">
    <!-- 头部区域 -->
    <div class="detail-header">
      <el-button @click="handleBack" class="back-btn" :icon="ArrowLeft">返回主页</el-button>
      <h1 class="detail-title">{{ category.name }} - 全部文章</h1>
      <div class="detail-meta">共 {{ filteredNews.length }} 条</div>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索关键词..."
        :prefix-icon="Search"
        clearable
        class="search-input"
        @input="handleSearch"
      />
    </div>

    <!-- 加载状态 -->
    <el-skeleton v-if="loading" :rows="10" animated />

    <!-- 无数据 -->
    <div v-else-if="filteredNews.length === 0" class="no-data">
      <el-empty description="暂无数据" :image-size="100" />
    </div>

    <!-- 新闻列表 -->
    <div v-else class="news-container">
      <div class="news-list">
        <NewsCard
          v-for="(news, index) in paginatedNews"
          :key="news.id"
          :news="news"
          :index="startIndex + index"
          @click="handleNewsClick(news)"
        />
      </div>

      <!-- 翻页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="filteredNews.length"
          layout="prev, pager, next, total"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 详情弹窗 -->
    <NewsDetailDialog v-model="dialogVisible" :news="currentNews" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ArrowLeft, Search } from '@element-plus/icons-vue'
import NewsCard from './NewsCard.vue'
import NewsDetailDialog from './NewsDetailDialog.vue'
import { themes } from '../config/themes'

const props = defineProps({
  category: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back'])

const loading = ref(true)
const allNews = ref([])
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10) // 每页 10 条
const dialogVisible = ref(false)
const currentNews = ref(null)
const currentTheme = ref('minimal')

// 计算属性
const currentLayout = computed(() => {
  return themes[currentTheme.value]?.layout || 'grid'
})

const filteredNews = computed(() => {
  if (!searchKeyword.value.trim()) {
    return allNews.value
  }
  const keyword = searchKeyword.value.toLowerCase().trim()
  return allNews.value.filter(news => {
    return (
      news.title?.toLowerCase().includes(keyword) ||
      news.summary?.toLowerCase().includes(keyword) ||
      news.description?.toLowerCase().includes(keyword)
    )
  })
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

const paginatedNews = computed(() => {
  const start = startIndex.value
  const end = start + pageSize.value
  return filteredNews.value.slice(start, end)
})

// 方法
const loadData = async () => {
  loading.value = true
  try {
    const response = await fetch(`./data/${props.category.file}`)
    if (!response.ok) {
      throw new Error('加载数据失败')
    }
    const data = await response.json()
    allNews.value = data.news || []
  } catch (error) {
    console.error('加载数据失败:', error)
    allNews.value = []
  } finally {
    loading.value = false
  }
}

const handleBack = () => {
  emit('back')
}

const handleSearch = () => {
  currentPage.value = 1 // 搜索时重置到第一页
}

const handlePageChange = (page) => {
  currentPage.value = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleNewsClick = (news) => {
  currentNews.value = news
  dialogVisible.value = true
}

const updateTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'minimal'
  currentTheme.value = savedTheme
}

// 生命周期
onMounted(() => {
  loadData()
  updateTheme()
  window.addEventListener('storage', updateTheme)
  window.addEventListener('themeChanged', updateTheme)
})

// 监听 category 变化
watch(() => props.category, () => {
  currentPage.value = 1
  searchKeyword.value = ''
  loadData()
}, { immediate: true })
</script>

<style scoped>
.category-detail {
  padding: 0;
}

/* 头部区域 */
.detail-header {
  background: linear-gradient(135deg, var(--morandi-primary), var(--morandi-accent));
  padding: 30px 20px;
  color: white;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.back-btn {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: white !important;
  font-weight: 600;
  padding: 12px 20px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  transform: translateX(-3px);
}

.detail-title {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.detail-meta {
  font-size: 1rem;
  opacity: 0.9;
}

/* 搜索区域 */
.search-section {
  max-width: 800px;
  margin: 0 auto 30px;
  padding: 0 20px;
}

.search-input {
  font-size: 1rem;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 12px 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 新闻列表容器 */
.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
}

/* 翻页 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.pagination-wrapper :deep(.el-pagination) {
  display: flex;
  gap: 8px;
}

.pagination-wrapper :deep(.el-pagination button),
.pagination-wrapper :deep(.el-pagination li) {
  border-radius: 8px;
  font-weight: 600;
}

.pagination-wrapper :deep(.el-pagination .is-active) {
  background-color: var(--morandi-primary);
  color: white;
}

/* 无数据 */
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

/* 主题适配 */
.layout-industrial .detail-header,
.layout-brutalist .detail-header {
  background: var(--morandi-primary);
  border-bottom: 4px solid var(--morandi-text);
}

.layout-pixel .detail-header {
  background: var(--morandi-card);
  border: 4px solid var(--morandi-text);
  box-shadow: 8px 8px 0 var(--morandi-text);
  color: var(--morandi-text);
}

.layout-pixel .detail-title {
  color: var(--morandi-primary);
}

.layout-pixel .back-btn {
  background: var(--morandi-bg) !important;
  border-color: var(--morandi-text) !important;
  color: var(--morandi-text) !important;
}

.layout-glass .detail-header {
  background: rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

.layout-sakura .detail-header {
  background: linear-gradient(135deg, #ffc0cb, #ffb6c1);
}

.layout-pop .detail-header {
  background: var(--morandi-primary);
  border-bottom: 4px solid var(--morandi-text);
}

.layout-spring .detail-header {
  background: var(--morandi-primary);
  position: relative;
  overflow: hidden;
}

.layout-spring .detail-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 50%;
}

.layout-ocean .detail-header {
  background: linear-gradient(135deg, #0984e3, #74b9ff);
  box-shadow: 0 8px 30px rgba(9, 132, 227, 0.25);
}

/* 响应式 */
@media (max-width: 768px) {
  .detail-header {
    padding: 20px 15px;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .detail-meta {
    font-size: 0.9rem;
  }

  .search-section {
    padding: 0 15px;
  }

  .news-container {
    padding: 0 15px 30px;
  }

  .pagination-wrapper :deep(.el-pagination) {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
