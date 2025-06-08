<template>
  <div class="container">
    <v-container :class="{ 'px-0': $vuetify.display.mobile }">
      <v-row>
        <v-col cols="12" :class="{ 'px-0': $vuetify.display.mobile }">
          <div :class="{ 'px-4': $vuetify.display.mobile }">
            <h1 class="text-center mb-1">
              <b style="color: #6bbbae">Roadsurfer</b> Coding Challenge
            </h1>
            <h4 class="text-center mb-9 text-grey-darken-1">Paul Neubauer</h4>
            <StationAutocomplete class="mb-9" />
          </div>
          <!-- Content container that connects to the tabs -->
          <div class="content-and-toggle">
            <ViewModeToggle v-model="viewMode" />
            <div class="content-container">
              <StationCalendarView v-show="viewMode === 'calendar'" />
              <StationBookingsList v-show="viewMode === 'list'" />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const viewMode = ref<"list" | "calendar">("calendar");
const stationsStore = useStationsStore();

onMounted(() => {
  // TODO: Remove, test code
  stationsStore.fetchBooking("1", "1").then(() => {
    console.log(stationsStore.selectedBooking);
  });
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .container {
    max-width: none;
    padding: 10px 0;
  }
}

h1 {
  color: #333;
}

.content-container {
  background: white;
  border-radius: 8px;
  position: relative;
  z-index: 1;
  margin-top: -2px;
}

@media (max-width: 768px) {
  .content-container {
    border-radius: 0;
    margin-left: 0;
    margin-right: 0;
  }
}

/* Remove the default card styling from content components */
.content-container :deep(.v-card) {
  box-shadow: none !important;
  border: none !important;
}

.content-and-toggle {
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

@media (max-width: 768px) {
  .content-and-toggle {
    margin-left: 0;
    margin-right: 0;
  }
}
</style>
