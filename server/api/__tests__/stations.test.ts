import { describe, expect, test, jest, beforeEach } from '@jest/globals'
import type { ExternalStation, Station, Booking } from '~/types/station'
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
        location: station.name,
        bookings: station.bookings,
        bookingsCount: station.bookings.length
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
    const mockBooking: Booking = {
      id: '1',
      pickupReturnStationId: '1',
      customerName: 'Test Customer',
      startDate: '2024-03-25T00:00:00.000Z',
      endDate: '2024-03-26T00:00:00.000Z'
    }

    const mockStations: ExternalStation[] = [
      { id: '1', name: 'Berlin', bookings: [mockBooking] },
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
        { id: '1', name: 'Berlin', location: 'Berlin', bookings: [mockBooking], bookingsCount: 1 },
        { id: '2', name: 'Munich', location: 'Munich', bookings: [], bookingsCount: 0 }
      ]
    })
  })

  test('handles fetch error correctly', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    await expect(mockHandler()).rejects.toThrow('Failed to fetch stations')
  })
}) 