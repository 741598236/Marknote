import React, { useState } from 'react'
import { CustomLinkButton } from './CustomLinkButton'
import { LinkManagerPanel } from './LinkManagerPanel'
import { useLinkShortcuts } from '@renderer/hooks/useLinkShortcuts'

interface LinkFeatureIntegrationProps {
  editor: any
  darkMode: boolean
  noteTitle: string
}

export const LinkFeatureIntegration: React.FC<LinkFeatureIntegrationProps> = ({
  editor,
  darkMode,
  noteTitle
}) => {
  const [showLinkManager, setShowLinkManager] = useState(false)
  const [showInsertDialog, setShowInsertDialog] = useState(false)

  const handleInsertLink = () => {
    setShowInsertDialog(true)
  }

  const handleManageLinks = () => {
    setShowLinkManager(true)
  }

  const handleQuickLink = (url: string, title: string) => {
    if (!editor) return
    
    const markdownLink = `[${title}](${url})`
    const selection = editor.getSelection()
    
    if (selection) {
      editor.replaceSelection(markdownLink)
    } else {
      editor.insertText(markdownLink)
    }
  }

  // 集成快捷键
  useLinkShortcuts({
    onInsertLink: handleInsertLink,
    onManageLinks: handleManageLinks,
    onQuickLink: handleQuickLink,
    editor
  })

  return (
    <>
      {/* 工具栏集成 */}
      <div className="flex items-center space-x-2">
        <CustomLinkButton editor={editor} darkMode={darkMode} />
        
        <button
          onClick={handleManageLinks}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
            ${darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          title="管理链接 (Ctrl+Shift+K)"
        >
          📋
        </button>
      </div>

      {/* 链接管理器 */}
      {showLinkManager && (
        <LinkManagerPanel
          noteTitle={noteTitle}
          darkMode={darkMode}
          onClose={() => setShowLinkManager(false)}
        />
      )}
    </>
  )
}