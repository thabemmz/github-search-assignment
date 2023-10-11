export interface Props {
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
