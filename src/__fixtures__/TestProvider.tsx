import * as React from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Switch, RouteProps } from 'react-router-dom'
import { MemoryRouterProps } from 'react-router'

import { configureStore, ReduxState } from '../modules'

type RouterInitialProps = {
  paths: string[]
  initialPath?: string
  params?: RouteProps
  search?: string
}

type Props = MemoryRouterProps &
  RouterInitialProps & {
    component: RouteProps['component']
    initialState?: ReduxState
  }

const TestProvider: React.FC<Props> = ({
  component: Component,
  initialState,
  paths,
  initialPath,
  search,
}) => {
  const initialEntries: MemoryRouterProps['initialEntries'] = paths.map(
    path => ({ pathname: path, search })
  )
  const initialIndex = initialPath ? paths.indexOf(initialPath) : 0

  return (
    <Provider store={configureStore(initialState)}>
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        <Switch>
          {paths.map(path => (
            <Route key={path} path={path} component={Component} />
          ))}
        </Switch>
      </MemoryRouter>
    </Provider>
  )
}

export default TestProvider