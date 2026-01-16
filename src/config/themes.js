/**
 * 青春风格主题配置
 * 9种完全不同的色彩方案和布局
 */

export const themes = {
  minimal: {
    name: '极简黑白',
    icon: '🖤',
    description: '简约专业',
    layout: 'grid',
    colors: {
      primary: '#2C3E50',
      secondary: '#95A5A6',
      accent: '#34495E',
      text: '#2C3E50',
      textLight: '#7F8C8D',
      bg: '#F8F9FA',
      card: '#FFFFFF',
      border: '#E0E0E0',
      hover: '#E8E8E8',
      danger: '#E74C3C',
      success: '#27AE60'
    }
  },

  industrial: {
    name: '工业风',
    icon: '🏭',
    description: '硬朗线条',
    layout: 'industrial',
    colors: {
      primary: '#FF6B35',
      secondary: '#2C3E50',
      accent: '#F7931E',
      text: '#1A1A1A',
      textLight: '#4A4A4A',
      bg: '#E8E8E8',
      card: '#FFFFFF',
      border: '#FF6B35',
      hover: '#FFF5F0',
      danger: '#D32F2F',
      success: '#388E3C'
    }
  },

  pixel: {
    name: '复古像素',
    icon: '👾',
    description: '8位游戏',
    layout: 'pixel',
    colors: {
      primary: '#4ECDC4',
      secondary: '#95E1D3',
      accent: '#FF6B6B',
      text: '#2C3E50',
      textLight: '#5A6C7D',
      bg: '#FFF9E6',
      card: '#FFFFFF',
      border: '#2C3E50',
      hover: '#FFF3D6',
      danger: '#FF6B6B',
      success: '#4ECDC4'
    }
  },

  glass: {
    name: '玻璃拟态',
    icon: '🪟',
    description: '毛玻璃',
    layout: 'glass',
    colors: {
      primary: '#6366F1',
      secondary: '#A5B4FC',
      accent: '#818CF8',
      text: '#1E293B',
      textLight: '#64748B',
      bg: '#F1F5F9',
      card: '#FFFFFF',
      border: '#E2E8F0',
      hover: '#F8FAFC',
      danger: '#EF4444',
      success: '#10B981'
    }
  },

  brutalist: {
    name: '新粗野主义',
    icon: '📐',
    description: '粗边框',
    layout: 'brutalist',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#FFFF00',
      text: '#000000',
      textLight: '#333333',
      bg: '#FFFFFF',
      card: '#FFFFFF',
      border: '#000000',
      hover: '#FFFF00',
      danger: '#FF0000',
      success: '#00FF00'
    }
  },

  sakura: {
    name: '樱粉粉嫩',
    icon: '🌸',
    description: '温柔可爱',
    layout: 'sakura',
    colors: {
      primary: '#FD79A8',
      secondary: '#FECFEF',
      accent: '#FFB6C1',
      text: '#4A4A4A',
      textLight: '#8A8A8A',
      bg: '#FFF5F7',
      card: '#FFFFFF',
      border: '#FFD6E0',
      hover: '#FFE9EE',
      danger: '#FF6B9D',
      success: '#95E1D3'
    }
  },

  pop: {
    name: '波普艺术',
    icon: '🎨',
    description: '大胆色彩',
    layout: 'pop',
    colors: {
      primary: '#FFD93D',
      secondary: '#FF6B6B',
      accent: '#4ECDC4',
      text: '#000000',
      textLight: '#333333',
      bg: '#FFFFFF',
      card: '#FFFFFF',
      border: '#000000',
      hover: '#FFF9E6',
      danger: '#FF0000',
      success: '#00AA00'
    }
  },

  spring: {
    name: '春天蓝天',
    icon: '🌤',
    description: '清新春日',
    layout: 'spring',
    colors: {
      primary: '#87CEEB',
      secondary: '#B0E0E6',
      accent: '#90EE90',
      text: '#2C5530',
      textLight: '#5A7A5E',
      bg: '#F0FFF0',
      card: '#FFFFFF',
      border: '#98D8C8',
      hover: '#E0FFFF',
      danger: '#FF6B6B',
      success: '#32CD32'
    }
  },

  ocean: {
    name: '海洋渐变',
    icon: '🌊',
    description: '深邃海洋',
    layout: 'ocean',
    colors: {
      primary: '#0984E3',
      secondary: '#74B9FF',
      accent: '#00CEC9',
      text: '#2D3436',
      textLight: '#636E72',
      bg: '#F0F8FF',
      card: '#FFFFFF',
      border: '#AED9E0',
      hover: '#D6EAF8',
      danger: '#D63031',
      success: '#00B894'
    }
  }
}

/**
 * 应用主题到CSS变量
 */
export function applyTheme(themeKey) {
  const theme = themes[themeKey]
  if (!theme) {
    console.error(`主题 ${themeKey} 不存在`)
    return
  }

  const root = document.documentElement
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--morandi-${key}`, value)
  })

  // 保存布局类型
  root.style.setProperty('--layout-type', theme.layout)

  // 保存到localStorage
  localStorage.setItem('theme', themeKey)
}

/**
 * 从localStorage加载主题
 */
export function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'minimal'
  applyTheme(savedTheme)
  return savedTheme
}
