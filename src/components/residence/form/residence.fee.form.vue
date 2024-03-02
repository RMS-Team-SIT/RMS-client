<script setup>
import Button from '@/components/common/button.vue';
import { useNotification } from '@kyvg/vue3-notification';
import { onMounted, reactive, ref, watch } from 'vue';
import { generateRandomObjectId } from '@/utils/mongo';

const { notify } = useNotification();
const emit = defineEmits(['getData']);

const props = defineProps({
  residenceData: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
  facilityList: {
    type: Array,
    default: () => [],
  },
});

const childData = reactive({
  fees: [],
});

const emitData = () => {
  emit('getData', childData);
};

const setDataFromProps = () => {
  for (const key in props.residenceData) {
    if (key in childData) childData[key] = props.residenceData[key];
  }
};

const feeName = ref('');
const feePrice = ref('');

const addFee = () => {
  if (feeName.value.trim() === '') {
    notify({
      group: 'tr',
      title: 'ไม่สามารถเพิ่มค่าบริการได้',
      text: `กรุณากรอกชื่อค่าบริการและราคา`,
      type: 'error',
    });
    return;
  }
  if (feePrice.value <= 0) {
    notify({
      group: 'tr',
      title: 'ไม่สามารถเพิ่มค่าบริการได้',
      text: `ราคาค่าบริการต้องมากกว่า 0`,
      type: 'error',
    });
    return;
  }
  if (
    childData.fees.some((fee) => fee.feename.trim() === feeName.value.trim())
  ) {
    notify({
      group: 'tr',
      title: 'ไม่สามารถเพิ่มค่าบริการได้',
      text: `มีค่าบริการชื่อ ${feeName.value} อยู่แล้ว`,
      type: 'error',
    });
    return;
  }
  childData.fees.push({
    _id: generateRandomObjectId(),
    feename: feeName.value,
    feeprice: feePrice.value,
  });
  feeName.value = '';
  feePrice.value = 0;
};

const removeFee = (index) => {
  childData.fees.splice(index, 1);
};

onMounted(() => {
  setDataFromProps();
});

watch(childData, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">
      กำหนดค่าบริการเพิ่มเติมที่เรียกเก็บ
    </h1>
    <p class="text-sm">
      เช่น ค่าอินเทอร์เน็ต ค่าส่วนกลาง ค่าฟิตเนส ค่าจอดรถ
    </p>  

    <!-- Add fee (feename, feeprice) -->
    <div class="flex gap-4">
      <input
        v-model="feeName"
        type="text"
        class="input input-bordered bg-white input-sm rounded-sm"
        placeholder="ชื่อค่าบริการ"
      />
      <input
        v-model="feePrice"
        type="number"
        min="0"
        class="input input-bordered bg-white input-sm rounded-sm"
        placeholder="ราคา"
      />
      <Button @click="addFee" class="btn-primary"> เพิ่ม </Button>
    </div>

    <!-- List -->
    <div class="flex flex-col gap-4">
      <div
        v-for="(fee, index) in childData.fees"
        :key="index"
        class="grid grid-cols-3 gap-4 items-center justify-between bg-gray-100 p-4 rounded-md"
      >
        <p>{{ fee.feename }}</p>
        <p>{{ fee.feeprice }} บาท</p>
        <Button
          v-if="!viewOnly"
          @click="removeFee(index)"
          class="btn btn-primary w-min"
        >
          ลบ
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
