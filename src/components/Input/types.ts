import { InputHTMLAttributes } from 'react'

export interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  onChange?: (value: string) => void
  value?: string
}
