import { isEmpty } from 'lodash'
import { appDirectoryName, fileEncoding, welcomeNoteFilename } from '@shared/constants'
import { app, dialog } from 'electron'
import { readdir, stat, readFile, writeFile } from 'fs/promises' // 使用 promises API
import { ensureDir, remove, rename } from 'fs-extra'
import path, { join } from 'path'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote, RenameNote } from '@shared/types'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

let userSelectedPath: string | null = null
export const getRootDir = async (): Promise<string> => {
  const defaultPath = join(app.getPath('userData'), appDirectoryName)

  if (import.meta.env.PROD) {
    if (!userSelectedPath) {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        title: 'Select Storage Directory',
        defaultPath: defaultPath,
        properties: ['openDirectory', 'createDirectory']
      })
      userSelectedPath = canceled ? defaultPath : filePaths[0]
    }
    return userSelectedPath
  }

  return process.cwd()
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
    await writeFile(join(rootDir, welcomeNoteFilename), content, { encoding: fileEncoding })
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

export const createNote: CreateNote = async (title?: string) => {
  const rootDir = await getRootDir()
  await ensureDir(rootDir)

  if (title) {
    const filePath = join(rootDir, `${title}.md`)
    await writeFile(filePath, '')
    return true
  }

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'Create New Note',
    defaultPath: `${rootDir}/Untitled.md`,
    buttonLabel: 'New',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    return false
  }

  const { dir: parentDir } = path.parse(filePath)

  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Create Failed',
      message: `All notes will be saved in: ${rootDir}`
    })

    return false
  }
  await writeFile(filePath, '')
  return true
}

export const renameNote: RenameNote = async (oldFilename, newFilename) => {
  const rootDir = await getRootDir()
  const oldPath = join(rootDir, `${oldFilename}.md`)
  const newPath = join(rootDir, `${newFilename}.md`)

  try {
    await rename(oldPath, newPath)
    return true
  } catch (error) {
    console.error('重命名笔记失败:', error)
    return false
  }
}

export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = await getRootDir()
  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete Note',
    message: `Are you sure you want to delete ${filename}?`,
    buttons: ['Delete', 'Cancel'], //0是删除，1是取消
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    return false
  }

  await remove(`${rootDir}/${filename}.md`)
  return true
}
