import React, { FormEvent } from 'react'
import { Props } from './types'

export const Form: React.FC<Props> = ({ children, onSubmit, ...otherProps }): React.JSX.Element => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(e)
    }
  }

  return (
    <form {...otherProps} onSubmit={handleSubmit}>
      {children}
    </form>
  )
}
