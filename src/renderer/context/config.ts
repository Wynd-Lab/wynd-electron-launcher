import React from 'react'
import { IConfig } from '../helpers/config'

const SocketContext = React.createContext<IConfig | null>(null)

export const SocketProvider = SocketContext.Provider
export const SocketConsumer = SocketContext.Consumer

export default SocketContext
