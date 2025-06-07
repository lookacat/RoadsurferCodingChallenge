<template>
  <div class="container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-center mb-6">Stations List</h1>
          
          <StationAutocomplete />
          <v-card class="mb-4" variant="outlined">
            <v-card-text class="d-flex align-center justify-center">
              <v-btn-toggle
                v-model="viewMode"
                mandatory
                color="primary"
                variant="outlined"
                divided
              >
                <v-btn 
                  value="list"
                  size="large"
                  :variant="viewMode === 'list' ? 'flat' : 'outlined'"
                >
                  <v-icon start>mdi-format-list-bulleted</v-icon>
                  List
                </v-btn>
                <v-btn 
                  value="calendar"
                  size="large"
                  :variant="viewMode === 'calendar' ? 'flat' : 'outlined'"
                >
                  <v-icon start>mdi-calendar</v-icon>
                  Calendar
                </v-btn>
              </v-btn-toggle>
            </v-card-text>
          </v-card>
          
          <StationBookingsList v-show="viewMode === 'list'" />
          <StationCalendarView v-show="viewMode === 'calendar'" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const viewMode = ref<'list' | 'calendar'>('list')
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
</style> 