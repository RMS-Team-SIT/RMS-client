<script setup>
const props = defineProps({
  stats: {
    type: Object,
    default: {
      numberOfRoom: 0,
      numberOfFloor: 0,
    },
  },
});
</script>

<template>
  <div class="stats stats-vertical lg:stats-horizontal shadow">
    <div class="stat">
      <div class="stat-title">Rooms</div>
      <div class="stat-value">{{ stats.numberOfRoom }}</div>
      <div class="stat-desc">Total</div>
    </div>
    <div class="stat">
      <div class="stat-title">Floor</div>
      <div class="stat-value">{{ stats.numberOfFloor }}</div>
      <div class="stat-desc">Total</div>
    </div>
  </div>
</template>

<style scoped></style>
