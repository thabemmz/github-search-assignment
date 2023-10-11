import React, { useContext, useEffect, useState } from 'react'
import { SearchBar } from './components/SearchBar'
import { IQueryResult } from './types'
import { SearchResults } from '../../components/SearchResults'
import { SortOptions } from './components/SortOptions'
import { FilterOptions } from './components/FilterOptions'
import { QueryContext } from '../../providers/QueryProvider'
import { State } from '../../providers/QueryProvider/types'
import styles from './styles.module.css'
import { Link } from 'react-router-dom'
import { octokit } from '../../utils/octokit'
import { db } from '../../utils/db'
import { constructQuery, constructSort, sanitizeResults } from './helpers'

export const Search: React.FC = (): React.JSX.Element => {
  const [queryResult, setQueryResult] = useState<IQueryResult | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const query = useContext(QueryContext)

  useEffect(() => {
    if (query.query) {
      // Always start loading to prevent double submits
      setIsLoading(true)

      // Create a clone of the query to make sure the query state isn't modified when getting the response.
      const requestQuery = { ...query }

      octokit.rest.search
        .repos({
          q: constructQuery(query.query, query.filters),
          ...constructSort(query.sort),
        })
        .then((response) => {
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
        })
        .catch((_e) => {
          return handleErrorResult('An error occurred, please try again.', requestQuery)
        })
        .finally(() => {
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
      return db.queries.add({ ...queryResult.forQuery, timestamp: new Date() }).then((queryId) => {
        ;(queryResult.results || []).slice(0, 10).forEach((result) => {
          const { owner, ...otherResultProps } = result

          db.repos
            .add({
              ...otherResultProps,
              queryId,
            })
            .then((repoId) => {
              if (!owner) {
                return
              }

              db.owners.add({
                ...owner,
                repoId: repoId,
              })
            })
        })
      })
    }).catch(function (error) {
      console.error(error.stack || error)
    })
  }, [queryResult])

  const handleErrorResult = (error: string, query: State): void => {
    setQueryResult({
      error,
      forQuery: query,
      numResults: null,
      results: null,
    })
  }

  const hadSuccess = queryResult && !queryResult.error
  const hadError = queryResult && queryResult.error

  return (
    <>
      <div className={styles.searchbar}>
        <SearchBar isLoading={isLoading} />
        {hadError && <p>{queryResult.error}</p>}
        <Link to={'/history'}>History</Link>
      </div>
      {hadSuccess && (
        <div className={styles.results}>
          <div className={styles.filterbar}>
            <h2>Filter</h2>
            <FilterOptions isLoading={isLoading} />
          </div>
          <div className={styles.resultlist}>
            <h2>
              {queryResult.numResults} results for query "{queryResult.forQuery.query}"
            </h2>
            <SortOptions />
            {queryResult.results && <SearchResults results={queryResult.results} />}
          </div>
        </div>
      )}
    </>
  )
}
