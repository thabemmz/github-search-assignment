import {FilterFieldEnum, SortDirectionEnum, SortFieldEnum, State} from "../../../providers/QueryProvider/types.ts";
import {Endpoints} from "@octokit/types";
import {MappedResult} from "../types.ts";

// All fields in Octokit where we need to search through
const SEARCH_IN = ['name', 'description', 'topics', 'readme']

// The Github API follows a QDSL where in: determines how to search through fields.
// See https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories#search-by-repository-name-description-or-contents-of-the-readme-file
const constructInQualifiers = (): string => {
    return SEARCH_IN.map((qualifier) => `in:${qualifier}`).join(' ')
}

// Given a query and a set of filters, construct a query Github can deal with, according to their QDSL.
// See https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#constructing-a-search-query
export const constructQuery = (query: string, filters: State['filters']): string => {
    const inQualifiers = constructInQualifiers()
    const followers =
        filters && filters[FilterFieldEnum.NUMBER_FOLLOWERS]
            ? `followers:>=${filters[FilterFieldEnum.NUMBER_FOLLOWERS]}`
            : ''
    const stars =
        filters && filters[FilterFieldEnum.NUMBER_STARS] ? `stars:>=${filters[FilterFieldEnum.NUMBER_STARS]}` : ''
    const language = filters && filters[FilterFieldEnum.LANGUAGE] ? `language:${filters[FilterFieldEnum.LANGUAGE]}` : ''

    return `${query} ${inQualifiers} ${followers} ${stars} ${language}`
}

// Given the sort field and direction, construct a sort and order object Github can deal with.
// See https://docs.github.com/en/rest/search/search?apiVersion=2022-11-28#search-repositories
export const constructSort = (sort: State['sort']): { sort?: 'stars' | 'forks'; order?: 'asc' | 'desc' } => {
    if (!sort || !sort.field) {
        return {}
    }

    const fieldMap: { [key in SortFieldEnum]: 'stars' | 'forks' } = {
        [SortFieldEnum.STARS]: 'stars',
        [SortFieldEnum.FORKS]: 'forks',
    }

    const orderMap: { [key in SortDirectionEnum]: 'asc' | 'desc' } = {
        [SortDirectionEnum.ASC]: 'asc',
        [SortDirectionEnum.DESC]: 'desc',
    }

    return {
        sort: fieldMap[sort.field],
        order: orderMap[sort.direction],
    }
}

// Sanitize results that came from Github by ditching obsolete properties and converting properties to more understandable
// property names.
export const sanitizeResults = (
    results: Endpoints['GET /search/repositories']['response']['data']['items']
): Array<MappedResult> =>
    (results || []).map((result) => {
        const mappedResult: MappedResult = {
            id: result.id,
            url: result.html_url,
            name: result.name,
            description: result.description || '',
            stars: result.stargazers_count,
            forks: result.forks,
        }

        if (result.owner) {
            mappedResult.owner = {
                id: result.owner.id,
                url: result.owner.html_url,
                name: result.owner.login,
                avatarUrl: result.owner.avatar_url,
            }
        }

        return mappedResult
    })
