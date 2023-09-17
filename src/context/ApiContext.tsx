import React, { createContext } from 'react'
import { ApiContextType } from '../types/context'

export const ApiContext: React.Context<ApiContextType> = createContext<ApiContextType>({
  api: '',
  baseURL: ''
})

