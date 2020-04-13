export function fetchSubredditStarted() {
  return { type: 'subreddit/fetchSubredditStarted' } as const
}
export function fetchSubredditResolved(payload: Child[]) {
  return { type: 'subreddit/fetchSubredditResolved', payload } as const
}
export function fetchSubredditRejected() {
  return { type: 'subreddit/fetchSubredditRejected' } as const
}
export type Child = {
  kind: string
  data: any
}
