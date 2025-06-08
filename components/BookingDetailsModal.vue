<template>
  <v-dialog
    v-model="isOpen"
    :fullscreen="$vuetify.display.mobile"
    :max-width="$vuetify.display.mobile ? undefined : '500px'"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <span class="text-h6">Booking Details</span>
        <v-btn icon variant="text" @click="closeModal" size="large">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-6">
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" />
          <p class="mt-4 text-body-1">Loading booking details...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <v-icon color="error" size="48" class="mb-4">mdi-alert-circle</v-icon>
          <p class="text-body-1 text-error">{{ error }}</p>
          <v-btn
            color="primary"
            variant="outlined"
            @click="fetchBookingDetails"
            class="mt-4"
          >
            Try Again
          </v-btn>
        </div>

        <div v-else-if="booking" class="booking-details">
          <div class="detail-item mb-4">
            <div class="detail-label">Customer Name</div>
            <div class="detail-value">{{ booking.customerName }}</div>
          </div>

          <div class="detail-item mb-4">
            <div class="detail-label">Booking Start Date</div>
            <div class="detail-value">{{ formatDate(booking.startDate) }}</div>
          </div>

          <div class="detail-item mb-4">
            <div class="detail-label">Booking End Date</div>
            <div class="detail-value">{{ formatDate(booking.endDate) }}</div>
          </div>

          <div class="detail-item mb-4">
            <div class="detail-label">Booking Duration</div>
            <div class="detail-value">{{ bookingDuration }}</div>
          </div>

          <div class="detail-item">
            <div class="detail-label">Pickup-Return Station Name</div>
            <div class="detail-value">{{ stationName }}</div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Booking } from "~/types/station";

interface Props {
  modelValue: boolean;
  stationId: string;
  bookingId: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const stationsStore = useStationsStore();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const loading = ref(false);
const error = ref<string | null>(null);
const booking = ref<Booking | null>(null);
const stationName = ref<string>("");

const closeModal = () => {
  isOpen.value = false;
};

const fetchBookingDetails = async () => {
  if (!props.stationId || !props.bookingId) return;

  loading.value = true;
  error.value = null;

  try {
    await stationsStore.fetchBooking(props.stationId, props.bookingId);
    booking.value = stationsStore.selectedBooking;

    // Get station name
    const station = stationsStore.stations.find(
      (s) => s.id === props.stationId
    );
    stationName.value = station?.name || `Station ${props.stationId}`;

    if (!booking.value) {
      error.value = "Booking not found";
    }
  } catch (err) {
    console.error("Failed to fetch booking:", err);
    error.value = "Failed to load booking details";
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const bookingDuration = computed(() => {
  if (!booking.value?.startDate || !booking.value?.endDate) return "";

  const start = new Date(booking.value.startDate);
  const end = new Date(booking.value.endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
});

// Watch for prop changes to fetch new data
watch(
  () => [props.stationId, props.bookingId, props.modelValue],
  ([newStationId, newBookingId, newModelValue]) => {
    if (newModelValue && newStationId && newBookingId) {
      fetchBookingDetails();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.booking-details {
  max-width: 100%;
}

.detail-item {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 12px;
}

.detail-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-label {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 1rem;
  color: #333;
  font-weight: 400;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .v-card-title {
    padding: 16px !important;
  }

  .v-card-text {
    padding: 24px 16px !important;
  }
}
</style>
