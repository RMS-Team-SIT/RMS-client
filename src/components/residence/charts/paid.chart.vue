<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { computed, ref } from 'vue';
import { Pie, Doughnut } from 'vue-chartjs';

const props = defineProps({
  paid: {
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

const data = computed(() => ({
  labels: ['จ่ายแล้ว', 'ยังไม่จ่าย'],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651'],
      data: [props.paid, props.unpaid],
    },
  ],
}));

const options = {
  responsive: false,
  maintainAspectRatio: true,
};

ChartJS.register(ArcElement, Tooltip, Legend);
</script>

<template>
  <Pie :data="data" :options="options"/>
</template>

<style scoped></style>
