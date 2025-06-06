// Mock useConfig
(global as any).useConfig = () => ({
  getInternalApiUrl: () => ({
    stations: '/api/stations'
  })
})

import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals'
import { setActivePinia, createPinia } from 'pinia'
import type { Station } from '~/types/station'

// Mock the useConfig composable
const mockUseConfig = {
  getInternalApiUrl: () => ({
    stations: '/api/stations'
  })
}

// Mock fetch globally
const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>
global.fetch = mockFetch

// Import store after mocks
import { useStationsStore } from '../stations'

describe('Stations Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockFetch.mockClear()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const mockStations: Station[] = [
    {
      id: '1',
      name: 'Berlin',
      location: 'Berlin',
      bookings: [
        {
          id: '1',
          pickupReturnStationId: '1',
          customerName: 'John Doe',
          startDate: '2024-03-25T00:00:00.000Z',
          endDate: '2024-03-26T00:00:00.000Z'
        }
      ],
      bookingsCount: 1
    },
    {
      id: '2',
      name: 'Munich',
      location: 'Munich',
      bookings: [],
      bookingsCount: 0
    },
    {
      id: '3',
      name: 'Barcelona',
      location: 'Barcelona',
      bookings: [
        {
          id: '2',
          pickupReturnStationId: '3',
          customerName: 'Jane Smith',
          startDate: '2024-03-27T00:00:00.000Z',
          endDate: '2024-03-28T00:00:00.000Z'
        }
      ],
      bookingsCount: 1
    }
  ]

  describe('Initial State', () => {
    test('should have correct initial state', () => {
      const store = useStationsStore()
      
      expect(store.stations).toEqual([])
      expect(store.selectedStation).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('Getters', () => {
    test('stationNames should return station names and locations', () => {
      const store = useStationsStore()
      store.stations = mockStations
      
      const stationNames = store.stationNames
      
      expect(stationNames).toEqual([
        { id: '1', name: 'Berlin', location: 'Berlin' },
        { id: '2', name: 'Munich', location: 'Munich' },
        { id: '3', name: 'Barcelona', location: 'Barcelona' }
      ])
    })

    test('filteredStations should return all stations when no search term', () => {
      const store = useStationsStore()
      store.stations = mockStations
      
      const filtered = store.filteredStations('')
      
      expect(filtered).toEqual(mockStations)
    })

    test('filteredStations should filter by name', () => {
      const store = useStationsStore()
      store.stations = mockStations
      
      const filtered = store.filteredStations('ber')
      
      expect(filtered).toEqual([mockStations[0]]) // Berlin
    })

    test('filteredStations should filter by location', () => {
      const store = useStationsStore()
      store.stations = mockStations
      
      const filtered = store.filteredStations('mun')
      
      expect(filtered).toEqual([mockStations[1]]) // Munich
    })

    test('filteredStations should be case insensitive', () => {
      const store = useStationsStore()
      store.stations = mockStations
      
      const filtered = store.filteredStations('BERLIN')
      
      expect(filtered).toEqual([mockStations[0]])
    })
  })

  describe('Actions', () => {
    describe('fetchAllStations', () => {
      test('should fetch stations successfully', async () => {
        const store = useStationsStore()
        
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ stations: mockStations })
        } as Response)
        
        await store.fetchAllStations()
        const expectedUrl = mockUseConfig.getInternalApiUrl().stations
        
        expect(mockFetch).toHaveBeenCalledWith(expectedUrl)
        expect(store.stations).toEqual(mockStations)
        expect(store.loading).toBe(false)
        expect(store.error).toBeNull()
      })

      test('should set loading state during fetch', async () => {
        const store = useStationsStore()
        
        let resolvePromise: (value: any) => void
        const fetchPromise = new Promise(resolve => {
          resolvePromise = resolve
        })
        
        mockFetch.mockReturnValueOnce(fetchPromise as Promise<Response>)
        
        const fetchPromiseResult = store.fetchAllStations()
        
        expect(store.loading).toBe(true)
        
        resolvePromise!({
          ok: true,
          json: async () => ({ stations: mockStations })
        })
        
        await fetchPromiseResult
        
        expect(store.loading).toBe(false)
      })

      test('should handle fetch error', async () => {
        const store = useStationsStore()
        
        mockFetch.mockRejectedValueOnce(new Error('Network error'))
        
        await store.fetchAllStations()
        
        expect(store.error).toBe('Failed to fetch stations')
        expect(store.stations).toEqual([])
        expect(store.loading).toBe(false)
      })

      test('should clear previous error on new fetch', async () => {
        const store = useStationsStore()
        store.error = 'Previous error'
        
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ stations: mockStations })
        } as Response)
        
        await store.fetchAllStations()
        
        expect(store.error).toBeNull()
      })
    })

    describe('selectStation', () => {
      test('should select a station', () => {
        const store = useStationsStore()
        const station = mockStations[0]
        
        store.selectStation(station)
        
        expect(store.selectedStation).toEqual(station)
      })
    })

    describe('clearSelection', () => {
      test('should clear selected station', () => {
        const store = useStationsStore()
        store.selectedStation = mockStations[0]
        
        store.clearSelection()
        
        expect(store.selectedStation).toBeNull()
      })
    })
  })

  describe('Integration Tests', () => {
    test('should handle complete workflow', async () => {
      const store = useStationsStore()
      expect(store.stations).toEqual([])
      expect(store.selectedStation).toBeNull()
      
      // Fetch stations
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ stations: mockStations })
      } as Response)
      
      await store.fetchAllStations()
      
      expect(store.stations).toEqual(mockStations)
      
      const filtered = store.filteredStations('ber')
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('Berlin')
      
      store.selectStation(mockStations[0])
      expect(store.selectedStation).toEqual(mockStations[0])
      
      store.clearSelection()
      expect(store.selectedStation).toBeNull()
    })
  })
}) 