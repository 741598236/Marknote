import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createNote, deleteNote, getNotes, readNote, writeNote } from '@/lib'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'

function createWindow(): void {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1000, // 窗口宽度
    height: 800, // 窗口高度
    show: false, // 初始不显示窗口
    autoHideMenuBar: true, // 自动隐藏菜单栏
    ...(process.platform === 'linux' ? { icon } : {}), // Linux系统需要设置图标
    center: true,
    title: 'MarkNote',
    frame: false, // 禁用默认的窗口框架
    titleBarStyle: 'hidden', // 隐藏标题栏
    trafficLightPosition: process.platform === 'darwin' ? { x: 15, y: 10 } : undefined, // 仅Mac设置traffic light位置
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // 预加载脚本路径
      sandbox: true, // 沙箱模式
      contextIsolation: true
    }
  })

  // 当窗口准备就绪时显示
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // 加载前端页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 开发模式下开启开发者工具
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }

  // 处理新窗口打开请求
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
}

// 当Electron完成初始化后创建窗口
app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('getNotes', (_, ...args: Parameters<GetNotes>) => getNotes(...args))
  ipcMain.handle('readNote', (_, ...args: Parameters<ReadNote>) => readNote(...args))
  ipcMain.handle('writeNote', (_, ...args: Parameters<WriteNote>) => writeNote(...args))
  ipcMain.handle('createNote', (_, ...args: Parameters<CreateNote>) => createNote(...args))
  ipcMain.handle('deleteNote', (_, ...args: Parameters<DeleteNote>) => deleteNote(...args))

  // Window control handlers
  ipcMain.on('window:minimize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.minimize()
  })

  ipcMain.on('window:maximize', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window?.isMaximized()) {
      window.unmaximize()
    } else {
      window?.maximize()
    }
  })

  ipcMain.on('window:close', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    window?.close()
  })

  ipcMain.handle('window:isMaximized', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    return window?.isMaximized()
  })

  // Fullscreen handlers
  ipcMain.on('window:toggle-fullscreen', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window?.isFullScreen()) {
      window.setFullScreen(false)
      window.webContents.send('window:leave-fullscreen')
    } else {
      window?.setFullScreen(true)
      window.webContents.send('window:enter-fullscreen')
    }
  })

  ipcMain.handle('window:isFullscreen', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    return window?.isFullScreen()
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
