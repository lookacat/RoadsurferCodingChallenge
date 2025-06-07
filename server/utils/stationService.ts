import type { ExternalStation, Station, Booking } from "~/types/station";
import { API_CONFIG } from "~/config/api";

export async function getStations() {
  const stationsUrl = `${API_CONFIG.stations.baseUrl}${API_CONFIG.stations.endpoints.list}`;
  const response = await fetch(stationsUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch stations: ${response.statusText}`);
  }

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
}

export async function getBooking(
  stationId: string,
  bookingId: string
): Promise<{ booking: Booking | null }> {
  // Build the URL using the config pattern
  const bookingUrl =
    `${API_CONFIG.stations.baseUrl}${API_CONFIG.stations.endpoints.bookings}`
      .replace("%station-id%", stationId)
      .replace("%booking-id%", bookingId);

  try {
    const response = await fetch(bookingUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return { booking: null };
      }
      throw new Error(`Failed to fetch booking: ${response.statusText}`);
    }

    const booking: Booking = await response.json();
    return { booking };
  } catch (error) {
    console.warn(
      `Direct booking fetch failed for booking ${bookingId} from station ${stationId}, trying fallback`
    );

    // Fallback: try to find the booking in the station's bookings list
    try {
      const stationsData = await getStations();
      const station = stationsData.stations.find((s) => s.id === stationId);
      const booking = station?.bookings.find((b) => b.id === bookingId) || null;

      if (!booking) {
        throw new Error("Booking not found");
      }

      return { booking };
    } catch (fallbackError) {
      console.error(
        `Fallback also failed for booking ${bookingId} from station ${stationId}:`,
        fallbackError
      );
      throw new Error("Booking not found");
    }
  }
}

export function parseStationRoute(pathSegments: string[]): {
  isStationsList: boolean;
  isBookingRequest: boolean;
  stationId?: string;
  bookingId?: string;
} {
  if (pathSegments.length === 0) {
    return { isStationsList: true, isBookingRequest: false };
  }

  if (pathSegments.length === 3 && pathSegments[1] === "bookings") {
    const [stationId, , bookingId] = pathSegments;
    return {
      isStationsList: false,
      isBookingRequest: true,
      stationId,
      bookingId,
    };
  }

  return { isStationsList: false, isBookingRequest: false };
}
