/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/renderer/**/*.{js,ts,jsx,tsx}'],

  darkMode: 'class',

  theme: {
    extend: {
      // 高级过渡动画配置
      transitionProperty: {
        colors: 'color, background-color, border-color'
      },

      transitionDuration: {
        300: '300ms',
        500: '500ms'
      },

      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },

      // 专业级颜色系统
      colors: {
        // 基础灰色调 (优化对比度)
        gray: {
          50: '#f9f8f6',
          100: '#f0ece6',
          200: '#e0d9d1',
          300: '#c5bcb3',
          400: '#a89f96',
          500: '#8a8279',
          600: '#6d6660',
          700: '#504b46',
          800: '#33302d',
          900: '#1a1816'
        },

        // 亮色模式专用
        light: {
          primary: '#f8f6f2',
          secondary: '#f0ece6',
          accent: '#e8e2d9',
          text: '#3a3a3a',
          border: '#d0c9c0'
        },

        // 暗黑模式专用
        dark: {
          primary: '#1a1d24',
          secondary: '#23272f',
          accent: '#2d323d',
          text: '#e0e3e7',
          border: '#3a414d'
        },

        // 品牌色 (降低饱和度)
        brand: {
          light: '#5d86c4',
          dark: '#4a74a8'
        }
      },

      // 扩展背景渐变
      backgroundImage: {
        'light-paper': 'linear-gradient(to bottom right, #f9f8f6, #f0ece6)',
        'dark-space': 'linear-gradient(to bottom right, #1a1d24, #23272f)'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
