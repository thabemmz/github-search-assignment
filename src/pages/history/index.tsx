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
  const queries = useLiveQuery(() => db.queries.toArray())

  useEffect(() => {
    const results: Array<MappedResult> = []
    db.repos
      .where({ queryId: currentQueryId })
      .toArray()
      .then((repos) => {
        const ownerPromises = repos.map((repo) => {
          return db.owners
            .where({ repoId: repo.id })
            .first()
            .then((owner) => {
              if (!owner) {
                results.push({
                  ...repo,
                  id: repo.id || new Date().valueOf(),
                })
                return
              }
              results.push({
                ...repo,
                id: repo.id || new Date().valueOf(),
                owner: {
                  ...owner,
                  id: owner.id || new Date().valueOf(),
                },
              })
            })
        })

        Promise.all(ownerPromises).then(() => {
          setResults(results)
        })
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
                      <span className={styles.additionalProperty}>
                        Sort: {query.sort.field} {query.sort.direction}
                      </span>
                    )}
                  </>
                  <>
                    {Object.entries(query.filters || {}).map(([field, filterValue]) => (
                      <span className={styles.additionalProperty}>
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
