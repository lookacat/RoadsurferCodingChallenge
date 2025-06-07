<template>
  <v-chip
    :size="size"
    :color="chipColor"
    variant="tonal"
    class="mb-1 mr-1 booking-chip"
  >
    <v-icon 
      :icon="chipIcon"
      size="x-small"
      class="mr-1"
    ></v-icon>
    {{ booking.displayText }}
  </v-chip>
</template>

<script setup lang="ts">
interface Booking {
  id: string
  eventType: 'start' | 'end'
  displayText: string
  startDate: string
  endDate: string
  customerName: string
}

const props = defineProps<{
  booking: Booking
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
}>()

const chipColor = computed(() => {
  if (props.booking.eventType === 'start') {
    return 'primary'
  } else if (props.booking.eventType === 'end') {
    return 'success'
  } else {
    return 'info'
  }
})

const chipIcon = computed(() => {
  if (props.booking.eventType === 'start') {
    return 'mdi-circle-outline'
  } else if (props.booking.eventType === 'end') {
    return 'mdi-circle-slice-8'
  } else {
    return 'mdi-circle-outline'
  }
})
</script>

<style scoped>
.booking-chip {
  font-size: 1rem !important;
  height: 20px !important;
  max-width: 100%;
}

@media (max-width: 768px) {
  .booking-chip {
    font-size: 0.75rem !important;
    height: 20px !important;
  }
}
</style> 