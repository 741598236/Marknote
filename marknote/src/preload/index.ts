import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote, RenameNote } from '@shared/types'
import { contextBridge, ipcRenderer } from 'electron'

// 确保启用了 contextIsolation
if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    platform: process.platform,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
    writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args),
    createNote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke('createNote', ...args),
    renameNote: (...args: Parameters<RenameNote>) => ipcRenderer.invoke('renameNote', ...args),
    deleteNote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke('deleteNote', ...args),
    ipcRenderer: {
      invoke: ipcRenderer.invoke.bind(ipcRenderer),
      send: ipcRenderer.send.bind(ipcRenderer),
      on: ipcRenderer.on.bind(ipcRenderer),
      removeAllListeners: ipcRenderer.removeAllListeners.bind(ipcRenderer)
    }
  })
} catch (error) {
  console.error('Failed to expose APIs to the renderer:', error)
}
