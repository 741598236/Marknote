import { ActionButton, ActionButtonProps } from '@/components'

import { LuMinus } from 'react-icons/lu'

export const MinimizeButton = ({ ...props }: ActionButtonProps) => {
  const handleMinimize = () => {
    window.context.ipcRenderer.send('window:minimize')
  }

  return (
    <ActionButton onClick={handleMinimize} {...props}>
      <LuMinus className="w-4 h-4 text-zinc-300" />
    </ActionButton>
  )
}
