import { useState, useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { notesAtom } from '@renderer/store'

export interface LinkInfo {
  url: string
  title: string
  alt?: string
  isNewTab?: boolean
  isInternal?: boolean
  position?: number
  context?: string
}

export const useLinkManager = () => {
  const notes = useAtomValue(notesAtom)

  // 分析笔记中的所有链接
  const extractLinks = (content: string): LinkInfo[] => {
    const links: LinkInfo[] = []
    
    // 匹配Markdown链接 [title](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    let match
    
    while ((match = markdownLinkRegex.exec(content)) !== null) {
      const [fullMatch, title, url] = match
      links.push({
        url,
        title,
        position: match.index,
        context: content.substring(Math.max(0, match.index - 20), match.index + fullMatch.length + 20),
        isInternal: url.startsWith('#'),
        isNewTab: !url.startsWith('#')
      })
    }
    
    return links
  }

  // 获取笔记中的所有链接
  const getNoteLinks = (noteTitle: string): LinkInfo[] => {
    const note = notes.find(n => n.title === noteTitle)
    if (!note) return []
    
    return extractLinks(note.content)
  }

  // 获取所有笔记的链接统计
  const getAllLinksStats = () => {
    const stats = {
      totalLinks: 0,
      internalLinks: 0,
      externalLinks: 0,
      brokenLinks: 0,
      notes: [] as Array<{ title: string; links: LinkInfo[] }>
    }

    notes.forEach(note => {
      const links = extractLinks(note.content)
      stats.notes.push({ title: note.title, links })
      stats.totalLinks += links.length
      
      links.forEach(link => {
        if (link.isInternal) {
          stats.internalLinks++
        } else {
          stats.externalLinks++
        }
      })
    })

    return stats
  }

  // 检查内部链接是否有效
  const validateInternalLinks = () => {
    const noteTitles = new Set(notes.map(n => n.title))
    const brokenLinks: LinkInfo[] = []

    notes.forEach(note => {
      const links = extractLinks(note.content)
      links.forEach(link => {
        if (link.isInternal) {
          const targetTitle = link.url.substring(1) // 去掉#
          if (!noteTitles.has(targetTitle)) {
            brokenLinks.push({ ...link, context: note.title })
          }
        }
      })
    })

    return brokenLinks
  }

  // 搜索包含特定链接的笔记
  const searchNotesByLink = (searchUrl: string) => {
    return notes.filter(note => {
      const links = extractLinks(note.content)
      return links.some(link => link.url.includes(searchUrl))
    })
  }

  // 批量替换链接
  const batchReplaceLinks = (oldUrl: string, newUrl: string, newTitle?: string) => {
    return notes.map(note => {
      let newContent = note.content
      
      // 替换Markdown链接
      const regex = new RegExp(`\\[([^\\]]*)\\]\\(${oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g')
      newContent = newContent.replace(regex, newTitle ? `[$1](${newUrl})` : `[$1](${newUrl})`)
      
      return {
        ...note,
        content: newContent
      }
    })
  }

  return {
    extractLinks,
    getNoteLinks,
    getAllLinksStats,
    validateInternalLinks,
    searchNotesByLink,
    batchReplaceLinks
  }
}