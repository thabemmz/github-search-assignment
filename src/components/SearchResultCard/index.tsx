import React from 'react'

interface IProps {
  url: string,
  name: string,
  description?: string,
  stars: number,
  forks: number,
  owner?: {
    url: string,
    name: string,
    avatarUrl: string,
  }
}

export const SearchResultCard: React.FC<IProps> = ({ url, name, description, stars, forks, owner}): React.JSX.Element => (
  <div className="search-result-card">
    <a href={url}>
      <h2>{name}</h2>
      <p>{description}</p>
      <p>Number of stars: {stars}</p>
      <p>Number of forks: {forks}</p>
    </a>

    {owner && (
      <div className='user'>
        <a href={owner.url}>
          <img src={owner.avatarUrl} alt={owner.name}/>
          <p>{owner.name}</p>
        </a>
      </div>
    )}
  </div>
)
