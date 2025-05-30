import { isEmpty } from 'lodash'
import { appDirectoryName, fileEncoding, welcomeNoteFilename } from '@shared/constants'
import { app, dialog } from 'electron'
import { readdir, stat, readFile, writeFile } from 'fs/promises' // 使用 promises API
import { ensureDir, remove } from 'fs-extra'
import path, { join } from 'path'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

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
  if (isEmpty(notes)) {
    const content = await readFile(welcomeNoteFile, { encoding: fileEncoding })
    await writeFile(`${rootDir}/${welcomeNoteFilename}`, content, { encoding: fileEncoding })
    notes.push(welcomeNoteFilename)
  }
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

export const readNote: ReadNote = async (filename) => {
  const rootDir = await getRootDir() // 添加 await
  return readFile(join(rootDir, `${filename}.md`), { encoding: fileEncoding })
}

export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = await getRootDir()

  return writeFile(join(rootDir, `${filename}.md`), content, { encoding: fileEncoding })
}

export const createNote: CreateNote = async () => {
  const rootDir = await getRootDir()
  await ensureDir(rootDir)
  const { filePath, canceled } = await dialog.showSaveDialog({
    title: '创建新笔记',
    defaultPath: `${rootDir}/Untitled.md`,
    buttonLabel: `新建`,
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)

  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: '创建失败',
      message: `所有文件必须创建在 ${rootDir}目录下.
      不可以选择别的目录创建!`
    })

    return false
  }
  await writeFile(filePath, '')
  return filename
}

export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = await getRootDir()
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: '删除笔记',
    message: `确定要删除${filename}吗？`,
    buttons: ['删除', '取消'], //0是删除，1是取消
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    return false
  }

  await remove(`${rootDir}/${filename}.md`)
  return true
}
