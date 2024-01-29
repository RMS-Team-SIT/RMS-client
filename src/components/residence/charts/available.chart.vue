<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'vue-chartjs';

const data = {
  labels: ['Available', 'Not Available'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651'],
      data: [40, 20],
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
