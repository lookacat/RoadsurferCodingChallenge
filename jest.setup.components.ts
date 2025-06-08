import { config } from "@vue/test-utils";
import { jest } from "@jest/globals";

// set global stubs
config.global.stubs = {
  // vuetify basic stubs
  "v-app": true,
  "v-main": true,
  "v-container": true,
  "v-card": true,
  "v-card-title": {
    template:
      '<div class="v-card-title-stub" :class="$attrs.class"><slot /></div>',
  },
  "v-card-subtitle": {
    template: '<div class="v-card-subtitle-stub"><slot /></div>',
  },
  "v-card-text": true,
  "v-chip": {
    template:
      '<div class="v-chip-stub" :color="color" :variant="variant" :class="$attrs.class"><slot /></div>',
    props: ["color", "variant"],
  },
  "v-icon": {
    template:
      '<span class="v-icon-stub">{{ $attrs.icon || $slots.default?.[0] }}</span>',
  },
  "v-data-table": true,
  "v-alert": true,
  "v-avatar": true,
  "v-btn": {
    name: "v-btn",
    template:
      '<button class="v-btn-stub" :disabled="disabled" @click="$emit(\'click\')" :class="$attrs.class"><slot /></button>',
    props: ["disabled", "variant"],
    emits: ["click"],
  },
  "v-select": {
    name: "v-select",
    template:
      '<select class="v-select-stub" :value="modelValue" @change="$emit(\'update:model-value\', $event.target.value)" :disabled="disabled" :class="$attrs.class"><option v-for="item in items" :key="item" :value="item">{{ item }}</option></select>',
    props: [
      "modelValue",
      "items",
      "disabled",
      "variant",
      "density",
      "hideDetails",
      "label",
      "itemTitle",
      "itemValue",
    ],
    emits: ["update:model-value"],
  },
  // vuetify layout stubs
  "v-row": {
    template:
      '<div class="v-row-stub calendar-row" :class="$attrs.class"><slot /></div>',
    props: ["noGutters"],
  },
  "v-col": {
    template:
      '<div class="v-col-stub calendar-day-col" :class="$attrs.class"><slot /></div>',
    props: ["cols"],
  },
  // custom component stubs
  CalendarDayCard: {
    name: "CalendarDayCard",
    template:
      '<div class="calendar-day-card-stub" @booking-click="$emit(\'booking-click\', $event)"><slot /></div>',
    props: ["dayData", "isMobile"],
    emits: ["booking-click"],
  },
};

// Mock store composable
const mockUseStationsStore = () => ({
  selectedStation: null,
  loading: false,
  error: null,
});

(global as any).useStationsStore = jest.fn(mockUseStationsStore);
(global as any).computed = jest.fn((fn: any) => ({ value: fn() }));
(global as any).ref = jest.fn((value: any) => ({ value }));
(global as any).reactive = jest.fn((value: any) => value);
(global as any).readonly = jest.fn((value: any) => value);

// Mock Nuxt global composables/functions
(global as any).useRuntimeConfig = jest.fn(() => ({}));
(global as any).useState = jest.fn((key: string, init?: () => any) => ({
  value: init ? init() : undefined,
}));
(global as any).navigateTo = jest.fn();
(global as any).createError = jest.fn();
(global as any).useRoute = jest.fn(() => ({ params: {}, query: {} }));
(global as any).useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
}));

// Mock vue global composables
(global as any).computed = jest.fn((fn: () => any) => ({ value: fn() }));
(global as any).ref = jest.fn((value: any) => ({ value }));
(global as any).reactive = jest.fn((value: any) => value);
(global as any).readonly = jest.fn((value: any) => value);
(global as any).watch = jest.fn();
(global as any).onMounted = jest.fn();
(global as any).nextTick = jest.fn(() => Promise.resolve());
