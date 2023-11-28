<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import blankprofileImg from '@/assets/img/bp.webp';
import dayjs from 'dayjs';

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
          <th>Image</th>
          <th>Email</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Active</th>
          <th>Copy Of ID Card</th>
          <th>Rental contract</th>
          <th>Created At</th>
          <th>Updated At</th>
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
            {{ rental.image }}
          </td>
          <td>
            {{ rental.email }}
          </td>
          <td>
            <span> {{ rental.firstname }} {{ rental.lastname }}</span>
          </td>
          <td>{{ rental.phone }}</td>
          <td>
            <Badge v-if="rental.isActive" type="success">Active</Badge>
            <Badge v-else type="error">Deactive</Badge>
          </td>
          <td><Button btnType="ghost-pill">Download</Button></td>
          <td><Button btnType="ghost-pill">Download</Button></td>
          <td>{{ dayjs(rental.created_at, 'DD-MM-YYYY', 'es') }}</td>
          <td>{{ dayjs(rental.updated_at, 'DD-MM-YYYY') }}</td>
          <th>
            <Button btnType="ghost-pill">Edit rental</Button>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
