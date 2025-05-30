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
import { useMarkdownEditor } from '@renderer/hooks/useMarkdiwnEditor'

export const MarkdownEditor = () => {
  const { selectedNote } = useMarkdownEditor()

  if (!selectedNote) return null
  
  return (
    <div className="relative h-full flex flex-col">
      <MDXEditor
        key={selectedNote.title}
        markdown={selectedNote.content}
        plugins={[
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
            codeBlockEditorDescriptors: [
              {
                id: 'codeblock',
                label: 'CodeBlock',
                iconName: 'code',
                supportedLanguages: [
                  'text',
                  'javascript',
                  'typescript',
                  'css',
                  'html',
                  'python',
                  'java',
                  'go',
                  'php',
                  'ruby',
                  'rust',
                  'c',
                  'cpp',
                  'csharp',
                  'swift',
                  'kotlin',
                  'sql',
                  'bash',
                  'json',
                  'yaml',
                  'markdown'
                ]
              }
            ]
          }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: 'JavaScript',
              ts: 'TypeScript',
              css: 'CSS',
              html: 'HTML',
              text: 'Plain Text',
              python: 'Python',
              java: 'Java',
              go: 'Go',
              php: 'PHP',
              ruby: 'Ruby',
              rust: 'Rust',
              c: 'C',
              cpp: 'C++',
              csharp: 'C#',
              swift: 'Swift',
              kotlin: 'Kotlin',
              sql: 'SQL',
              bash: 'Bash',
              json: 'JSON',
              yaml: 'YAML',
              markdown: 'Markdown'
            }
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
            toolbarClassName: `
              !bg-light-primary !border-b !border-light-border
              dark:!bg-dark-primary dark:!border-b dark:!border-dark-border
              shadow-sm
              px-3 py-1.5
              transition-colors duration-300 ease-smooth
              sticky top-0 z-10
            `
          }),
          directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
          frontmatterPlugin(),
          diffSourcePlugin()
        ]}
        contentEditableClassName={`
          outline-none max-w-none 
          px-4 py-4 sm:px-6 md:px-8
          prose prose-lg
          dark:prose-invert 
          max-w-full
          caret-primary-500
          
          /* 关键修复 - 滚动容器设置 */
          h-[calc(100vh-4rem)]  /* 视口高度减去工具栏高度 */
          overflow-y-auto       /* 启用垂直滚动 */
          
          /* 滚动条样式 */
          scrollbar-thin 
          scrollbar-thumb-gray-300 
          scrollbar-track-gray-100
          dark:scrollbar-thumb-gray-600 
          dark:scrollbar-track-gray-800
          
          /* 内容区域底部留白 */
          pb-10
          
          /* 标题优化 */
          prose-headings:font-serif prose-headings:font-normal
          prose-headings:mb-5 prose-headings:mt-8
          prose-h1:text-3xl prose-h1:leading-[1.3]
          prose-h2:text-2xl prose-h2:leading-[1.35] prose-h2:mt-10
          prose-h3:text-xl prose-h3:leading-[1.4]
          prose-headings:text-gray-900 dark:prose-headings:text-gray-100
          
          /* 段落优化 */
          prose-p:my-5 prose-p:leading-[1.8]
          prose-p:text-gray-700 dark:prose-p:text-gray-300
          prose-p:tracking-[0.01em]
          
          /* 列表优化 */
          prose-ul:my-5 prose-ol:my-5
          prose-li:my-2 prose-li:leading-relaxed
          prose-ul:pl-7 prose-ol:pl-7
          prose-ul:marker:text-gray-400 prose-ol:marker:text-gray-400
          prose-li:pl-1.5
          prose-li:marker:font-normal
          
          /* 引用块优化 */
          prose-blockquote:border-l-[3px] 
          prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-500
          prose-blockquote:pl-6 prose-blockquote:my-6 prose-blockquote:py-1
          prose-blockquote:not-italic
          prose-blockquote:bg-gray-50/60 dark:prose-blockquote:bg-gray-800/30
          prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
          prose-blockquote:rounded-r-md
          
          /* 链接优化 */
          prose-a:text-primary-600 dark:prose-a:text-primary-400
          prose-a:underline-offset-4 prose-a:decoration-2
          hover:prose-a:text-primary-700 dark:hover:prose-a:text-primary-300
          hover:prose-a:decoration-primary-500/50
          prose-a:transition-colors prose-a:duration-200
          
          /* 代码优化 */
          prose-code:bg-gray-100 dark:prose-code:bg-gray-700/70
          prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-code:text-gray-800 dark:prose-code:text-gray-200
          prose-code:font-mono prose-code:text-[0.9em]
          prose-code:before:content-[''] prose-code:after:content-['']
          
          /* 代码块优化 */
          prose-pre:bg-gray-900 prose-pre:shadow-lg
          prose-pre:border prose-pre:border-gray-800
          dark:prose-pre:bg-gray-900/95
          prose-pre:text-gray-100 dark:prose-pre:text-gray-200
          prose-pre:p-5 prose-pre:rounded-xl
          prose-pre:overflow-x-auto
          prose-pre:leading-relaxed
          prose-pre:font-mono prose-pre:text-[0.92em]
          
          /* 表格优化 */
          prose-table:my-6
          prose-th:bg-gray-100 dark:prose-th:bg-gray-800/50
          prose-th:px-4 prose-th:py-3
          prose-td:px-4 prose-td:py-2.5
          prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700
          prose-td:border prose-td:border-gray-100 dark:prose-td:border-gray-800
          
          /* 图片优化 */
          prose-img:my-6 prose-img:rounded-lg
          prose-img:border prose-img:border-gray-200 dark:prose-img:border-gray-700
          prose-img:shadow-sm
          
          /* 分割线优化 */
          prose-hr:my-8 prose-hr:border-t-2
          prose-hr:border-gray-200 dark:prose-hr:border-gray-700
          
          /* 过渡效果 */
          transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]
        `}
      />
    </div>
  )
}
