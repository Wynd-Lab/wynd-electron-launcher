import { applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { ICustomWindow } from '../helpers/interface'

import { loggerMiddleware } from '../helpers/logger_middleware'

declare let window: ICustomWindow

// eslint-disable-next-line @typescript-eslint/no-unused-vars

let middleware = applyMiddleware(thunk, loggerMiddleware)
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  middleware = composeWithDevTools(middleware)
}

// export const store = createStore(appReducer, middleware) as Store<IRootState>
