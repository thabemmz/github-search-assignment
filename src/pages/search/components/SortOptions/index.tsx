import React, {useContext} from 'react'
import {QueryContext, QueryDispatchContext} from "../../../../providers/QueryProvider";
import {QueryReducerActionKindEnum, SortDirectionEnum, SortFieldEnum} from '../../../../providers/QueryProvider/types'
import styles from './styles.module.css'

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

  const ascIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  )

  const descIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  )

  const iconMap = {
    [SortDirectionEnum.ASC]: ascIcon,
    [SortDirectionEnum.DESC]: descIcon,
  }

  return (
    <div className={styles.sort}>
      <p>Sort results by: </p>
      <div className={styles.sortOptions}>
        <div className={styles.sortOption} onClick={e => { e.preventDefault; handleSort(SortFieldEnum.STARS)}}>
          <span>Stars</span>
          {currentStarSort && iconMap[currentStarSort]}
        </div>
        <div className={styles.sortOption} onClick={e => { e.preventDefault; handleSort(SortFieldEnum.FORKS)}}>
          <span>Forks</span>
          {currentForkSort && iconMap[currentForkSort]}
        </div>
      </div>
    </div>
  )
}
