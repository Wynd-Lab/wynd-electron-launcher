import React from 'react'
import io from "socket.io-client"

const SocketContext = React.createContext<typeof io.Socket | null>(null)

export const SocketProvider = SocketContext.Provider
export const SocketConsumer = SocketContext.Consumer

export default SocketContext
