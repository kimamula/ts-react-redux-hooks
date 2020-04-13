import {
  combineReducers,
  StoreEnhancer,
  Dispatch,
  ActionFromReducersMapObject,
  StateFromReducersMapObject,
  ReducersMapObject,
} from 'redux'
import { useStore, useSelector, useDispatch } from 'react-redux'
import { useMemo } from 'react'

type RegisterReducersExt = {
  registerReducers<M extends ReducersMapObject<any, any>>(reducers?: M): void
}
type UseReducerRegistryReturnType<
  Initial extends ReducersMapObject<any, any>,
  Added extends ReducersMapObject<any, any>
> = {
  useSelector: <V>(
    selector: (s: StateFromReducersMapObject<Initial & Added>) => V,
    equalityFn?: (left: V, right: V) => boolean
  ) => V
  useDispatch: () => Dispatch<
    ActionFromReducersMapObject<Initial> | ActionFromReducersMapObject<Added>
  >
}
export type UseReducerRegistry<Initial extends ReducersMapObject<any, any>> = {
  <Added extends ReducersMapObject<any, any> = {}>(
    reducers?: Added
  ): UseReducerRegistryReturnType<Initial, Added>
}

export function useReducerRegistry<
  Initial extends ReducersMapObject<any, any> = {},
  Added extends ReducersMapObject<any, any> = {}
>(reducers?: Added): UseReducerRegistryReturnType<Initial, Added> {
  const store = useStore()
  useMemo(
    () =>
      ((store as unknown) as RegisterReducersExt).registerReducers(reducers),
    [store, reducers]
  )
  return { useSelector, useDispatch }
}

export function reducerRegistryEnhancer(
  initialReducers: ReducersMapObject<any, any> = {}
): StoreEnhancer {
  const existingReducers: ReducersMapObject<any, any> = {
    ...initialReducers,
  }
  return createStore => (r, p) => {
    const store = createStore(r, p)
    ;((store as unknown) as RegisterReducersExt).registerReducers = addedReducers => {
      if (
        addedReducers &&
        Object.keys(addedReducers).some(namespace => {
          if (!existingReducers[namespace]) {
            existingReducers[namespace] = addedReducers[namespace]
            return true
          }
          if (existingReducers[namespace] !== addedReducers[namespace]) {
            throw new Error(
              `A reducer has been already registered for the namespace '${namespace}'`
            )
          }
          return false
        })
      ) {
        store.replaceReducer(
          (combineReducers(existingReducers) as unknown) as Parameters<
            typeof store['replaceReducer']
          >[0]
        )
      }
    }
    return store
  }
}
