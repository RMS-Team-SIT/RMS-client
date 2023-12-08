<script setup>
import RoomListTable from './room.list.table.vue';
import Button from '@/components/common/button.vue';

const props = defineProps({
  rooms: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="bg-white p-10 mt-2 shadow rounded-lg">
    <div class="flex justify-between mb-5">
      <h1 class="text-2xl font-semibold text-dark-blue-200">Rooms</h1>
      <div class="flex gap-2">
        <router-link
          :to="{
            name: 'create-room',
            params: {
              residentId: $route.params.residentId,
            },
          }"
        >
          <Button btnType="primary">Add Room</Button>
        </router-link>
        <router-link
        :to="{
          name: 'create-room',
          params: {
            residentId: $route.params.residentId,
          },
        }"
      >
        <Button btnType="primary">Add Room Wizard</Button>
      </router-link>
      </div>
    </div>
    <RoomListTable :rooms="rooms" />
  </div>
</template>

<style scoped></style>
