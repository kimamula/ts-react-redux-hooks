import { applyMiddleware, createStore, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'

import subreddit from './subreddit'
import {
  reducerRegistryEnhancer,
  useReducerRegistry as _useReducerRegistry,
  UseReducerRegistry,
} from '../react-redux-code-split'

const rootReducers = { subreddit }
const rootReducer = combineReducers(rootReducers)

export const configureStore = (initialState?: any) => {
  return createStore(
    rootReducer,
    initialState,
    composeWithDevTools(
      applyMiddleware(thunk),
      reducerRegistryEnhancer(rootReducers)
    )
  )
}

export const useReducerRegistry: UseReducerRegistry<typeof rootReducers> = _useReducerRegistry
export type RootState = ReturnType<typeof rootReducer>
