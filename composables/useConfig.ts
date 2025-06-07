import { API_CONFIG } from "~/config/api";

export const useConfig = () => {
  const getInternalApiUrl = () => {
    return {
      stations: "/api/stations",
      bookings: "/api/stations/%station-id%/bookings/%booking-id%",
    };
  };

  return {
    api: API_CONFIG,
    getInternalApiUrl,
  };
};
