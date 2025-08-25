import { NoteInfo } from '@shared/models'

export const notesMocks: NoteInfo[] = [
  {
    title: `Welcome👋`,
    lastEditTime: new Date().getTime(),
    content: `# Welcome to MarkNote

This is your first note! Start writing here...`
  },
  {
    title: `Note 1`,
    lastEditTime: new Date().getTime(),
    content: `# Note 1

This is note 1.`
  },
  {
    title: `Note 2`,
    lastEditTime: new Date().getTime(),
    content: `# Note 2

This is note 2.`
  },
  {
    title: `Note 3`,
    lastEditTime: new Date().getTime(),
    content: `# Note 3

This is note 3.`
  }
]
