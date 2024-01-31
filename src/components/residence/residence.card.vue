<script setup>
import ResidenceStat from '@/components/residence/residence.stat.vue';
import Button from '@/components/common/button.vue';
import img4 from '@/assets/img/4.jpg';
import { useRoute, useRouter } from 'vue-router';
import FileService from '@/services/FileService';
import { computed } from 'vue';

const router = useRouter();
const route = useRoute();

const props = defineProps({
  residence: {
    type: Object,
    default: {},
  },
});

const imageSrc = computed(() => {
  if (props.residence.images.length === 0) {
    return img4;
  }
  return FileService.getFile(props.residence.images[0]);
});
</script>

<template>
  <div class="card card-side bg-base-100 shadow-xl mt-5">
    <figure>
      <img class="w-60 h-60 rounded-lg shadow-xl" :src="imageSrc" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">ชื่อห้องพัก : {{ props.residence?.name }}</h2>
      <p>
        รายละเอียด : {{ props.residence?.description || 'No Description' }}
      </p>
      <p v-if="props.residence?.contact?.address">
        ที่อยู่ : {{ props.residence.contact.address }}
      </p>
      <div class="card-actions justify-between items-center">
        <ResidenceStat
          :stats="{
            numberOfRooms: props.residence?.rooms?.length ?? 0,
            numberOfFloors: props.residence?.floors?.length ?? 0,
            numberOfRenters: props.residence?.renters?.length ?? 0,
          }"
        />
        <Button
          class="btn"
          btnType="secondary"
          @click="
            router.push({
              name: 'dashboard',
              params: { residenceId: props.residence._id },
            })
          "
          >แดชบอร์ด</Button
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
