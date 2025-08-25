import { useEffect, useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { notesAtom } from '@renderer/store'

interface LinkShortcutsProps {
  onInsertLink: () => void
  onManageLinks: () => void
  onQuickLink: (url: string, title: string) => void
  editor?: any
}

export const useLinkShortcuts = ({
  onInsertLink,
  onManageLinks,
  onQuickLink,
  editor
}: LinkShortcutsProps) => {
  const notes = useAtomValue(notesAtom)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ctrl/Cmd + K: 打开插入链接对话框
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault()
      onInsertLink()
      return
    }

    // Ctrl/Cmd + Shift + K: 打开链接管理器
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'K') {
      event.preventDefault()
      onManageLinks()
      return
    }

    // Ctrl/Cmd + Shift + L: 快速插入最近使用的链接
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'L') {
      event.preventDefault()
      const recentLinks = getRecentLinks()
      if (recentLinks.length > 0) {
        const lastLink = recentLinks[0]
        onQuickLink(lastLink.url, lastLink.title)
      }
      return
    }

    // Alt + 数字: 快速插入第N个最近链接
    if (event.altKey && /^[1-9]$/.test(event.key)) {
      event.preventDefault()
      const index = parseInt(event.key) - 1
      const recentLinks = getRecentLinks()
      if (recentLinks[index]) {
        const link = recentLinks[index]
        onQuickLink(link.url, link.title)
      }
      return
    }

    // Ctrl/Cmd + Shift + V: 智能粘贴为链接
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'V') {
      event.preventDefault()
      handleSmartPaste()
      return
    }
  }, [onInsertLink, onManageLinks, onQuickLink, editor])

  const getRecentLinks = () => {
    try {
      const stored = localStorage.getItem('recent-links')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const handleSmartPaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      
      if (!clipboardText) return

      // 检查是否为URL
      const urlRegex = /^(https?:\/\/|www\.|#)[^\s]+$/i
      if (urlRegex.test(clipboardText.trim())) {
        const url = clipboardText.trim()
        const title = await getUrlTitle(url) || url
        onQuickLink(url, title)
        return
      }

      // 检查是否为内部链接格式
      if (clipboardText.startsWith('#')) {
        const noteTitle = clipboardText.substring(1)
        const note = notes.find(n => n.title === noteTitle)
        if (note) {
          onQuickLink(clipboardText, note.title)
          return
        }
      }

      // 如果不是URL，尝试从选中文本创建搜索链接
      if (editor) {
        const selection = editor.getSelection()
        if (selection) {
          const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(selection)}`
          onQuickLink(searchUrl, selection)
        }
      }
    } catch (error) {
      console.error('智能粘贴失败:', error)
    }
  }

  const getUrlTitle = async (url: string): Promise<string | null> => {
    try {
      // 对于内部链接
      if (url.startsWith('#')) {
        const noteTitle = url.substring(1)
        const note = notes.find(n => n.title === noteTitle)
        return note ? note.title : null
      }

      // 对于外部链接，这里可以添加获取网页标题的逻辑
      // 由于是本地应用，暂时返回URL作为标题
      return new URL(url).hostname
    } catch {
      return null
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return {
    getRecentLinks,
    handleSmartPaste
  }
}