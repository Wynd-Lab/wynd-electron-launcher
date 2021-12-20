
import { applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { ICustomWindow } from './interface'

declare let window: ICustomWindow

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-unused-vars
export const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
	if (process.env.NODE_ENV === 'development')
		window?.log.debug('[RENDERER WINDOW]', action)
	next(action)
}
let middleware = applyMiddleware(thunk, loggerMiddleware)
if (process.env.NODE_ENV !== 'production') {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	middleware = composeWithDevTools(middleware)
}
