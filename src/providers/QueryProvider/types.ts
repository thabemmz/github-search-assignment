import React from 'react'

export enum QueryReducerActionKindEnum {
  SET_QUERY = 'SET_QUERY',
  SET_FILTERS = 'SET_FILTERS',
  SET_FILTER = 'SET_FILTER',
  REMOVE_FILTER = 'REMOVE_FILTER',
  REMOVE_FILTERS = 'REMOVE_FILTERS',
  SET_SORT = 'SET_SORT',
  REMOVE_SORT = 'REMOVE_SORT',
  SUBMIT = 'SUBMIT',
}

export enum FilterFieldEnum {
  NUMBER_FOLLOWERS = 'NUMBER_FOLLOWERS',
  NUMBER_STARS = 'NUMBER_STARS',
  LANGUAGE = 'LANGUAGE',
}

export enum SortFieldEnum {
  STARS = 'STARS',
  FORKS = 'FORKS',
}

export enum SortDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

type SetQueryAction = {
  type: QueryReducerActionKindEnum.SET_QUERY
  payload: string
}

type SetFilterAction = {
  type: QueryReducerActionKindEnum.SET_FILTER
  payload: {
    field: FilterFieldEnum
    value: string
  }
}

type SetFiltersAction = {
  type: QueryReducerActionKindEnum.SET_FILTERS
  payload: {
    [key in FilterFieldEnum]: string
  }
}

type RemoveFilterAction = {
  type: QueryReducerActionKindEnum.REMOVE_FILTER
  payload: {
    field: FilterFieldEnum
  }
}

type RemoveFiltersAction = {
  type: QueryReducerActionKindEnum.REMOVE_FILTERS
}

type SetSortAction = {
  type: QueryReducerActionKindEnum.SET_SORT
  payload: {
    field: SortFieldEnum
    direction: SortDirectionEnum
  }
}

type RemoveSortAction = {
  type: QueryReducerActionKindEnum.REMOVE_SORT
}

type SubmitAction = {
  type: QueryReducerActionKindEnum.SUBMIT
}

export type State = {
  query: string
  filters: { [key in FilterFieldEnum]?: string } | null
  sort: {
    field: SortFieldEnum
    direction: SortDirectionEnum
  } | null
}

export type Actions =
  | SetQueryAction
  | SetFiltersAction
  | SetFilterAction
  | RemoveFilterAction
  | RemoveFiltersAction
  | SetSortAction
  | RemoveSortAction
  | SubmitAction

export interface Props {
  children?: React.ReactNode
}
