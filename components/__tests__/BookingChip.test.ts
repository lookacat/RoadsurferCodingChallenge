import {
  describe,
  expect,
  test,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount, VueWrapper } from "@vue/test-utils";
import BookingChip from "../calendar/BookingChip.vue";

interface Booking {
  id: string;
  eventType: "start" | "end";
  displayText: string;
  startDate: string;
  endDate: string;
  customerName: string;
}

describe("BookingChip.vue", () => {
  let wrapper: VueWrapper<any>;

  const mockStartBooking: Booking = {
    id: "booking-1",
    eventType: "start",
    displayText: "John Doe started",
    startDate: "2024-03-25T00:00:00.000Z",
    endDate: "2024-03-27T00:00:00.000Z",
    customerName: "John Doe",
  };

  const mockEndBooking: Booking = {
    id: "booking-2",
    eventType: "end",
    displayText: "Jane Smith ended",
    startDate: "2024-03-28T00:00:00.000Z",
    endDate: "2024-03-30T00:00:00.000Z",
    customerName: "Jane Smith",
  };

  const mountComponent = (booking: Booking, size?: string) => {
    const props: any = { booking };
    if (size) props.size = size;

    return mount(BookingChip, {
      props,
      global: {
        stubs: { "v-icon": true },
      },
    });
  };

  beforeEach(() => {
    // Mock computed to return reactive-like objects
    (global as any).computed = jest.fn((fn: () => any) => {
      const computedRef = { value: fn() };
      // Make it behave like a getter for direct access
      Object.defineProperty(computedRef, "toString", {
        value: () => computedRef.value,
      });
      return computedRef;
    });
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    jest.clearAllMocks();
  });

  describe("Component Rendering", () => {
    test("should render correctly with all elements", () => {
      wrapper = mountComponent(mockStartBooking);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(".booking-chip__text").text()).toBe(
        "John Doe started"
      );
      expect(wrapper.find(".booking-chip__icon").exists()).toBe(true);
      expect(wrapper.findComponent({ name: "v-icon" }).attributes("size")).toBe(
        "12"
      );
    });
  });

  describe("Props", () => {
    test("should accept booking and optional size props", () => {
      wrapper = mountComponent(mockStartBooking, "large");

      expect(wrapper.props("booking")).toEqual(mockStartBooking);
      expect(wrapper.props("size")).toBe("large");
    });
  });

  describe("Computed Properties", () => {
    test.each([
      ["start", "primary", "mdi-circle-outline"],
      ["end", "success", "mdi-circle-slice-8"],
      ["unknown", "info", "mdi-circle-outline"],
    ])(
      "should return correct color and icon for %s event type",
      (eventType, expectedColor, expectedIcon) => {
        const booking = { ...mockStartBooking, eventType: eventType as any };
        wrapper = mountComponent(booking);

        expect(wrapper.vm.chipColor.value).toBe(expectedColor);
        expect(wrapper.vm.chipIcon.value).toBe(expectedIcon);
      }
    );
  });

  describe("CSS Classes", () => {
    test("should apply correct base and color classes", () => {
      wrapper = mountComponent(mockStartBooking);
      expect(wrapper.classes()).toContain("booking-chip");
      expect(wrapper.classes()).toContain("booking-chip--primary");

      wrapper.unmount();
      wrapper = mountComponent(mockEndBooking);
      expect(wrapper.classes()).toContain("booking-chip--success");
    });

    test.each(["x-small", "small", "default", "large", "x-large"])(
      "should apply size class for %s size",
      (size) => {
        wrapper = mountComponent(mockStartBooking, size);
        expect(wrapper.classes()).toContain(`booking-chip--${size}`);
      }
    );

    test("should not apply size class when size prop is not provided", () => {
      wrapper = mountComponent(mockStartBooking);
      const sizeClasses = wrapper
        .classes()
        .filter(
          (cls) =>
            cls.startsWith("booking-chip--") &&
            !cls.includes("primary") &&
            !cls.includes("success") &&
            !cls.includes("info")
        );
      expect(sizeClasses).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    test.each([
      ["empty text", ""],
      [
        "long text",
        "This is a very long booking display text that should be truncated properly by the component styling",
      ],
      ["special characters", "João & María started - café@shop.com"],
    ])("should handle %s correctly", (_, displayText) => {
      const booking = { ...mockStartBooking, displayText };
      wrapper = mountComponent(booking);

      expect(wrapper.find(".booking-chip__text").text()).toBe(displayText);
    });
  });
});
