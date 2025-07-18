import {
  describe,
  expect,
  test,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount, VueWrapper } from "@vue/test-utils";
import CalendarHeader from "../calendar/CalendarHeader.vue";
import type { Station } from "~/types/station";

describe("CalendarHeader.vue", () => {
  let wrapper: VueWrapper<any>;

  const mockStation: Station = {
    id: "1",
    name: "Berlin Central Station",
    location: "Berlin, Germany",
    bookingsCount: 25,
    bookings: [],
  };

  const mountComponent = (station: Station = mockStation) => {
    return mount(CalendarHeader, {
      props: { station },
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
    test("should render station information correctly", () => {
      wrapper = mountComponent();

      expect(wrapper.find(".v-card-title-stub").text()).toContain(
        "Berlin Central Station"
      );
      expect(wrapper.find(".v-card-subtitle-stub").text()).toContain(
        "25 bookings"
      );
    });

    test("should render booking chip with correct attributes", () => {
      wrapper = mountComponent();

      const chips = wrapper.findAll(".v-chip-stub");
      expect(chips).toHaveLength(1);

      // Bookings chip
      expect(chips[0].attributes("color")).toBe("success");
      expect(chips[0].attributes("variant")).toBe("tonal");
      expect(chips[0].text()).toContain("25 bookings");
    });
  });

  describe("Props Handling", () => {
    test("should accept and display station prop", () => {
      wrapper = mountComponent();

      expect(wrapper.props("station")).toEqual(mockStation);
    });

    test.each([
      ["Test Station", "Test Location", 0],
      ["München Hauptbahnhof", "Munich, Germany", 100],
      ["Special Chars & Numbers", "Location-123", 999],
    ])(
      "should handle different station data: %s",
      (name, location, bookingsCount) => {
        const station = {
          id: "test-id",
          name,
          location,
          bookingsCount,
          bookings: [],
        };
        wrapper = mountComponent(station);

        expect(wrapper.text()).toContain(name);
        expect(wrapper.text()).toContain(`${bookingsCount} bookings`);
      }
    );
  });

  describe("CSS Classes and Layout", () => {
    test("should apply correct CSS classes", () => {
      wrapper = mountComponent();

      const title = wrapper.find(".v-card-title-stub");
      const bookingChip = wrapper.find(".v-chip-stub");

      expect(title.classes()).toContain("d-flex");
      expect(title.classes()).toContain("align-center");
      expect(bookingChip.attributes("color")).toBe("success");
    });
  });

  describe("Edge Cases", () => {
    test("should handle zero bookings", () => {
      const stationWithZeroBookings = { ...mockStation, bookingsCount: 0 };
      wrapper = mountComponent(stationWithZeroBookings);

      expect(wrapper.text()).toContain("0 bookings");
    });

    test("should handle empty strings gracefully", () => {
      const stationWithEmptyStrings = {
        id: "empty-test",
        name: "",
        location: "",
        bookingsCount: 5,
        bookings: [],
      };
      wrapper = mountComponent(stationWithEmptyStrings);

      // Should still render structure even with empty strings
      expect(wrapper.find(".v-card-title-stub").exists()).toBe(true);
      expect(wrapper.find(".v-card-subtitle-stub").exists()).toBe(true);
      expect(wrapper.text()).toContain("5 bookings");
    });
  });
});
