import {
  getStations,
  getBooking,
  parseStationRoute,
} from "~/server/utils/stationService";

export default defineEventHandler(async (event) => {
  try {
    const params = getRouterParams(event);
    const pathSegments = params.stations
      ? String(params.stations).split("/")
      : [];

    const routeInfo = parseStationRoute(pathSegments);

    if (routeInfo.isStationsList) {
      return await getStations();
    } else if (
      routeInfo.isBookingRequest &&
      routeInfo.stationId &&
      routeInfo.bookingId
    ) {
      return await getBooking(routeInfo.stationId, routeInfo.bookingId);
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: "Not Found",
      });
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }

    console.error("Error in stations API:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
