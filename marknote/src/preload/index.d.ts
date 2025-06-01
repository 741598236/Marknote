import { GetNotes, ReadNote, WriteNote, CreateNote, DeleteNote, RenameNote } from '@shared/types'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    //electron: ElectronAPI
    context: {
      locale: string
      platform: string
      getNotes: GetNotes
      readNote: ReadNote
      writeNote: WriteNote
      createNote: CreateNote
      deleteNote: DeleteNote
      renameNote: RenameNote
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>
        send: (channel: string, ...args: any[]) => void
        on: (channel: string, listener: (...args: any[]) => void) => void
        removeAllListeners: (channel: string) => void
      }
    }
  }
}
