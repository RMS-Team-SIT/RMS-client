<script setup>
const props = defineProps({
  headers: {
    type: Array,
    default: () => [],
  },
  items: {
    type: Array,
    default: () => [],
  },
});
</script>
<template>
  <EasyDataTable
    :headers="props.headers"
    :items="props.items"
    :show-index="true"
    :border-cell="true"
    theme-color="#EA5455"
  />
</template>
