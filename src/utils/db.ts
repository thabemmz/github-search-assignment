import Dexie, { Table } from 'dexie'
import { State } from '../providers/QueryProvider/types'

export interface Query extends State {
  id?: number
  timestamp: Date
}

export interface Repo {
  id?: number
  queryId: number
  url: string
  name: string
  description?: string
  stars: number
  forks: number
}

export interface Owner {
  id?: number
  repoId: number
  url: string
  name: string
  avatarUrl: string
}

export class GithubSearchAssignmentDb extends Dexie {
  // We just tell the typing system this is the case
  queries!: Table<Query>
  repos!: Table<Repo>
  owners!: Table<Owner>

  constructor() {
    super('github-search-assignment')
    this.version(1).stores({
      queries: '++id, timestamp',
      repos: 'id, queryId',
      owners: 'id, repoId',
    })
  }
}

export const db = new GithubSearchAssignmentDb()
