import { describe, expect, test } from "@jest/globals";
import { API_CONFIG } from "~/config/api";
import { useConfig } from "./useConfig";

describe("usConfig", () => {
  test("getInternalApiUrl", () => {
    const { getInternalApiUrl } = useConfig();
    const apiUrls = getInternalApiUrl();
    expect(apiUrls).toEqual({
      stations: "/api/stations",
      bookings: "/api/stations/%station-id%/bookings/%booking-id%",
    });
  });
  test("api", () => {
    const { api } = useConfig();
    expect(api).toEqual(API_CONFIG);
  });
});
