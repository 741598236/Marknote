import { DeleteNoteButton, NewNoteButton } from '@/components'

export const ActionButtonsRow = ({ ...props }) => {
  return (
    <div {...props}>
      <NewNoteButton />
      <DeleteNoteButton />
    </div>
  )
}
