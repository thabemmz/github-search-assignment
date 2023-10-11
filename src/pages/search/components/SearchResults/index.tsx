import React from 'react'
import {Props} from './types'
import {SearchResultCard} from "../../../../components/SearchResultCard";
import styles from './styles.module.css'

export const SearchResults: React.FC<Props> = ({results}): React.JSX.Element => {
    return (
        <div className={styles.cardlist}>
            {(results || []).map(result => {
                const ownerProps = result.owner ? result.owner : {}

                return (<SearchResultCard key={result.id} name={result.name} description={result.description}
                                          url={result.url} stars={result.stars} forks={result.forks} {...ownerProps} />)
            })}
        </div>
    )
}
