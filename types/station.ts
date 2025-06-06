export interface Booking {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string;
  endDate: string;
}

// External station type from the API
export interface ExternalStation {
  id: string;
  name: string;
  bookings: Booking[];
}

// Internal station type for the application
export interface Station {
  id: string;
  name: string;
  location: string;
  bookings: Booking[];
  bookingsCount: number;
} 