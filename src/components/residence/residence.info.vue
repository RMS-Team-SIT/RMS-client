<script setup>
import { useRouter } from 'vue-router';
import Divider from '@/components/common/divider.vue';
import { PencilSquareIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const props = defineProps({
  residence: {
    type: String,
    default: '',
  },
});
</script>

<template>
  <div class="bg-white p-4 shadow-md rounded">
    <div class="mb-4">
      <div class="flex justify-between items-center">
        <Divider>ข้อมูลทั่วไป</Divider>

        <PencilSquareIcon
          @click="
            () =>
              router.push({
                name: 'update-residence',
                params: { id: residence._id },
              })
          "
          class="text-dark-blue-200 w-5 h-5 flex justify-end cursor-pointer"
        />
      </div>
      <p>
        <span class="font-bold">ชื่อห้องพัก</span> :
        {{ residence.name }}
      </p>
      <p>
        <span class="font-bold">รายละเอียด</span> :
        <span :class="{ 'text-gray-500': !residence.contact.description }">
          {{ residence.contact.description || 'ไม่มีข้อมูล' }}
        </span>
      </p>
      <p>
        <span class="font-bold">ที่อยู่</span> :
        <span :class="{ 'text-gray-500': !residence.address }">
          {{ residence.address || 'ไม่มีข้อมูล' }}
        </span>
      </p>
      <Divider>ข้อมูลการติดต่อ</Divider>
      <p>
        <span class="font-bold">อีเมล</span> :
        <span :class="{ 'text-gray-500': !residence.contact.email }">
          {{ residence.contact.email || 'ไม่มีข้อมูล' }}
        </span>
      </p>
      <p>
        <span class="font-bold">หมายเลขโทรศัพท์</span> :
        <span :class="{ 'text-gray-500': !residence.contact.phone }">
          {{ residence.contact.phone || 'ไม่มีข้อมูล' }}
        </span>
      </p>
      <p>
        <span class="font-bold">Line</span> :
        <span :class="{ 'text-gray-500': !residence.contact.line }">
          {{ residence.contact.line || 'ไม่มีข้อมูล' }}
        </span>
      </p>
      <p>
        <span class="font-bold">Facebook</span> :
        <span :class="{ 'text-gray-500': !residence.contact.facebook }">
          {{ residence.contact.facebook || 'ไม่มีข้อมูล' }}
        </span>
      </p>
      <Divider>อื่น ๆ</Divider>
      <p>
        <span class="font-bold">ค่าน้ำ</span> :
        {{ residence.defaultWaterPriceRate }} บาท / หน่วย
      </p>
      <p>
        <span class="font-bold">ค่าไฟ</span> :
        {{ residence.defaultLightPriceRate }} บาท / หน่วย
      </p>
    </div>
  </div>
</template>

<style scoped></style>
