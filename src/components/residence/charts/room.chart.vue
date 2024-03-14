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

const chartOptions = {
  labels: ['ว่าง', 'ไม่ว่าง'],
  chart: {
    type: 'donut',
  },
  stroke: {
    colors: ['#fff'],
  },
  fill: {
    opacity: 0.8,
  },
//   responsive: [
//     {
//       breakpoint: 480,
//       options: {
//         chart: {
//           width: 200,
//         },
//         legend: {
//           position: 'bottom',
//         },
//       },
//     },
//   ],
};
const series = [props.available, props.notAvailable];
</script>

<template>
  <apexchart
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<style scoped></style>
