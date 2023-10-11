import { IQueryResult } from "../../types.ts";

export interface IProps {
  query: IQueryResult['forQuery']
  numResults: IQueryResult['numResults']
  results: IQueryResult['results']
}
