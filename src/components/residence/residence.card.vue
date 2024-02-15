<script setup>
import ResidenceStat from '@/components/residence/residence.stat.vue';
import Button from '@/components/common/button.vue';
import img4 from '@/assets/img/4.jpg';
import { useRouter } from 'vue-router';
import FileService from '@/services/FileService';
import { computed } from 'vue';

const router = useRouter();

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
  <div class="card card-side bg-base-100 border border-gray-200 mt-5">
    <figure>
      <img class="w-60 h-60 rounded-lg" :src="imageSrc" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">ชื่อหอพัก : {{ props.residence?.name }}</h2>
      <p>รายละเอียด : {{ props.residence?.description || 'ไม่มีข้อมูล' }}</p>
      <p>ที่อยู่ : {{ props.residence?.contact?.address || 'ไม่มีข้อมูล' }}</p>
      <div class="card-actions justify-between items-center">
        <ResidenceStat
          :residenceId="props.residence._id"
          :stats="{
            roomCount: props.residence?.rooms?.length ?? 0,
            paymentCount: props.residence?.payments?.length ?? 0,
            renterCount: props.residence?.renters?.length ?? 0,
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
          >เข้าสู่หน้าแดชบอร์ด</Button
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
