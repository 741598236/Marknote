import React, { useState, useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { notesAtom } from '@renderer/store'

interface SmartLinkDialogProps {
  isOpen: boolean
  onClose: () => void
  onInsert: (link: LinkData) => void
  initialUrl?: string
  initialTitle?: string
}

interface LinkData {
  url: string
  title: string
  alt?: string
  isNewTab?: boolean
  isInternal?: boolean
}

interface RecentLink {
  url: string
  title: string
  timestamp: number
}

export const SmartLinkDialog: React.FC<SmartLinkDialogProps> = ({
  isOpen,
  onClose,
  onInsert,
  initialUrl = '',
  initialTitle = ''
}) => {
  const notes = useAtomValue(notesAtom)
  const [url, setUrl] = useState(initialUrl)
  const [title, setTitle] = useState(initialTitle)
  const [alt, setAlt] = useState('')
  const [isNewTab, setIsNewTab] = useState(true)
  const [isInternal, setIsInternal] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState(true)
  const [recentLinks, setRecentLinks] = useState<RecentLink[]>([])
  const [clipboardUrl, setClipboardUrl] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // 加载最近使用的链接
  useEffect(() => {
    const stored = localStorage.getItem('recentLinks')
    if (stored) {
      setRecentLinks(JSON.parse(stored))
    }
  }, [])

  // 检查剪贴板中的URL
  useEffect(() => {
    if (isOpen) {
      checkClipboardForUrl()
    }
  }, [isOpen])

  // 自动验证链接
  useEffect(() => {
    if (url && !isInternal) {
      validateUrl(url)
    } else {
      setIsValid(true)
    }
  }, [url, isInternal])

  const checkClipboardForUrl = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const urlRegex = /(https?:\/\/[^\s]+)/i
      const match = text.match(urlRegex)
      if (match && !url) {
        setClipboardUrl(match[1])
      }
    } catch (error) {
      // 剪贴板权限问题，静默处理
    }
  }

  const validateUrl = async (url: string) => {
    if (!url) {
      setIsValid(true)
      return
    }

    setIsValidating(true)
    
    // 简单的URL格式验证
    const isValidFormat = /^https?:\/\/.+/.test(url)
    setIsValid(isValidFormat)
    setIsValidating(false)
  }

  const handleInsert = () => {
    if (!url.trim()) return

    const linkData: LinkData = {
      url: isInternal ? `#${url}` : url,
      title: title || url,
      alt,
      isNewTab,
      isInternal
    }

    // 保存到最近使用
    const newRecent: RecentLink = {
      url: url,
      title: title || url,
      timestamp: Date.now()
    }

    const updatedRecent = [newRecent, ...recentLinks.filter(l => l.url !== url)].slice(0, 5)
    setRecentLinks(updatedRecent)
    localStorage.setItem('recentLinks', JSON.stringify(updatedRecent))

    onInsert(linkData)
    handleClose()
  }

  const handleClose = () => {
    setUrl('')
    setTitle('')
    setAlt('')
    setIsNewTab(true)
    setIsInternal(false)
    setIsValid(true)
    onClose()
  }

  const useRecentLink = (link: RecentLink) => {
    setUrl(link.url)
    setTitle(link.title)
  }

  const useClipboardUrl = () => {
    setUrl(clipboardUrl)
    setClipboardUrl('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            插入链接
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* 剪贴板URL提示 */}
          {clipboardUrl && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  检测到剪贴板URL
                </span>
                <button
                  onClick={useClipboardUrl}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  使用
                </button>
              </div>
            </div>
          )}

          {/* 链接类型选择 */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isInternal}
                onChange={(e) => setIsInternal(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                内部链接（跳转到其他笔记）
              </span>
            </label>
          </div>

          {/* URL输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {isInternal ? '选择笔记' : '链接地址'}
            </label>
            {isInternal ? (
              <select
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">选择笔记...</option>
                {notes.map(note => (
                  <option key={note.title} value={note.title}>
                    {note.title}
                  </option>
                ))}
              </select>
            ) : (
              <div>
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                {url && (
                  <div className="mt-1">
                    {isValidating ? (
                      <span className="text-sm text-blue-600 dark:text-blue-400">验证中...</span>
                    ) : isValid ? (
                      <span className="text-sm text-green-600 dark:text-green-400">✓ 有效链接</span>
                    ) : (
                      <span className="text-sm text-red-600 dark:text-red-400">✗ 无效链接格式</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 链接标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              链接标题
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isInternal ? "跳转到笔记" : "链接描述"}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* 高级选项 */}
          {!isInternal && (
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isNewTab}
                  onChange={(e) => setIsNewTab(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  在新标签页打开
                </span>
              </label>
            </div>
          )}

          {/* 最近使用 */}
          {recentLinks.length > 0 && !isInternal && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                最近使用
              </label>
              <div className="space-y-1">
                {recentLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => useRecentLink(link)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 truncate"
                  >
                    {link.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md"
          >
            取消
          </button>
          <button
            onClick={handleInsert}
            disabled={!url.trim() || (!isValid && !isInternal)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md"
          >
            插入链接
          </button>
        </div>
      </div>
    </div>
  )
}