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

  // The useEffect hook below makes the actual call to Github, given that the query state (retrieved from the context)
  // has changed.
  useEffect(() => {
    if (!query.query) {
      // When we don't have a query, we won't make a call.
      return
    }

    // Always start loading to prevent double submits
    setIsLoading(true)

    // Create a clone of the query to make sure the query state isn't modified when getting the response.
    const requestQuery = { ...query }

    // Define async method to be able to use async / await within useEffect
    const fetchAndProcessQuery = async () => {
      const response = await octokit.rest.search.repos({
        q: constructQuery(query.query, query.filters),
        ...constructSort(query.sort),
      })

      if (response.status === 200 || response.status === 304) {
        // We have a success response, store the results!
        return setQueryResult({
          error: null,
          forQuery: requestQuery,
          numResults: response.data.total_count,
          results: sanitizeResults(response.data.items),
        })
      }

      if (response.status === 403) {
        // Rate limits were hit. Report this back to the user so they know what happened.
        return handleErrorResult('Rate limit exceeded, please try again later.', requestQuery)
      }

      return handleErrorResult('An error occurred, please try again.', requestQuery)
    }

    fetchAndProcessQuery()
      .catch((_e) => {
        return handleErrorResult('An error occurred, please try again.', requestQuery)
      })
      .finally(() => {
        // We've either finished successfully or errored, but we have a response, so stop loading.
        setIsLoading(false)
      })
  }, [query])

  // The useEffect hook below stores the query result in the database to be able to retrieve the result from history
  useEffect(() => {
    if (!queryResult) {
      return
    }

    const storeQueryResult = async () => {
      // Since we need to store items in three different tables, let's create a transaction. If one of the writes fails,
      // the entire transaction will be rolled back, meaning we won't have corrupt data.
      db.transaction('rw', db.queries, db.repos, db.owners, async () => {
        // Start by storing the query itself
        const queryId = await db.queries.add({ ...queryResult.forQuery, timestamp: new Date() })
        const relevantResults = (queryResult.results || []).slice(0, 10)

        for await (const result of relevantResults) {
          // Store the first 10 results in the database
          const { owner, ...otherResultProps } = result

          const repoId = await db.repos.add({
            ...otherResultProps,
            queryId,
          })

          if (!owner) {
            return
          }

          // Store the owners along with the repos
          await db.owners.add({
            ...owner,
            repoId: repoId,
          })
        }
      })
    }

    storeQueryResult().catch((e) => {
      console.error(e.stack || e)
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
