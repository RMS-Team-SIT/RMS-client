<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';

const props = defineProps({
  paid: {
    type: Number,
    required: true,
    default: 10,
  },
  uploaded: {
    type: Number,
    required: true,
    default: 10,
  },
  unpaid: {
    type: Number,
    required: true,
    default: 10,
  },
});

const chartOptions = {
  labels: ['จ่ายแล้ว', 'อัพโหลดหลักฐานแล้ว', 'ยังไม่จ่าย'],
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
const series = [props.paid, props.uploaded, props.unpaid];
</script>

<template>
  <apexchart :options="chartOptions" :series="series"></apexchart>
</template>

<style scoped></style>
