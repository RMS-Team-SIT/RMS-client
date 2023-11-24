<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import blankprofileImg from '@/assets/img/blank-profile.webp';


const props = defineProps({
  rentals: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div class="overflow-x-auto">
    <p class="text-base" v-if="!props.rentals.length">No rental</p>
    <table class="table" v-else>
      <!-- head -->
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
        <!-- row 1 -->
        <tr v-for="(rental, index) in rentals" :key="index">
          <td>
            {{ index + 1 }}
          </td>
          <td>
            {{ rental.name }}
          </td>
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="w-12 h-12 rounded-full">
                  <img
                    :src="blankprofileImg"
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
