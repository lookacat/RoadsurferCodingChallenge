<template>
  <v-container>
    <div v-if="stationsStore.selectedStation">
      <v-card>
        <CalendarHeader :station="stationsStore.selectedStation" />
        <v-card-text>
          <CalendarNavigation
            v-model:current-year="currentYear"
            :available-years="availableYears"
            :selected-week-option="selectedWeekOption"
            :week-options="weekOptions"
            :week-range-text="formatWeekRange(currentWeekStart)"
            :loading="stationsStore.loading"
            @previous-year="previousYear"
            @next-year="nextYear"
            @previous-week="previousWeek"
            @next-week="nextWeek"
            @week-select="onWeekSelect"
          />
          <CalendarGrid 
            :week-days="weekDays"
            :is-mobile="isMobile"
          />
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
import CalendarHeader from './calendar/CalendarHeader.vue'
import CalendarNavigation from './calendar/CalendarNavigation.vue'
import CalendarGrid from './calendar/CalendarGrid.vue'

const stationsStore = useStationsStore()
const { mobile } = useDisplay()

const isMobile = computed(() => mobile.value)
const currentWeekStart = ref(getStartOfWeek(new Date()))
const currentYear = ref(new Date().getFullYear())
const selectedWeekOption = ref<string>('')

const availableYears = computed(() => {
  const currentYearValue = new Date().getFullYear()
  const years = []
  for (let i = currentYearValue - 5; i <= currentYearValue + 5; i++) {
    years.push(i)
  }
  return years
})

const weekOptions = computed(() => {
  const weeks = []
  const yearStart = new Date(currentYear.value, 0, 1)
  const yearEnd = new Date(currentYear.value, 11, 31)
  
  // Find the first Monday of the year
  let currentWeek = getStartOfWeek(yearStart)
  
  // If the first week starts in the previous year, start from the next week
  if (currentWeek.getFullYear() < currentYear.value) {
    currentWeek = new Date(currentWeek)
    currentWeek.setDate(currentWeek.getDate() + 7)
  }
  
  while (currentWeek <= yearEnd) {
    const weekEnd = new Date(currentWeek)
    weekEnd.setDate(currentWeek.getDate() + 6)
    
    // Only include weeks that have at least some days in the current year
    if (weekEnd.getFullYear() >= currentYear.value) {
      const eventCount = getEventCountForWeek(currentWeek)
      const weekRangeText = formatWeekRange(currentWeek)
      const weekLabel = `${weekRangeText} (${eventCount} events)`
      
      weeks.push({
        label: weekLabel,
        value: weekRangeText,
        weekStartDate: new Date(currentWeek),
        eventCount: eventCount
      })
    }
    // Move to next week
    currentWeek.setDate(currentWeek.getDate() + 7)
  }
  
  return weeks
})

watch(currentYear, (newYear) => {
  const newDate = new Date(currentWeekStart.value)
  newDate.setFullYear(newYear)
  currentWeekStart.value = getStartOfWeek(newDate)
  selectedWeekOption.value = formatWeekRange(currentWeekStart.value)
})

watch(currentWeekStart, (newWeek) => {
  selectedWeekOption.value = formatWeekRange(newWeek)
})

onMounted(() => {
  selectedWeekOption.value = formatWeekRange(currentWeekStart.value)
})

// Year navigation
function previousYear() {
  currentYear.value -= 1
}

function nextYear() {
  currentYear.value += 1
}

function onWeekSelect(weekValue: string) {
  if (weekValue) {
    const selectedWeek = weekOptions.value.find(week => week.value === weekValue)
    if (selectedWeek) {
      currentWeekStart.value = new Date(selectedWeek.weekStartDate)
      // Update year if selected week is in a different year
      if (selectedWeek.weekStartDate.getFullYear() !== currentYear.value) {
        currentYear.value = selectedWeek.weekStartDate.getFullYear()
      }
    }
  }
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
  if (newDate.getFullYear() !== currentYear.value) {
    currentYear.value = newDate.getFullYear()
  }
}

function getEventCountForWeek(weekStart: Date): number {
  if (!stationsStore.selectedStation?.bookings) return 0
  
  let totalEvents = 0
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(weekStart)
    currentDay.setDate(weekStart.getDate() + i)
    totalEvents += getBookingEventsForDate(currentDay).length
  }
  
  return totalEvents
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
    
    const dayEvents = getBookingEventsForDate(date)
    
    days.push({
      date: new Date(date),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: date.getDate(),
      bookings: dayEvents
    })
  }
  
  return days
})

function getBookingEventsForDate(date: Date) {
  if (!stationsStore.selectedStation?.bookings) return []
  
  const events: any[] = []
  
  stationsStore.selectedStation.bookings.forEach(booking => {
    const startDate = new Date(booking.startDate)
    const endDate = new Date(booking.endDate)
    
    if (date.toDateString() === startDate.toDateString()) {
      events.push({
        ...booking,
        eventType: 'start',
        displayText: `${booking.customerName} started`
      })
    }
    
    if (date.toDateString() === endDate.toDateString()) {
      events.push({
        ...booking,
        eventType: 'end',
        displayText: `${booking.customerName} ended`
      })
    }
  })
  
  return events
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
</script> 