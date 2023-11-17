<script setup>
const props = defineProps({
  numberOfRoom: {
    type: Boolean,
    default: 0,
  },
});
</script>

<template>
  <div class="stats stats-vertical lg:stats-horizontal shadow">
    <div class="stat">
      <div class="stat-title">Rooms</div>
      <div class="stat-value">{{ props.numberOfRoom }}</div>
      <div class="stat-desc">Total</div>
    </div>

    <!-- <div class="stat">
      <div class="stat-title">New Users</div>
      <div class="stat-value">4,200</div>
      <div class="stat-desc">↗︎ 400 (22%)</div>
    </div> -->

    <!-- <div class="stat">
      <div class="stat-title">New Registers</div>
      <div class="stat-value">1,200</div>
      <div class="stat-desc">↘︎ 90 (14%)</div>
    </div> -->
  </div>
</template>

<style scoped></style>
