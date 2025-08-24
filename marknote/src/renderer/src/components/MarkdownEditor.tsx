import { MDXEditor } from '@mdxeditor/editor'
import {
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
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
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
import React from 'react'

const SUPPORTED_LANGUAGES = {
  text: 'Plain Text',
  javascript: 'JavaScript',
  js: 'JavaScript',
  css: 'CSS',
  html: 'HTML',
  python: 'Python',
  php: 'PHP',
  rust: 'Rust',
  c: 'C',
  cpp: 'C++',
  sql: 'SQL',
  bash: 'Bash',
  json: 'JSON',
  yaml: 'YAML',
  markdown: 'Markdown'
}

// 中文翻译函数
const chineseTranslation = (key: string, defaultValue: string, params?: Record<string, string>): string => {
  const translations: Record<string, string> = {
    // 工具栏按钮提示
    'toolbar.undo': '撤销',
    'toolbar.redo': '重做',
    'toolbar.bold': '粗体',
    'toolbar.italic': '斜体',
    'toolbar.underline': '下划线',
    'toolbar.strikethrough': '删除线',
    'toolbar.heading': '标题',
    'toolbar.bulletedList': '无序列表',
    'toolbar.numberedList': '有序列表',
    'toolbar.checkList': '任务列表',
    'toolbar.quote': '引用',
    'toolbar.link': '链接',
    'toolbar.image': '图片',
    'toolbar.table': '表格',
    'toolbar.thematicBreak': '分割线',
    'toolbar.codeBlock': '代码块',
    'toolbar.inlineCode': '行内代码',
    'toolbar.removeInlineCode': '移除代码格式',
    'toolbar.blockTypeSelect.selectBlockTypeTooltip': '选择块类型',
    'toolbar.blockTypeSelect.placeholder': '块类型',
    'toolbar.blockTypes.paragraph': '段落',
    'toolbar.blockTypes.quote': '引用',
    'toolbar.blockTypes.heading': '标题 {{level}}',
    'toolbar.diffMode': '差异模式',
    'toolbar.source': '源码模式',
    
    // 链接对话框
    'createLink.dialogTitle': '创建链接',
    'createLink.url': '链接地址',
    'createLink.urlPlaceholder': '选择或粘贴URL',
    'createLink.title': '标题',
    'createLink.save': '保存',
    'createLink.cancel': '取消',
    'createLink.openInNewTab': '在新标签页中打开',
    'createLink.saveTooltip': '设置链接',
    'createLink.cancelTooltip': '取消更改',
    'dialogControls.save': '保存',
    'dialogControls.cancel': '取消',
    'frontmatterEditor.title': '编辑文档前置信息',
    
    // 链接预览
    'linkPreview.open': '在新窗口打开 {{url}}',
    'linkPreview.edit': '编辑链接URL',
    'linkPreview.copyToClipboard': '复制到剪贴板',
    'linkPreview.copied': '已复制！',
    'linkPreview.remove': '移除链接',
    
    // 表格相关
    'table.insertTable': '插入表格',
    'table.deleteTable': '删除表格',
    'table.columnMenu': '列菜单',
    'table.rowMenu': '行菜单',
    'table.textAlignment': '文本对齐',
    'table.alignLeft': '左对齐',
    'table.alignCenter': '居中对齐',
    'table.alignRight': '右对齐',
    'table.insertColumnLeft': '在左侧插入列',
    'table.insertColumnRight': '在右侧插入列',
    'table.deleteColumn': '删除列',
    'table.insertRowAbove': '在上方插入行',
    'table.insertRowBelow': '在下方插入行',
    'table.deleteRow': '删除行',
    'table.toggleHeaderCell': '切换标题单元格',
    'table.toggleHeaderRow': '切换标题行',
    'table.toggleHeaderColumn': '切换标题列',
    'table.createTable': '创建表格',
    'table.addColumn': '添加列',
    'table.addRow': '添加行',
    'table.insertColumn': '插入列',
    'table.insertRow': '插入行',
    
    // 代码块相关
    'codeBlock.language': '代码块语言',
    'codeBlock.selectLanguage': '选择代码块语言',
    'codeBlock.inlineLanguage': '语言',
    'codeblock.delete': '删除代码块',
    'toolbar.deleteSandpack': '删除此代码块',
    'codeBlock.copyCode': '复制代码',
    'codeBlock.copied': '已复制！',
    
    // 图片相关
    'image.url': '图片URL',
    'image.title': '图片标题',
    'image.altText': '替代文本',
    'image.insertImage': '插入图片',
    'uploadImage.dialogTitle': '上传图片',
    'uploadImage.title': '标题：',
    
    // 通用
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.copy': '复制'
  }
  
  // 查找翻译，如果没有找到则使用默认值
  let translatedText = translations[key] || defaultValue
  
  // 如果有参数，进行替换
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translatedText = translatedText.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue)
    })
  }
  
  return translatedText
}

