import {
  describe,
  expect,
  test,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount, VueWrapper } from "@vue/test-utils";
import CalendarDayCard from "../calendar/CalendarDayCard.vue";

interface DayBooking {
  id: string;
  eventType: "start" | "end";
  displayText: string;
  startDate: string;
  endDate: string;
  customerName: string;
}

interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  bookings: DayBooking[];
}

describe("CalendarDayCard.vue", () => {
  let wrapper: VueWrapper<any>;

  const createDayData = (
    dateStr: string,
    bookingCount: number = 0
  ): DayData => {
    const date = new Date(dateStr);
    const bookings: DayBooking[] = Array.from(
      { length: bookingCount },
      (_, i) => ({
        id: `booking-${i + 1}`,
        eventType: i % 2 === 0 ? "start" : "end",
        displayText: `Customer ${i + 1} ${i % 2 === 0 ? "started" : "ended"}`,
        startDate: dateStr,
        endDate: dateStr,
        customerName: `Customer ${i + 1}`,
      })
    );

    return {
      date,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      bookings,
    };
  };

  const mountComponent = (dayData: DayData, isMobile: boolean = false) => {
    return mount(CalendarDayCard, {
      props: { dayData, isMobile },
      global: {
        stubs: {
          BookingChip: {
            template:
              '<div class="booking-chip-stub" @click="handleClick">{{ booking.displayText }}</div>',
            props: ["booking", "size"],
            emits: ["booking-click"],
            methods: {
              handleClick() {
                this.$emit("booking-click", this.booking);
              },
            },
          },
        },
      },
    });
  };

  beforeEach(() => {
    (global as any).computed = jest.fn((fn: () => any) => {
      const computedRef = { value: fn() };
      // Make the computed ref work properly in templates
      computedRef.toString = () => computedRef.value.toString();
      computedRef.valueOf = () => computedRef.value;
      return computedRef;
    });

    // Mock Date.now to have consistent "today" tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-03-25T12:00:00Z"));
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    test("should render day header and content correctly", () => {
      const dayData = createDayData("2024-03-25T00:00:00Z");
      wrapper = mountComponent(dayData);

      expect(wrapper.find(".day-name").text()).toBe("Mon");
      expect(wrapper.find(".day-number").text()).toBe("25");
      expect(wrapper.find(".bookings-content").exists()).toBe(true);
    });

    test("should highlight today with special styling", () => {
      const todayData = createDayData("2024-03-25T00:00:00Z"); // Same as mocked system time
      wrapper = mountComponent(todayData);

      expect(wrapper.classes()).toContain("today");
      expect(wrapper.find(".day-number").classes()).toContain("today-number");
    });
  });

  describe("Booking Display Logic", () => {
    test.each([
      [0, false, 0, false],
      [1, false, 1, false],
      [2, false, 2, false],
      [3, false, 2, true, 1],
      [5, false, 2, true, 3],
      [2, true, 2, false],
      [4, true, 3, true, 1],
    ])(
      "with %i bookings on %s mobile should show %i visible and hasMore=%s",
      (
        totalBookings,
        isMobile,
        expectedVisible,
        expectedHasMore,
        expectedRemaining = 0
      ) => {
        const dayData = createDayData("2024-03-26T00:00:00Z", totalBookings);
        wrapper = mountComponent(dayData, isMobile);

        expect(wrapper.vm.maxVisibleBookings.value).toBe(isMobile ? 3 : 2);
        expect(wrapper.vm.visibleBookings.value).toHaveLength(expectedVisible);
        expect(wrapper.vm.hasMoreBookings.value).toBe(expectedHasMore);

        if (expectedHasMore) {
          expect(wrapper.vm.remainingBookingsCount.value).toBe(
            expectedRemaining
          );
          expect(wrapper.find(".more-bookings").text()).toContain(
            `+${expectedRemaining} more`
          );
        }
      }
    );
  });

  describe("CSS Classes", () => {
    test("should apply correct conditional classes", () => {
      const dayWithBookings = createDayData("2024-03-26T00:00:00Z", 2);
      wrapper = mountComponent(dayWithBookings);
      expect(wrapper.classes()).toContain("has-bookings");

      wrapper.unmount();

      const todayWithBookings = createDayData("2024-03-25T00:00:00Z", 1);
      wrapper = mountComponent(todayWithBookings);
      expect(wrapper.classes()).toEqual(
        expect.arrayContaining(["today", "has-bookings"])
      );
    });
  });

  describe("Props Handling", () => {
    test("should handle different day data and mobile configurations", () => {
      const dayData = createDayData("2024-03-20T00:00:00Z", 1);
      wrapper = mountComponent(dayData, true);

      expect(wrapper.props("dayData")).toEqual(dayData);
      expect(wrapper.props("isMobile")).toBe(true);
      expect(wrapper.vm.maxVisibleBookings.value).toBe(3); // Mobile shows 3
    });
  });

  describe("Booking Click Events", () => {
    test("should emit booking-click event when BookingChip is clicked", async () => {
      const dayData = createDayData("2024-03-26T00:00:00Z", 2);
      wrapper = mountComponent(dayData);

      const firstBookingChip = wrapper.find(".booking-chip-stub");
      await firstBookingChip.trigger("click");

      expect(wrapper.emitted("booking-click")).toBeTruthy();
      expect(wrapper.emitted("booking-click")).toHaveLength(1);
    });

    test("should not emit events when no bookings exist", () => {
      const dayData = createDayData("2024-03-26T00:00:00Z", 0);
      wrapper = mountComponent(dayData);

      expect(wrapper.findAll(".booking-chip-stub")).toHaveLength(0);
      expect(wrapper.emitted("booking-click")).toBeFalsy();
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty bookings gracefully", () => {
      const dayData = createDayData("2024-03-26T00:00:00Z", 0);
      wrapper = mountComponent(dayData);

      expect(wrapper.find(".no-bookings").exists()).toBe(true);
      expect(wrapper.find(".more-bookings").exists()).toBe(false);
      expect(wrapper.findAllComponents({ name: "BookingChip" })).toHaveLength(
        0
      );
    });

    test("should handle edge dates correctly", () => {
      // Use a specific date we can control
      const edgeDate = createDayData("2024-01-31T00:00:00Z");
      wrapper = mountComponent(edgeDate);

      expect(wrapper.find(".day-number").text()).toBe("31");
      expect(wrapper.find(".day-name").text()).toBe("Wed");
    });
  });
});
