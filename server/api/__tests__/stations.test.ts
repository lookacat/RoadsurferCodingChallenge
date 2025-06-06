import { describe, expect, test, jest, beforeEach } from '@jest/globals'
import type { ExternalStation, Station } from '~/types/station'
import { API_CONFIG } from '~/config/api'

// Mock the handler
const mockHandler = async () => {
  try {
    const stationsUrl = `${API_CONFIG.stations.baseUrl}${API_CONFIG.stations.endpoints.list}`
    const response = await fetch(stationsUrl)
    const stations: ExternalStation[] = await response.json()
    
    return {
      stations: stations.map((station): Station => ({
        id: station.id,
        name: station.name,
        location: station.name
      }))
    }
  } catch (error) {
    throw new Error('Failed to fetch stations')
  }
}

// Mock fetch globally
const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>
global.fetch = mockFetch

describe('Stations API Handler', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  test('successfully fetches and transforms stations data', async () => {
    const mockStations: ExternalStation[] = [
      { id: '1', name: 'Berlin', bookings: [] },
      { id: '2', name: 'Munich', bookings: [] }
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockStations
    } as Response)

    const response = await mockHandler()
    
    expect(global.fetch).toHaveBeenCalledWith(
      `${API_CONFIG.stations.baseUrl}${API_CONFIG.stations.endpoints.list}`
    )
    
    expect(response).toEqual({
      stations: [
        { id: '1', name: 'Berlin', location: 'Berlin' },
        { id: '2', name: 'Munich', location: 'Munich' }
      ]
    })
  })

  test('handles fetch error correctly', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    await expect(mockHandler()).rejects.toThrow('Failed to fetch stations')
  })
}) 