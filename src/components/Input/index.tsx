import React, {ChangeEvent, InputHTMLAttributes} from 'react'
import styles from './styles.module.css'

interface IProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  onChange?: (value: string) => void
  value?: string
}

export const Input: React.FC<IProps> = (props): React.JSX.Element => {
  const { onChange, type = 'text', value, ...otherProps } = props

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value
    if (onChange) {
      onChange(newValue)
    }
  }

  return (
    <input className={styles.input} type={type} value={value} onChange={handleOnChange} {...otherProps} />
  )
}
