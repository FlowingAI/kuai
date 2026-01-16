/**
 * 构建前复制 data 目录到 public 目录
 * 确保 GitHub Pages 部署时可以访问数据文件
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectRoot = path.resolve(__dirname, '..')
const dataDir = path.join(projectRoot, 'data')
const publicDataDir = path.join(projectRoot, 'public', 'data')

console.log('📁 开始复制 data 目录...')

// 确保目标目录存在
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true })
  console.log('✅ 创建 public/data 目录')
}

// 复制所有 JSON 文件
const files = fs.readdirSync(dataDir)
let copiedCount = 0

files.forEach(file => {
  if (file.endsWith('.json')) {
    const srcPath = path.join(dataDir, file)
    const destPath = path.join(publicDataDir, file)
    fs.copyFileSync(srcPath, destPath)
    copiedCount++
    console.log(`  ✓ ${file}`)
  }
})

console.log(`\n✅ 成功复制 ${copiedCount} 个数据文件到 public/data/`)
