import { QueryReducerActionKindEnum, State, Actions } from './types';
import {Reducer} from "react";

export const queryReducer: Reducer<State, Actions> = (state, action) => {
  switch (action.type) {
    case QueryReducerActionKindEnum.SET_QUERY:
      return { ...state, query: action.payload }
    case QueryReducerActionKindEnum.SET_FILTER:
      return { ...state, filters: [...state.filters, action.payload] }
    case QueryReducerActionKindEnum.REMOVE_FILTER:
      return { ...state, filters: state.filters.filter(filter => filter.field !== action.payload.field) }
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
  filters: [],
  sort: null,
}
