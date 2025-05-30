import { GetNotes } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

// 确保启用了 contextIsolation
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args)
  })
} catch (error) {
  console.error('Failed to expose APIs to the renderer:', error)
}
