<template>
  <div class="container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-center mb-1">
            <b style="color: #6bbbae">Roadsurfer</b> Coding Challange
          </h1>
          <h4 class="text-center mb-9 text-grey-darken-1">Paul Neubauer</h4>
          <StationAutocomplete class="mb-9" />
          <!-- Content container that connects to the tabs -->
          <ViewModeToggle v-model="viewMode" />
          <div class="content-container">
            <StationCalendarView v-show="viewMode === 'calendar'" />
            <StationBookingsList v-show="viewMode === 'list'" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const viewMode = ref<"list" | "calendar">("calendar");
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
}

.content-container {
  background: white;
  border-radius: 8px;
  border-top-left-radius: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
  margin-top: -2px;
}

/* Remove the default card styling from content components */
.content-container :deep(.v-card) {
  box-shadow: none !important;
  border: none !important;
}
</style>
