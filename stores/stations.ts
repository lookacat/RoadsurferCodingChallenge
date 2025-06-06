import { defineStore } from 'pinia'
import type { Station } from '~/types/station'

const { getInternalApiUrl } = useConfig()
const apiUrls = getInternalApiUrl()

interface StationsState {
  stations: Station[]
  selectedStation: Station | null
  loading: boolean
  error: string | null
}

export const useStationsStore = defineStore('stations', {
  state: (): StationsState => ({
    stations: [],
    selectedStation: null,
    loading: false,
    error: null,
  }),

  getters: {
    stationNames: (state) => state.stations.map(station => ({
      id: station.id,
      name: station.name,
      location: station.location,
    })),

    filteredStations: (state) => (searchTerm: string) => {
      if (!searchTerm) return state.stations
      const term = searchTerm.toLowerCase()
      return state.stations.filter(station => 
        station.name.toLowerCase().includes(term) ||
        station.location.toLowerCase().includes(term)
      )
    },
  },

  actions: {
    async fetchAllStations() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(apiUrls.stations)
        const data = await response.json()
        this.stations = data.stations
      } catch (error) {
        this.error = 'Failed to fetch stations'
        console.error('Error fetching stations:', error)
      } finally {
        this.loading = false
      }
    },

    selectStation(station: Station) {
      this.selectedStation = station
    },

    clearSelection() {
      this.selectedStation = null
    },
  },
}) 