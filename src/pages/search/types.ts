import { Endpoints } from "@octokit/types";

export enum QueryReducerActionKindEnum {
  SET_QUERY = 'SET_QUERY',
  SET_FILTER = 'SET_FILTER',
  REMOVE_FILTER = 'REMOVE_FILTER',
  REMOVE_FILTERS = 'REMOVE_FILTERS',
  SET_SORT = 'SET_SORT',
  REMOVE_SORT = 'REMOVE_SORT',
  SUBMIT = 'SUBMIT'
}

enum FilterFieldEnum {
  NUMBER_FOLLOWERS = 'NUMBER_FOLLOWERS',
  NUMBER_STARS = 'NUMBER_STARS',
  LANGUAGE = 'LANGUAGE'
}

enum SortFieldEnum {
  STARS = 'STARS',
  FORKS = 'FORKS'
}

enum SortDirectionEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IQueryResult {
  error: string | null
  forQuery: string
  numResults: number | null
  results: Endpoints["GET /search/repositories"]['response']['data']['items'] | null
}

export interface Request {
  query: string,
    filters: Array<{
    field: FilterFieldEnum,
    value: string,
  }>,
    sort: {
    field: SortFieldEnum,
      direction: SortDirectionEnum
  } | null
}
