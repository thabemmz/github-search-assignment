import React from 'react'
import { IProps } from './types'
import {SearchResultCard} from "../../../../components/SearchResultCard";

export const SearchResults: React.FC<IProps> = ({ results, numResults, query }): React.JSX.Element => (
  <div className="results">
    <p>For query: {query}</p>
    <p>Number of results: {numResults}</p>
    {(results || []).map(result => {
      const ownerProps = result.owner ? { owner: { name: result.owner.login, url: result.owner.html_url, avatarUrl: result.owner.avatar_url } } : {}

      return (<SearchResultCard key={result.id} name={result.name} description={result.description || ''}
                        url={result.html_url} stars={result.score} forks={result.forks} {...ownerProps} />)
    })}
  </div>
)
