import * as actions from './counter-actions'

const initialState = {
  count: 0,
}
export type State = {
  count: number
}

export default function reducer(
  state: State = initialState,
  action: ReturnType<typeof actions[keyof typeof actions]>
): State {
  switch (action.type) {
    case 'counter/increment':
      return { count: state.count + 1 }
    case 'counter/decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}
