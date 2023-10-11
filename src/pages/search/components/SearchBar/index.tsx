import React, {useState} from 'react'
import { Input } from "../../../../components/Input";
import { Form } from "../../../../components/Form";
import { Octokit } from "@octokit/rest";
import { IProps } from './types'

const octokit = new Octokit({
  userAgent: 'github-search-assignment v1.0.0'
})

const SEARCH_IN = [
  'name',
  'description',
  'topics',
  'readme'
]

export const SearchBar: React.FC<IProps> = ({ onQueryResult }): React.JSX.Element => {
  const [query, setQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const constructInQualifiers = (): string => {
    return SEARCH_IN.map(qualifier => `in:${qualifier}`).join(' ')
  }

  const constructQuery = (query: string): string => {
    const inQualifiers = constructInQualifiers()

    return `${query} ${inQualifiers}`
  }

  const handleErrorResult = (error: string): void => {
    onQueryResult({
      error,
      forQuery: query,
      numResults: null,
      results: null,
    })
  }

  const handleSubmit = () => {
    // Always start loading to prevent double submits
    setIsLoading(true)

    // Create a clone of the query to make sure the query state isn't modified when getting the response.
    const requestQuery = query

    octokit.rest.search.repos({
      q: constructQuery(query),
    }).then(response => {
      if (response.status === 200 || response.status === 304) {
        return onQueryResult({
          error: null,
          forQuery: requestQuery,
          numResults: response.data.total_count,
          results: response.data.items,
        })
      }

      if (response.status === 403) {
        // Rate limits!
        return handleErrorResult('Rate limit exceeded, please try again later.')
      }

      return handleErrorResult('An error occurred, please try again.')
    }).catch(_e => {
      return handleErrorResult('An error occurred, please try again.')
    }).finally(() => {
      // We've either finished successfully or errored, but we have a response, so stop loading.
      setIsLoading(false)
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input type="text" onChange={setQuery} value={query} disabled={isLoading} />
      <button>{isLoading ? `Submitting...` : `Submit`}</button>
    </Form>
  )
}
