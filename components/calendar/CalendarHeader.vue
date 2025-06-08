<template>
  <v-card-title class="d-flex align-center">
    <v-icon class="mr-2">mdi-map-marker</v-icon>
    {{ station.name }}
  </v-card-title>
  <v-card-subtitle>
    <v-chip color="success" variant="tonal">
      <v-icon start>mdi-calendar-check</v-icon>
      {{ station.bookingsCount }} bookings
    </v-chip>
  </v-card-subtitle>
</template>

<script setup lang="ts">
import type { Station } from "~/types/station";

defineProps<{
  station: Station;
}>();
</script>
