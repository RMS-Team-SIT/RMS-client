<script setup>
import ResidentStat from '@/components/resident.stat.vue';
import Button from '@/components/button.vue';

const props = defineProps({
  residentData: {
    type: Object,
    default: {
      id: 0,
      name: 'Resident Name',
      description: 'Resident Description',
      numberOfRoom: 0,
      image: '4.jpg',
      numberOfAnnouncement: 0,
      address: 'Resident Address'
    },
  },
});

const goToManageResident = (residentId) => {
  router.push(`/manage/resident/${residentId}`);
};
</script>

<template>
  <div class="card card-side bg-base-100 shadow-xl mt-5">
    <figure>
      <img class="w-full h-60 rounded-lg shadow-xl" src="4.jpg" alt="Movie" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">Resident Name : {{ props.residentData.name }}</h2>
      <p>Description : {{ props.residentData.description }}</p>
      <p>Address : {{  }}</p>
      <div class="card-actions justify-between items-center">
        <ResidentStat />
        <Button class="btn" btnType="secondary" @click="goto()">Manage</Button>
    </div>
    </div>
  </div>
</template>

<style scoped></style>
