<template>
  <div class="container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-center mb-6">Stations List</h1>
          
          <StationAutocomplete />
          <StationBookingsList />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const stationsStore = useStationsStore()
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