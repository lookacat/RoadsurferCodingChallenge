import {
  describe,
  expect,
  test,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount, VueWrapper } from "@vue/test-utils";
import CalendarGrid from "../calendar/CalendarGrid.vue";
import type { DayData } from "~/types/station";

describe("CalendarGrid.vue", () => {
  let wrapper: VueWrapper<any>;

  const createMockWeekDays = (count: number = 7): DayData[] => {
    return Array.from({ length: count }, (_, i) => ({
      date: new Date(2024, 2, 25 + i), // March 25-31, 2024
      dayName: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      dayNumber: 25 + i,
      bookings: [
        {
          id: `booking-${i}`,
          eventType: i % 2 === 0 ? "start" : "end",
          displayText: `Customer ${i + 1} ${i % 2 === 0 ? "started" : "ended"}`,
          startDate: `2024-03-${25 + i}T00:00:00.000Z`,
          endDate: `2024-03-${25 + i}T00:00:00.000Z`,
          customerName: `Customer ${i + 1}`,
        },
      ],
    }));
  };

  const mountComponent = (
    weekDays: DayData[] = createMockWeekDays(),
    isMobile: boolean = false
  ) => {
    return mount(CalendarGrid, {
      props: { weekDays, isMobile },
    });
  };

  beforeEach(() => {
    (global as any).computed = jest.fn((fn: () => any) => ({ value: fn() }));
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    test("should render calendar grid structure correctly", () => {
      wrapper = mountComponent();

      expect(wrapper.find(".calendar-container").exists()).toBe(true);
      expect(wrapper.find(".calendar-grid").exists()).toBe(true);
      expect(wrapper.find(".calendar-row").exists()).toBe(true);
    });

    test("should render correct number of day columns", () => {
      const weekDays = createMockWeekDays(7);
      wrapper = mountComponent(weekDays);

      const dayColumns = wrapper.findAll(".calendar-day-col");
      expect(dayColumns).toHaveLength(7);
    });

    test("should render CalendarDayCard components", () => {
      wrapper = mountComponent();

      const dayCards = wrapper.findAllComponents({ name: "CalendarDayCard" });
      expect(dayCards).toHaveLength(7);
    });
  });

  describe("Props Handling", () => {
    test("should accept weekDays and isMobile props", () => {
      const mockWeekDays = createMockWeekDays(5);
      wrapper = mountComponent(mockWeekDays, true);

      expect(wrapper.props("weekDays")).toEqual(mockWeekDays);
      expect(wrapper.props("isMobile")).toBe(true);
    });

    test("should pass correct props to CalendarDayCard components", () => {
      const weekDays = createMockWeekDays(3);
      wrapper = mountComponent(weekDays, true);

      const dayCards = wrapper.findAllComponents({ name: "CalendarDayCard" });
      expect(dayCards[0].props("dayData")).toEqual(weekDays[0]);
      expect(dayCards[0].props("isMobile")).toBe(true);
    });
  });

  describe("Event Handling", () => {
    test("should emit booking-click when CalendarDayCard emits booking-click", async () => {
      wrapper = mountComponent();

      const firstDayCard = wrapper.findComponent({ name: "CalendarDayCard" });
      const mockBooking = {
        id: "test-booking",
        eventType: "start" as const,
        displayText: "Test booking",
        startDate: "2024-03-25T00:00:00.000Z",
        endDate: "2024-03-27T00:00:00.000Z",
        customerName: "Test Customer",
      };

      await firstDayCard.vm.$emit("booking-click", mockBooking);

      expect(wrapper.emitted("booking-click")).toBeTruthy();
      expect(wrapper.emitted("booking-click")![0]).toEqual([mockBooking]);
    });
  });

  describe("Responsive Behavior", () => {
    test("should apply mobile classes when isMobile is true", () => {
      wrapper = mountComponent(createMockWeekDays(), true);

      const dayColumns = wrapper.findAll(".calendar-day-col");
      dayColumns.forEach((column) => {
        expect(column.classes()).toContain("mobile-day");
      });
    });

    test("should not apply mobile classes when isMobile is false", () => {
      wrapper = mountComponent(createMockWeekDays(), false);

      const dayColumns = wrapper.findAll(".calendar-day-col");
      dayColumns.forEach((column) => {
        expect(column.classes()).not.toContain("mobile-day");
      });
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty weekDays array", () => {
      wrapper = mountComponent([]);

      const dayColumns = wrapper.findAll(".calendar-day-col");
      expect(dayColumns).toHaveLength(0);
    });

    test("should handle different numbers of days", () => {
      const partialWeek = createMockWeekDays(3);
      wrapper = mountComponent(partialWeek);

      const dayColumns = wrapper.findAll(".calendar-day-col");
      expect(dayColumns).toHaveLength(3);
    });
  });

  describe("CSS Classes and Styling", () => {
    test("should apply correct base CSS classes", () => {
      wrapper = mountComponent();

      expect(wrapper.find(".calendar-container").exists()).toBe(true);
      expect(wrapper.find(".calendar-grid").exists()).toBe(true);
      expect(wrapper.find(".calendar-row").classes()).toContain("calendar-row");
    });

    test("should apply calendar-day-col class to all day columns", () => {
      wrapper = mountComponent();

      const dayColumns = wrapper.findAll(".calendar-day-col");
      dayColumns.forEach((column) => {
        expect(column.classes()).toContain("calendar-day-col");
      });
    });
  });
});
