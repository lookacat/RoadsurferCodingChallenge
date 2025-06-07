<template>
  <v-card
    variant="outlined"
    :class="[
      'calendar-day-card',
      { 'today': isToday },
      { 'has-bookings': dayData.bookings.length > 0 }
    ]"
    :height="isMobile ? 'auto' : '120'"
  >
    <v-card-title class="pa-2 text-center">
      <div class="day-header">
        <div class="day-name text-caption text-medium-emphasis">
          {{ dayData.dayName }}
        </div>
        <div class="day-number text-h6" :class="{ 'text-primary': isToday }">
          {{ dayData.dayNumber }}
        </div>
      </div>
    </v-card-title>
    
    <v-card-text class="pa-2" style="min-height: 60px;">
      <div v-if="dayData.bookings.length > 0" class="bookings-list">
        <BookingChip
          v-for="booking in visibleBookings"
          :key="`${booking.id}-${booking.eventType}`"
          :booking="booking"
          :size="isMobile ? 'default' : 'large'"
        />
        
        <v-chip
          v-if="hasMoreBookings"
          size="x-small"
          color="info"
          variant="outlined"
          class="mb-1"
        >
          +{{ remainingBookingsCount }} more
        </v-chip>
      </div>
      
      <div v-else class="text-center text-caption text-medium-emphasis">
        No bookings
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import BookingChip from './BookingChip.vue'

interface DayBooking {
  id: string
  eventType: 'start' | 'end'
  displayText: string
  startDate: string
  endDate: string
  customerName: string
}

interface DayData {
  date: Date
  dayName: string
  dayNumber: number
  bookings: DayBooking[]
}

const props = defineProps<{
  dayData: DayData
  isMobile: boolean
}>()

const isToday = computed(() => {
  const today = new Date()
  return props.dayData.date.toDateString() === today.toDateString()
})

const maxVisibleBookings = computed(() => props.isMobile ? 5 : 2)

const visibleBookings = computed(() => 
  props.dayData.bookings.slice(0, maxVisibleBookings.value)
)

const hasMoreBookings = computed(() => 
  props.dayData.bookings.length > maxVisibleBookings.value
)

const remainingBookingsCount = computed(() => 
  props.dayData.bookings.length - maxVisibleBookings.value
)
</script>

<style scoped>
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

@media (max-width: 768px) {
  .calendar-day-card {
    border-radius: 8px !important;
    margin-bottom: 8px;
  }
  
  .bookings-list {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style> 