<script setup>
const props = defineProps({
  totalAdmins: {
    type: Number,
    required: true,
  },
  totalUsers: {
    type: Number,
    required: true,
  },
  totalPendingUsers: {
    type: Number,
    required: true,
  },
});

const chartOptions = {
  labels: ['รอการอนุมัติ', 'อนุมัติแล้ว', 'ผู้ดูแล'],
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
const series = [props.totalPendingUsers, props.totalUsers, props.totalAdmins];
</script>

<template>
  <apexchart
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<style scoped></style>