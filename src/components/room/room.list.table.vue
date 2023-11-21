<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';

const props = defineProps({
  rooms: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="overflow-x-auto">
    <p class="text-base" v-if="!props.rooms.length">No room</p>
    <table class="table" v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Rental</th>
          <th>Floor</th>
          <th>Available</th>
          <th>Paid Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(room, index) in rooms" :key="index">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            {{ room.name }}
          </td>
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-12 h-12 rounded-full">
                  <img
                    src="/blank-profile.webp"
                    alt="Avatar"
                  />
                </div>
              </div>
              <div>
                <div class="font-bold">Hart Hagerty</div>
                <div class="text-sm opacity-50">United States</div>
              </div>
            </div>
          </td>
          <td>1</td>
          <td>
            <Badge type="success">Available</Badge>
            <Badge type="error">Available</Badge>
          </td>
          <td>Purple</td>
          <th>
            <Button btnType="ghost-pill">manage room</Button>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
