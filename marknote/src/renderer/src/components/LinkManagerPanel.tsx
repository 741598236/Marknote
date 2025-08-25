import React, { useState, useEffect, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { useTranslation } from 'react-i18next'
import { notesAtom } from '@renderer/store'
import { useLinkManager } from '@renderer/hooks/useLinkManager'


interface LinkManagerPanelProps {
  noteTitle: string
  darkMode: boolean
  onClose: () => void
}

export const LinkManagerPanel: React.FC<LinkManagerPanelProps> = ({
  noteTitle,
  darkMode,
  onClose
}) => {
  const { t } = useTranslation()
  const notes = useAtomValue(notesAtom)
  const {
    getNoteLinks,
    getAllLinksStats,
    validateInternalLinks,
    searchNotesByLink,
    batchReplaceLinks
  } = useLinkManager()

  const [activeTab, setActiveTab] = useState<'current' | 'all' | 'broken'>('current')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLink, setSelectedLink] = useState<string | null>(null)

  const currentNoteLinks = getNoteLinks(noteTitle)
  const allLinksStats = getAllLinksStats()
  const brokenLinks = validateInternalLinks() || []

  const getFilteredLinks = () => {
    switch (activeTab) {
      case 'current':
        return currentNoteLinks.filter(link => 
          link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      case 'all':
        return allLinksStats.notes.flatMap(note => note.links).filter(link =>
          link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
          link.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      case 'broken':
        return brokenLinks.filter(link =>
          link.url.toLowerCase().includes(searchQuery.toLowerCase())
        )
      default:
        return []
    }
  }

  const handleReplaceLink = (oldUrl: string, newUrl: string, newTitle?: string) => {
    const updatedNotes = batchReplaceLinks(oldUrl, newUrl, newTitle)
    // 这里需要触发笔记内容的更新
    console.log('批量替换完成', updatedNotes)
  }

  const handleRemoveLink = (url: string) => {
    handleReplaceLink(url, '')
  }

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className={`${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-900'} 
        rounded-lg shadow-xl w-full max-w-4xl h-[80vh] max-h-[800px] flex flex-col`}>
        
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">链接管理器</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'current'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('notes.currentNote')} ({currentNoteLinks.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'all'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('notes.allNotes')} ({allLinksStats.totalLinks})
          </button>
          <button
            onClick={() => setActiveTab('broken')}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'broken'
                ? 'border-b-2 border-red-500 text-red-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t('link.brokenLinks')} ({brokenLinks.length})
          </button>
        </div>

        <div className="p-4">
          <input
            type="text"
            placeholder={t('link.searchLinks')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                : 'bg-gray-50 border-gray-300 text-gray-900'
            }`}
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {getFilteredLinks().map((link, index) => (
              <div
                key={`${link.url}-${index}`}
                className={`p-3 border rounded-md ${
                  darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        link.isInternal 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                      }`}>
                        {link.isInternal ? '内部' : '外部'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {link.context || '当前笔记'}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <a
                        href={link.url}
                        target={link.isInternal ? '_self' : '_blank'}
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        {link.title || link.url}
                      </a>
                      <div className="text-xs text-gray-500 mt-1">
                        {link.url}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedLink(link.url)}
                      className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleRemoveLink(link.url)}
                      className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>总计: {getFilteredLinks().length} 个链接</p>
            {activeTab === 'all' && (
              <p>
                内部链接: {allLinksStats.internalLinks} | 
                外部链接: {allLinksStats.externalLinks}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}