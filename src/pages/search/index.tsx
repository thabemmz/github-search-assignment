import {useContext, useEffect, useState} from 'react'
import { SearchBar } from './components/SearchBar'
import { IQueryResult } from "./types.ts";
import {SearchResults} from "./components/SearchResults";
import { SortOptions } from './components/SortOptions';
import { FilterOptions } from './components/FilterOptions';
import {QueryContext} from '../../providers/QueryProvider'
import {Octokit} from "@octokit/rest";
import {SortFieldEnum,SortDirectionEnum, State, FilterFieldEnum} from "../../providers/QueryProvider/types.ts";
import styles from './styles.module.css'
import {Link} from "react-router-dom";

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
      const requestQuery = query.query

      octokit.rest.search.repos({
        q: constructQuery(query.query, query.filters),
        ...constructSort(query.sort)
      }).then(response => {
        if (response.status === 200 || response.status === 304) {
          return setQueryResult({
            error: null,
            forQuery: requestQuery,
            numResults: response.data.total_count,
            results: response.data.items,
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

    const fieldMap: {[key in SortFieldEnum]: 'stars' | 'forks'} = {
      [SortFieldEnum.STARS]: 'stars',
      [SortFieldEnum.FORKS]: 'forks'
    }

    const orderMap: {[key in SortDirectionEnum]: 'asc' | 'desc'} = {
      [SortDirectionEnum.ASC]: 'asc',
      [SortDirectionEnum.DESC]: 'desc'
    }

    return {
      sort: fieldMap[sort.field],
      order: orderMap[sort.direction],
    }
  }

  const handleErrorResult = (error: string, query: string): void => {
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
        <SearchBar isLoading={isLoading} />
        {hadError && (<p>{queryResult.error}</p>)}
        <Link to={'/history'}>History</Link>
      </div>
      {hadSuccess && (
        <div className={styles.results}>
          <div className={styles.filterbar}>
            <h2>Filter</h2>
            <FilterOptions />
          </div>
          <div className={styles.resultlist}>
            <h2>{queryResult.numResults} results for query "{queryResult.forQuery}"</h2>
            <SortOptions />
            <SearchResults results={queryResult.results} />
        </div>
        </div>
      )}
    </>
  )
}

export default Search
