<script setup>
const props = defineProps({
  stats: {
    type: Object,
    default: {
      numberOfRooms: 0,
      numberOfFloors: 0,
      numberOfRenters: 0,
    },
  },
});
</script>

<template>
  <div class="stats stats-vertical lg:stats-horizontal shadow">
    <div class="stat">
      <div class="stat-title">จำนวนห้อง</div>
      <div class="stat-value">{{ stats.numberOfRooms }}</div>
      <div class="stat-desc">ทั้งหมด</div>
    </div>
    <div class="stat">
      <div class="stat-title">จำนวนผู้เช่า</div>
      <div class="stat-value">{{ stats.numberOfRenters }}</div>
      <div class="stat-desc">ทั้งหมด</div>
    </div>
  </div>
</template>

<style scoped></style>
