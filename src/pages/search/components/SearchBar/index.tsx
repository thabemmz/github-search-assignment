import React, { useContext, useState } from 'react'
import { Input } from '../../../../components/Input'
import { Form } from '../../../../components/Form'
import { Button } from '../../../../components/Button'
import { QueryDispatchContext } from '../../../../providers/QueryProvider'
import { QueryReducerActionKindEnum } from '../../../../providers/QueryProvider/types'
import { Props } from './types'
import styles from './styles.module.css'

export const SearchBar: React.FC<Props> = ({ isLoading }): React.JSX.Element => {
  const [query, setQuery] = useState<string>('')
  const dispatch = useContext(QueryDispatchContext)

  const handleSubmit = () => {
    dispatch({ type: QueryReducerActionKindEnum.SET_QUERY, payload: query })
  }

  return (
    <Form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.label} htmlFor={'query'}>
        Search for Github repositories
      </label>
      <Input id="query" type="text" onChange={setQuery} value={query} disabled={isLoading} />
      <Button>{isLoading ? `Loading...` : `Submit`}</Button>
    </Form>
  )
}
