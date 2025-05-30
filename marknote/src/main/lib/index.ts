import { appDirectoryName, fileEncoding } from '@shared/constants'
import { app, dialog } from 'electron'
import { readdir, stat } from 'fs/promises' // 使用 promises API
import { ensureDir } from 'fs-extra'
import { join } from 'path'
import { GetNotes } from '@shared/types'

export const getRootDir = async (): Promise<string> => {
  const defaultPath = join(app.getPath('userData'), appDirectoryName)

  // 生产环境下让用户选择存储位置
  if (import.meta.env.PROD) {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: '选择存储目录',
      defaultPath: defaultPath,
      properties: ['openDirectory', 'createDirectory']
    })
    return canceled ? defaultPath : join(filePaths[0], appDirectoryName)
  }

  // 开发环境下用当前目录（方便调试）
  return join(process.cwd(), appDirectoryName)
}

export const getNotes: GetNotes = async () => {
  const rootDir = await getRootDir() // 需要 await

  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))
  return Promise.all(notes.map(getNoteInfoFromFilename))
}

export const getNoteInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
  const rootDir = await getRootDir() // 需要 await
  const filePath = join(rootDir, filename) // 使用 join 而不是字符串拼接
  const fileStats = await stat(filePath)

  return {
    title: filename.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

interface NoteInfo {
  title: string
  lastEditTime: number
}
