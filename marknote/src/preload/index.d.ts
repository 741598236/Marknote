// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    //electron: ElectronAPI
    context: {
      locale: string
      getNotes: GetNotes
    }
  }
}
