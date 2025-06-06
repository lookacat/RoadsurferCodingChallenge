export interface Booking {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string;
  endDate: string;
}

export interface ExternalStation {
  id: string;
  name: string;
  bookings: Booking[];
}

export interface Station {
  id: string;
  name: string;
  location: string;
  bookings: Booking[];
  bookingsCount: number;
} 