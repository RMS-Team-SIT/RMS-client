<script setup>
import { computed } from "vue";

const { data, seriesName } = defineProps({
  data: {
    type: Array,
    required: true,
    default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  seriesName: {
    type: String,
    required: false,
    default: 'รายได้',
  },
});
const options = {
  chart: {
    id: 'income-column-chart',
    type: 'area',
  },
  dataLabels: {
    enabled: false,
  },
  // stroke: {
  //   show: true,
  //   width: 2,
  //   colors: ['transparent'],
  // },
  stroke: {
    curve: 'straight'
  },
  fill: {
    opacity: 1,
  },
  xaxis: {
    categories: [
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
    ],
  },
  yaxis: {
    title: {
      text: 'บาท',
    },
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val.toLocaleString() + ' บาท';
      },
    },
  },
};
const series = [
  {
    name: seriesName,
    data: data,
  },
];
const total = computed(() => {
  return data.reduce((acc, cur) => acc + cur, 0);
});
</script>

<template>
  <p>รวม: {{ total.toLocaleString() }} บาท</p>
  <apexchart
    class="min-w-full"
    width="500"
    type="area"
    :options="options"
    :series="series"
  ></apexchart>
</template>

<style scoped></style>
