import { ComponentProps, JSX } from 'react'
import { twMerge } from 'tailwind-merge'

export type ActionButtonProps = ComponentProps<'button'>

export const ActionButton = ({ className, children, ...props }: ActionButtonProps): JSX.Element => {
  return (
    <button
      className={twMerge(
        'px-3 py-2 rounded-lg border border-zinc-300/50 hover:bg-zinc-500/50 transition-colors duration-200',
        'text-zinc-700 dark:text-zinc-200',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
