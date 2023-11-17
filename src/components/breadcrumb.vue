<script setup>
const props = defineProps({
  pathList: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="text-sm breadcrumbs">
    <ul>
      <li v-for="(val, index) in props.pathList" :key="index">
        <a>{{ val }}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
