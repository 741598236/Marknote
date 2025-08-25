import React, { useState } from 'react'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { notesAtom } from '@renderer/store'
import { SmartLinkDialog } from './SmartLinkDialog'
import { useLinkManager } from '@renderer/hooks/useLinkManager'

interface CustomLinkButtonProps {
  editor: any
  darkMode: boolean
}

export const CustomLinkButton: React.FC<CustomLinkButtonProps> = ({ editor, darkMode }) => {
  const [showDialog, setShowDialog] = useState(false)
  const { t } = useTranslation()
  const notes = useAtomValue(notesAtom)
  const { getNoteLinks } = useLinkManager()

  const handleInsertLink = (linkData: { url: string; title: string; alt?: string }) => {
    if (!editor) return

    const { url, title, alt } = linkData
    const markdownLink = title ? `[${title}](${url})` : `[${url}](${url})`
    
    // 获取当前选中的文本
    const selection = editor.getSelection()
    const text = selection || title || url
    
    // 替换选中文本或插入新链接
    if (selection) {
      editor.replaceSelection(`[${text}](${url})`)
    } else {
      editor.insertText(`[${text}](${url})`)
    }
    
    setShowDialog(false)
  }

  const handleQuickInsert = (url: string, title: string) => {
    handleInsertLink({ url, title })
  }

  const getRecentLinks = () => {
    try {
      const stored = localStorage.getItem('recent-links')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
          ${darkMode 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        title={t('link.insertLink')}
      >
        🔗
      </button>

      {showDialog && (
        <SmartLinkDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          onInsert={handleInsertLink}
        />
      )}
    </>
  )
}