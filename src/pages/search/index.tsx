import {useState} from 'react'
import './styles.css'
import { SearchBar } from './components/SearchBar'
import { IQueryResult } from "./types.ts";

function Search() {
  const [queryResult, setQueryResult] = useState<IQueryResult | null>(null)

  return (
    <>
      <div>
        <SearchBar onQueryResult={setQueryResult} />
      </div>
    </>
  )
}

export default Search
