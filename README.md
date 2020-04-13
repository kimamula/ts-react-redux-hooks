# Type safe code splitting of Redux in React app

Using Redux in a type safe manner can be a little tricky.
For example, `useSelector()` and `useDispatch()` hooks are not type safe.
This may be OK if the store shape of your app is always the same.
However it would be annoying if you code split Redux reducers and actions as [described](https://redux.js.org/recipes/code-splitting) and have to type `useSelector()` and `dispatc()` precisely in each component depending on which reducers you use for the component.

Here, I implemented `useReducerRegistry()` hook which can be used to register reducers and retrieve typed `useSelector()` and `useDispatch()` hooks in return.
To make `useReducerRegistry()` hook to be available, store must be created with `reducerRegistryEnhancer()` enhancer (If you are not familiar with Redux enhancer, please refer to [here](https://redux.js.org/recipes/configuring-your-store/#extending-redux-functionality)).

The implementation of `useReducerRegistry()` and `reducerRegistryEnhancer()` can be found [here](src/react-redux-code-split.ts).
This branch hosts working example.

The following code is the brief summary of how to use these APIs.

```ts
// store.ts
import {
  reducerRegistryEnhancer,
  useReducerRegistry as _useReducerRegistry,
  UseReducerRegistry,
} from './react-redux-code-split'
import reducer1 from './reducer1'
import reducer2 from './reducer2'

// Initial reducers
const initialReducers = { reducer1, reducer2 }

// Initial state
const InitialState = { /* ... */ }

// Create Store
export const store = createStore(
  initialReducers,
  initialState,
  // It is easy to compose reducerRegistryEnhancer() with the other enhancers
  composeWithDevTools(
    applyMiddleware(thunk),
    // Pass initialReducers to reducerRegistryEnhancer()
    reducerRegistryEnhancer(initialReducers)
  )
)

// Type useReducerRegistry as initialReducers has been already applied to the store.
// If there are no initial reducers, you can use useReducerRegistry directly without this additional typing 
export const useReducerRegistry: UseReducerRegistry<typeof initialReducers> = _useReducerRegistry

---

// MyComponent1.tsx
import { useReducerRegistry } from './store'
import additinalReducer from './additinalReducer'

const reducers = { additinalReducer }

const MyComponent1 = () => {
  // Register reducers and retrieve typed useSelector and useDispatch
  const { useSelector, useDispatch } = useReducerRegistry(reducers)
  // ...
}

---

// MyComponent2.tsx
import { useReducerRegistry } from './store'

const MyComponent2 = () => {
  // If you only need initialReducers in this component,
  // you can call useReducerRegistry without argument
  const { useSelector, useDispatch } = useReducerRegistry()
  // ...
}
```

## Note

To take full advantage of these APIs, reducers must be typed strictly as the types of these APIs' return values depend on the reducers types.
However, it seems reducers are not strictly typed in general.
For example, though I think [`createSlice()`](https://redux-toolkit.js.org/api/createSlice) of `redux-toolbelt` is a relly cool API, it returns a reducer whose type accepts any action.
I think the type safe version of `createSlice()` will be possible if [key augmentation during type mapping](https://github.com/microsoft/TypeScript/issues/12754) is available, so I'm waiting for it.
