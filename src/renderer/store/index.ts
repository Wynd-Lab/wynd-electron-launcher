import { applyMiddleware, createStore, Store } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { IRootState } from '../interface'
import appReducer from './reducer'


let middleware = applyMiddleware(thunk)
if (process.env.NODE_ENV !== 'production') {
	middleware = composeWithDevTools(middleware)
}
export const store = createStore(appReducer, middleware) as Store<
	IRootState
>


