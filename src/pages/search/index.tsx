import {useState} from 'react'
import './styles.css'
import { SearchBar } from './components/SearchBar'
import { IQueryResult } from "./types.ts";
import {SearchResults} from "./components/SearchResults";

function Search() {
  const [queryResult, setQueryResult] = useState<IQueryResult | null>(null)

  const hadSuccess = queryResult && !queryResult.error
  const hadError = queryResult && queryResult.error

  return (
    <>
      <div>
        <SearchBar onQueryResult={setQueryResult} />
      </div>
      {hadSuccess && (<SearchResults results={queryResult.results} numResults={queryResult.numResults} query={queryResult.forQuery} />)}
      {hadError && (<p>{queryResult.error}</p>)}
    </>
  )
}

export default Search
