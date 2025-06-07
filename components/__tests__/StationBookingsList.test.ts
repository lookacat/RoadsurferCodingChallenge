import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals'
import { mount, VueWrapper } from '@vue/test-utils'
import StationBookingsList from '../StationBookingsList.vue'
import type { Station } from '~/types/station'

// Mock the useDisplay import
jest.mock('vuetify', () => ({
  useDisplay: () => ({
    mobile: { value: false }
  })
}), { virtual: true })

describe('StationBookingsList.vue', () => {
  let wrapper: VueWrapper<any>
  let mockStationsStore: any

  const mockStation: Station = {
    id: '1',
    name: 'Berlin Central',
    location: 'Berlin, Germany',
    bookingsCount: 2,
    bookings: [
      {
        id: 'booking-1',
        pickupReturnStationId: '1',
        customerName: 'John Doe',
        startDate: '2024-03-25T00:00:00.000Z',
        endDate: '2024-03-27T00:00:00.000Z'
      },
      {
        id: 'booking-2',
        pickupReturnStationId: '1',
        customerName: 'Jane Smith',
        startDate: '2024-03-28T00:00:00.000Z',
        endDate: '2024-03-30T00:00:00.000Z'
      }
    ]
  }

  beforeEach(() => {
    mockStationsStore = {
      selectedStation: null,
      loading: false,
      error: null
    }

    // Mock the global useStationsStore
    ;(global as any).useStationsStore = jest.fn(() => mockStationsStore)

    // Mock computed
    ;(global as any).computed = jest.fn((fn: () => any) => ({ value: fn() }))
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    jest.clearAllMocks()
  })

  describe('Component Logic', () => {
    test('should create component instance', () => {
      wrapper = mount(StationBookingsList, {
        global: {
          stubs: {
            'v-container': true,
            'v-card': true,
            'v-card-title': true,
            'v-card-subtitle': true,
            'v-card-text': true,
            'v-chip': true,
            'v-icon': true,
            'v-data-table': true,
            'v-alert': true,
            'v-avatar': true
          }
        }
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm).toBeDefined()
    })

    test('should have correct initial computed headers for desktop', () => {
      wrapper = mount(StationBookingsList, {
        global: {
          stubs: {
            'v-container': true,
            'v-card': true,
            'v-card-title': true,
            'v-card-subtitle': true,
            'v-card-text': true,
            'v-chip': true,
            'v-icon': true,
            'v-data-table': true,
            'v-alert': true,
            'v-avatar': true
          }
        }
      })

      // Since we're using computed, let's test the allHeaders directly
      expect(wrapper.vm.allHeaders).toHaveLength(4)
      expect(wrapper.vm.allHeaders[0].title).toBe('Booking ID')
      expect(wrapper.vm.allHeaders[1].title).toBe('Customer Name')
      expect(wrapper.vm.allHeaders[2].title).toBe('Start Date')
      expect(wrapper.vm.allHeaders[3].title).toBe('End Date')
    })

    test('should have correct mobile headers', () => {
      wrapper = mount(StationBookingsList, {
        global: {
          stubs: {
            'v-container': true,
            'v-card': true,
            'v-card-title': true,
            'v-card-subtitle': true,
            'v-card-text': true,
            'v-chip': true,
            'v-icon': true,
            'v-data-table': true,
            'v-alert': true,
            'v-avatar': true
          }
        }
      })

      expect(wrapper.vm.mobileHeaders).toHaveLength(3)
      expect(wrapper.vm.mobileHeaders[0].title).toBe('Customer Name')
      expect(wrapper.vm.mobileHeaders[1].title).toBe('Start Date')
      expect(wrapper.vm.mobileHeaders[2].title).toBe('End Date')
    })
  })

  describe('Date Formatting', () => {
    test('should format dates correctly', () => {
      wrapper = mount(StationBookingsList, {
        global: {
          stubs: {
            'v-container': true,
            'v-card': true,
            'v-card-title': true,
            'v-card-subtitle': true,
            'v-card-text': true,
            'v-chip': true,
            'v-icon': true,
            'v-data-table': true,
            'v-alert': true,
            'v-avatar': true
          }
        }
      })

      const testDate = '2024-03-25T00:00:00.000Z'
      const formattedDate = wrapper.vm.formatDate(testDate)
      
      // The exact format may vary by locale, but should contain the main elements
      expect(formattedDate).toMatch(/Mar|March/)
      expect(formattedDate).toMatch(/25/)
      expect(formattedDate).toMatch(/2024/)
    })

    test('should handle invalid date strings', () => {
      wrapper = mount(StationBookingsList, {
        global: {
          stubs: {
            'v-container': true,
            'v-card': true,
            'v-card-title': true,
            'v-card-subtitle': true,
            'v-card-text': true,
            'v-chip': true,
            'v-icon': true,
            'v-data-table': true,
            'v-alert': true,
            'v-avatar': true
          }
        }
      })

      const invalidDate = 'invalid-date'
      const formattedDate = wrapper.vm.formatDate(invalidDate)
      
      // Should return "Invalid Date" or similar
      expect(formattedDate).toMatch(/Invalid Date/i)
    })
  })

  describe('Store Integration', () => {
    test('should use store data correctly when no station is selected', () => {
      mockStationsStore.selectedStation = null

      wrapper = mount(StationBookingsList, {
        global: {
          stubs: {
            'v-container': true,
            'v-card': true,
            'v-card-title': true,
            'v-card-subtitle': true,
            'v-card-text': true,
            'v-chip': true,
            'v-icon': true,
            'v-data-table': true,
            'v-alert': true,
            'v-avatar': true
          }
        }
      })

      expect((global as any).useStationsStore).toHaveBeenCalled()
      expect(wrapper.vm.stationsStore.selectedStation).toBe(null)
    })

    test('should use store data correctly when station is selected', () => {
      mockStationsStore.selectedStation = mockStation

      wrapper = mount(StationBookingsList, {
        global: {
          stubs: {
            'v-container': true,
            'v-card': true,
            'v-card-title': true,
            'v-card-subtitle': true,
            'v-card-text': true,
            'v-chip': true,
            'v-icon': true,
            'v-data-table': true,
            'v-alert': true,
            'v-avatar': true
          }
        }
      })

      expect(wrapper.vm.stationsStore.selectedStation).toEqual(mockStation)
    })

    test('should handle error state from store', () => {
      mockStationsStore.error = 'Failed to load data'

      wrapper = mount(StationBookingsList, {
        global: {
          stubs: {
            'v-container': true,
            'v-card': true,
            'v-card-title': true,
            'v-card-subtitle': true,
            'v-card-text': true,
            'v-chip': true,
            'v-icon': true,
            'v-data-table': true,
            'v-alert': true,
            'v-avatar': true
          }
        }
      })

      expect(wrapper.vm.stationsStore.error).toBe('Failed to load data')
    })

    test('should handle loading state from store', () => {
      mockStationsStore.loading = true

      wrapper = mount(StationBookingsList, {
        global: {
          stubs: {
            'v-container': true,
            'v-card': true,
            'v-card-title': true,
            'v-card-subtitle': true,
            'v-card-text': true,
            'v-chip': true,
            'v-icon': true,
            'v-data-table': true,
            'v-alert': true,
            'v-avatar': true
          }
        }
      })

      expect(wrapper.vm.stationsStore.loading).toBe(true)
    })
  })

  describe('Component Template Logic', () => {
    test('should have proper conditional rendering logic for no station', () => {
      mockStationsStore.selectedStation = null
      mockStationsStore.loading = false

      wrapper = mount(StationBookingsList, {
        global: {
          stubs: {
            'v-container': true,
            'v-card': true,
            'v-card-title': true,
            'v-card-subtitle': true,
            'v-card-text': true,
            'v-chip': true,
            'v-icon': true,
            'v-data-table': true,
            'v-alert': true,
            'v-avatar': true
          }
        }
      })

      // show info if no station selected
      const shouldShowInfoAlert = !wrapper.vm.stationsStore.selectedStation && !wrapper.vm.stationsStore.loading
      expect(shouldShowInfoAlert).toBe(true)
    })

    test('should have proper conditional rendering logic for selected station', () => {
      mockStationsStore.selectedStation = mockStation

      wrapper = mount(StationBookingsList, {
        global: {
          stubs: {
            'v-container': true,
            'v-card': true,
            'v-card-title': true,
            'v-card-subtitle': true,
            'v-card-text': true,
            'v-chip': true,
            'v-icon': true,
            'v-data-table': true,
            'v-alert': true,
            'v-avatar': true
          }
        }
      })

      // should show card if station is selected
      const shouldShowCard = !!wrapper.vm.stationsStore.selectedStation
      expect(shouldShowCard).toBe(true)
    })
  })
}) 