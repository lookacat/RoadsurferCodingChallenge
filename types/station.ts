export interface Booking {
  id: string;
  pickupReturnStationId: string;
  customerName: string;
  startDate: string;
  endDate: string;
}

// Booking with additional display properties for calendar components
export interface DayBooking {
  id: string;
  eventType: "start" | "end";
  displayText: string;
  startDate: string;
  endDate: string;
  customerName: string;
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

// Calendar day data structure
export interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  bookings: DayBooking[];
}

// Week option for calendar navigation
export interface WeekOption {
  label: string;
  value: string;
  weekStartDate: Date;
  eventCount: number;
}
