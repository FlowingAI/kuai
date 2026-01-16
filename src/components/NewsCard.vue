<template>
  <div class="news-card" @click="handleClick">
    <div class="news-index">{{ index + 1 }}</div>
    <div class="news-content">
      <h3 class="news-title" v-html="highlightedTitle"></h3>
      <p class="news-summary" v-html="highlightedSummary"></p>
      <div class="news-meta">
        <span class="news-time" v-if="news.publish_time">
          <el-icon><Clock /></el-icon>
          {{ news.publish_time }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock } from '@element-plus/icons-vue'
import { highlightKeywords } from '../utils/highlight.js'

const props = defineProps({
  news: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['click'])

const highlightedTitle = computed(() => {
  return highlightKeywords(props.news.title || '')
})

const highlightedSummary = computed(() => {
  return highlightKeywords(props.news.summary || '')
})

const handleClick = () => {
  emit('click', props.news)
}
</script>

<style scoped>
.news-card {
  background: var(--morandi-card);
  border-radius: 0;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(168, 181, 201, 0.15);
  display: flex;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.news-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--morandi-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.news-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(168, 181, 201, 0.25);
}

.news-card:hover::before {
  opacity: 1;
}

.news-index {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background: var(--morandi-primary);
  color: white;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 2px;
}

.news-content {
  flex: 1;
  min-width: 0;
}

.news-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--morandi-text);
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-summary {
  font-size: 0.9rem;
  color: var(--morandi-text-light);
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 0.85rem;
  color: var(--morandi-text-light);
  flex-wrap: wrap;
}

.news-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .news-card {
    padding: 12px;
  }

  .news-title {
    font-size: 0.95rem;
  }

  .news-summary {
    font-size: 0.85rem;
  }
}
</style>
