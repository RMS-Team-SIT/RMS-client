<script setup>
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'vue-chartjs';

const months = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];
const truncatedMonths = months.map((month) => month.substring(0, 3));

const data = {
  labels: truncatedMonths,
  datasets: [
    {
      label: 'Income',
      backgroundColor: '#f87979',
      data: [40000, 49000, 12450, 45130, 34515, 86140, 45510, 56319, 10, 40, 39, 80],
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: true,
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
</script>

<template>
  <Line
    :data="data"
    :options="options"
    class=""
    aria-label="Residence in come"
  />
</template>

<style scoped></style>
