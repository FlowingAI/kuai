<template>
  <el-dialog
    v-model="visible"
    :title="currentNews?.title"
    width="700px"
    @close="handleClose"
  >
    <div v-if="currentNews" class="news-detail">
      <div class="detail-meta">
        <el-tag v-if="currentNews.publish_time" size="small">
          {{ currentNews.publish_time }}
        </el-tag>
        <el-tag v-if="getSourceName()" type="info" size="small" style="margin-left: 8px">
          来源：{{ getSourceName() }}
        </el-tag>
      </div>

      <div class="detail-content">
        <h4>新闻内容</h4>
        <div class="content-text" v-html="highlightedContent"></div>
      </div>

      <div v-if="currentNews.original_title && currentNews.original_title !== currentNews.title" class="detail-original">
        <h4>原标题</h4>
        <p class="original-title" v-html="highlightedOriginalTitle"></p>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { highlightKeywords } from '../utils/highlight.js'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  news: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(props.modelValue)
const currentNews = ref(props.news)

const highlightedContent = computed(() => {
  return highlightKeywords(currentNews.value?.summary || '')
})

const highlightedOriginalTitle = computed(() => {
  return highlightKeywords(currentNews.value?.original_title || '')
})

const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
}

// 从URL提取来源名称
const getSourceName = () => {
  if (!currentNews.value?.source_url) return null

  try {
    const url = new URL(currentNews.value.source_url)
    const hostname = url.hostname.replace('www.', '')

    // 中文名称映射
    const sourceMap = {
      'qbitai.com': '量子位',
      'jiqizhixin.com': '机器之心',
      'techcrunch.com': 'TechCrunch',
      'theverge.com': 'The Verge',
      'technologyreview.com': 'MIT Technology Review',
      'openai.com': 'OpenAI',
      'blog.google.com': 'Google Blog',
      'arstechnica.com': 'Ars Technica',
      'huxiu.com': '虎嗅'
    }

    return sourceMap[hostname] || hostname
  } catch {
    return null
  }
}

// 监听props变化
import { watch } from 'vue'
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

watch(() => props.news, (newVal) => {
  currentNews.value = newVal
})
</script>

<style scoped>
.news-detail {
  padding: 10px 0;
}

.detail-meta {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.detail-content {
  margin-bottom: 20px;
}

.detail-content h4 {
  font-size: 1rem;
  color: var(--morandi-text);
  margin: 0 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--morandi-primary);
}

.content-text {
  font-size: 1rem;
  color: var(--morandi-text);
  line-height: 1.8;
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 关键词加粗样式 */
.content-text :deep(strong),
.original-title :deep(strong),
.news-title :deep(strong),
.news-summary :deep(strong) {
  font-weight: 700;
  color: var(--morandi-primary);
}

.detail-original {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--morandi-border);
}

.detail-original h4 {
  font-size: 0.9rem;
  color: var(--morandi-text);
  margin: 0 0 10px 0;
}

.original-title {
  font-size: 0.9rem;
  color: var(--morandi-text-light);
  font-style: italic;
  line-height: 1.6;
  margin: 0;
  background: var(--morandi-bg);
  padding: 12px;
  border-radius: 0;
  border-left: 3px solid var(--morandi-secondary);
}
</style>
