<script setup>
const props = defineProps({
  stats: {
    type: Object,
    default: {
      numberOfRooms: 0,
      numberOfFloors: 0,
      numberOfRentals: 0,
    },
  },
});
</script>

<template>
  <div class="stats stats-vertical lg:stats-horizontal shadow">
    <div class="stat">
      <div class="stat-title">Rooms</div>
      <div class="stat-value">{{ stats.numberOfRooms }}</div>
      <div class="stat-desc">Total</div>
    </div>
    <div class="stat">
      <div class="stat-title">Rentals</div>
      <div class="stat-value">{{ stats.numberOfRentals }}</div>
      <div class="stat-desc">Total</div>
    </div>
  </div>
</template>

<style scoped></style>
