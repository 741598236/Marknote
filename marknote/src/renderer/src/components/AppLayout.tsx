import { ComponentProps, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

// 解决方案：使用类型断言扩展 CSSProperties
interface ExtendedCSSProperties extends React.CSSProperties {
  WebkitAppRegion?: 'drag' | 'no-drag'
}

export const RootLayout = ({ className, children, ...props }: ComponentProps<'div'>) => (
  <div
    className={twMerge(
      'flex flex-col h-screen',
      'bg-[#f8f6f2] dark:bg-[#1a1d24]',
      'text-[#3a3a3a] dark:text-[#e0e3e7]',
      'transition-colors duration-300',
      className
    )}
    style={{ WebkitAppRegion: 'drag' } as ExtendedCSSProperties}
    {...props}
  >
    <div
      style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
      className="flex-1 flex flex-col"
    >
      {children}
    </div>
  </div>
)

export const TopBar = ({ className, children, ...props }: ComponentProps<'header'>) => (
  <header
    className={twMerge(
      'h-16',
      'bg-[#f0ece6] dark:bg-[#23272f]',
      'border-b border-[#e0d9d1] dark:border-[#2d343f]',
      'text-[#3a3a3a] dark:text-[#e0e3e7]',
      'sticky top-0 z-50',
      'relative',
      'transition-colors duration-300',
      className
    )}
    {...props}
  >
    {/* 顶部拖拽条（高度8px） */}
    <div
      className="absolute inset-0 h-2 bg-transparent"
      style={
        {
          WebkitAppRegion: 'drag',
          cursor: 'move' // 更符合拖拽操作习惯
        } as ExtendedCSSProperties
      }
    />

    {/* 内容区域 */}
    <div
      className="flex items-center h-full px-4"
      style={{ WebkitAppRegion: 'no-drag' } as ExtendedCSSProperties}
    >
      {children}
    </div>
  </header>
)

export const Sidebar = ({ className, children, ...props }: ComponentProps<'aside'>) => (
  <aside
    className={twMerge(
      'w-64',
      'bg-[#f5f1eb] dark:bg-[#1e222a]',
      'border-r border-[#e0d9d1] dark:border-[#2d343f]',
      'text-[#4a4a4a] dark:text-[#d0d5dc]',
      'sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto',
      'transition-colors duration-300',
      className
    )}
    {...props}
  >
    {children}
  </aside>
)

export const Content = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={twMerge(
        'flex-1 overflow-auto p-4',
        'bg-[#fcfaf7] dark:bg-[#181c23]',
        'text-[#3a3a3a] dark:text-[#e0e3e7]',
        'transition-colors duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Content.displayName = 'Content'

export const MainContent = ({ className, children, ...props }: ComponentProps<'div'>) => (
  <div className={twMerge('flex flex-1', 'transition-colors duration-300', className)} {...props}>
    {children}
  </div>
)
