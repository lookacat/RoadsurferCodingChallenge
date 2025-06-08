<template>
  <div class="calendar-container">
    <div class="calendar-grid">
      <v-row no-gutters class="calendar-row">
        <v-col
          v-for="(day, index) in weekDays"
          :key="index"
          :cols="isMobile ? '12' : undefined"
          :class="['calendar-day-col', { 'mobile-day': isMobile }]"
        >
          <CalendarDayCard
            :day-data="day"
            :is-mobile="isMobile"
            @booking-click="handleBookingClick"
          />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarDayCard from "./CalendarDayCard.vue";
import type { DayData, DayBooking } from "~/types/station";

defineProps<{
  weekDays: DayData[];
  isMobile: boolean;
}>();

const emit = defineEmits<{
  "booking-click": [booking: DayBooking];
}>();

const handleBookingClick = (booking: DayBooking) => {
  emit("booking-click", booking);
};
</script>

<style scoped>
.calendar-container {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: white;
}

.calendar-grid {
  width: 100%;
}

.calendar-row {
  min-height: 120px;
}

.calendar-day-col {
  border-right: 1px solid #e0e0e0;
  border-bottom: none;
  position: relative;
}

.calendar-day-col:last-child {
  border-right: none;
}

.calendar-day-col.mobile-day {
  border-right: none;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 0;
}
.calendar-day-col.mobile-day:last-child {
  border-bottom: none;
}
@media (max-width: 768px) {
  .calendar-container {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }

  .calendar-row {
    min-height: auto;
  }
}
</style>
