import { applyMiddleware, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { IRootState } from '../interface'
import log from 'electron-log'

import appReducer from './reducer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
	// eslint-disable-next-line no-console
	log.info(action)
	next(action)
}
let middleware = applyMiddleware(thunk, loggerMiddleware)
if (process.env.NODE_ENV !== 'production') {
	middleware = composeWithDevTools(middleware)
}

export const store = createStore(appReducer, middleware) as Store<IRootState>
