import React, { useContext, useState } from 'react'
import { QueryContext, QueryDispatchContext } from '../../../../providers/QueryProvider'
import { QueryReducerActionKindEnum, FilterFieldEnum } from '../../../../providers/QueryProvider/types'
import { Input } from '../../../../components/Input'
import { Form } from '../../../../components/Form'
import styles from './styles.module.css'
import { Button } from '../../../../components/Button'
import { Props } from './types'

export const FilterOptions: React.FC<Props> = ({ isLoading }): React.JSX.Element => {
  const dispatch = useContext(QueryDispatchContext)
  const { filters } = useContext(QueryContext)
  const currentLanguageFilter = filters && filters[FilterFieldEnum.LANGUAGE]
  const currentNumStarsFilter = filters && filters[FilterFieldEnum.NUMBER_STARS]
  const currentNumFollowersFilter = filters && filters[FilterFieldEnum.NUMBER_FOLLOWERS]

  const [language, setLanguage] = useState<string>(currentLanguageFilter || '')
  const [numStars, setNumStars] = useState<number>(parseInt(currentNumStarsFilter || '0'))
  const [numFollowers, setNumFollowers] = useState<number>(parseInt(currentNumFollowersFilter || '0'))

  const handleSubmit = () => {
    dispatch({
      type: QueryReducerActionKindEnum.SET_FILTERS,
      payload: {
        [FilterFieldEnum.LANGUAGE]: language,
        [FilterFieldEnum.NUMBER_STARS]: numStars.toString(),
        [FilterFieldEnum.NUMBER_FOLLOWERS]: numFollowers.toString(),
      },
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="language">Programming language:</label>
        <Input id="language" type="text" onChange={setLanguage} value={language} disabled={isLoading} />
      </div>

      <div className={styles.field}>
        <label htmlFor="numStars">Minimum number of stars:</label>
        <Input
          id="numStars"
          type="number"
          onChange={(value) => setNumStars(parseInt(value))}
          value={numStars.toString()}
          disabled={isLoading}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="numFollowers">Minimum number of followers:</label>
        <Input
          id="numFollowers"
          type="number"
          onChange={(value) => setNumFollowers(parseInt(value))}
          value={numFollowers.toString()}
          disabled={isLoading}
        />
      </div>
      <Button>{isLoading ? 'Loading...' : 'Apply filters'}</Button>
    </Form>
  )
}
