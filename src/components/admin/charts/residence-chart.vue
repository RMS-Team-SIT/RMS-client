<script setup>
const props = defineProps({
  totalApprovedResidences: {
    type: Number,
    required: true,
  },
  totalPendingResidences: {
    type: Number,
    required: true,
  },
});

const chartOptions = {
  labels: ['รอการอนุมัติ', 'อนุมัติแล้ว'],
  chart: {
    type: 'donut',
  },
  stroke: {
    colors: ['#fff'],
  },
  fill: {
    opacity: 0.8,
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
};
const series = [props.totalPendingResidences, props.totalApprovedResidences];
</script>

<template>
  <apexchart :options="chartOptions" :series="series"></apexchart>
</template>

<style scoped></style>
