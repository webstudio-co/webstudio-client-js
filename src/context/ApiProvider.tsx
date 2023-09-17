import React from 'react'
import { ApiContext } from './ApiContext'
import { createClient } from '../api/ApiClient'
import { ApiProviderProps } from '../types/context'

export const ApiProvider: React.FC<ApiProviderProps> = (props) => {

  const { url, fetchToken, children } = props

	const baseURL = url
	const api = createClient(baseURL, fetchToken)
	
  const value = {
		api,
		baseURL
	}

	return (
		<ApiContext.Provider value={value}>
			{children}
		</ApiContext.Provider>
	)
}

export default ApiProvider
