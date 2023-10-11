import React, { createContext, useReducer } from 'react'
import { queryReducer, initialState } from './queryReducer'
import { Actions, Props, State } from './types'

export const QueryContext = createContext<State>(initialState)
export const QueryDispatchContext = createContext<React.Dispatch<Actions>>(() => undefined)

export const QueryProvider: React.FC<Props> = ({ children }): React.JSX.Element => {
  const [query, dispatch] = useReducer(queryReducer, initialState)

  return (
    <QueryContext.Provider value={query}>
      <QueryDispatchContext.Provider value={dispatch}>{children}</QueryDispatchContext.Provider>
    </QueryContext.Provider>
  )
}
