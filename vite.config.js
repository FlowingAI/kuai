import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 部署路径
  // 如果仓库名是 flowingai，base 设为 '/flowingai/'
  // 如果使用自定义域名或用户/组织页面，base 设为 '/'
  base: '/flowingai/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus']
        }
      }
    }
  }
})
