/* eslint-disable @typescript-eslint/explicit-function-return-type */
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const dataFormatter = new Intl.DateTimeFormat(window.context.locale, {
  dateStyle: 'short',
  timeStyle: 'short'
})

export const formatDateFromMs = (ms: number) => dataFormatter.format(ms)

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}
