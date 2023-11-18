<script setup>
import ResidentStat from '@/components/resident.stat.vue';
import Button from '@/components/common/button.vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  resident: {
    type: Object,
    default: {},
  },
});

const goToResidentDashboard = (residentId) => {
  router.push(`/dashboard/resident/${residentId}`);
};
</script>

<template>
  <div class="card card-side bg-base-100 shadow-xl mt-5">
    <figure>
      <img class="w-full h-60 rounded-lg shadow-xl" src="/4.jpg" alt="Movie" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">Resident Name : {{ props.resident?.name }}</h2>
      <p>Description : {{ props.resident?.description }}</p>
      <p v-if="props.resident?.contact?.address">
        Address : {{ props.resident.contact.address }}
      </p>
      <div class="card-actions justify-between items-center">
        <ResidentStat />
        <Button
          class="btn"
          btnType="secondary"
          @click="goToResidentDashboard(props.resident._id)"
          >Dashboard</Button
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
