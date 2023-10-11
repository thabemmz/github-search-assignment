import { QueryReducerActionKindEnum, State, Actions } from './types';
import {Reducer} from "react";

export const queryReducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case QueryReducerActionKindEnum.SET_QUERY:
      return { ...state, query: action.payload }
    case QueryReducerActionKindEnum.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case QueryReducerActionKindEnum.SET_FILTER:
      return { ...state, filters: { ...state.filters, [action.payload.field]: action.payload.value } }
    case QueryReducerActionKindEnum.REMOVE_FILTER:
      // If we have no current filters applied, just return state
      if (!state.filters) return { ...state }

      // If we have filters applied, only return the other filters
      const { [action.payload.field]: _removedFilter, ...otherFilters } = state.filters
      return { ...state, filters: { ...otherFilters } }
    case QueryReducerActionKindEnum.REMOVE_FILTERS:
      return { ...state, filters: initialState.filters }
    case QueryReducerActionKindEnum.SET_SORT:
      return { ...state, sort: action.payload }
    case QueryReducerActionKindEnum.REMOVE_SORT:
      return { ...state, sort: initialState.sort }
    default:
      return { ...state }
  }
}

export const initialState: State = {
  query: '',
  filters: null,
  sort: null,
}
