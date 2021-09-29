import { applyMiddleware, createStore, Store, AnyAction } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk, { ThunkDispatch, ThunkMiddleware } from 'redux-thunk'
import { loggerMiddleware } from '../../helpers/logger_middleware'

import { IRootState } from '../interface'

import appReducer from './reducers'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mw: ThunkMiddleware<IRootState, AnyAction> = thunk

let middleware = applyMiddleware(mw, loggerMiddleware)
if (process.env.NODE_ENV !== 'production') {
	middleware = composeWithDevTools(middleware)
}

export const store = createStore(appReducer, middleware) as Store<IRootState>
export type AppDispatch = ThunkDispatch<IRootState, any, AnyAction>;
