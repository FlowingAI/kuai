<template>
  <div id="admin-app">
    <!-- 登录界面 -->
    <div v-if="!isLoggedIn" class="login-container">
      <div class="login-box">
        <h2>🔐 管理后台登录</h2>
        <el-form @submit.prevent="handleLogin">
          <el-form-item>
            <el-input
              v-model="password"
              type="password"
              placeholder="请输入管理密码"
              show-password
              size="large"
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              style="width: 100%"
              @click="handleLogin"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <el-alert
          v-if="errorMessage"
          :title="errorMessage"
          type="error"
          :closable="false"
          style="margin-top: 20px"
        />
      </div>
    </div>

    <!-- 管理界面 -->
    <div v-else class="admin-container">
      <header class="admin-header">
        <h1>⚙️ 管理后台</h1>
        <el-button type="primary" link @click="goToFront">返回首页</el-button>
      </header>

      <main class="admin-main">
        <el-tabs v-model="activeCategory" type="border-card">
          <el-tab-pane
            v-for="category in categories"
            :key="category.key"
            :label="category.name"
            :name="category.key"
          >
            <div class="category-actions">
              <el-text>共 {{ getCategoryCount(category.key) }} 条新闻</el-text>
              <el-button
                type="danger"
                size="small"
                @click="clearCategory(category.key)"
                :disabled="getCategoryCount(category.key) === 0"
              >
                清空该分类
              </el-button>
            </div>

            <div class="news-list">
              <div
                v-for="(news, index) in getCategoryNews(category.key)"
                :key="news.id"
                class="admin-news-item"
              >
                <div class="news-number">{{ index + 1 }}</div>
                <div class="news-info">
                  <h4 class="news-title">{{ news.title }}</h4>
                  <p class="news-summary">{{ news.summary }}</p>
                  <div class="news-meta">
                    <el-tag size="small" :type="news.original_language === 'en' ? 'warning' : 'success'">
                      {{ news.original_language === 'en' ? '英文' : '中文' }}
                    </el-tag>
                    <span class="news-time">{{ news.publish_time }}</span>
                  </div>
                </div>
                <div class="news-actions">
                  <el-button
                    type="danger"
                    size="small"
                    @click="deleteNews(category.key, news.id)"
                  >
                    删除
                  </el-button>
                  <el-button
                    type="primary"
                    size="small"
                    link
                    @click="openUrl(news.source_url)"
                    v-if="news.source_url"
                  >
                    查看原文
                  </el-button>
                </div>
              </div>

              <el-empty
                v-if="getCategoryCount(category.key) === 0"
                description="暂无数据"
                :image-size="100"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const categories = [
  { key: 'global-ai', name: '🌍 全球AI动态', file: 'global-ai.json' },
  { key: 'china-ai', name: '🇨🇳 中国AI动态', file: 'china-ai.json' },
  { key: 'llm', name: '🤖 大模型动态', file: 'llm.json' },
  { key: 'video-model', name: '🎬 视频模型动态', file: 'video-model.json' },
  { key: 'coding-tools', name: '💻 AI编程工具进化', file: 'coding-tools.json' },
  { key: 'applications', name: '⚡ 当前主流应用', file: 'applications.json' }
]

// 登录状态
const isLoggedIn = ref(false)
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

// 管理数据
const activeCategory = ref('global-ai')
const newsData = ref({})

// 从环境变量或配置文件读取密码
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123456'

// 登录处理
const handleLogin = () => {
  if (!password.value) {
    errorMessage.value = '请输入密码'
    return
  }

  loading.value = true
  errorMessage.value = ''

  // 简单密码验证（实际部署时应该使用更安全的方式）
  setTimeout(() => {
    if (password.value === ADMIN_PASSWORD) {
      isLoggedIn.value = true
      loadAllData()
      ElMessage.success('登录成功')
    } else {
      errorMessage.value = '密码错误'
    }
    loading.value = false
  }, 500)
}

