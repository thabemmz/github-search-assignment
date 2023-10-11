import {useContext, useEffect, useState} from 'react'
import './styles.css'
import { SearchBar } from './components/SearchBar'
import { IQueryResult } from "./types.ts";
import {SearchResults} from "./components/SearchResults";
import { SortOptions } from './components/SortOptions';
import {QueryContext} from '../../providers/QueryProvider'
import {Octokit} from "@octokit/rest";


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
        q: constructQuery(query.query),
        sort: constructSort(query.sort)
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

  const constructQuery = (query: string): string => {
    const inQualifiers = constructInQualifiers()

    return `${query} ${inQualifiers}`
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
      <div>
        <SearchBar isLoading={isLoading} />
      </div>
      {hadSuccess && (
        <div className='results'>
          <SearchResults results={queryResult.results} numResults={queryResult.numResults} query={queryResult.forQuery} />
        </div>
      )}
      {hadError && (<p>{queryResult.error}</p>)}
    </>
  )
}

export default Search
