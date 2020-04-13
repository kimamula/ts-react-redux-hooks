import React, { Suspense, lazy } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, Route, Switch } from 'react-router-dom'
import './index.less'
import { configureStore } from './modules'

const Counter = lazy(() => import('./containers/Counter'))
const Home = lazy(() => import('./containers/Home'))
const Subreddit = lazy(() => import('./containers/Subreddit'))

const App = () => (
  <Provider store={configureStore()}>
    <HashRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route component={Home} exact={true} path={'/'} />
          <Route component={Counter} exact={true} path={'/counter'} />
          <Route component={Subreddit} exact={true} path={'/subreddit'} />
        </Switch>
      </Suspense>
    </HashRouter>
  </Provider>
)

render(<App />, document.getElementById('app'))
