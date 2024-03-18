<script setup>
const {
  data
} = defineProps({
  data: {
    type: Array,
    required: true,
    default: [0,0,0,0,0,0,0,0,0,0,0,0],
  },
})
const options = {
  chart: {
    id: 'apexchart-example',
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
};
const series = [
  {
    name: 'รายได้',
    data: [...data],
  },
];
</script>

<template>
  <div class="w-full flex justify-center lg:justify-start">
    <apexchart
      width="500"
      type="line"
      :options="options"
      :series="series"
    ></apexchart>
  </div>
</template>

<style scoped></style>
