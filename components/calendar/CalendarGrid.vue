<template>
  <div class="calendar-grid">
    <v-row no-gutters>
      <v-col
        v-for="(day, index) in weekDays"
        :key="index"
        :cols="isMobile ? '12' : undefined"
        :class="isMobile ? 'mb-2' : 'calendar-day-col'"
      >
        <CalendarDayCard 
          :day-data="day"
          :is-mobile="isMobile"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import CalendarDayCard from './CalendarDayCard.vue'

interface DayData {
  date: Date
  dayName: string
  dayNumber: number
  bookings: any[]
}

defineProps<{
  weekDays: DayData[]
  isMobile: boolean
}>()
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
</style> 