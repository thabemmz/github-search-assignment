import React, {useContext, useState} from 'react'
import {QueryContext, QueryDispatchContext} from "../../../../providers/QueryProvider";
import {QueryReducerActionKindEnum, FilterFieldEnum} from '../../../../providers/QueryProvider/types.ts'
import {Input} from "../../../../components/Input";
import {Form} from "../../../../components/Form";

export const FilterOptions: React.FC = (): React.JSX.Element => {
  const dispatch = useContext(QueryDispatchContext);
  const { filters } = useContext(QueryContext)
  const currentLanguageFilter = filters && filters[FilterFieldEnum.LANGUAGE]
  const currentNumStarsFilter = filters && filters[FilterFieldEnum.NUMBER_STARS]
  const currentNumFollowersFilter = filters && filters[FilterFieldEnum.NUMBER_FOLLOWERS]

  const [language, setLanguage] = useState<string>(currentLanguageFilter || '')
  const [numStars, setNumStars] = useState<number>(parseInt(currentNumStarsFilter || '0'))
  const [numFollowers, setNumFollowers] = useState<number>(parseInt(currentNumFollowersFilter || '0'))

  const handleSubmit = () => {
    dispatch({ type: QueryReducerActionKindEnum.SET_FILTERS, payload: {
      [FilterFieldEnum.LANGUAGE]: language,
      [FilterFieldEnum.NUMBER_STARS]: numStars.toString(),
      [FilterFieldEnum.NUMBER_FOLLOWERS]: numFollowers.toString(),
    }})
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input placeholder="Filter on language" type="text" onChange={setLanguage} value={language} />
      <Input placeholder="Filter on minimum number of stars" type="number" onChange={(value) => setNumStars(parseInt(value))} value={numStars.toString()} />
      <Input placeholder="Filter on minimum number of followers" type="number" onChange={(value) => setNumFollowers(parseInt(value))} value={numFollowers.toString()} />
      <button>Submit</button>
    </Form>
  )


}
