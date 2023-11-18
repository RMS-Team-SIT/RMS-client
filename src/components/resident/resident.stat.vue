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
  </div>
</template>

<style scoped></style>
