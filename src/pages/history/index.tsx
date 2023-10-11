import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../utils/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { SearchResults } from '../../components/SearchResults'
import { MappedResult } from '../search/types'
import styles from './styles.module.css'

export const History: React.FC = (): React.JSX.Element => {
  const [currentQueryId, setCurrentQueryId] = useState<number | null>(null)
  const [results, setResults] = useState<Array<MappedResult>>([])
  const queries = useLiveQuery(() => db.queries.reverse().toArray())

  useEffect(() => {
    if (!currentQueryId) {
      return
    }

    const getItems = async () => {
      const results: Array<MappedResult> = []

      const repos = await db.repos.where({ queryId: currentQueryId }).toArray()

      for await (const repo of repos) {
        const result: MappedResult = { ...repo, id: repo.id || new Date().valueOf() }

        const owner = await db.owners.where({ repoId: repo.id }).first()

        if (owner) {
          result.owner = {
            ...owner,
            id: owner.id || new Date().valueOf(),
          }
        }

        results.push(result)
      }

      setResults(results)
    }

    getItems().catch((e) => {
      console.error(e.stack || e)
    })
  }, [currentQueryId])

  return (
    <>
      <div className={styles.header}>
        <h1>History</h1>
        <Link to={'/'}>Back to live search</Link>
      </div>
      <div className={styles.results}>
        <div className={styles.searchresultsbar}>
          {(queries || []).map((query) => {
            const queryId = query.id

            if (!queryId) {
              return
            }

            return (
              <div
                className={`${styles.historyItem} ${currentQueryId === queryId ? styles.current : ''}`}
                key={queryId}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentQueryId(queryId)
                }}
              >
                <span className={styles.timestamp}>{query.timestamp.toLocaleString('nl-NL')}</span>
                <span className={styles.query}>{query.query}</span>

                <div className={styles.additionalProperties}>
                  <>
                    {query.sort && (
                      <span className={styles.additionalProperty} key={`${queryId}-sort-${query.sort.field}`}>
                        Sort: {query.sort.field} {query.sort.direction}
                      </span>
                    )}
                  </>
                  <>
                    {Object.entries(query.filters || {}).map(([field, filterValue]) => (
                      <span className={styles.additionalProperty} key={`${queryId}-${field}-${filterValue}`}>
                        {field}: {filterValue}
                      </span>
                    ))}
                  </>
                </div>
              </div>
            )
          })}
        </div>
        <div className={styles.resultslist}>{currentQueryId && <SearchResults results={results} />}</div>
      </div>
    </>
  )
}
