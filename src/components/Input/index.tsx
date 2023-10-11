import React, { ChangeEvent } from 'react'
import styles from './styles.module.css'
import { Props } from './types'

export const Input: React.FC<Props> = (props): React.JSX.Element => {
  const { onChange, type = 'text', value, ...otherProps } = props

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value
    if (onChange) {
      onChange(newValue)
    }
  }

  return <input className={styles.input} type={type} value={value} onChange={handleOnChange} {...otherProps} />
}
