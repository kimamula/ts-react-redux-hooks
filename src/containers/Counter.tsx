import React from 'react'

import CounterComponent from '../components/pages/Counter'
import counter from '../modules/counter'
import { useReducerRegistry } from '../modules'
import { decrement, increment } from '../modules/counter-actions'

const reducers = { counter }

const Counter = () => {
  const { useSelector, useDispatch } = useReducerRegistry(reducers)
  const dispatch = useDispatch()
  const count = useSelector(s => s.counter.count)
  return (
    <CounterComponent
      count={count}
      onDecrementClick={() => dispatch(decrement())}
      onIncrementClick={() => dispatch(increment())}
    />
  )
}

export default Counter
