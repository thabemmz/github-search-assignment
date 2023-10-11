import React, {useContext, useState} from 'react'
import { Input } from "../../../../components/Input";
import { Form } from "../../../../components/Form";
import { QueryDispatchContext } from "../../../../providers/QueryProvider";
import { QueryReducerActionKindEnum } from "../../../../providers/QueryProvider/types";
import { IProps } from './types'

export const SearchBar: React.FC<IProps> = ({ isLoading }): React.JSX.Element => {
  const [query, setQuery] = useState<string>('')
  const dispatch = useContext(QueryDispatchContext);

  const handleSubmit = () => {
    dispatch({ type: QueryReducerActionKindEnum.SET_QUERY, payload: query })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input type="text" onChange={setQuery} value={query} disabled={isLoading} />
      <button>{isLoading ? `Submitting...` : `Submit`}</button>
    </Form>
  )
}
