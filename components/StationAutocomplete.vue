<template>
  <div class="autocomplete-container">
    <div class="autocomplete-wrapper">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search for a station..."
        class="autocomplete-input"
        @input="onInput"
        @focus="showDropdown = true"
        @blur="onBlur"
      />
      <div class="location-icon">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
            stroke="#6bbbae"
            stroke-width="2"
            fill="none"
          />
          <circle
            cx="12"
            cy="9"
            r="2.5"
            stroke="#6bbbae"
            stroke-width="2"
            fill="none"
          />
        </svg>
      </div>
      <div v-if="stationsStore.loading" class="loading">Loading...</div>

      <div v-if="showDropdown && filteredStations.length > 0" class="dropdown">
        <div
          v-for="station in filteredStations"
          :key="station.id"
          class="dropdown-item"
          @mousedown="selectStation(station)"
        >
          <div class="station-name">{{ station.name }}</div>
          <div class="station-info">{{ station.bookingsCount }} bookings</div>
        </div>
      </div>

      <div
        v-if="showDropdown && searchTerm && filteredStations.length === 0"
        class="dropdown no-results"
      >
        <div class="dropdown-item">No stations found</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Station } from "~/types/station";

const stationsStore = useStationsStore();

const searchTerm = ref("");
const showDropdown = ref(false);

const filteredStations = computed(() => {
  return stationsStore.filteredStations(searchTerm.value).slice(0, 5);
});

const onInput = () => {
  showDropdown.value = true;

  // Fetch stations on type
  if (stationsStore.stations.length === 0 && !stationsStore.loading) {
    stationsStore.fetchAllStations();
  }
};

const onBlur = () => {
  // Hide output after some time to allow for clicks
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const selectStation = (station: Station) => {
  stationsStore.selectStation(station);
  searchTerm.value = station.name;
  showDropdown.value = false;
};
</script>

<style scoped>
.autocomplete-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.autocomplete-wrapper {
  position: relative;
}

.autocomplete-input {
  width: 100%;
  padding: 12px 48px 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.autocomplete-input:focus {
  border-color: #6bbbae;
}

.location-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 12px 16px;
  color: #666;
  font-size: 14px;
  z-index: 1000;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.no-results .dropdown-item {
  cursor: default;
  color: #999;
}

.no-results .dropdown-item:hover {
  background-color: white;
}

.station-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.station-info {
  font-size: 12px;
  color: #666;
}
</style>
