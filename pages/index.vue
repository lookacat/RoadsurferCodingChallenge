<template>
  <div class="container">
    <h1>Stations List</h1>
    <button @click="fetchStations" class="fetch-button">
      Fetch Stations
    </button>
    <div v-if="stations.length > 0" class="stations-list">
      <div v-for="station in stations" :key="station.id" class="station-item">
        <h3>{{ station.name }}</h3>
        <p>Location: {{ station.location }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const stations = ref([])

async function fetchStations() {
  try {
    const response = await fetch('/api/stations')
    const data = await response.json()
    stations.value = data.stations
  } catch (error) {
    console.error('Error fetching stations:', error)
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
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
  margin-top: 20px;
}

.station-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.station-item h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.station-item p {
  margin: 0;
  color: #666;
}
</style> 