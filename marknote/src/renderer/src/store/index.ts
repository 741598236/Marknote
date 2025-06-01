import { NoteContent } from './../../../shared/models'
import { NoteInfo } from '@shared/models'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

const loadNotes = async () => {
  const notes = await window.context.getNotes()
  return notes.sort((a, b) => b.lastEditTime - a.lastEditTime)
}

const notesAtomAsync = atom<NoteInfo[] | Promise<NoteInfo[]>>(loadNotes())

export const notesAtom = unwrap(notesAtomAsync, (prev) => prev)

export const selectedNoteIndexAtom = atom<number | null>(null)

const selectedNoteAtomAsync = atom(async (get) => {
  const notes = get(notesAtom)
  const selectedNoteIndex = get(selectedNoteIndexAtom)

  if (selectedNoteIndex == null || !notes) return null

  const selectedNote = notes[selectedNoteIndex]

  const noteContent = await window.context.readNote(selectedNote.title)

  return {
    ...selectedNote,
    content: noteContent
  }
})

export const selectedNoteAtom = unwrap(
  selectedNoteAtomAsync,
  (prev) =>
    prev ?? {
      title: '',
      content: '',
      lastEditTime: Date.now()
    }
)

export const createEmptyNoteAtom = atom(null, async (get, set, noteTitle?: string) => {
  const notes = get(notesAtom)

  if (!notes) return

  if (!noteTitle) {
    const title = await window.context.createNote()
    if (!title) return

    const newNote: NoteInfo = {
      title,
      lastEditTime: Date.now()
    }

    const updatedNotes = [newNote, ...notes.filter((note) => note.title !== newNote.title)]
    set(
      notesAtom,
      updatedNotes.sort((a, b) => b.lastEditTime - a.lastEditTime)
    )
    set(selectedNoteIndexAtom, 0)
    return
  }

  const title = await window.context.createNote(noteTitle)
  if (!title) return

  const newNote: NoteInfo = {
    title,
    lastEditTime: Date.now()
  }

  const updatedNotes = [newNote, ...notes.filter((note) => note.title !== newNote.title)]
  set(
    notesAtom,
    updatedNotes.sort((a, b) => b.lastEditTime - a.lastEditTime)
  )
  set(selectedNoteIndexAtom, 0)
})

export const renameNoteAtom = atom(null, async (get, set, newTitle: string) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  const isRenamed = await window.context.renameNote(selectedNote.title, newTitle)
  if (!isRenamed) return

  set(
    notesAtom,
    notes.map((note) => {
      if (note.title === selectedNote.title) {
        return {
          ...note,
          title: newTitle
        }
      }
      return note
    })
  )
})

export const deleteNoteAtom = atom(null, async (get, set) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)

  if (!selectedNote || !notes) return

  const isDelete = await window.context.deleteNote(selectedNote.title)
  if (!isDelete) return

  const updatedNotes = notes.filter((note) => note.title !== selectedNote.title)
  set(
    notesAtom,
    updatedNotes.sort((a, b) => b.lastEditTime - a.lastEditTime)
  )
  set(selectedNoteIndexAtom, null)
})

export const saveNoteAtom = atom(null, async (get, set, newContent: NoteContent) => {
  const notes = get(notesAtom)
  const selectedNote = get(selectedNoteAtom)
  if (!selectedNote || !notes) return

  await window.context.writeNote(selectedNote.title, newContent)

  set(
    notesAtom,
    notes.map((note) => {
      if (note.title === selectedNote.title) {
        return {
          ...note,
          lastEditTime: Date.now()
        }
      }

      return note
    })
  )
})
