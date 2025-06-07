<template>
  <div
    :class="[
      'calendar-day',
      { 'today': isToday },
      { 'has-bookings': dayData.bookings.length > 0 }
    ]"
  >
    <div class="day-header">
      <div class="day-name">
        {{ dayData.dayName }}
      </div>
      <div class="day-number" :class="{ 'today-number': isToday }">
        {{ dayData.dayNumber }}
      </div>
    </div>
    
    <div class="bookings-content">
      <div v-if="dayData.bookings.length > 0" class="bookings-list">
        <BookingChip
          v-for="booking in visibleBookings"
          :key="`${booking.id}-${booking.eventType}`"
          :booking="booking"
          :size="isMobile ? 'small' : 'default'"
        />
        
        <div
          v-if="hasMoreBookings"
          class="more-bookings"
        >
          +{{ remainingBookingsCount }} more
        </div>
      </div>
      
      <div v-else class="no-bookings">
        <!-- Empty state, no text needed for clean look -->
      </div>
    </div>
  </div>
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

const maxVisibleBookings = computed(() => props.isMobile ? 3 : 2)

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
.calendar-day {
  height: 100%;
  min-height: 120px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  background: transparent;
  position: relative;
}

.calendar-day.today {
  background-color: rgba(25, 118, 210, 0.04);
}

.calendar-day.has-bookings {
  background-color: rgba(25, 118, 210, 0.02);
}

.calendar-day.today.has-bookings {
  background-color: rgba(25, 118, 210, 0.06);
}

.day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.day-name {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
  margin-bottom: 2px;
}

.day-number {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  line-height: 1;
}

.day-number.today-number {
  color: #1976d2;
  background-color: #1976d2;
  color: white;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.bookings-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.more-bookings {
  font-size: 0.75rem;
  color: #666;
  text-align: center;
  margin-top: 4px;
  padding: 2px 6px;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  align-self: center;
}

.no-bookings {
  flex: 1;
}

@media (max-width: 768px) {
  .calendar-day {
    min-height: 80px;
    padding: 12px;
    border-radius: 0;
  }
  
  .bookings-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px;
  }
  
  .day-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .day-number.today-number {
    width: 24px;
    height: 24px;
    font-size: 0.875rem;
  }
}
</style> 