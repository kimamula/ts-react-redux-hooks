import { Child } from './subreddit-actions'
import * as actions from './subreddit-actions'

// Reducer
export type State = {
  isLoading: boolean
  children?: Child[]
}

const initialState: State = {
  isLoading: false,
}

export default function reducer(
  state: State = initialState,
  action: ReturnType<typeof actions[keyof typeof actions]>
): State {
  switch (action.type) {
    case 'subreddit/fetchSubredditStarted':
      return { ...state, isLoading: true }
    case 'subreddit/fetchSubredditResolved':
      return { children: action.payload, isLoading: false }
    case 'subreddit/fetchSubredditRejected':
      return { ...state, isLoading: false }
    default:
      return state
  }
}

const getPosts = (children?: Child[]) => {
  return children
    ? children.map(({ data }) => ({
        title: data.title,
        thumbnail: data.thumbnail,
        selftext: data.selftext,
        permalink: data.permalink,
      }))
    : []
}

export const queries = { getPosts }
