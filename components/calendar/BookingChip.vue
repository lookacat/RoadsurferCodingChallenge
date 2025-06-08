<template>
  <div
    :class="[
      'booking-chip',
      `booking-chip--${chipColor}`,
      { [`booking-chip--${size}`]: size },
    ]"
    @click="handleClick"
    role="button"
    tabindex="0"
    @keydown.enter="handleClick"
    @keydown.space="handleClick"
  >
    <div class="booking-chip__icon">
      <v-icon :icon="chipIcon" size="12"></v-icon>
    </div>
    <span class="booking-chip__text">{{ booking.displayText }}</span>
  </div>
</template>

<script setup lang="ts">
interface Booking {
  id: string;
  eventType: "start" | "end";
  displayText: string;
  startDate: string;
  endDate: string;
  customerName: string;
}

const props = defineProps<{
  booking: Booking;
  size?: "x-small" | "small" | "default" | "large" | "x-large";
}>();

const emit = defineEmits<{
  "booking-click": [booking: Booking];
}>();

const handleClick = () => {
  emit("booking-click", props.booking);
};

const chipColor = computed(() => {
  if (props.booking.eventType === "start") {
    return "primary";
  } else if (props.booking.eventType === "end") {
    return "success";
  } else {
    return "info";
  }
});

const chipIcon = computed(() => {
  if (props.booking.eventType === "start") {
    return "mdi-circle-outline";
  } else if (props.booking.eventType === "end") {
    return "mdi-circle-slice-8";
  } else {
    return "mdi-circle-outline";
  }
});
</script>

<style scoped>
.booking-chip {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.booking-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.booking-chip:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

.booking-chip__icon {
  margin-right: 4px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.booking-chip__text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Color variants */
.booking-chip--primary {
  background-color: rgba(25, 118, 210, 0.12);
  color: #1976d2;
}

.booking-chip--success {
  background-color: rgba(46, 125, 50, 0.12);
  color: #2e7d32;
}

.booking-chip--info {
  background-color: rgba(2, 136, 209, 0.12);
  color: #0288d1;
}

/* Size variants */
.booking-chip--x-small {
  padding: 2px 6px;
  font-size: 0.625rem;
}

.booking-chip--small {
  padding: 3px 6px;
  font-size: 0.6875rem;
}

.booking-chip--large {
  padding: 6px 10px;
  font-size: 0.875rem;
}

.booking-chip--x-large {
  padding: 8px 12px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .booking-chip {
    font-size: 0.6875rem;
    padding: 3px 6px;
  }

  .booking-chip__icon {
    margin-right: 3px;
  }
}
</style>
