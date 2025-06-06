import { API_CONFIG } from '~/config/api'

export const useConfig = () => {
  const getInternalApiUrl = () => {
    return {
      stations: '/api/stations'
    }
  }

  return {
    api: API_CONFIG,
    getInternalApiUrl
  }
} 