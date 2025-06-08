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
    props: ["start"],
  },
  "v-data-table": true,
  "v-alert": true,
  "v-avatar": true,
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
