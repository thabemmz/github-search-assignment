import React, {useContext} from 'react'
import {QueryContext, QueryDispatchContext} from "../../../../providers/QueryProvider";
import {QueryReducerActionKindEnum, SortDirectionEnum, SortFieldEnum} from '../../../../providers/QueryProvider/types.ts'

export const SortOptions: React.FC = (): React.JSX.Element => {
  const dispatch = useContext(QueryDispatchContext);
  const { sort } = useContext(QueryContext)

  const currentStarSort = sort?.field === SortFieldEnum.STARS ? sort?.direction : ''
  const currentForkSort = sort?.field === SortFieldEnum.FORKS ? sort?.direction : ''

  const handleSort = (field: SortFieldEnum): void => {
    if (sort?.field === field && sort?.direction === SortDirectionEnum.DESC) {
      // Field currently is sorted ascending, so we want to sort descending
      dispatch({ type: QueryReducerActionKindEnum.SET_SORT, payload: { field, direction: SortDirectionEnum.ASC } })
      return
    }

    if (sort?.field === field && sort?.direction === SortDirectionEnum.ASC) {
      // Field currently is sorted descending, so we want to remove the sort
      dispatch({ type: QueryReducerActionKindEnum.REMOVE_SORT })
      return
    }

    // In all other scenarios, apply sorting for this field
    dispatch({ type: QueryReducerActionKindEnum.SET_SORT, payload: { field, direction: SortDirectionEnum.DESC } })
  }

  return (
    <ul>
      <li><a onClick={e => { e.preventDefault; handleSort(SortFieldEnum.STARS)}}>Stars: {currentStarSort}</a></li>
      <li><a onClick={e => { e.preventDefault; handleSort(SortFieldEnum.FORKS)}}>Forks: {currentForkSort}</a></li>
    </ul>
  )
}
