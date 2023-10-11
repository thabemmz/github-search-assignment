import React from 'react'
import {Link} from "react-router-dom";
import {SearchResults} from "../search/components/SearchResults";

export const History: React.FC = (): React.JSX.Element => {
  return (
    <>
      <h1>History</h1>
      <Link to={'/'}>Back to live search</Link>
      <div>
        <ul>
          <li>Old item</li>
        </ul>
      </div>
      <div>
        <SearchResults results={queryResult.results} />
      </div>
    </>
  )
}
