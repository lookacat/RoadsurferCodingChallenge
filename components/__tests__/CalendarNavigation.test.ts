import {
  describe,
  expect,
  test,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount, VueWrapper } from "@vue/test-utils";
import CalendarNavigation from "../calendar/CalendarNavigation.vue";

interface WeekOption {
  label: string;
  value: string;
  weekStartDate: Date;
  eventCount: number;
}

describe("CalendarNavigation.vue", () => {
  let wrapper: VueWrapper<any>;

  const mockProps = {
    currentYear: 2024,
    availableYears: [2022, 2023, 2024, 2025, 2026],
    selectedWeekOption: "Mar 25 - 31, 2024",
    weekOptions: [
      {
        label: "Mar 25 - 31, 2024 (5 events)",
        value: "Mar 25 - 31, 2024",
        weekStartDate: new Date(2024, 2, 25),
        eventCount: 5,
      },
      {
        label: "Apr 1 - 7, 2024 (2 events)",
        value: "Apr 1 - 7, 2024",
        weekStartDate: new Date(2024, 3, 1),
        eventCount: 2,
      },
    ],
    weekRangeText: "Mar 25 - 31, 2024",
    loading: false,
  };

  const mountComponent = (props = mockProps) => {
    return mount(CalendarNavigation, {
      props,
      global: {
        stubs: {
          "v-btn": {
            name: "v-btn",
            template:
              '<button class="v-btn-stub" :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
            props: ["variant", "size", "disabled"],
            emits: ["click"],
          },
          "v-select": {
            name: "v-select",
            template:
              '<select class="v-select-stub" :value="modelValue" :disabled="disabled"><option v-for="item in items" :key="getItemValue(item)" :value="getItemValue(item)">{{ getItemTitle(item) }}</option></select>',
            props: [
              "modelValue",
              "items",
              "itemTitle",
              "itemValue",
              "variant",
              "density",
              "hideDetails",
              "label",
              "disabled",
            ],
            emits: ["update:model-value"],
            methods: {
              getItemValue(item: any) {
                return this.itemValue ? item[this.itemValue] : item;
              },
              getItemTitle(item: any) {
                return this.itemTitle ? item[this.itemTitle] : item;
              },
            },
          },
          "v-icon": { template: '<span class="v-icon-stub"><slot /></span>' },
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
    test("should render navigation sections correctly", () => {
      wrapper = mountComponent();

      expect(wrapper.find(".year-navigation").exists()).toBe(true);
      expect(wrapper.find(".week-selector").exists()).toBe(true);
      expect(wrapper.find(".week-navigation").exists()).toBe(true);
      expect(wrapper.find(".text-h6").text()).toBe("Mar 25 - 31, 2024");
    });

    test("should render year and week selection dropdowns", () => {
      wrapper = mountComponent();

      const selects = wrapper.findAllComponents({ name: "v-select" });
      expect(selects).toHaveLength(2);

      // Year select
      expect(selects[0].props("modelValue")).toBe(2024);
      expect(selects[0].props("items")).toEqual([2022, 2023, 2024, 2025, 2026]);

      // Week select
      expect(selects[1].props("modelValue")).toBe("Mar 25 - 31, 2024");
      expect(selects[1].props("items")).toEqual(mockProps.weekOptions);
    });
  });

  describe("Event Emissions", () => {
    test.each([
      ["previous-year", 0],
      ["next-year", 1],
      ["previous-week", 2],
      ["next-week", 3],
    ])(
      "should emit %s when corresponding button is clicked",
      async (eventName, buttonIndex) => {
        wrapper = mountComponent();

        const buttons = wrapper.findAllComponents({ name: "v-btn" });
        await buttons[buttonIndex].vm.$emit("click");

        expect(wrapper.emitted(eventName)).toHaveLength(1);
      }
    );

    test("should emit update:current-year when year changes", async () => {
      wrapper = mountComponent();

      const yearSelect = wrapper.findAllComponents({ name: "v-select" })[0];
      await yearSelect.vm.$emit("update:model-value", 2025);

      expect(wrapper.emitted("update:current-year")).toEqual([[2025]]);
    });

    test("should emit week-select when week changes", async () => {
      wrapper = mountComponent();

      const weekSelect = wrapper.findAllComponents({ name: "v-select" })[1];
      await weekSelect.vm.$emit("update:model-value", "Apr 1 - 7, 2024");

      expect(wrapper.emitted("week-select")).toEqual([["Apr 1 - 7, 2024"]]);
    });
  });

  describe("Loading State", () => {
    test("should disable all interactive elements when loading", () => {
      const loadingProps = { ...mockProps, loading: true };
      wrapper = mountComponent(loadingProps);

      const buttons = wrapper.findAllComponents({ name: "v-btn" });
      const selects = wrapper.findAllComponents({ name: "v-select" });

      buttons.forEach((button) => {
        expect(button.props("disabled")).toBe(true);
      });

      selects.forEach((select) => {
        expect(select.props("disabled")).toBe(true);
      });
    });

    test("should enable all interactive elements when not loading", () => {
      wrapper = mountComponent();

      const buttons = wrapper.findAllComponents({ name: "v-btn" });
      const selects = wrapper.findAllComponents({ name: "v-select" });

      buttons.forEach((button) => {
        expect(button.props("disabled")).toBe(false);
      });

      selects.forEach((select) => {
        expect(select.props("disabled")).toBe(false);
      });
    });
  });

  describe("Props Handling", () => {
    test("should accept and display all required props", () => {
      wrapper = mountComponent();

      expect(wrapper.props("currentYear")).toBe(2024);
      expect(wrapper.props("availableYears")).toEqual([
        2022, 2023, 2024, 2025, 2026,
      ]);
      expect(wrapper.props("selectedWeekOption")).toBe("Mar 25 - 31, 2024");
      expect(wrapper.props("weekRangeText")).toBe("Mar 25 - 31, 2024");
      expect(wrapper.props("loading")).toBe(false);
    });

    test("should handle different week options correctly", () => {
      const customWeekOptions = [
        {
          label: "Jan 1 - 7, 2024 (0 events)",
          value: "Jan 1 - 7, 2024",
          weekStartDate: new Date(2024, 0, 1),
          eventCount: 0,
        },
      ];
      const customProps = {
        ...mockProps,
        weekOptions: customWeekOptions,
        selectedWeekOption: "Jan 1 - 7, 2024",
      };
      wrapper = mountComponent(customProps);

      const weekSelect = wrapper.findAllComponents({ name: "v-select" })[1];
      expect(weekSelect.props("items")).toEqual(customWeekOptions);
      expect(weekSelect.props("modelValue")).toBe("Jan 1 - 7, 2024");
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty arrays gracefully", () => {
      const emptyProps = {
        ...mockProps,
        availableYears: [],
        weekOptions: [],
      };
      wrapper = mountComponent(emptyProps);

      const selects = wrapper.findAllComponents({ name: "v-select" });
      expect(selects[0].props("items")).toEqual([]);
      expect(selects[1].props("items")).toEqual([]);
    });
  });
});
