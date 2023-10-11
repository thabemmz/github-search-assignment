import { Endpoints } from "@octokit/types";

export interface IQueryResult {
  error: string | null
  forQuery: string
  numResults: number | null
  results: Endpoints["GET /search/repositories"]['response']['data']['items'] | null
}
