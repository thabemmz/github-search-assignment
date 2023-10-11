import {useContext, useEffect, useState} from 'react'
import {SearchBar} from './components/SearchBar'
import {IQueryResult, MappedResult} from "./types";
import {SearchResults} from "./components/SearchResults";
import {SortOptions} from './components/SortOptions';
import {FilterOptions} from './components/FilterOptions';
import {QueryContext} from '../../providers/QueryProvider'
import {Octokit} from "@octokit/rest";
import {SortFieldEnum, SortDirectionEnum, State, FilterFieldEnum} from "../../providers/QueryProvider/types";
import styles from './styles.module.css'
import {Link} from "react-router-dom";
import {db} from '../../utils/db'
import {Endpoints} from "@octokit/types";

const octokit = new Octokit({
    userAgent: 'github-search-assignment v1.0.0'
})

const SEARCH_IN = [
    'name',
    'description',
    'topics',
    'readme'
]

function Search() {
    const [queryResult, setQueryResult] = useState<IQueryResult | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const query = useContext(QueryContext)

    useEffect(() => {
        if (query.query) {
            // Always start loading to prevent double submits
            setIsLoading(true)

            // Create a clone of the query to make sure the query state isn't modified when getting the response.
            const requestQuery = {...query}

            octokit.rest.search.repos({
                q: constructQuery(query.query, query.filters),
                ...constructSort(query.sort)
            }).then(response => {
                if (response.status === 200 || response.status === 304) {
                    return setQueryResult({
                        error: null,
                        forQuery: requestQuery,
                        numResults: response.data.total_count,
                        results: sanitizeResults(response.data.items),
                    })
                }

                if (response.status === 403) {
                    // Rate limits!
                    return handleErrorResult('Rate limit exceeded, please try again later.', requestQuery)
                }

                return handleErrorResult('An error occurred, please try again.', requestQuery)
            }).catch(_e => {
                return handleErrorResult('An error occurred, please try again.', requestQuery)
            }).finally(() => {
                // We've either finished successfully or errored, but we have a response, so stop loading.
                setIsLoading(false)
            })
        }
    }, [query])

    useEffect(() => {
        if (!queryResult) {
            return
        }

        db.transaction('rw', db.queries, db.repos, db.owners, function () {
            return db.queries.add({...queryResult.forQuery, timestamp: new Date()}).then((queryId) => {
                (queryResult.results || []).slice(0, 10).forEach(result => {
                    const {owner, ...otherResultProps} = result

                    db.repos.add({
                        ...otherResultProps,
                        queryId,
                    }).then((repoId) => {
                        if (!owner) {
                            return
                        }

                        db.owners.add({
                            ...owner,
                            repoId: repoId,
                        })
                    });
                })
            });
        }).catch(function (error) {
            console.error(error.stack || error);
        });
    }, [queryResult])

    const hadSuccess = queryResult && !queryResult.error
    const hadError = queryResult && queryResult.error

    const constructInQualifiers = (): string => {
        return SEARCH_IN.map(qualifier => `in:${qualifier}`).join(' ')
    }

    const constructQuery = (query: string, filters: State['filters']): string => {
        const inQualifiers = constructInQualifiers()
        const followers = filters && filters[FilterFieldEnum.NUMBER_FOLLOWERS] ? `followers:>=${filters[FilterFieldEnum.NUMBER_FOLLOWERS]}` : ''
        const stars = filters && filters[FilterFieldEnum.NUMBER_STARS] ? `stars:>=${filters[FilterFieldEnum.NUMBER_STARS]}` : ''
        const language = filters && filters[FilterFieldEnum.LANGUAGE] ? `language:${filters[FilterFieldEnum.LANGUAGE]}` : ''

        return `${query} ${inQualifiers} ${followers} ${stars} ${language}`
    }

    const constructSort = (sort: State['sort']): { sort?: 'stars' | 'forks', order?: 'asc' | 'desc' } => {
        if (!sort || !sort.field) {
            return {}
        }

        const fieldMap: { [key in SortFieldEnum]: 'stars' | 'forks' } = {
            [SortFieldEnum.STARS]: 'stars',
            [SortFieldEnum.FORKS]: 'forks'
        }

        const orderMap: { [key in SortDirectionEnum]: 'asc' | 'desc' } = {
            [SortDirectionEnum.ASC]: 'asc',
            [SortDirectionEnum.DESC]: 'desc'
        }

        return {
            sort: fieldMap[sort.field],
            order: orderMap[sort.direction],
        }
    }

    const sanitizeResults = (results: Endpoints['GET /search/repositories']['response']['data']['items']): Array<MappedResult> => (results || []).map(result => ({
        id: result.id,
        url: result.html_url,
        name: result.name,
        description: result.description || '',
        stars: result.stargazers_count,
        forks: result.forks,
        owner: result.owner ? {
            id: result.owner.id,
            url: result.owner.html_url,
            name: result.owner.login,
            avatarUrl: result.owner.avatar_url,
        } : undefined
    }))

    const handleErrorResult = (error: string, query: State): void => {
        setQueryResult({
            error,
            forQuery: query,
            numResults: null,
            results: null,
        })
    }

    return (
        <>
            <div className={styles.searchbar}>
                <SearchBar isLoading={isLoading}/>
                {hadError && (<p>{queryResult.error}</p>)}
                <Link to={'/history'}>History</Link>
            </div>
            {hadSuccess && (
                <div className={styles.results}>
                    <div className={styles.filterbar}>
                        <h2>Filter</h2>
                        <FilterOptions/>
                    </div>
                    <div className={styles.resultlist}>
                        <h2>{queryResult.numResults} results for query "{queryResult.forQuery.query}"</h2>
                        <SortOptions/>
                        {queryResult.results && <SearchResults results={queryResult.results}/>}
                    </div>
                </div>
            )}
        </>
    )
}

export default Search
