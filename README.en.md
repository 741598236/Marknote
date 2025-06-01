# MarkNote

![MarkNote Logo](/marknote/build/icon.png)  
*Cross-platform Markdown Note App*  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **Real-time Markdown Preview**: Edit on the left, see formatted result on the right
- **Simple File Management**: Easily create/delete/search notes
- **Auto Save**: All changes are saved automatically
- **Cross-platform**: Windows/macOS/Linux support
- **Theme Switching**: Built-in light/dark themes
- **Syntax Highlighting**: Supports multiple programming languages

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Build Tool**: Vite
- **UI Framework**: TailwindCSS
- **Editor**: CodeMirror
- **Packaging**: Electron + electron-builder

## 🚀 Quick Start

### Development

```bash
# Clone repo
git clone https://github.com/your-repo/marknote.git

# Install dependencies
npm install

# Start dev server
npm run dev
```

### Production Build

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## 📖 User Guide

1. **Create Note**:
   - Click "+" button to create new note
   - A dialog will pop up for title if not provided
   - Will create directly if title is provided
2. **Edit Note**:
   - WYSIWYG editing mode
   - Supports Markdown syntax and toolbar shortcuts
3. **Title Operations**:
   - Double click title to edit
   - Press Enter or lose focus to save
   - Empty title will delete the note
4. **Delete Note**:
   - Through delete button
   - With confirmation dialog
5. **Auto Save**: All changes are saved automatically
6. **Sorting**: Notes sorted by last edit time in descending order

## 📄 Markdown Support

Supports standard Markdown syntax including:

- Headings, paragraphs, lists
- Code blocks and inline code
- Tables, blockquotes, horizontal rules
- Links and images

Full syntax reference see [Welcome.md](./Welcome.md)

## 🤝 Contributing

Issues and PRs are welcome!

## 📜 License

MIT © 2023 Lu Chang
