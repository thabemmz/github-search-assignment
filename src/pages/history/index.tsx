import React, {useState, useEffect} from 'react'
import {Link} from "react-router-dom";
import {db} from '../../utils/db'
import {useLiveQuery} from "dexie-react-hooks";
import {SearchResults} from "../search/components/SearchResults";
import {MappedResult} from "../search/types";

export const History: React.FC = (): React.JSX.Element => {
    const [currentQueryId, setCurrentQueryId] = useState<number | null>(null)
    const [results, setResults] = useState<Array<MappedResult>>([])
    const queries = useLiveQuery(() => db.queries.toArray())

    useEffect(() => {
        const results: Array<MappedResult> = []
        db.repos.where({queryId: currentQueryId}).toArray().then(repos => {
            const ownerPromises = repos.map(repo => {
                return db.owners.where({repoId: repo.id}).first().then(owner => {
                    if (!owner) {
                        results.push({
                            ...repo,
                            id: repo.id || new Date().valueOf()
                        })
                        return
                    }
                    results.push({
                        ...repo,
                        id: repo.id || new Date().valueOf(),
                        owner: {
                            ...owner,
                            id: owner.id || new Date().valueOf()
                        }
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
            <h1>History</h1>
            <Link to={'/'}>Back to live search</Link>
            <div>
                <ul>
                    {(queries || []).map((query) => {
                        const queryId = query.id

                        if (!queryId) {
                            return
                        }

                        return <li key={queryId} onClick={(e) => {
                            e.preventDefault();
                            setCurrentQueryId(queryId)
                        }}>{query.query}</li>
                    })}
                </ul>
            </div>
            {currentQueryId && (
                <div>
                    <h1>Results</h1>
                    <SearchResults results={results}/>
                </div>
            )}
        </>
    )
}
