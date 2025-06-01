# MarkNote

![MarkNote Logo](/marknote/build/icon.png)  
_跨平台 Markdown 笔记应用_  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English Documentation](./README.en.md) | [中文文档](#)

## ✨ 功能特性

- **实时 Markdown 预览**：即时呈现排版效果
- **简洁文件管理**：轻松创建/删除/搜索笔记
- **自动保存**：所有更改自动保存，无需手动操作
- **跨平台支持**：Windows/macOS/Linux 全平台兼容
- **主题切换**：内置昼夜主题，保护您的眼睛
- **代码高亮**：支持多种编程语言语法高亮

## 🛠️ 技术栈

- **前端框架**: React + TypeScript
- **构建工具**: Vite
- **UI 框架**: TailwindCSS
- **编辑器**: CodeMirror
- **打包工具**: Electron + electron-builder

## 🚀 快速开始

### 开发环境

```bash
# 克隆项目
git clone https://gitee.com/your-repo/marknote.git

# 安装依赖
yarn install

# 启动开发模式
yarn dev
```

### 生产构建

```bash
# Windows
yarn build:win

# macOS
yarn build:mac

# Linux
yarn build:linux
```

## 📖 使用指南

1. **创建笔记**：
   - 点击侧边栏"+"按钮创建新笔记
   - 未提供标题时会弹出对话框输入标题
   - 提供标题时会直接创建
2. **编辑笔记**：
   - 所见即所得编辑模式
   - 支持 Markdown 语法和工具栏快捷操作
3. **标题操作**：
   - 双击标题可编辑
   - 按 Enter 或失去焦点保存
   - 清空标题会删除笔记
4. **删除笔记**：
   - 通过删除按钮操作
   - 会弹出确认对话框
5. **自动保存**：所有更改会自动保存
6. **排序**：笔记按最后编辑时间降序排列

## 📄 Markdown 支持

支持标准 Markdown 语法，包括：

- 标题、段落、列表
- 代码块和行内代码
- 表格、引用、分割线
- 链接和图片

完整语法参考见[Welcome.md](./marknote/resources/welcomeNote.md)

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📜 许可证

MIT © 2025 路畅