// 加载所有数据
const loadAllData = async () => {
  try {
    const promises = categories.map(async (category) => {
      const response = await fetch(`/data/${category.file}`)
      const data = await response.json()
      return { key: category.key, data }
    })

    const results = await Promise.all(promises)
    results.forEach(({ key, data }) => {
      newsData.value[key] = data.news || []
    })
  } catch (error) {
    console.error('加载数据失败:', error)
    ElMessage.error('加载数据失败')
  }
}

// 获取某个分类的新闻数量
const getCategoryCount = (key) => {
  return (newsData.value[key] || []).length
}

// 获取某个分类的新闻列表
const getCategoryNews = (key) => {
  return newsData.value[key] || []
}

// 删除单条新闻
const deleteNews = async (categoryKey, newsId) => {
  try {
    await ElMessageBox.confirm('确定要删除这条新闻吗？', '确认删除', {
      type: 'warning'
    })

    const category = categories.find(c => c.key === categoryKey)
    const newsList = newsData.value[categoryKey] || []
    const updatedList = newsList.filter(n => n.id !== newsId)

    // 更新本地数据
    newsData.value[categoryKey] = updatedList

    // 更新服务器数据（需要后端支持，这里暂时只更新本地）
    // 在GitHub Pages部署时，这个功能需要通过GitHub API实现
    ElMessage.warning('删除功能需要配置GitHub API才能生效')

    // 如果配置了GitHub API，可以这样实现：
    // await updateDataOnServer(category.file, {
    //   category: category.name,
    //   last_update: new Date().toLocaleString('zh-CN'),
    //   news: updatedList
    // })

  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 清空某个分类
const clearCategory = async (categoryKey) => {
  try {
    await ElMessageBox.confirm(
      `确定要清空"${getCategoryName(categoryKey)}"的所有新闻吗？此操作不可恢复！`,
      '危险操作',
      {
        type: 'error',
        confirmButtonText: '确定清空',
        cancelButtonText: '取消'
      }
    )

    newsData.value[categoryKey] = []
    ElMessage.warning('清空功能需要配置GitHub API才能生效')

  } catch (error) {
    // 用户取消
  }
}

const getCategoryName = (key) => {
  const category = categories.find(c => c.key === key)
  return category ? category.name : key
}

const openUrl = (url) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const goToFront = () => {
  window.location.href = '/'
}

onMounted(() => {
  // 检查是否已登录（使用sessionStorage）
  const logged = sessionStorage.getItem('admin_logged_in')
  if (logged === 'true') {
    isLoggedIn.value = true
    loadAllData()
  }
})

// 监听登录状态变化，保存到sessionStorage
const watchLogin = () => {
  sessionStorage.setItem('admin_logged_in', isLoggedIn.value)
}

// 简单的监听器
import { watch } from 'vue'
watch(isLoggedIn, watchLogin)
</script>

<style scoped>
#admin-app {
  min-height: 100vh;
  background: var(--morandi-bg);
}

/* 登录界面 */
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--morandi-primary), var(--morandi-accent));
}

.login-box {
  background: var(--morandi-card);
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-box h2 {
  text-align: center;
  margin: 0 0 30px 0;
  color: var(--morandi-text);
}

/* 管理界面 */
.admin-container {
  min-height: 100vh;
}

.admin-header {
  background: var(--morandi-card);
  padding: 20px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.admin-header h1 {
  margin: 0;
  color: var(--morandi-text);
}

.admin-main {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 20px;
}

.category-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  background: var(--morandi-bg);
  border-radius: 8px;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.admin-news-item {
  background: var(--morandi-card);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.admin-news-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.news-number {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: var(--morandi-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.news-info {
  flex: 1;
  min-width: 0;
}

.news-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--morandi-text);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.news-summary {
  font-size: 0.9rem;
  color: var(--morandi-text-light);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.news-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.news-time {
  font-size: 0.85rem;
  color: var(--morandi-text-light);
}

.news-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 768px) {
  .admin-header {
    padding: 15px 20px;
  }

  .admin-header h1 {
    font-size: 1.2rem;
  }

  .admin-news-item {
    flex-direction: column;
  }

  .news-actions {
    flex-direction: row;
    width: 100%;
  }

  .news-actions .el-button {
    flex: 1;
  }
}
</style>
