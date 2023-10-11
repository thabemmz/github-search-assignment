import React, {ChangeEvent, HTMLInputTypeAttribute} from 'react'

interface IProps {
  disabled?: boolean
  onChange?: (value: string) => void
  placeholder?: string
  type?: HTMLInputTypeAttribute
  value?: string
}

export const Input: React.FC<IProps> = (props): React.JSX.Element => {
  const { disabled, onChange, placeholder, type = 'text' } = props

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <input type={type} disabled={disabled} onChange={handleOnChange} placeholder={placeholder} />
  )
}
