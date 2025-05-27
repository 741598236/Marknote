import { cn, formatDateFromMs } from '@renderer/utils'
import { NoteInfo } from '@shared/models'
import { ComponentProps } from 'react'

export type NotePreviewProps = NoteInfo & {
  isActive?: boolean
} & ComponentProps<'div'>

export const NotePreview = ({
  title,
  content,
  lastEditTime,
  isActive = false,
  className,
  ...props
}: NotePreviewProps) => {
  return (
    <div
      className={cn(
        'cursor-pointer px-4 py-3 rounded-xl',
        'border border-gray-200/70 dark:border-gray-600/60',
        'shadow-sm dark:shadow-[0_1px_2px_rgba(0,0,0,0.25)]',
        'transform transition-[transform,border-color] duration-300 ease-smooth',
        'ring-0 hover:ring-4 ring-blue-400/20 dark:ring-blue-500/30',
        'hover:scale-[1.015] hover:-translate-y-0.5',
        'active:scale-[0.985]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30',
        isActive && [
          'bg-blue-100/70 dark:bg-blue-900/50',
          'border-blue-400/80 dark:border-blue-300/50',
          'shadow-blue-200/40 dark:shadow-blue-900/20',
          'aria-pressed:bg-blue-200/50 dark:aria-pressed:bg-blue-900/60'
        ],
        !isActive && 'hover:bg-gray-50/80 dark:hover:bg-gray-800/70 hover:border-gray-300/50 dark:hover:border-gray-500/50',
        className
      )}
      {...props}
    >
      <h3 className="mb-1 font-bold truncate text-zinc-800 dark:text-zinc-200">{title}</h3>
      <span className="inline-block w-full text-xs font-light text-left text-zinc-600 dark:text-zinc-400">
        {formatDateFromMs(lastEditTime)}
      </span>
    </div>
  )
}
