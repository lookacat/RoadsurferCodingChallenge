import {
  describe,
  expect,
  test,
  jest,
  beforeEach,
  afterEach,
} from "@jest/globals";
import { mount, VueWrapper } from "@vue/test-utils";
import ViewModeToggle from "../ViewModeToggle.vue";

describe("ViewModeToggle.vue", () => {
  let wrapper: VueWrapper<any>;

  const mountComponent = (modelValue: "list" | "calendar" = "calendar") => {
    return mount(ViewModeToggle, {
      props: { modelValue },
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
    test("should render both view mode buttons", () => {
      wrapper = mountComponent();

      const buttons = wrapper.findAll(".view-mode-tab");
      expect(buttons).toHaveLength(2);

      expect(buttons[0].text()).toContain("Calendar");
      expect(buttons[1].text()).toContain("List");
    });
  });

  describe("Props Handling", () => {
    test("should accept modelValue prop", () => {
      wrapper = mountComponent("list");

      expect(wrapper.props("modelValue")).toBe("list");
    });

    test.each([["calendar"], ["list"]])(
      "should handle %s modelValue",
      (modelValue) => {
        wrapper = mountComponent(modelValue as "list" | "calendar");

        expect(wrapper.props("modelValue")).toBe(modelValue);
      }
    );
  });

  describe("Active State CSS Classes", () => {
    test("should apply active class to calendar button when calendar is selected", () => {
      wrapper = mountComponent("calendar");

      const buttons = wrapper.findAll(".view-mode-tab");
      expect(buttons[0].classes()).toContain("view-mode-tab--active");
      expect(buttons[1].classes()).not.toContain("view-mode-tab--active");
    });

    test("should apply active class to list button when list is selected", () => {
      wrapper = mountComponent("list");

      const buttons = wrapper.findAll(".view-mode-tab");
      expect(buttons[0].classes()).not.toContain("view-mode-tab--active");
      expect(buttons[1].classes()).toContain("view-mode-tab--active");
    });
  });

  describe("Event Emissions", () => {
    test("should emit update:modelValue with 'calendar' when calendar button is clicked", async () => {
      wrapper = mountComponent("list");

      const calendarButton = wrapper.findAll(".view-mode-tab")[0];
      await calendarButton.trigger("click");

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0]).toEqual(["calendar"]);
    });

    test("should emit update:modelValue with 'list' when list button is clicked", async () => {
      wrapper = mountComponent("calendar");

      const listButton = wrapper.findAll(".view-mode-tab")[1];
      await listButton.trigger("click");

      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue")![0]).toEqual(["list"]);
    });
  });
});
