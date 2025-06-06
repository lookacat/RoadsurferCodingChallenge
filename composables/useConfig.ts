import { API_CONFIG } from '~/config/api'

export const useConfig = () => {
  const getStationsUrl = () => {
    return `${API_CONFIG.stations.baseUrl}${API_CONFIG.stations.endpoints.list}`
  }

  return {
    api: API_CONFIG,
    getStationsUrl
  }
} 