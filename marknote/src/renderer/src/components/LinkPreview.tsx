import React, { useState, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { notesAtom } from '@renderer/store'

interface LinkPreviewProps {
  url: string
  title: string
  onEdit: () => void
  onRemove: () => void
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  url,
  title,
  onEdit,
  onRemove
}) => {
  const notes = useAtomValue(notesAtom)
  const [isHovered, setIsHovered] = useState(false)
  const [isInternal, setIsInternal] = useState(false)
  const [targetNote, setTargetNote] = useState<any>(null)

  useEffect(() => {
    if (url.startsWith('#')) {
      setIsInternal(true)
      const noteTitle = url.substring(1)
      const note = notes.find(n => n.title === noteTitle)
      setTargetNote(note)
    }
  }, [url, notes])

  const getDisplayUrl = () => {
    if (isInternal) {
      return `📄 ${targetNote?.title || '未找到笔记'}`
    }
    return url.length > 50 ? url.substring(0, 50) + '...' : url
  }

  return (
    <div
      className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={url}
        target={isInternal ? '_self' : '_blank'}
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
        title={url}
      >
        {title || getDisplayUrl()}
      </a>
      
      {isHovered && (
        <div className="flex space-x-1">
          <button
            onClick={onEdit}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            title="编辑链接"
          >
            ✏️
          </button>
          <button
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700"
            title="删除链接"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}