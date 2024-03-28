<script setup>
const { data } = defineProps({
  data: {
    type: Array,
    required: true,
    default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
});
const options = {
  chart: {
    id: 'income-column-chart',
    type: 'bar',
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded',
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
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
    name: 'รายได้',
    data: [...data],
  },
];
</script>

<template>
  <apexchart
    class="min-w-full h-96"
    width="500"
    type="bar"
    :options="options"
    :series="series"
  ></apexchart>
</template>

<style scoped></style>
