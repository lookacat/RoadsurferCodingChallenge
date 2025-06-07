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

interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  bookings: any[];
}

describe("CalendarGrid.vue", () => {
  let wrapper: VueWrapper<any>;

  const createWeekDays = (count: number = 7): DayData[] => {
    return Array.from({ length: count }, (_, i) => ({
      date: new Date(2024, 2, 25 + i),
      dayName: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
      dayNumber: 25 + i,
      bookings: [],
    }));
  };

  const mountComponent = (
    weekDays: DayData[] = createWeekDays(),
    isMobile: boolean = false
  ) => {
    return mount(CalendarGrid, {
      props: { weekDays, isMobile },
      global: {
        stubs: {
          "v-row": {
            template:
              '<div class="v-row-stub" :class="$attrs.class"><slot /></div>',
            props: ["noGutters"],
            inheritAttrs: false,
          },
          "v-col": {
            template:
              '<div class="v-col-stub" :cols="cols" :class="$attrs.class"><slot /></div>',
            props: ["cols"],
            inheritAttrs: false,
          },
          CalendarDayCard: {
            name: "CalendarDayCard",
            template:
              '<div class="calendar-day-card-stub">{{ dayData.dayName }} {{ dayData.dayNumber }}</div>',
            props: ["dayData", "isMobile"],
          },
        },
      },
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
    test("should render calendar structure with correct elements", () => {
      wrapper = mountComponent();

      expect(wrapper.find(".calendar-container").exists()).toBe(true);
      expect(wrapper.find(".calendar-grid").exists()).toBe(true);
      expect(wrapper.find(".v-row-stub").classes()).toContain("calendar-row");
    });

    test("should render correct number of day columns", () => {
      const weekDays = createWeekDays(5);
      wrapper = mountComponent(weekDays);

      const dayColumns = wrapper.findAll(".v-col-stub");
      expect(dayColumns).toHaveLength(5);
    });
  });

  describe("Mobile vs Desktop Layout", () => {
    test.each([
      [false, undefined, false], // Desktop: no cols, no mobile-day class
      [true, "12", true], // Mobile: cols="12", has mobile-day class
    ])(
      "should apply correct layout for isMobile=%s",
      (isMobile, expectedCols, hasMobileClass) => {
        wrapper = mountComponent(createWeekDays(), isMobile);

        const dayColumns = wrapper.findAll(".v-col-stub");
        dayColumns.forEach((col) => {
          if (expectedCols) {
            expect(col.attributes("cols")).toBe(expectedCols);
          } else {
            expect(col.attributes("cols")).toBeUndefined();
          }

          if (hasMobileClass) {
            expect(col.classes()).toContain("mobile-day");
          } else {
            expect(col.classes()).not.toContain("mobile-day");
          }

          // Always has base class
          expect(col.classes()).toContain("calendar-day-col");
        });
      }
    );
  });

  describe("Props Handling", () => {
    test("should accept and use weekDays and isMobile props", () => {
      const customWeekDays = createWeekDays(3);
      wrapper = mountComponent(customWeekDays, true);

      expect(wrapper.props("weekDays")).toEqual(customWeekDays);
      expect(wrapper.props("isMobile")).toBe(true);
    });

    test("should pass correct props to CalendarDayCard components", () => {
      const weekDays = createWeekDays(2);
      wrapper = mountComponent(weekDays, true);

      const dayCards = wrapper.findAllComponents({ name: "CalendarDayCard" });

      expect(dayCards).toHaveLength(2);
      expect(dayCards[0].props("dayData")).toEqual(weekDays[0]);
      expect(dayCards[0].props("isMobile")).toBe(true);
      expect(dayCards[1].props("dayData")).toEqual(weekDays[1]);
      expect(dayCards[1].props("isMobile")).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty weekDays array", () => {
      wrapper = mountComponent([]);

      expect(wrapper.findAll(".v-col-stub")).toHaveLength(0);
      expect(
        wrapper.findAllComponents({ name: "CalendarDayCard" })
      ).toHaveLength(0);
    });

    test("should handle single day", () => {
      const singleDay = createWeekDays(1);
      wrapper = mountComponent(singleDay);

      expect(wrapper.findAll(".v-col-stub")).toHaveLength(1);
      expect(
        wrapper.findAllComponents({ name: "CalendarDayCard" })
      ).toHaveLength(1);
    });
  });
});
