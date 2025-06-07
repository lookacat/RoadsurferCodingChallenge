import type { ExternalStation, Station } from "~/types/station";
import { API_CONFIG } from "~/config/api";

export default defineEventHandler(async (event) => {
  try {
    const stationsUrl = `${API_CONFIG.stations.baseUrl}${API_CONFIG.stations.endpoints.list}`;
    const response = await fetch(stationsUrl);
    const stations: ExternalStation[] = await response.json();

    // Filter out station id 7 since it seems to be a nonsense station
    return {
      stations: stations
        .filter((station) => station.id !== "7")
        .map(
          (station): Station => ({
            id: station.id,
            name: station.name,
            location: station.name,
            bookings: station.bookings,
            bookingsCount: station.bookings.length,
          })
        ),
    };
  } catch (error) {
    console.error("Error fetching stations:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch stations",
    });
  }
});
