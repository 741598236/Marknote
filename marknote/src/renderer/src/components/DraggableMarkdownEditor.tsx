import React, { useRef, useEffect, useState } from 'react'
import { MDXEditor, MDXEditorMethods } from '@mdxeditor/editor'
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

interface DraggableBlock {
  id: string
  type: string
  content: string
  order: number
}

interface DraggableMarkdownEditorProps {
  darkMode: boolean
}

export const DraggableMarkdownEditor: React.FC<DraggableMarkdownEditorProps> = ({ darkMode }) => {
  const { t } = useTranslation()
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMarkdownEditor()
  const [blocks, setBlocks] = useState<DraggableBlock[]>([])
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null)
  const dragCounter = useRef(0)

  // 将markdown内容解析为块
  const parseMarkdownToBlocks = (markdown: string): DraggableBlock[] => {
    const lines = markdown.split('\n')
    const newBlocks: DraggableBlock[] = []
    let currentBlock = ''
    let blockType = 'paragraph'
    let blockId = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // 检查是否是新的块开始
      const isNewBlock = /^#{1,6}\s/.test(line) || // 标题
                        /^\s*[-*+]\s/.test(line) || // 无序列表
                        /^\s*\d+\.\s/.test(line) || // 有序列表
                        /^```/.test(line) || // 代码块
                        /^\|/.test(line) || // 表格
                        /^\s*$/ // 空行

      if (isNewBlock && currentBlock.trim()) {
        newBlocks.push({
          id: `block-${blockId++}`,
          type: blockType,
          content: currentBlock.trim(),
          order: newBlocks.length
        })
        currentBlock = ''
        
        // 设置新块的类型
        if (/^#{1,6}\s/.test(line)) blockType = 'heading'
        else if (/^\s*[-*+]\s/.test(line)) blockType = 'list'
        else if (/^\s*\d+\.\s/.test(line)) blockType = 'list'
        else if (/^```/.test(line)) blockType = 'code'
        else if (/^\|/.test(line)) blockType = 'table'
        else blockType = 'paragraph'
      }
      
      currentBlock += line + '\n'
    }

    if (currentBlock.trim()) {
      newBlocks.push({
        id: `block-${blockId++}`,
        type: blockType,
        content: currentBlock.trim(),
        order: newBlocks.length
      })
    }

    return newBlocks
  }

  // 将块合并为markdown内容
  const mergeBlocksToMarkdown = (blocks: DraggableBlock[]): string => {
    return blocks
      .sort((a, b) => a.order - b.order)
      .map(block => block.content)
      .join('\n\n')
  }

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggedBlock(blockId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', blockId)
  }

  // 处理拖拽结束
  const handleDragEnd = () => {
    setDraggedBlock(null)
    dragCounter.current = 0
  }

  // 处理拖拽经过
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  // 处理放置
  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault()
    
    if (!draggedBlock || draggedBlock === targetBlockId) return

    const newBlocks = [...blocks]
    const draggedIndex = newBlocks.findIndex(b => b.id === draggedBlock)
    const targetIndex = newBlocks.findIndex(b => b.id === targetBlockId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const [draggedItem] = newBlocks.splice(draggedIndex, 1)
    newBlocks.splice(targetIndex, 0, draggedItem)

    // 更新顺序
    newBlocks.forEach((block, index) => {
      block.order = index
    })

    setBlocks(newBlocks)
    
    // 更新编辑器内容
    const newMarkdown = mergeBlocksToMarkdown(newBlocks)
    if (editorRef.current) {
      editorRef.current.setMarkdown(newMarkdown)
      handleAutoSaving(newMarkdown)
    }
  }

  // 监听内容变化
  useEffect(() => {
    if (selectedNote?.content) {
      const parsedBlocks = parseMarkdownToBlocks(selectedNote.content)
      setBlocks(parsedBlocks)
    }
  }, [selectedNote?.content])

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
    <div className="relative h-full flex flex-col">
      {/* 拖拽模式开关 */}
      <div className="absolute top-2 right-2 z-20">
        <button
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          onClick={() => {
            // 可以在这里添加切换拖拽模式的逻辑
            console.log('切换拖拽模式')
          }}
        >
          拖拽模式
        </button>
      </div>

      <MDXEditor
        ref={editorRef}
        key={`${selectedNote.title}-${darkMode}`}
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
          
          /* 拖拽相关样式 */
          [&_.draggable-block]:cursor-move
          [&_.draggable-block]:border-l-2
          [&_.draggable-block]:border-transparent
          [&_.draggable-block:hover]:border-blue-400
          [&_.draggable-block.dragging]:opacity-50
          [&_.draggable-block.drag-over]:border-l-4
          [&_.draggable-block.drag-over]:border-blue-500
          
          /* 原有的样式保持不变 */
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