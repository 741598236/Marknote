import {
  selectedNoteAtom,
  renameNoteAtom,
  createEmptyNoteAtom,
  deleteNoteAtom
} from '@renderer/store'
import { useAtomValue, useSetAtom } from 'jotai'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const FloatingNoteTitle = ({ className, ...props }: ComponentProps<'div'>) => {
  const { t } = useTranslation()
  const selectedNote = useAtomValue(selectedNoteAtom)
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    setNewTitle(selectedNote?.title || '')
  }, [selectedNote])

  const createNote = useSetAtom(createEmptyNoteAtom)
  const renameNote = useSetAtom(renameNoteAtom)
  const deleteNote = useSetAtom(deleteNoteAtom)

  const handleSave = async () => {
    setIsEditing(false)

    if (!selectedNote) {
      if (newTitle.trim()) {
        await createNote(newTitle.trim())
      }
      return
    }

    if (newTitle.trim() === '') {
      await deleteNote()
    } else if (newTitle.trim() !== selectedNote.title) {
      await renameNote(newTitle.trim())
    }
  }

  return (
    <div
      className={twMerge('flex justify-center w-full cursor-text', className)}
      {...props}
      onDoubleClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
          className="text-2xl font-extrabold tracking-tight bg-transparent border-b border-gray-400 outline-none px-2 w-full max-w-[80vw]"
        />
      ) : (
        <h1 className="text-2xl font-extrabold tracking-tight truncate max-w-[80vw] px-2">
          {selectedNote ? selectedNote.title : t('notes.doubleClickToCreate')}
        </h1>
      )}
    </div>
  )
}
