import { ActionButton, ActionButtonProps } from '@/components'

import { LuX } from 'react-icons/lu'

export const CloseButton = ({ ...props }: ActionButtonProps) => {
  const handleClose = () => {
    window.electron.ipcRenderer.send('window:close')
  }

  return (
    <ActionButton
      onClick={handleClose}
      className="hover:bg-red-500/20 hover:text-red-500"
      {...props}
    >
      <LuX className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
