<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import blankprofileImg from '@/assets/img/bp.webp';

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
    <table class="table table-xs" v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Description</th>
          <th>Rental</th>
          <th>Floor</th>
          <th>Water Price Rate</th>
          <th>Light Price Rate</th>
          <th>Available</th>
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
            {{ room.description || 'No Description' }}
          </td>
          <td>
            {{ room.currentRental || 'No Rental' }}
          </td>
          <td>{{ room.floor }}</td>
          <td>
            {{ room.waterPriceRate }}
            <Badge badgeType="primary" v-if="room.isUseDefaultWaterPriceRate"
              >Default</Badge
            >
            <Badge badgeType="secondary" v-else>Custom</Badge>
          </td>
          <td>
            {{ room.lightPriceRate }}
            <Badge badgeType="primary" v-if="room.isUseDefaultLightPriceRate"
              >Default</Badge
            >
            <Badge badgeType="secondary" v-else>Custom</Badge>
          </td>
          <td>
            <Badge badgeType="success" v-if="!room.currentRental"
              >Available</Badge
            >
            <Badge badgeType="error" v-else>Not Available</Badge>
          </td>
          <!-- <td>
            <Badge badgeType="success">Paid</Badge>
            <Badge badgeType="error">Not Paid</Badge>
          </td> -->
          <th>
            <router-link
              :to="{
                name: 'update-room',
                params: { 
                  residentId: $route.params.residentId,
                  roomId: room._id
                 },
              }"
            >
              <Button btnType="ghost-pill">Edit</Button>
            </router-link>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
