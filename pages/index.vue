<template>
  <div class="container">
    <h1>Stations List</h1>
    
    <StationAutocomplete />
    
    <div v-if="stationsStore.selectedStation" class="selected-station">
      <h2>Selected Station</h2>
      <div class="station-item">
        <h3>{{ stationsStore.selectedStation.name }}</h3>
        <p><strong>Location:</strong> {{ stationsStore.selectedStation.location }}</p>
        <p><strong>Total Bookings:</strong> {{ stationsStore.selectedStation.bookingsCount }}</p>
        <div v-if="stationsStore.selectedStation.bookings.length > 0" class="latest-booking">
          <h4>Latest Booking:</h4>
          <p><strong>Customer:</strong> {{ stationsStore.selectedStation.bookings[0].customerName }}</p>
          <p><strong>Start Date:</strong> {{ formatDate(stationsStore.selectedStation.bookings[0].startDate) }}</p>
          <p><strong>End Date:</strong> {{ formatDate(stationsStore.selectedStation.bookings[0].endDate) }}</p>
        </div>
      </div>
    </div>
    
    <div v-if="!stationsStore.selectedStation && stationsStore.stations.length > 0" class="stations-list">
      <h2>All Stations</h2>
      <div v-for="station in stationsStore.stations" :key="station.id" class="station-item">
        <h3>{{ station.name }}</h3>
        <p><strong>Location:</strong> {{ station.location }}</p>
        <p><strong>Total Bookings:</strong> {{ station.bookingsCount }}</p>
        <div v-if="station.bookings.length > 0" class="latest-booking">
          <h4>Latest Booking:</h4>
          <p><strong>Customer:</strong> {{ station.bookings[0].customerName }}</p>
          <p><strong>Start Date:</strong> {{ formatDate(station.bookings[0].startDate) }}</p>
          <p><strong>End Date:</strong> {{ formatDate(station.bookings[0].endDate) }}</p>
        </div>
      </div>
    </div>
    
    <div v-if="stationsStore.error" class="error">
      {{ stationsStore.error }}
    </div>
  </div>
</template>

<script setup lang="ts">
const stationsStore = useStationsStore()

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #333;
  margin: 30px 0 20px 0;
}

.selected-station {
  margin: 30px 0;
}

.stations-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.station-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.selected-station .station-item {
  background-color: #e8f5e8;
  border: 2px solid #4CAF50;
}

.station-item h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.4em;
}

.station-item p {
  margin: 5px 0;
  color: #666;
}

.station-item strong {
  color: #333;
}

.latest-booking {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.latest-booking h4 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
  text-align: center;
}
</style> 