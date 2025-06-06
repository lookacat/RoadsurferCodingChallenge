<template>
  <div class="container">
    <h1>Stations List</h1>
    <button @click="fetchStations" class="fetch-button">
      Fetch Stations
    </button>
    <div>Debug: {{ stationsData }}</div>
    <div v-if="stationsData?.stations && stationsData.stations.length > 0" class="stations-list">
      <div v-for="station in stationsData.stations" :key="station.id" class="station-item">
        <h3>{{ station.name }}</h3>
        <p><strong>Location:</strong> {{ station.location }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StationResponse {
  stations: Array<{
    id: string;
    name: string;
    location: string;
  }>;
}

const stationsData = ref<StationResponse | null>(null)

async function fetchStations() {
  try {
    const response = await fetch('/api/stations')
    const data = await response.json()
    stationsData.value = data
    console.log('Fetched stations:', stationsData.value)
  } catch (error) {
    console.error('Error fetching stations:', error)
  }
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
}

.fetch-button {
  background-color: #4CAF50;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin: 20px 0;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.fetch-button:hover {
  background-color: #45a049;
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
</style> 