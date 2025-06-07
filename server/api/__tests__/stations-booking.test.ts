import {
  describe,
  expect,
  test,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { getStations, getBooking, parseStationRoute } from "~/server/utils/stationService";

jest.mock("~/config/api", () => ({
  API_CONFIG: {
    stations: {
      baseUrl: "https://test-api.com",
      endpoints: {
        list: "/stations",
        bookings: "/stations/%station-id%/bookings/%booking-id%",
      },
    },
  },
}));

// Mock global fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

describe("Station Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("parseStationRoute", () => {
    test("should parse empty path as stations list request", () => {
      const result = parseStationRoute([]);
      expect(result).toEqual({
        isStationsList: true,
        isBookingRequest: false,
      });
    });

    test("should parse booking request path", () => {
      const result = parseStationRoute(["station-1", "bookings", "booking-123"]);
      expect(result).toEqual({
        isStationsList: false,
        isBookingRequest: true,
        stationId: "station-1",
        bookingId: "booking-123",
      });
    });

    test("should return false for invalid paths", () => {
      const result = parseStationRoute(["invalid", "path"]);
      expect(result).toEqual({
        isStationsList: false,
        isBookingRequest: false,
      });
    });
  });

  describe("getStations", () => {
    test("should return filtered stations list", async () => {
      const mockStations = [
        {
          id: "1",
          name: "Station 1",
          bookings: [{ id: "booking1", customerName: "John" }],
        },
        { id: "7", name: "Station 7", bookings: [] }, // Should be filtered out
        { id: "2", name: "Station 2", bookings: [] },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStations,
      } as Response);

      const result = await getStations();

      expect(result.stations).toHaveLength(2);
      expect(result.stations.map((s: any) => s.id)).toEqual(["1", "2"]);
      expect(result.stations[0]).toEqual({
        id: "1",
        name: "Station 1",
        location: "Station 1",
        bookings: [{ id: "booking1", customerName: "John" }],
        bookingsCount: 1,
      });
    });

    test("should throw error when fetch fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as Response);

      await expect(getStations()).rejects.toThrow("Failed to fetch stations: Internal Server Error");
    });
  });

  describe("getBooking", () => {
    test("should return specific booking when found", async () => {
      const mockBooking = {
        id: "booking-123",
        pickupReturnStationId: "station-1",
        customerName: "John Doe",
        startDate: "2024-03-25",
        endDate: "2024-03-27",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBooking,
      } as Response);

      const result = await getBooking("station-1", "booking-123");

      expect(result.booking).toEqual(mockBooking);
      expect(mockFetch).toHaveBeenCalledWith(
        "https://test-api.com/stations/station-1/bookings/booking-123"
      );
    });

    test("should return null when booking not found", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
      } as Response);

      const result = await getBooking("station-1", "nonexistent");

      expect(result.booking).toBeNull();
    });

    test("should fallback to stations list when direct booking fetch fails", async () => {
      const mockStations = [
        {
          id: "station-1",
          name: "Station 1",
          bookings: [
            {
              id: "booking-123",
              customerName: "John Doe",
              startDate: "2024-03-25",
              endDate: "2024-03-27",
            },
          ],
        },
      ];

      // First call fails
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      // Second call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStations,
      } as Response);

      const result = await getBooking("station-1", "booking-123");

      expect(result.booking).toEqual({
        id: "booking-123",
        customerName: "John Doe",
        startDate: "2024-03-25",
        endDate: "2024-03-27",
      });
    });

    test("should throw error when booking not found in fallback", async () => {
      const mockStations = [
        {
          id: "station-1",
          name: "Station 1",
          bookings: [],
        },
      ];

      // First call fails
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      // Second call succeeds but booking not found
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockStations,
      } as Response);

      await expect(getBooking("station-1", "nonexistent")).rejects.toThrow("Booking not found");
    });
  });
});
