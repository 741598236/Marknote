import {
  ActionButtonsRow,
  Content,
  MainContent,
  RootLayout,
  Sidebar,
  TopBar,
  NotePreviewList,
  MarkdownEditor,
  FloatingNoteTitle,
  MinimizeButton,
  MaximizeButton,
  CloseButton
} from '@/components'
import { useRef, useState } from 'react'
import type { ReactElement } from 'react'

type ExtendedCSSProperties = React.CSSProperties & {
  WebkitAppRegion?: 'drag' | 'no-drag'
}

const App = (): ReactElement => {
  const [darkMode, setDarkMode] = useState(false)

  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0)
  }

  return (
    <RootLayout className={darkMode ? 'dark' : ''}>
      {/* 修改后的TopBar - 保证全宽适配 */}
      <TopBar className="border-b border-gray-200 dark:border-gray-700 relative w-full min-w-[320px]">
        {/* 拖拽层 - 覆盖整个顶部 */}
        <div
          className="absolute inset-0"
          style={{ WebkitAppRegion: 'drag' } as ExtendedCSSProperties}
        />

        {/* 优化后的网格布局 */}
        <div className="relative z-10 h-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center px-4 w-full">
          {/* 左侧控件 - 昼夜切换按钮 */}
          <div
            className="flex justify-start min-w-[150px]"
            style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
          >
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="sr-only peer"
              />
              <div className="w-16 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-500 transition-colors duration-300">
                <div
                  className={`absolute top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                    darkMode ? 'translate-x-8' : 'translate-x-1'
                  }`}
                >
                  <span className="absolute inset-0 flex items-center justify-center text-sm">
                    {darkMode ? '🌙' : '🌞'}
                  </span>
                </div>
              </div>
            </label>
          </div>

          {/* 居中的标题 - 添加响应式处理 */}
          <FloatingNoteTitle
            className="w-full"
            style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
          />

          {/* 右侧区域 - 窗口控制按钮 */}
          <div
            className="flex justify-end min-w-[150px] h-full items-center gap-1 px-2"
            style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
          >
            {window.context.platform !== 'darwin' && (
              <>
                <MinimizeButton />
                <MaximizeButton />
                <CloseButton />
              </>
            )}
          </div>
        </div>
      </TopBar>

      {/* 其余部分保持不变 */}
      <MainContent className="border-t border-gray-100 dark:border-gray-800">
        <Sidebar className="p-4 border-r border-gray-100 dark:border-gray-800">
          <ActionButtonsRow className="flex justify-between mb-4 gap-3 px-1" />
          <NotePreviewList className="space-y-2" onSelect={resetScroll} />
        </Sidebar>

        <Content ref={contentContainerRef} className="p-6">
          <MarkdownEditor darkMode={darkMode} />
        </Content>
      </MainContent>
    </RootLayout>
  )
}

export default App
