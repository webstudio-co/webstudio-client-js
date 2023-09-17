import React, { useContext } from 'react'
import { ApiContext } from '../context/ApiContext'

interface ApiContextType {
  api: string; // Replace 'string' with the actual type of your 'api'
}

export const useApi = (): ApiContextType => {
	const { api } = useContext(ApiContext)
	return {
		api
	}
}
