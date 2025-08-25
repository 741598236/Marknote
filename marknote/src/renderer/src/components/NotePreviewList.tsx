import { ComponentProps } from 'react'
import { NotePreview } from '@/components/'
import { twMerge } from 'tailwind-merge'
import { useNotesList } from '@/hooks/useNotesList'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'

export type NotePreviewListProps = ComponentProps<'ul'> & {
  onSelect?: () => void
}

export const NotePreviewList = ({ onSelect, className, ...props }: NotePreviewListProps) => {
  const { t } = useTranslation()
  const { notes, selectedNoteIndex, handleNoteSelect } = useNotesList({ onSelect })
  if (!notes) return null

  if (isEmpty(notes)) {
    return (
      <ul
        className={twMerge('text-center pt-4 text-gray-500 dark:text-gray-400', className)}
        {...props}
      >
        <span className="text-lg">{t('notes.createFirstNote')}</span>
      </ul>
    )
  }

  return (
    <ul className="className" {...props}>
      {notes.map((note, index) => (
        <NotePreview
          key={note.title + note.lastEditTime}
          isActive={selectedNoteIndex === index}
          onClick={handleNoteSelect(index)}
          {...note}
        />
      ))}
    </ul>
  )
}
