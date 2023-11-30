<script setup>
import ResidentStat from '@/components/resident/resident.stat.vue';
import Button from '@/components/common/button.vue';
import img4 from '@/assets/img/4.jpg';
import { useRoute, useRouter } from 'vue-router';
import FileService from '@/services/FileService';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  resident: {
    type: Object,
    default: {},
  },
});

const gotoManage = (residentId) => {
  router.push(`/manage/resident/${residentId}`);
};
const imageSrc = computed(() => {
  if (props.resident.images.length === 0) {
    return img4;
  }
  return FileService.getFile(props.resident.images[0]);
  
});
</script>

<template>
  <div class="card card-side bg-base-100 shadow-xl mt-5">
    <figure>
      <img class="w-60 h-60 rounded-lg shadow-xl" :src="imageSrc" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">Resident Name : {{ props.resident?.name }}</h2>
      <p>Description : {{ props.resident?.description }}</p>
      <p v-if="props.resident?.contact?.address">
        Address : {{ props.resident.contact.address }}
      </p>
      <div class="card-actions justify-between items-center">
        <ResidentStat
          :stats="{
            numberOfRooms: props.resident?.rooms?.length ?? 0,
            numberOfFloors: props.resident?.floors?.length ?? 0,
            numberOfRentals: props.resident?.rentals?.length ?? 0,
          }"
        />
        <Button
          class="btn"
          btnType="secondary"
          @click="gotoManage(props.resident._id)"
          >Manage</Button
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
