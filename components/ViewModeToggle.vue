<template>
  <div class="view-mode-tabs">
    <button
      @click="$emit('update:modelValue', 'calendar')"
      :class="[
        'view-mode-tab',
        { 'view-mode-tab--active': modelValue === 'calendar' },
      ]"
    >
      <v-icon start>mdi-calendar</v-icon>
      Calendar
    </button>
    <button
      @click="$emit('update:modelValue', 'list')"
      :class="[
        'view-mode-tab',
        { 'view-mode-tab--active': modelValue === 'list' },
      ]"
    >
      <v-icon start>mdi-format-list-bulleted</v-icon>
      List
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: "list" | "calendar";
}>();

defineEmits<{
  "update:modelValue": [value: "list" | "calendar"];
}>();
</script>

<style scoped>
.view-mode-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 2px;
  padding-left: 20px;
  z-index: 10;
  position: relative;
}

.view-mode-tab {
  padding: 12px 24px;
  border: none;
  background: #f5f5f5;
  color: #666;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 3;
}

.view-mode-tab:hover {
  background: #eeeeee;
  color: #555;
}

.view-mode-tab--active {
  background: white;
  color: #333;
}

.view-mode-tab--active:hover {
  background: white;
  color: #333;
}
</style>
