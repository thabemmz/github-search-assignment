import {State} from "../../providers/QueryProvider/types";

export interface MappedResult {
    id: number
    url: string
    name: string
    description?: string
    stars: number
    forks: number
    owner?: {
        id: number
        url: string
        name: string
        avatarUrl: string
    }
}

export interface IQueryResult {
    error: string | null
    forQuery: State
    numResults: number | null
    results: Array<MappedResult> | null
}
