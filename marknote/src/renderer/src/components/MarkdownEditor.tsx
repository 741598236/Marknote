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

export const MarkdownEditor = () => {
  const { editorRef, selectedNote, handleAutoSaving, handleBlur } = useMarkdownEditor()

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
        key={selectedNote.title}
        markdown={selectedNote.content}
        onChange={handleAutoSaving}
        onBlur={handleBlur}
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
              markdown()
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
              '!bg-light-primary !border-b !border-light-border dark:!bg-dark-primary dark:!border-b dark:!border-dark-border shadow-sm px-3 py-1.5 transition-colors duration-300 ease-smooth sticky top-0 z-10'
          }),
          directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
          frontmatterPlugin(),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' })
        ]}
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
          
          [&_pre]:bg-gray-900 [&_pre]:shadow-xl
          [&_pre]:border [&_pre]:border-gray-800/80
          dark:[&_pre]:bg-[#0d1117] dark:[&_pre]:border-gray-700/60
          [&_pre]:text-gray-100 dark:[&_pre]:text-gray-200
          [&_pre]:p-5 [&_pre]:rounded-xl
          [&_pre]:overflow-x-auto
          [&_pre]:leading-relaxed
          [&_pre]:font-mono [&_pre]:text-[0.92em]
          [&_pre]:bg-gradient-to-br [&_pre]:from-gray-900 [&_pre]:via-gray-800 [&_pre]:to-gray-900
          dark:[&_pre]:bg-gradient-to-br dark:[&_pre]:from-[#0d1117] dark:[&_pre]:via-[#161b22] dark:[&_pre]:to-[#0d1117]
          [&_pre]:shadow-lg [&_pre]:ring-1 [&_pre]:ring-gray-700/30
          dark:[&_pre]:ring-gray-600/30
          [&_pre]:transition-all [&_pre]:duration-300
          [&_pre_code]:bg-transparent
          dark:[&_pre_code]:bg-transparent
          [&_pre_code]:before:content-[attr(data-line)]
          [&_pre_code]:before:text-gray-500/70
          dark:[&_pre_code]:before:text-gray-500/50
          [&_pre_code]:before:mr-3
          [&_pre_code]:before:inline-block
          [&_pre_code]:before:w-4
          [&_pre_code]:before:text-right
          
          [&_pre]::-webkit-scrollbar {
            height: 8px;
            background-color: transparent;
          }
          [&_pre]::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.3);
            border-radius: 4px;
          }
          dark:[&_pre]::-webkit-scrollbar-thumb {
            background-color: rgba(75, 85, 99, 0.4);
          }
          
          [&_.token.comment],
          [&_.token.prolog],
          [&_.token.doctype],
          [&_.token.cdata] {
            color: #6b7280;
          }
          [&_.token.punctuation] {
            color: #d1d5db;
          }
          [&_.token.property],
          [&_.token.tag],
          [&_.token.boolean],
          [&_.token.number],
          [&_.token.constant],
          [&_.token.symbol],
          [&_.token.deleted] {
            color: #f472b6;
          }
          [&_.token.selector],
          [&_.token.attr-name],
          [&_.token.string],
          [&_.token.char],
          [&_.token.builtin],
          [&_.token.inserted] {
            color: #93c5fd;
          }
          [&_.token.operator],
          [&_.token.entity],
          [&_.token.url],
          [&_.language-css_.token.string],
          [&_.style_.token.string] {
            color: #93c5fd;
          }
          [&_.token.atrule],
          [&_.token.attr-value],
          [&_.token.keyword] {
            color: #93c5fd;
          }
          [&_.token.function],
          [&_.token.class-name] {
            color: #fbbf24;
          }
          [&_.token.regex],
          [&_.token.important],
          [&_.token.variable] {
            color: #93c5fd;
          }
          
          [&_table]:my-6
          [&_th]:bg-gray-100 dark:[&_th]:bg-gray-800/50
          [&_th]:px-4 [&_th]:py-3
          [&_td]:px-4 [&_td]:py-2.5
          [&_th]:border [&_th]:border-gray-200 dark:[&_th]:border-gray-700
          [&_td]:border [&_td]:border-gray-100 dark:[&_td]:border-gray-800
          
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
