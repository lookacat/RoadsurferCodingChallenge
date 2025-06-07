export const API_CONFIG = {
  stations: {
    baseUrl: "https://605c94c36d85de00170da8b4.mockapi.io",
    endpoints: {
      list: "/stations",
      bookings: "/stations/%station-id%/bookings/%booking-id%",
    },
  },
} as const;
