<template>
  <v-container>
    <div v-if="stationsStore.selectedStation">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2">mdi-map-marker</v-icon>
          {{ stationsStore.selectedStation.name }}
        </v-card-title>
        <v-card-subtitle>
          <v-chip color="primary" variant="tonal" class="mr-2">
            <v-icon start>mdi-map-marker-outline</v-icon>
            {{ stationsStore.selectedStation.location }}
          </v-chip>
          <v-chip color="success" variant="tonal">
            <v-icon start>mdi-calendar-check</v-icon>
            {{ stationsStore.selectedStation.bookingsCount }} bookings
          </v-chip>
        </v-card-subtitle>
        
        <v-card-text>
          <v-data-table
            :headers="responsiveHeaders"
            :items="stationsStore.selectedStation.bookings"
            :items-per-page="10"
            class="elevation-1"
            mobile-breakpoint="md"
          >
            <template v-slot:item.startDate="{ item }">
              <v-chip color="info" size="small">
                {{ formatDate(item.startDate) }}
              </v-chip>
            </template>
            
            <template v-slot:item.endDate="{ item }">
              <v-chip color="warning" size="small">
                {{ formatDate(item.endDate) }}
              </v-chip>
            </template>
            
            <template v-slot:item.customerName="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="32" color="primary" class="mr-3">
                  {{ item.customerName.charAt(0).toUpperCase() }}
                </v-avatar>
                <span class="text-truncate">{{ item.customerName }}</span>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </div>
    
    <v-alert
      v-else-if="!stationsStore.selectedStation && !stationsStore.loading"
      type="info"
      variant="tonal"
      class="mt-4"
    >
      Please select a station to view its bookings
    </v-alert>
    
    <v-alert
      v-if="stationsStore.error"
      type="error"
      variant="tonal"
      class="mt-4"
    >
      {{ stationsStore.error }}
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const stationsStore = useStationsStore()
const { mobile } = useDisplay()

const allHeaders = [
  {
    title: 'Booking ID',
    align: 'start' as const,
    sortable: true,
    key: 'id',
  },
  {
    title: 'Customer Name',
    key: 'customerName',
    sortable: true,
  },
  {
    title: 'Start Date',
    key: 'startDate',
    sortable: true,
  },
  {
    title: 'End Date',
    key: 'endDate',
    sortable: true,
  },
]

const mobileHeaders = [
  {
    title: 'Customer Name',
    key: 'customerName',
    sortable: true,
  },
  {
    title: 'Start Date',
    key: 'startDate',
    sortable: true,
  },
  {
    title: 'End Date',
    key: 'endDate',
    sortable: true,
  },
]

const responsiveHeaders = computed(() => {
  return mobile.value ? mobileHeaders : allHeaders
})

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<style scoped>
.v-data-table {
  background: transparent;
}

/* No overflow of names at small screens */
.text-truncate {
  max-width: 150px;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .v-chip {
    font-size: 0.75rem;
  }
  
  .v-avatar {
    width: 28px !important;
    height: 28px !important;
    font-size: 0.75rem;
  }
}
</style> 