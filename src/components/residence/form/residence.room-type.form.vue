<script setup>
import { useNotification } from '@kyvg/vue3-notification';
import { onMounted, reactive, ref, watch } from 'vue';
import BankIcon from '@/components/common/bank-icon.vue';
import { generateRandomObjectId } from '@/utils/mongo';

const emit = defineEmits(['getData']);
const { notify } = useNotification();
const props = defineProps({
  viewOnly: {
    type: Boolean,
    default: false,
  },
  banks: {
    type: Array,
    default: () => [],
  },
  residenceData: {
    type: Object,
    default: () => ({}),
  },
});

const childData = reactive({
  roomTypes: [],
});

const temp = reactive({
  name: '',
  type: '',
  size: '',
  price: '',
  description: '',
});

const add = () => {
  console.log('addd');
  if (!temp.name || !temp.size || !temp.price || !temp.description) {
    console.log('error');
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'โปรดกรอกข้อมูลให้ครบถ้วน',
      type: 'error',
    });
    return;
  }
  childData.roomTypes.push({ _id: generateRandomObjectId(), ...temp });
  temp.name = '';
  temp.size = '';
  temp.price = '';
  temp.description = '';
};

const remove = (index) => {
  childData.roomTypes.splice(index, 1);
};

const findBank = (bankId) => {
  return props.banks.find((bank) => bank._id === bankId);
};

const emitData = () => {
  emit('getData', childData);
};

const setDataFromProps = () => {
  for (const key in props.residenceData) {
    if (key in childData) childData[key] = props.residenceData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(childData, () => {
  emitData();
});
</script>

<template>
  <div class="flex gap-4 shadow-md rounded w-full">
    <div class="bg-white p-10 space-y-4">
      <h1 class="text-xl font-semibold text-dark-blue-200">ประเภทห้องพัก</h1>
      <p class="text-xs">สร้างประเภทห้องพักในหอพักของคุณ</p>

      <div class="grid grid-cols-3 gap-5" v-if="!viewOnly">
        <div>
          <label class="label">
            <span class="text-base label-text"
              >ประเภท <span class="text-red-500">*</span>
            </span>
          </label>
          <input
            type="text"
            placeholder="ชื่อประเภท"
            class="input input-bordered bg-white input-sm rounded-sm"
            v-model="temp.name"
          />
          <p class="text-xs text-gray-500">เช่น ห้องสตูดิโอ, 1 ห้องนอน</p>
        </div>

        <div>
          <label class="label">
            <span class="text-base label-text"
              >ขนาดห้อง (ตร.ม.) <span class="text-red-500">*</span>
            </span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="ค่าเช่าบาท/เดือน"
            class="input input-bordered bg-white input-sm rounded-sm"
            v-model="temp.size"
          />
          <p class="text-xs text-gray-500">เช่น 10 ตร.ม. (กรอกเฉพาะตัวเลข)</p>
        </div>

        <div>
          <label class="label">
            <span class="text-base label-text"
              >ค่าเช่าบาท/เดือน <span class="text-red-500">*</span>
            </span>
          </label>
          <input
            type="number"
            min="0"
            placeholder="ค่าเช่าบาท/เดือน"
            class="input input-bordered bg-white input-sm rounded-sm"
            v-model="temp.price"
          />
        </div>

        <div class="col-span-3">
          <label class="label">
            <span class="text-base label-text"
              >รายละเอียด <span class="text-red-500">*</span>
            </span>
          </label>
          <textarea
            rows="10"
            placeholder="รายละเอียด"
            class="input input-bordered bg-white input-sm rounded-sm w-full"
            v-model="temp.description"
          ></textarea>
        </div>
      
        <div class="flex items-center">
          <button
            class="btn btn-primary btn-sm"
            @click="add"
            :disabled="props.viewOnly"
          >
            เพิ่ม
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div
          v-for="(payment, index) in childData.roomTypes"
          :key="index"
          class="grid grid-cols-5 gap-4 items-center justify-between bg-gray-100 p-4 rounded-md"
        >
          <div class="col-span-2">
            <p class="text-base font-semibold">{{ payment.name }}</p>
            <p class="text-xs text-gray-500">{{ payment.description }}</p>
          </div>
          <div class="col-span-1">
            <p class="text-base">{{ payment.size }} ตร.ม.</p>
          </div>
          <div class="col-span-1">
            <p class="text-base">{{ payment.price }} บาท/เดือน</p>
          </div>
          <button
            v-if="!props.viewOnly"
            @click="remove(index)"
            class="btn btn-sm btn-secondary w-min"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
