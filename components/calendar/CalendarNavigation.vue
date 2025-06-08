<template>
  <div class="navigation-container mb-4 mt-4">
    <!-- Year Selection -->
    <div class="year-navigation d-flex justify-center align-center mb-3">
      <v-btn
        @click="$emit('previous-year')"
        variant="text"
        size="small"
        :disabled="loading"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <v-select
        :model-value="currentYear"
        @update:model-value="$emit('update:current-year', $event)"
        :items="availableYears"
        variant="outlined"
        density="compact"
        label="Select Year"
        hide-details
        style="width: 120px; margin: 0 8px"
        :disabled="loading"
      ></v-select>

      <v-btn
        @click="$emit('next-year')"
        variant="text"
        size="small"
        :disabled="loading"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <!-- Week Selection Dropdown -->
    <div class="week-selector d-flex justify-center align-center mb-3">
      <v-btn
        @click="$emit('previous-week')"
        variant="text"
        size="small"
        :disabled="loading"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-select
        :model-value="selectedWeekOption"
        @update:model-value="$emit('week-select', $event)"
        :items="weekOptions"
        item-title="label"
        item-value="value"
        variant="outlined"
        density="compact"
        hide-details
        label="Select Week"
        style="width: 120px; margin: 0 8px"
        :disabled="loading"
      ></v-select>
      <v-btn
        @click="$emit('next-week')"
        variant="text"
        size="small"
        :disabled="loading"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <!-- Week Navigation -->
    <div
      class="week-navigation d-flex justify-center align-center align-center"
    >
      <div class="text-h6 text-center">
        {{ weekRangeText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeekOption } from "~/types/station";

defineProps<{
  currentYear: number;
  availableYears: number[];
  selectedWeekOption: string;
  weekOptions: WeekOption[];
  weekRangeText: string;
  loading: boolean;
}>();

defineEmits<{
  "previous-year": [];
  "next-year": [];
  "update:current-year": [year: number];
  "previous-week": [];
  "next-week": [];
  "week-select": [weekValue: string];
}>();
</script>

<style scoped>
.week-navigation {
  padding: 8px 0;
}
</style>
