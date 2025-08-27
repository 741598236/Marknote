import React, { useRef, useEffect, useState, useCallback } from 'react'
import { MDXEditor } from '@mdxeditor/editor'
import * as mdPlugins from '@mdxeditor/editor'
import { useMarkdownEditor } from '@renderer/hooks/useMarkdownEditor'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
import { python } from '@codemirror/lang-python'
import { php } from '@codemirror/lang-php'
import { rust } from '@codemirror/lang-rust'
import { cpp } from '@codemirror/lang-cpp'
import { sql } from '@codemirror/lang-sql'
import { json } from '@codemirror/lang-json'
import { yaml } from '@codemirror/lang-yaml'
import { markdown } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import { solarizedLight } from '@ddietr/codemirror-themes/solarized-light'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../config/editor.config'

const {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  thematicBreakPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  AdmonitionDirectiveDescriptor,
  BoldItalicUnderlineToggles,
  CodeToggle,
  ListsToggle,
  Separator,
  BlockTypeSelect,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  InsertImage,
  UndoRedo
} = mdPlugins

interface BlockDraggableEditorProps {
  darkMode: boolean
}

export const BlockDraggableEditor: React.FC<BlockDraggableEditorProps> = ({ darkMode }) => {
  const { t } = useTranslation()
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMarkdownEditor()
  const [isDragMode, setIsDragMode] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // 为块级元素添加拖拽功能
  const enableBlockDragging = useCallback(() => {
    if (!containerRef.current || !isDragMode) return

    const editor = containerRef.current.querySelector('[contenteditable="true"]')
    if (!editor) return

    // 添加拖拽样式 - 修复表格和代码块样式覆盖问题
    const style = document.createElement('style')
    style.textContent = `
      .drag-mode-active .prose {
        position: relative;
      }
      
      /* 基础拖拽样式 - 仅添加最小必要样式 */
      .drag-mode-active .prose > *:not(table):not(pre) {
        position: relative;
        cursor: move;
        transition: all 0.2s ease;
        border-left: 3px solid transparent;
        margin: 0.25rem 0;
        padding: 0.5rem 0.5rem 0.5rem 2rem;
        background-color: transparent;
        min-height: 1.5rem;
      }
      
      /* 表格特殊处理 - 保持原有样式 */
      .drag-mode-active .prose table {
        position: relative;
        cursor: move;
        border-left: 3px solid transparent;
        transition: all 0.2s ease;
        margin: 1rem 0;
      }
      
      /* 代码块特殊处理 - 保持原有样式 */
      .drag-mode-active .prose pre {
        position: relative;
        cursor: move;
        border-left: 3px solid transparent;
        transition: all 0.2s ease;
        margin: 1rem 0;
      }
      
      .drag-mode-active .prose > *:empty {
        min-height: 1.5rem;
        border-left: 3px dashed transparent;
      }
      
      .drag-mode-active .prose > *:empty:hover {
        border-left-color: #d1d5db;
      }
      
      .drag-mode-active .prose > *:hover,
      .drag-mode-active .prose table:hover,
      .drag-mode-active .prose pre:hover {
        border-left-color: #3b82f6;
        background-color: rgba(59, 130, 246, 0.05);
      }
      
      .drag-mode-active .prose > *.dragging,
      .drag-mode-active .prose table.dragging,
      .drag-mode-active .prose pre.dragging {
        opacity: 0.8;
        transform: rotate(1deg) scale(1.01);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        background-color: rgba(59, 130, 246, 0.1);
        border-left-color: #3b82f6;
      }
      
      .drag-mode-active .prose > *.drag-over,
      .drag-mode-active .prose table.drag-over,
      .drag-mode-active .prose pre.drag-over {
        border-left-color: #1d4ed8;
        border-left-width: 4px;
        background-color: rgba(29, 78, 216, 0.08);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(29, 78, 216, 0.15);
      }
      
      /* 拖拽手柄 - 左侧显示 */
      .drag-mode-active .prose > *::before,
      .drag-mode-active .prose table::before,
      .drag-mode-active .prose pre::before {
        content: "⋮⋮";
        position: absolute;
        left: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
        font-size: 1.2rem;
        cursor: grab;
        font-weight: bold;
        letter-spacing: 0.1em;
        opacity: 0.7;
        transition: all 0.2s ease;
        background: rgba(255, 255, 255, 0.95);
        padding: 0.375rem 0.5rem;
        border-radius: 0.375rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        z-index: 20;
        border: 1px solid #e5e7eb;
      }
      
      .dark .drag-mode-active .prose > *,
      .dark .drag-mode-active .prose table,
      .dark .drag-mode-active .prose pre {
        background-color: transparent;
      }
      
      .dark .drag-mode-active .prose > *:hover,
      .dark .drag-mode-active .prose table:hover,
      .dark .drag-mode-active .prose pre:hover {
        border-left-color: #60a5fa;
        background-color: rgba(59, 130, 246, 0.1);
      }
      
      .dark .drag-mode-active .prose > *.dragging,
      .dark .drag-mode-active .prose table.dragging,
      .dark .drag-mode-active .prose pre.dragging {
        background-color: rgba(59, 130, 246, 0.2);
        border-left-color: #3b82f6;
      }
      
      .dark .drag-mode-active .prose > *.drag-over,
      .dark .drag-mode-active .prose table.drag-over,
      .dark .drag-mode-active .prose pre.drag-over {
        background-color: rgba(29, 78, 216, 0.15);
      }
      
      .dark .drag-mode-active .prose > *::before,
      .dark .drag-mode-active .prose table::before,
      .dark .drag-mode-active .prose pre::before {
        color: #9ca3af;
        background: rgba(31, 41, 55, 0.95);
        border-color: #374151;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
      
      .drag-mode-active .prose > *:hover::before,
      .drag-mode-active .prose table:hover::before,
      .drag-mode-active .prose pre:hover::before {
        color: #3b82f6;
        opacity: 1;
        border-color: #3b82f6;
        box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
      }
      
      .dark .drag-mode-active .prose > *:hover::before,
      .dark .drag-mode-active .prose table:hover::before,
      .dark .drag-mode-active .prose pre:hover::before {
        color: #60a5fa;
        border-color: #60a5fa;
      }
      
      .drag-mode-active .prose > *.dragging::before,
      .drag-mode-active .prose table.dragging::before,
      .drag-mode-active .prose pre.dragging::before {
        cursor: grabbing;
        color: #1d4ed8;
        border-color: #1d4ed8;
        background-color: rgba(29, 78, 216, 0.1);
      }
      
      .dark .drag-mode-active .prose > *.dragging::before,
      .dark .drag-mode-active .prose table.dragging::before,
      .dark .drag-mode-active .prose pre.dragging::before {
        color: #3b82f6;
        border-color: #3b82f6;
      }
    `
    document.head.appendChild(style)

    // 为每个块添加拖拽事件 - 智能选择所有可见块级元素
      const blocks = Array.from(editor.querySelectorAll('.prose > *'))
        .filter(block => {
          // 跳过拖拽句柄本身
          if (block.classList.contains('drag-handle')) return false
          
          // 特殊处理代码块和表格
          const isCodeBlock = block.tagName === 'PRE' || block.querySelector('pre')
          const isTable = block.tagName === 'TABLE' || block.querySelector('table')
          
          // 确保复杂元素也能被选中
          return true
        })
      
      const eventHandlers = new Map()

      blocks.forEach((block, index) => {
        if (!(block instanceof HTMLElement)) return

        block.draggable = true
      block.dataset.blockIndex = index.toString()

      const handleDragStart = (e: DragEvent) => {
        if (!e.dataTransfer) return
        e.dataTransfer.effectAllowed = 'move'
        e.dataTransfer.setData('text/plain', index.toString())
        block.classList.add('dragging')
      }

      const handleDragEnd = () => {
        block.classList.remove('dragging')
        editor.querySelectorAll('.drag-over').forEach(el => {
          el.classList.remove('drag-over')
        })
      }

      const handleDragOver = (e: DragEvent) => {
        e.preventDefault()
        if (!block.classList.contains('dragging')) {
          block.classList.add('drag-over')
        }
      }

      const handleDragLeave = () => {
        block.classList.remove('drag-over')
      }

      const handleDrop = (e: DragEvent) => {
        e.preventDefault()
        const draggedIndex = parseInt(e.dataTransfer?.getData('text/plain') || '-1')
        const targetIndex = parseInt(block.dataset.blockIndex || '-1')

        if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) return

        // 重新排序内容
        reorderContent(draggedIndex, targetIndex)
        
        block.classList.remove('drag-over')
      }

      // 存储事件处理器引用
      eventHandlers.set(block, {
        handleDragStart,
        handleDragEnd,
        handleDragOver,
        handleDragLeave,
        handleDrop
      })

      block.addEventListener('dragstart', handleDragStart)
      block.addEventListener('dragend', handleDragEnd)
      block.addEventListener('dragover', handleDragOver)
      block.addEventListener('dragleave', handleDragLeave)
      block.addEventListener('drop', handleDrop)
    })

    return () => {
      style.remove()
      blocks.forEach(block => {
        const handlers = eventHandlers.get(block)
        if (handlers) {
          block.removeEventListener('dragstart', handlers.handleDragStart)
          block.removeEventListener('dragend', handlers.handleDragEnd)
          block.removeEventListener('dragover', handlers.handleDragOver)
          block.removeEventListener('dragleave', handlers.handleDragLeave)
          block.removeEventListener('drop', handlers.handleDrop)
        }
      })
    }
  }, [isDragMode])

  // 重新排序内容
  const reorderContent = useCallback((fromIndex: number, toIndex: number) => {
    if (!editorRef.current) return

    const currentContent = editorRef.current.getMarkdown()
    const blocks = parseMarkdownToBlocks(currentContent)
    
    if (blocks.length === 0) return // 防止空内容
    
    const [movedBlock] = blocks.splice(fromIndex, 1)
    blocks.splice(toIndex, 0, movedBlock)
    
    const newContent = blocks.join('\n\n')
    editorRef.current.setMarkdown(newContent)
    handleAutoSaving(newContent)
  }, [editorRef, handleAutoSaving])

  // 智能解析markdown为块 - 完整保留复杂格式
  const parseMarkdownToBlocks = (markdown: string) => {
    if (!markdown.trim()) return ['']
    
    const lines = markdown.split('\n')
    const blocks: string[] = []
    let currentBlock = ''
    let inCodeBlock = false
    let inTable = false
    let inList = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()
      
      // 处理代码块 - 完整保留
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // 代码块结束
          currentBlock += (currentBlock ? '\n' : '') + line
          blocks.push(currentBlock)
          currentBlock = ''
          inCodeBlock = false
        } else {
          // 代码块开始 - 如果之前有内容，先保存
          if (currentBlock.trim()) {
            blocks.push(currentBlock)
          }
          currentBlock = line
          inCodeBlock = true
        }
        continue
      }
      
      if (inCodeBlock) {
        currentBlock += '\n' + line
        continue
      }
      
      // 检测表格 - 以|开头或包含|---|
      const isTableLine = /^\|/.test(line) || /^\s*\|.*\|/.test(line) || /^[-:+|]+$/.test(line.trim())
      
      // 检测列表
      const isListItem = /^\s*[-*+]\s/.test(line) || /^\s*\d+\.\s/.test(line)
      
      // 检测标题
      const isHeader = /^#{1,6}\s/.test(line)
      
      // 检测引用
      const isQuote = /^>\s/.test(line)
      
      // 检测分隔线
      const isSeparator = /^(\*{3,}|_{3,}|-{3,})$/.test(trimmedLine)
      
      // 智能判断新块开始
      let shouldNewBlock = false
      
      if (!currentBlock.trim()) {
        // 如果当前块为空，直接添加
        currentBlock = line
        continue
      }
      
      // 基于当前块类型和内容类型判断
      const currentBlockLines = currentBlock.split('\n')
      const lastLine = currentBlockLines[currentBlockLines.length - 1]
      
      if (isHeader && !isHeader) {
        shouldNewBlock = true
      } else if (isTableLine && !/^\|/.test(lastLine)) {
        shouldNewBlock = true
      } else if (isListItem && !/^\s*[-*+\d]/.test(lastLine.trim())) {
        shouldNewBlock = true
      } else if (isQuote && !/^>/.test(lastLine)) {
        shouldNewBlock = true
      } else if (isSeparator && trimmedLine !== '') {
        shouldNewBlock = true
      } else if (trimmedLine === '' && currentBlock.trim()) {
        // 空行作为分隔符
        shouldNewBlock = true
      } else if (!isTableLine && /^\|/.test(lastLine)) {
        // 表格结束
        shouldNewBlock = true
      }
      
      if (shouldNewBlock) {
        blocks.push(currentBlock)
        currentBlock = line
      } else {
        if (currentBlock) {
          currentBlock += '\n' + line
        } else {
          currentBlock = line
        }
      }
    }

    // 处理最后剩余的块
    if (currentBlock.trim() || inCodeBlock) {
      blocks.push(currentBlock)
    }

    // 清理空块，但保留空白行
    const cleanedBlocks = blocks.filter(block => block.trim() !== '' || block === '\n')
    
    return cleanedBlocks.length > 0 ? cleanedBlocks : [markdown]
  }

  // 监听拖拽模式变化和内容更新
  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    if (isDragMode) {
      // 延迟执行以确保内容渲染完成
      timeoutId = setTimeout(() => {
        const cleanup = enableBlockDragging()
        return cleanup
      }, 500)
    } else {
      // 立即清理拖拽效果
      const cleanup = enableBlockDragging()
      return cleanup
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [enableBlockDragging, isDragMode, selectedNote?.content])

  // 切换拖拽模式
  const toggleDragMode = () => {
    setIsDragMode(!isDragMode)
  }

  const plugins = React.useMemo(
    () => [
      headingsPlugin(),
      listsPlugin(),
      quotePlugin(),
      markdownShortcutPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      imagePlugin(),
      tablePlugin(),
      thematicBreakPlugin(),
      codeBlockPlugin({
        defaultCodeBlockLanguage: 'plaintext'
      }),
      codeMirrorPlugin({
        codeBlockLanguages: SUPPORTED_LANGUAGES,
        codeMirrorExtensions: [
          javascript(),
          css(),
          html(),
          python(),
          php(),
          rust(),
          cpp(),
          sql(),
          json(),
          yaml(),
          markdown(),
          darkMode ? oneDark : solarizedLight
        ]
      }),
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <UndoRedo />
            <Separator />
            <BoldItalicUnderlineToggles />
            <CodeToggle />
            <Separator />
            <ListsToggle />
            <Separator />
            <BlockTypeSelect />
            <Separator />
            <CreateLink />
            <InsertImage />
            <InsertTable />
            <InsertThematicBreak />
            <InsertCodeBlock />
          </>
        ),
        toolbarClassName:
          '!bg-light-primary !border-b !border-light-border dark:!bg-dark-primary dark:!border-b dark:!border-dark-border shadow-sm px-3 py-1.5 transition-colors duration-300 ease-smooth sticky top-0 z-10 flex items-center gap-1'
      }),
      directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
      frontmatterPlugin(),
      diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' })
    ],
    [darkMode]
  )

  if (!selectedNote) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">{t('notes.selectOrCreateNote')}</p>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className={`relative h-full flex flex-col ${isDragMode ? 'drag-mode-active' : ''}`}
    >
      {/* 拖拽模式切换按钮 */}
      <div className="absolute top-2 right-2 z-20">
        <button
          className={`px-3 py-1 text-sm rounded transition-colors ${
            isDragMode 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
          onClick={toggleDragMode}
          title={isDragMode ? '退出拖拽模式' : '进入拖拽模式'}
        >
          {isDragMode ? '✓ 拖拽模式' : '拖拽模式'}
        </button>
      </div>

      {/* 拖拽模式提示 */}
      {isDragMode && (
        <div className="absolute top-12 right-2 z-20 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded text-sm">
          拖拽左侧的 ⋮⋮ 图标来移动块
        </div>
      )}

      <MDXEditor
        ref={editorRef}
        key={`${selectedNote.title}-${darkMode}-${isDragMode}`}
        markdown={selectedNote.content}
        onChange={handleAutoSaving}
        onBlur={handleBlur}
        plugins={plugins}
        contentEditableClassName="
          outline-none max-w-none 
          px-4 py-4 sm:px-6 md:px-8
          prose prose-lg dark:prose-invert 
          max-w-full caret-primary-500
          h-[calc(100vh-4rem)] overflow-y-auto
          pb-10
          scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
          dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800
          
          [&_.prose-headings]:font-serif [&_.prose-headings]:font-normal
          [&_.prose-headings]:mb-5 [&_.prose-headings]:mt-8
          [&_h1]:text-3xl [&_h1]:leading-[1.3]
          [&_h2]:text-2xl [&_h2]:leading-[1.35] [&_h2]:mt-10
          [&_h3]:text-xl [&_h3]:leading-[1.4]
          [&_.prose-headings]:text-gray-900 dark:[&_.prose-headings]:text-gray-100
          
          [&_p]:my-5 [&_p]:leading-[1.8]
          [&_p]:text-gray-700 dark:[&_p]:text-gray-300
          [&_p]:tracking-[0.01em]
          
          [&_ul]:my-5 [&_ol]:my-5
          [&_li]:my-2 [&_li]:leading-relaxed
          [&_ul]:pl-7 [&_ol]:pl-7
          [&_ul]:[&_::marker]:text-gray-400 [&_ol]:[&_::marker]:text-gray-400
          [&_li]:pl-1.5
          [&_li]:[&_::marker]:font-normal
          
          [&_.prose-blockquote]:border-l-[3px] 
          [&_.prose-blockquote]:border-gray-300 dark:[&_.prose-blockquote]:border-gray-500
          [&_.prose-blockquote]:pl-6 [&_.prose-blockquote]:my-6 [&_.prose-blockquote]:py-1
          [&_.prose-blockquote]:not-italic
          [&_.prose-blockquote]:bg-gray-50/60 dark:[&_.prose-blockquote]:bg-gray-800/30
          [&_.prose-blockquote]:text-gray-600 dark:[&_.prose-blockquote]:text-gray-400
          [&_.prose-blockquote]:rounded-r-md
          
          [&_a]:text-primary-600 dark:[&_a]:text-primary-400
          [&_a]:underline-offset-4 [&_a]:decoration-2
          hover:[&_a]:text-primary-700 dark:hover:[&_a]:text-primary-300
          hover:[&_a]:decoration-primary-500/50
          [&_a]:transition-colors [&_a]:duration-200
          
          [&_code]:bg-gray-100 dark:[&_code]:bg-gray-700/70
          [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded
          [&_code]:text-gray-800 dark:[&_code]:text-gray-200
          [&_code]:font-mono [&_code]:text-[0.9em]
          [&_code]:before:content-[''] [&_code]:after:content-['']
          
          [&_pre]:my-6 [&_pre]:p-5 [&_pre]:rounded-xl [&_pre]:overflow-x-auto
          [&_pre]:bg-gray-50 dark:[&_pre]:bg-gray-900/50
          [&_pre]:border [&_pre]:border-gray-200 dark:[&_pre]:border-gray-700
          [&_pre]:shadow-lg [&_pre]:shadow-gray-100/50 dark:[&_pre]:shadow-gray-900/20
          [&_pre]:backdrop-blur-sm
          
          [&_img]:my-6 [&_img]:rounded-lg
          [&_img]:border [&_img]:border-gray-200 dark:[&_img]:border-gray-700
          [&_img]:shadow-sm
          
          [&_hr]:my-8 [&_hr]:border-t-2
          [&_hr]:border-gray-200 dark:[&_hr]:border-gray-700
          
          transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
        "
      />
    </div>
  )
}