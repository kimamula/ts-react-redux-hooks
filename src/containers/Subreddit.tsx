import React from 'react'

import { RouteComponentProps } from 'react-router-dom'
import * as yup from 'yup'
import axios from 'axios'

import SubredditComponent from '../components/pages/Subreddit'
import { queries } from '../modules/subreddit'
import { parse } from 'query-string'
import { useCallback, useEffect, useMemo } from 'react'
import { createSelector } from 'reselect'
import { useReducerRegistry, RootState } from '../modules'
import {
  Child,
  fetchSubredditStarted,
  fetchSubredditResolved,
  fetchSubredditRejected,
} from '../modules/subreddit-actions'

const validationSchema = yup.object().shape({
  subreddit: yup.string().required(),
})

const useSubredditHandlers = ({ history, location }: RouteComponentProps) => {
  const onSubmit = useCallback(
    data => {
      const { value } = parse(location.search)
      if (value === data.subreddit) {
        return
      }

      const nextPath = `/subreddit?value=${data.subreddit}`
      return history.push(nextPath)
    },
    [location]
  )

  const onLinkClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, permalink: string) => {
      event.preventDefault()
      return window.open(`https://www.reddit.com/${permalink}`)
    },
    [location]
  )

  return { onLinkClick, onSubmit }
}

const postsSelector = createSelector(
  (s: RootState) => s.subreddit.children,
  children => queries.getPosts(children)
)

const api = axios.create({
  baseURL: 'https://www.reddit.com/r',
})

type SubRedditModel = {
  data: { children: Child[] }
}

const getSubreddit = (subreddit: string) =>
  api.get<SubRedditModel>(`/${subreddit}.json`)

const Subreddit = (props: RouteComponentProps) => {
  const { useSelector, useDispatch } = useReducerRegistry()
  const dispatch = useDispatch()
  const posts = useSelector(postsSelector)
  const isLoading = useSelector(s => s.subreddit.isLoading)
  const subreddit = useMemo(
    () =>
      props.location.search === '' ? '' : parse(props.location.search).value,
    [props.location.search]
  )
  const { onLinkClick, onSubmit } = useSubredditHandlers(props)
  useEffect(() => {
    if (subreddit) {
      dispatch(fetchSubredditStarted())
      getSubreddit(subreddit).then(
        ({ data }) => dispatch(fetchSubredditResolved(data.data.children)),
        () => dispatch(fetchSubredditRejected())
      )
    }
  }, [subreddit, dispatch])
  return (
    <SubredditComponent
      initialValues={{ subreddit }}
      onSubmit={onSubmit}
      onLinkClick={onLinkClick}
      validationSchema={validationSchema}
      isLoading={isLoading}
      posts={posts}
    />
  )
}
export default Subreddit
