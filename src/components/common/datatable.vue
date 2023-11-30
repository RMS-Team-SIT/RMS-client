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

    <template #item-copyOfIDCard="{ copyOfIdCard }">
      <div v-if="copyOfIdCard">
        <router-link
          :to="{ name: 'pdf-preview', query: { filename: copyOfIdCard } }"
        >
          View
        </router-link>
      </div>
      <div v-else>
        <span class="text-red-500">No file</span>
      </div>
    </template>

    <template #item-rentalContract="{ rentalContract }">
      <div v-if="rentalContract">
        <router-link
          :to="{ name: 'pdf-preview', query: { filename: rentalContract } }"
        >
          View
        </router-link>
      </div>
      <div v-else>
        <span class="text-red-500">No file</span>
      </div>
    </template>
  </EasyDataTable>
</template>
