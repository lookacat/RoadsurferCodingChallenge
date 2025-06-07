<template>
  <v-container>
    <div v-if="stationsStore.selectedStation">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-calendar</v-icon>
          {{ stationsStore.selectedStation.name }} - Calendar View
        </v-card-title>
        <v-card-subtitle>
          <v-chip color="primary" variant="tonal" class="mr-2">
            <v-icon start>mdi-map-marker-outline</v-icon>
            {{ stationsStore.selectedStation.location }}
          </v-chip>
          <v-chip color="success" variant="tonal">
            <v-icon start>mdi-calendar-check</v-icon>
            {{ stationsStore.selectedStation.bookingsCount }} bookings
          </v-chip>
        </v-card-subtitle>
        
        <v-card-text>
          <div class="navigation-container mb-4">
            <!-- Year Selection -->
            <div class="year-navigation d-flex justify-center align-center mb-3">
              <v-btn
                @click="previousYear"
                variant="text"
                size="small"
                :disabled="stationsStore.loading"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              
              <v-select
                v-model="currentYear"
                :items="availableYears"
                variant="outlined"
                density="compact"
                hide-details
                style="width: 120px; margin: 0 8px;"
                :disabled="stationsStore.loading"
              ></v-select>
              
              <v-btn
                @click="nextYear"
                variant="text"
                size="small"
                :disabled="stationsStore.loading"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
            
            <!-- Week Navigation -->
            <div class="week-navigation d-flex justify-space-between align-center">
              <v-btn
                @click="previousWeek"
                variant="outlined"
                size="small"
                :disabled="stationsStore.loading"
              >
                <v-icon start>mdi-chevron-left</v-icon>
                Previous
              </v-btn>
              
              <div class="text-h6 text-center">
                {{ formatWeekRange(currentWeekStart) }}
              </div>
              
              <v-btn
                @click="nextWeek"
                variant="outlined"
                size="small"
                :disabled="stationsStore.loading"
              >
                Next
                <v-icon end>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </div>
          
          <!-- Week Calendar Grid -->
          <div class="calendar-grid">
            <v-row no-gutters>
              <v-col
                v-for="(day, index) in weekDays"
                :key="index"
                :cols="isMobile ? '12' : undefined"
                :class="isMobile ? 'mb-2' : 'calendar-day-col'"
              >
                <v-card
                  variant="outlined"
                  :class="[
                    'calendar-day-card',
                    { 'today': isToday(day.date) },
                    { 'has-bookings': day.bookings.length > 0 }
                  ]"
                  :height="isMobile ? 'auto' : '120'"
                >
                  <v-card-title class="pa-2 text-center">
                    <div class="day-header">
                      <div class="day-name text-caption text-medium-emphasis">
                        {{ day.dayName }}
                      </div>
                      <div class="day-number text-h6" :class="{ 'text-primary': isToday(day.date) }">
                        {{ day.dayNumber }}
                      </div>
                    </div>
                  </v-card-title>
                  
                  <v-card-text class="pa-2" style="min-height: 60px;">
                    <div v-if="day.bookings.length > 0" class="bookings-list">
                      <v-chip
                        v-for="booking in day.bookings.slice(0, isMobile ? 5 : 2)"
                        :key="booking.id"
                        size="large"
                        :color="getBookingChipColor(booking, day.date)"
                        variant="tonal"
                        class="mb-1 mr-1 booking-chip"
                      >
                        <v-icon 
                          :icon="getBookingIcon(booking, day.date)"
                          size="x-small"
                          class="mr-1"
                        ></v-icon>
                        {{ booking.customerName }} {{ isBookingStarting(booking, day.date) ? 'started' : 'ended' }}
                      </v-chip>
                      
                      <v-chip
                        v-if="day.bookings.length > (isMobile ? 5 : 2)"
                        size="x-small"
                        color="info"
                        variant="outlined"
                        class="mb-1"
                      >
                        +{{ day.bookings.length - (isMobile ? 5 : 2) }} more
                      </v-chip>
                    </div>
                    
                    <div v-else class="text-center text-caption text-medium-emphasis">
                      No bookings
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
    </div>
    
    <v-alert
      v-else-if="!stationsStore.selectedStation && !stationsStore.loading"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      Please select a station to view its bookings calendar
    </v-alert>
    
    <v-alert
      v-if="stationsStore.error"
      type="error"
      variant="tonal"
      class="mt-4"
    >
      {{ stationsStore.error }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const stationsStore = useStationsStore()
const { mobile } = useDisplay()

const isMobile = computed(() => mobile.value)
const currentWeekStart = ref(getStartOfWeek(new Date()))
const currentYear = ref(new Date().getFullYear())
const availableYears = computed(() => {
  const currentYearValue = new Date().getFullYear()
  const years = []
  for (let i = currentYearValue - 5; i <= currentYearValue + 5; i++) {
    years.push(i)
  }
  return years
})

watch(currentYear, (newYear) => {
  const newDate = new Date(currentWeekStart.value)
  newDate.setFullYear(newYear)
  currentWeekStart.value = getStartOfWeek(newDate)
})

// Year navigation
function previousYear() {
  currentYear.value -= 1
}

function nextYear() {
  currentYear.value += 1
}

// Week navigation
function previousWeek() {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeekStart.value = newDate
  if (newDate.getFullYear() !== currentYear.value) {
    currentYear.value = newDate.getFullYear()
  }
}

function nextWeek() {
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeekStart.value = newDate
  // Update year if week crosses year boundary
  if (newDate.getFullYear() !== currentYear.value) {
    currentYear.value = newDate.getFullYear()
  }
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

const weekDays = computed(() => {
  const days = []
  const weekStart = new Date(currentWeekStart.value)
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    
    const dayBookings = getBookingsForDate(date)
    
    days.push({
      date: new Date(date),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      bookings: dayBookings
    })
  }
  
  return days
})

function getBookingsForDate(date: Date) {
  if (!stationsStore.selectedStation?.bookings) return []
  
  return stationsStore.selectedStation.bookings.filter(booking => {
    const startDate = new Date(booking.startDate)
    const endDate = new Date(booking.endDate)
    
    const isStartDate = date.toDateString() === startDate.toDateString()
    const isEndDate = date.toDateString() === endDate.toDateString()
    
    return isStartDate || isEndDate
  })
}

function isToday(date: Date): boolean {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  
  const startMonth = weekStart.toLocaleDateString('en-US', { month: 'short' })
  const startDay = weekStart.getDate()
  const endMonth = weekEnd.toLocaleDateString('en-US', { month: 'short' })
  const endDay = weekEnd.getDate()
  const year = weekStart.getFullYear()
  
  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}, ${year}`
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
  }
}

function getBookingChipColor(booking: any, date: Date): string {
  const startDate = new Date(booking.startDate)
  const endDate = new Date(booking.endDate)
  
  if (date.toDateString() === startDate.toDateString()) {
    return 'primary'
  } else if (date.toDateString() === endDate.toDateString()) {
    return 'success'
  } else {
    return 'info'
  }
}

function isBookingEnding(booking: any, date: Date): boolean {
	const startDate = new Date(booking.startDate)
	const endDate = new Date(booking.endDate)

	return date.toDateString() === endDate.toDateString()
}

function isBookingStarting(booking: any, date: Date): boolean {
	const startDate = new Date(booking.startDate)
	return date.toDateString() === startDate.toDateString()
}

function getBookingIcon(booking: any, date: Date): string {
  if (isBookingStarting(booking, date)) {
    return 'mdi-circle-outline'
  } else if (isBookingEnding(booking, date)) {
    return 'mdi-circle-slice-8'
  } else {
    return 'mdi-circle-outline'
  }
}
</script>

<style scoped>
.calendar-grid {
  width: 100%;
}

.calendar-day-col {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.calendar-day-col:last-child {
  border-right: none;
}

.calendar-day-card {
  border-radius: 0 !important;
  transition: all 0.2s ease;
}

.calendar-day-card:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.calendar-day-card.today {
  border-color: rgb(var(--v-theme-primary));
  border-width: 2px;
}

.calendar-day-card.has-bookings {
  background-color: rgba(var(--v-theme-primary), 0.02);
}

.day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.day-name {
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.day-number {
  line-height: 1;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.booking-chip {
  font-size: 1rem !important;
  height: 20px !important;
  max-width: 100%;
}

.week-navigation {
  padding: 8px 0;
}

@media (max-width: 768px) {
  .calendar-day-card {
    border-radius: 8px !important;
    margin-bottom: 8px;
  }
  
  .bookings-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .booking-chip {
    font-size: 0.75rem !important;
    height: 20px !important;
  }
}
</style> 