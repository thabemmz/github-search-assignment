import React from 'react'
import { IProps } from './types'
import {SearchResultCard} from "../../../../components/SearchResultCard";
import styles from './styles.module.css'

export const SearchResults: React.FC<IProps> = ({ results }): React.JSX.Element => (
  <div className={styles.cardlist}>
    {(results || []).map(result => {
      const ownerProps = result.owner ? { owner: { name: result.owner.login, url: result.owner.html_url, avatarUrl: result.owner.avatar_url } } : {}

      return (<SearchResultCard key={result.id} name={result.name} description={result.description || ''}
                        url={result.html_url} stars={result.stargazers_count} forks={result.forks} {...ownerProps} />)
    })}
  </div>
)
