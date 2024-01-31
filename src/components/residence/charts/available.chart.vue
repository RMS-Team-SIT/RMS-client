<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';

const props = defineProps({
  available: {
    type: Number,
    required: true,
    default: 10,
  },
  notAvailable: {
    type: Number,
    required: true,
    default: 10,
  },
});

const data = {
  labels: ['ว่าง', 'ไม่ว่าง'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651'],
      data: [props.available, props.notAvailable],
    },
  ],
};

const options = {
  responsive: false,
  maintainAspectRatio: true,
};

ChartJS.register(ArcElement, Tooltip, Legend);
</script>

<template>
  <Pie :data="data" :options="options" />
</template>

<style scoped></style>
