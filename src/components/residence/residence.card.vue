<script setup>
import ResidenceStat from '@/components/residence/residence.stat.vue';
import Button from '@/components/common/button.vue';
import img4 from '@/assets/img/4.jpg';
import { useRouter } from 'vue-router';
import FileService from '@/services/FileService';
import { computed } from 'vue';
import { truncate } from '@/utils/string';
import { ArrowTopRightOnSquareIcon, ChartPieIcon } from '@heroicons/vue/24/outline';

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
  <div
    class="card card-side bg-base-100 border border-gray-200 mt-5 hover:shadow hover:cursor-pointer hover:border-gray-300"
  >
    <figure>
      <img class="w-60 h-60 rounded-lg" :src="imageSrc" />
    </figure>
    <div class="card-body">
      <h2 class="card-title">
        ชื่อหอพัก : {{ truncate(props.residence?.name, 50) }}
      </h2>
      <p>
        รายละเอียด :
        {{ truncate(props.residence?.description || 'ไม่มีข้อมูล', 50) }}
      </p>
      <p>ที่อยู่ : {{ props.residence?.address || 'ไม่มีข้อมูล' }}</p>
      <div class="card-actions justify-between items-center">
        <Button
          v-if="props.residence.isApproved"
          btnType=""
          class="underline"
          @click="
            router.push({
              name: 'dashboard',
              params: { residenceId: props.residence._id },
            })
          "
          >
          <!-- <ChartPieIcon class="w-5 h-5" /> -->
          เข้าสู่หน้าแดชบอร์ด
          <ArrowTopRightOnSquareIcon class="w-5 h-5" />
          </Button
        >
        <Button
          v-else
          @click="
            router.push({
              name: 'pending-residence',
              params: { residenceId: props.residence._id },
            })
          "
          class="btn"
          btnType="secondary"
          >ดูข้อมูล</Button
        >
      </div>
    </div>
  </div>
</template>

<style scoped></style>
