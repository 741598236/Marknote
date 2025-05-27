import { ActionButton, ActionButtonProps } from '@/components'
import { JSX } from 'react'
import { LuSignature } from 'react-icons/lu'

export const NewNoteButton = ({ ...props }: ActionButtonProps): JSX.Element => {
  return (
    <ActionButton {...props}>
      <LuSignature className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
