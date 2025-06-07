import { defineStore } from "pinia";
import type { Booking, Station } from "~/types/station";

const { getInternalApiUrl } = useConfig();
const apiUrls = getInternalApiUrl();

interface StationsState {
  stations: Station[];
  selectedStation: Station | null;
  loading: boolean;
  error: string | null;
  selectedBooking: Booking | null;
}

export const useStationsStore = defineStore("stations", {
  state: (): StationsState => ({
    stations: [],
    selectedStation: null,
    loading: false,
    error: null,
    selectedBooking: null,
  }),

  getters: {
    stationNames: (state) =>
      state.stations.map((station) => ({
        id: station.id,
        name: station.name,
        location: station.location,
      })),

    filteredStations: (state) => (searchTerm: string) => {
      if (!searchTerm) return state.stations;
      const term = searchTerm.toLowerCase();
      return state.stations.filter(
        (station) =>
          station.name.toLowerCase().includes(term) ||
          station.location.toLowerCase().includes(term)
      );
    },
  },

  actions: {
    async fetchAllStations() {
      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(apiUrls.stations);
        const data = await response.json();
        this.stations = data.stations;
      } catch (error) {
        this.error = "Failed to fetch stations";
        console.error("Error fetching stations:", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchBooking(stationId: string, bookingId: string) {
      try {
        const response = await fetch(
          apiUrls.bookings
            .replace("%station-id%", stationId)
            .replace("%booking-id%", bookingId)
        );
        const data = await response.json();
        this.selectedBooking = data.booking;
      } catch (error) {
        this.error = "Failed to fetch booking";
        console.error("Error fetching booking:", error);
      } finally {
        this.loading = false;
      }
    },

    selectStation(station: Station) {
      this.selectedStation = station;
    },

    clearSelection() {
      this.selectedStation = null;
    },
  },
});
