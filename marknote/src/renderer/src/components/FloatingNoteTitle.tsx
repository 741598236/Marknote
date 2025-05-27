import { selectedNoteAtom } from '@renderer/store'
import { useAtomValue } from 'jotai'
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const FloatingNoteTitle = ({ className, ...props }: ComponentProps<'div'>) => {
  const selectedNote = useAtomValue(selectedNoteAtom)

  if (!selectedNote) return null

  return (
    <div className={twMerge('flex justify-center w-full', className)} {...props}>
      <h1 className="text-2xl font-extrabold tracking-tight truncate max-w-[80vw] px-2">
        {selectedNote.title}
      </h1>
    </div>
  )
}
