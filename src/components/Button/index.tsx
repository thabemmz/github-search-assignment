import React from 'react'
import { Props } from './types'
import styles from './styles.module.css'

export const Button: React.FC<Props> = ({children, className}): React.JSX.Element => {
  return (
    <button className={`${className || ''} ${styles.button}`}>{children}</button>
  )
}
