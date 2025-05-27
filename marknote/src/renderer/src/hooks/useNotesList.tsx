import { selectedNoteIndexAtom } from '@renderer/store'
import { notesAtom } from '@/store'
import { useAtom, useAtomValue } from 'jotai'

export const useNotesList = ({ onSelect }: { onSelect?: () => void }) => {
  const notes = useAtomValue(notesAtom)

  const [selectedNoteIndex, setSelectedNotedIndex] = useAtom(selectedNoteIndexAtom)

  const handleNoteSelect = (index: number) => async () => {
    setSelectedNotedIndex(index)

    if (onSelect) {
      onSelect()
    }
  }

  return {
    notes,
    selectedNoteIndex,
    handleNoteSelect
  }
}