export const MarkdownEditor = ({ darkMode }: { darkMode: boolean }): React.ReactElement => {
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMarkdownEditor()

  // 使用 useMemo 优化插件创建，依赖 darkMode
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
        defaultCodeBlockLanguage: 'text',
        codeBlockEditorDescriptors: []
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
        <p className="text-gray-500">请选择或创建一个笔记</p>
      </div>
    )
  }

  return (
    <div className="relative h-full flex flex-col">
      <MDXEditor
        ref={editorRef}
        key={`${selectedNote.title}-${darkMode}`} // 添加 darkMode 到 key 强制重新渲染
        markdown={selectedNote.content}
        onChange={handleAutoSaving}
        onBlur={handleBlur}
        plugins={plugins}
        translation={chineseTranslation}
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
          
          /* 简化 pre 样式以避免覆盖 CodeMirror 主题 */
          [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto
          [&_pre_code]:bg-transparent
          
          /* 重构后的表格样式 - 强制覆盖prose默认样式 */
          [&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-light-border dark:[&_table]:border-dark-border [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:shadow-sm
          
          /* 强制覆盖prose表格样式 - 确保居中对齐 */
          [&_.prose_table]:!text-center [&_.prose_th]:!text-center [&_.prose_td]:!text-center
          [&_.prose_table]:!w-full [&_.prose_table]:!border-collapse
          [&_.prose_th]:!border [&_.prose_th]:border-light-border dark:[&_.prose_th]:!border-dark-border
          [&_.prose_td]:!border [&_.prose_td]:!border-light-border dark:[&_.prose_td]:!border-dark-border
          
          /* 表头样式 */
          [&_thead]:bg-light-secondary dark:[&_thead]:bg-dark-secondary [&_thead]:border-b [&_thead]:border-light-border dark:[&_thead]:border-dark-border
          [&_thead_tr]:bg-transparent [&_thead_tr]:border-0
          [&_thead_th]:border [&_thead_th]:border-light-border dark:[&_thead_th]:border-dark-border [&_thead_th]:pl-2 [&_thead_th]:pr-4 [&_thead_th]:py-3 [&_thead_th]:!text-center [&_thead_th]:font-semibold [&_thead_th]:text-light-text dark:[&_thead_th]:text-dark-text [&_thead_th]:bg-light-accent dark:[&_thead_th]:bg-dark-accent
          
          /* 表格主体样式 */
          [&_tbody]:bg-transparent [&_tbody]:border-0
          
          /* 统一的表格行样式 - 包括所有行（第一行无需特殊处理） */
          [&_tbody_tr]:bg-transparent [&_tbody_tr]:border-0 [&_tbody_tr]:h-[3.5rem] [&_tbody_tr]:min-h-[3.5rem] [&_tbody_tr]:align-middle [&_tbody_tr]:leading-[1.5]
          
          /* 统一的表格单元格样式 */
          [&_tbody_td]:border [&_tbody_td]:border-light-border dark:[&_tbody_td]:border-dark-border [&_tbody_td]:pl-4 [&_tbody_td]:pr-4 [&_tbody_td]:py-4 [&_tbody_td]:!text-center [&_tbody_td]:text-light-text dark:[&_tbody_td]:text-dark-text [&_tbody_td]:align-middle [&_tbody_td]:leading-normal [&_tbody_td]:bg-transparent [&_tbody_td]:h-[3.5rem]
          
          /* 隔行变色 */
          [&_tbody_tr:nth-child(even)]:bg-light-accent/30 dark:[&_tbody_tr:nth-child(even)]:bg-dark-accent/20
          
          /* 表格内元素垂直居中对齐 */
          [&_table_p]:my-0 [&_table_p]:leading-normal [&_table_p]:align-middle
          [&_table_code]:align-middle [&_table_span]:align-middle [&_table_strong]:align-middle [&_table_em]:align-middle [&_table_button]:align-middle [&_table_button]:text-center [&_table_button]:justify-center [&_table_a]:align-middle
          
          /* 表格菜单按钮特殊样式 - 修复偏移问题 */
          [&_table_.table-row-menu-button]:left-0 [&_table_.table-row-menu-button]:transform-none [&_table_.table-column-menu-button]:left-0 [&_table_.table-column-menu-button]:transform-none
          
          /* 表格内特殊元素样式 */
          [&_table_code]:bg-gray-200 dark:[&_table_code]:bg-gray-700 [&_table_code]:px-1 [&_table_code]:py-0.5 [&_table_code]:text-sm [&_table_code]:rounded
          [&_table_a]:text-brand-light dark:[&_table_a]:text-brand-dark [&_table_a]:no-underline [&_table_a:hover]:underline
          
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
