<script setup>
import Button from './button.vue';

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
  >
    <template #item-image="{ image }">
      <img :src="image" alt="" class="w-10 h-10 rounded-full" />
    </template>

    <template #item-actions="{ actions }">
      <router-link :to="{}"> Edit </router-link>
    </template>

    <template #item-copyOfIDCard="{ actions }">
      <router-link :to="{}"> Download </router-link>
    </template>

    <template #item-rentalContract="{ actions }">
      <router-link :to="{}"> Download </router-link>
    </template>

  </EasyDataTable>
</template>
