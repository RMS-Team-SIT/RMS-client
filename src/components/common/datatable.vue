<script setup>
import Button from './button.vue';
import ModalPdf from './modal-pdf.vue';
import Badge from './badge.vue';

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

    <template #item-isActive="{ isActive }">
      <Badge v-if="isActive" badgeType="success">Active</Badge>
      <Badge v-else badgeType="error">Deactive</Badge>
    </template>

    <template #item-edit="{ edit }">
      <router-link
        :to="{
          name: 'update-renter',
          params: {
            renterId: edit,
          },
        }"
      >
        Edit
      </router-link>
    </template>

    <template #item-copyOfIDCard="{ copyOfIdCard }">
      <div v-if="copyOfIdCard">
        <ModalPdf :fileName="copyOfIdCard" />
      </div>
      <div v-else>
        <span class="text-red-500">No file</span>
      </div>
    </template>

    <template #item-renterContract="{ renterContract }">
      <div v-if="renterContract">
        <ModalPdf :fileName="renterContract" />
      </div>
      <div v-else>
        <span class="text-red-500">No file</span>
      </div>
    </template>
  </EasyDataTable>
</template>
