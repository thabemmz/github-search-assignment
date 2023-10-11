import {Octokit} from "@octokit/rest";

export const octokit = new Octokit({
    userAgent: 'github-search-assignment v1.0.0',
})
