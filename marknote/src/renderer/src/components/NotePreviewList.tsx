import { notesMocks } from '@/store/mocks'
import { ComponentProps } from 'react'
import { NotePreview } from './NotePreview'
import { twMerge } from 'tailwind-merge'

export const NotePreviewList = ({ className, ...props }: ComponentProps<'ul'>) => {
  if (!notesMocks || notesMocks.length === 0) {
    return (
      <ul
        className={twMerge('text-center pt-4 text-gray-500 dark:text-gray-400', className)}
        {...props}
      >
        <span className="text-lg">来创建第一条笔记吧！</span>
      </ul>
    )
  }

  return (
    <ul className="className" {...props}>
      {notesMocks.map((note) => (
        <NotePreview key={note.title + note.lastEditTime} {...note} />
      ))}
    </ul>
  )
}
