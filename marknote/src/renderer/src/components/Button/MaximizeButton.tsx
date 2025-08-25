import { ActionButton, ActionButtonProps } from '@/components'
import { LuExpand, LuShrink } from 'react-icons/lu'
import { useEffect, useState } from 'react'

export const MaximizeButton = ({ ...props }: ActionButtonProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    let isMounted = true

    const updateFullscreenState = async () => {
      try {
        const fullscreen = await window.context?.ipcRenderer?.invoke('window:isFullscreen') || false
        if (isMounted) setIsFullscreen(fullscreen)
      } catch (error) {
        console.error('Failed to get window fullscreen state:', error)
        // 设置默认值
        if (isMounted) setIsFullscreen(false)
      }
    }

    updateFullscreenState()

    // 监听窗口状态变化
    const onEnterFullscreen = () => isMounted && setIsFullscreen(true)
    const onLeaveFullscreen = () => isMounted && setIsFullscreen(false)

    window.context?.ipcRenderer?.on('window:enter-fullscreen', onEnterFullscreen)
    window.context?.ipcRenderer?.on('window:leave-fullscreen', onLeaveFullscreen)

    return () => {
      isMounted = false
      // removeAllListeners 方法只需要事件名作为参数，移除该事件的所有监听器
      window.context?.ipcRenderer?.removeAllListeners('window:enter-fullscreen')
      window.context?.ipcRenderer?.removeAllListeners('window:leave-fullscreen')
    }
  }, [])

  const [isMaximizing, setIsMaximizing] = useState(false)

  const handleToggleFullscreen = () => {
    setIsMaximizing(true)
    window.context?.ipcRenderer?.send('window:toggle-fullscreen')

    // 延迟200ms更新图标避免闪烁
    setTimeout(() => {
      setIsMaximizing(false)
    }, 200)
  }

  return (
    <ActionButton
      onClick={handleToggleFullscreen}
      {...props}
      className="transition-all duration-500 ease-in-out active:scale-90"
      disabled={isMaximizing}
    >
      {isFullscreen ? (
        <LuShrink className="w-4 h-4 text-zinc-300" />
      ) : (
        <LuExpand className="w-4 h-4 text-zinc-300" />
      )}
    </ActionButton>
  )
}
