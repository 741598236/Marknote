import { ActionButton, ActionButtonProps } from '@/components'

import { LuMaximize2, LuMinimize2 } from 'react-icons/lu'
import { useEffect, useState } from 'react'

export const MaximizeButton = ({ ...props }: ActionButtonProps) => {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    let isMounted = true

    const updateMaximizedState = async () => {
      try {
        const maximized = await window.Electron.ipcRenderer.invoke('window:isMaximized')
        if (isMounted) setIsMaximized(maximized)
      } catch (error) {
        console.error('Failed to get window maximize state:', error)
        // 设置默认值
        if (isMounted) setIsMaximized(false)
      }
    }

    updateMaximizedState()

    // 监听窗口状态变化
    const onMaximized = () => isMounted && setIsMaximized(true)
    const onUnmaximized = () => isMounted && setIsMaximized(false)

    window.electron.ipcRenderer.on('window:maximized', onMaximized)
    window.electron.ipcRenderer.on('window:unmaximized', onUnmaximized)

    return () => {
      isMounted = false
      window.electron.ipcRenderer.removeAllListeners('window:maximized', onMaximized)
      window.electron.ipcRenderer.removeAllListeners('window:unmaximized', onUnmaximized)
    }
  }, [])

  const handleMaximize = () => {
    window.electron.ipcRenderer.send('window:maximize')
  }

  return (
    <ActionButton onClick={handleMaximize} {...props}>
      {isMaximized ? (
        <LuMinimize2 className="w-4 h-4 text-zinc-300" />
      ) : (
        <LuMaximize2 className="w-4 h-4 text-zinc-300" />
      )}
    </ActionButton>
  )
}
