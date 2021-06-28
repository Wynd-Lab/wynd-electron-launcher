
import { applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import log from 'electron-log'

export const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
	if (process.env.NODE_ENV === 'development')
		log.info("[RENDERER WINDOW]", action)
	next(action)
}
let middleware = applyMiddleware(thunk, loggerMiddleware)
if (process.env.NODE_ENV !== 'production') {
	middleware = composeWithDevTools(middleware)
}
