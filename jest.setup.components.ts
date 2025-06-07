import { config } from '@vue/test-utils'
import { jest } from '@jest/globals'

// set global stubs
config.global.stubs = {
  // vuetify stubs
  'v-app': true,
  'v-main': true,
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

// Mock store composable
const mockUseStationsStore = () => ({
  selectedStation: null,
  loading: false,
  error: null
})

;(global as any).useStationsStore = jest.fn(mockUseStationsStore)
;(global as any).computed = jest.fn((fn: any) => ({ value: fn() }))
;(global as any).ref = jest.fn((value: any) => ({ value }))
;(global as any).reactive = jest.fn((value: any) => value)
;(global as any).readonly = jest.fn((value: any) => value) 