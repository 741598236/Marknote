import { GetNotes, ReadNote, WriteNote, CreateNote, DeleteNote } from '@shared/types'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    //electron: ElectronAPI
    context: {
      locale: string
      getNotes: GetNotes
      readNote: ReadNote
      writeNote: WriteNote
      createNote: CreateNote
      deleteNote: DeleteNote
    }
  }
}
