<template>
  <div class="navigation-container mb-4 mt-4">
    <!-- Responsive Navigation Container -->
    <div
      class="d-flex flex-column flex-sm-row align-center justify-center mb-3 navigation-wrapper"
    >
      <!-- Year Selection -->
      <div
        class="year-navigation d-flex justify-center align-center"
        :class="{
          'flex-grow-0': isSmAndUp,
          'w-100': isXs,
        }"
      >
        <v-btn
          @click="$emit('previous-year')"
          variant="flat"
          size="small"
          :disabled="loading"
          class="nav-btn"
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
          :style="yearSelectStyle"
          :disabled="loading"
        ></v-select>

        <v-btn
          @click="$emit('next-year')"
          variant="flat"
          size="small"
          :disabled="loading"
          class="nav-btn"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>

      <!-- Week Selection Dropdown -->
      <div
        class="week-selector d-flex justify-center align-center flex-grow-1"
        :class="{ 'w-100': isXs }"
      >
        <v-btn
          @click="$emit('previous-week')"
          variant="flat"
          size="small"
          :disabled="loading"
          class="nav-btn"
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
          :style="weekSelectStyle"
          :disabled="loading"
        ></v-select>
        <v-btn
          @click="$emit('next-week')"
          variant="flat"
          size="small"
          :disabled="loading"
          class="nav-btn"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </div>
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
import { computed, getCurrentInstance } from "vue";

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

const instance = getCurrentInstance();
const vuetify = instance?.appContext.config.globalProperties.$vuetify;

const isSmAndUp = computed(() => {
  return vuetify?.display?.smAndUp ?? true;
});

const isXs = computed(() => {
  return vuetify?.display?.xs ?? false;
});

const yearSelectStyle = computed(() => {
  if (isSmAndUp.value) {
    return "width: 120px; margin: 0 8px";
  }
  return "width: 100%; margin: 0 8px";
});

const weekSelectStyle = computed(() => {
  return "width: 100%; margin: 0 8px";
});
</script>

<style scoped>
.week-navigation {
  padding: 8px 0;
}

.navigation-wrapper {
  gap: 24px;
}

.nav-btn {
  background-color: #6bbbae !important;
  color: white !important;
  border-radius: 12px !important;
  min-width: 36px !important;
  width: 36px !important;
  height: 36px !important;
}

.nav-btn:hover {
  background-color: #5aa89b !important;
}

.nav-btn:disabled {
  background-color: #a0a0a0 !important;
  color: white !important;
}

@media (min-width: 600px) {
  .year-navigation {
    flex: 0 0 20%;
    max-width: 20%;
  }

  .week-selector {
    flex: 1;
  }
}

@media (max-width: 599px) {
  .year-navigation {
    width: 100%;
    margin-bottom: 16px;
  }

  .week-selector {
    width: 100%;
  }

  .navigation-wrapper {
    gap: 0;
  }
}
</style>
