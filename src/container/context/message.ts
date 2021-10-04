
import React from 'react'
import Messager from '../helpers/messager'

const MessagerContext = React.createContext<Messager>(new Messager())

export const MessagerProvider = MessagerContext.Provider
export const MessagerConsumer = MessagerContext.Consumer

export default MessagerContext
