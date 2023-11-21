<script setup>
import ResidentStat from '@/components/resident/resident.stat.vue';
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

const gotoManage = (residentId) => {
  router.push(`/manage/resident/${residentId}`);
};
</script>

<template>
  <div class="card card-side bg-base-100 shadow-xl mt-5">
    <figure>
      <img
        class="w-60 h-60 rounded-lg shadow-xl"
        :src="props.resident.images[0] ?? '/4.jpg'"
      />
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
            numberOfRoom: props.resident?.rooms?.length ?? 0,
            numberOfFloor: props.resident?.floors?.length ?? 0,
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
