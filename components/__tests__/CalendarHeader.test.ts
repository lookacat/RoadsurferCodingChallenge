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

interface Station {
  name: string;
  location: string;
  bookingsCount: number;
}

describe("CalendarHeader.vue", () => {
  let wrapper: VueWrapper<any>;

  const mockStation: Station = {
    name: "Berlin Central Station",
    location: "Berlin, Germany",
    bookingsCount: 25,
  };

  const mountComponent = (station: Station = mockStation) => {
    return mount(CalendarHeader, {
      props: { station },
      global: {
        stubs: {
          "v-card-title": {
            template:
              '<div class="v-card-title-stub" :class="$attrs.class"><slot /></div>',
          },
          "v-card-subtitle": {
            template: '<div class="v-card-subtitle-stub"><slot /></div>',
          },
          "v-icon": {
            template:
              '<span class="v-icon-stub">{{ $attrs.icon || $slots.default?.[0] }}</span>',
            props: ["start"],
          },
          "v-chip": {
            template:
              '<div class="v-chip-stub" :color="color" :variant="variant" :class="$attrs.class"><slot /></div>',
            props: ["color", "variant"],
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
    test("should render station information correctly", () => {
      wrapper = mountComponent();

      expect(wrapper.find(".v-card-title-stub").text()).toContain(
        "Berlin Central Station"
      );
      expect(wrapper.find(".v-card-subtitle-stub").text()).toContain(
        "Berlin, Germany"
      );
      expect(wrapper.find(".v-card-subtitle-stub").text()).toContain(
        "25 bookings"
      );
    });

    test("should render icons and chips with correct attributes", () => {
      wrapper = mountComponent();

      const chips = wrapper.findAll(".v-chip-stub");
      expect(chips).toHaveLength(2);

      // Location chip
      expect(chips[0].attributes("color")).toBe("primary");
      expect(chips[0].attributes("variant")).toBe("tonal");
      expect(chips[0].text()).toContain("Berlin, Germany");

      // Bookings chip
      expect(chips[1].attributes("color")).toBe("success");
      expect(chips[1].attributes("variant")).toBe("tonal");
      expect(chips[1].text()).toContain("25 bookings");
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
        const station = { name, location, bookingsCount };
        wrapper = mountComponent(station);

        expect(wrapper.text()).toContain(name);
        expect(wrapper.text()).toContain(location);
        expect(wrapper.text()).toContain(`${bookingsCount} bookings`);
      }
    );
  });

  describe("CSS Classes and Layout", () => {
    test("should apply correct CSS classes", () => {
      wrapper = mountComponent();

      const title = wrapper.find(".v-card-title-stub");
      const subtitle = wrapper.find(".v-card-subtitle-stub");
      const locationChip = wrapper.findAll(".v-chip-stub")[0];

      expect(title.classes()).toContain("d-flex");
      expect(title.classes()).toContain("align-center");
      expect(locationChip.classes()).toContain("mr-2");
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
        name: "",
        location: "",
        bookingsCount: 5,
      };
      wrapper = mountComponent(stationWithEmptyStrings);

      // Should still render structure even with empty strings
      expect(wrapper.find(".v-card-title-stub").exists()).toBe(true);
      expect(wrapper.find(".v-card-subtitle-stub").exists()).toBe(true);
      expect(wrapper.text()).toContain("5 bookings");
    });
  });
});
