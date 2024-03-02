<script setup>
import { useNotification } from '@kyvg/vue3-notification';
import { onMounted, reactive, ref, watch } from 'vue';
import BankIcon from '@/components/common/bank-icon.vue';

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
  payments: [],
  paymentNotes: '',
});

const tempRoomType = reactive({
  name: '',
  type: '',
  size: '',
  price: '',
  description: '',
});

const addPayment = () => {
  if (tempRoomType.bankId === '') {
    notify({
      group: 'tr',
      title: 'ไม่สามารถเพิ่มช่องทางการชำระเงินได้',
      text: `กรุณาเลือกธนาคาร`,
      type: 'error',
    });
    return;
  }
  if (tempRoomType.account_name === '') {
    notify({
      group: 'tr',
      title: 'ไม่สามารถเพิ่มช่องทางการชำระเงินได้',
      text: `กรุณากรอกชื่อบัญชี`,
      type: 'error',
    });
    return;
  }
  if (tempRoomType.account_number === '') {
    notify({
      group: 'tr',
      title: 'ไม่สามารถเพิ่มช่องทางการชำระเงินได้',
      text: `กรุณากรอกหมายเลขบัญชี`,
      type: 'error',
    });
    return;
  }
  childData.payments.push({ ...tempRoomType });
  tempRoomType.bankId = '';
  tempRoomType.account_name = '';
  tempRoomType.account_number = '';
};

const removePayment = (index) => {
  childData.payments.splice(index, 1);
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
      <h1 class="text-xl font-semibold text-dark-blue-200">
        ประเภทห้องพัก
      </h1>
      <p class="text-xs">สร้างประเภทห้องพักในหอพักของคุณ</p>

      <div class="flex flex-col lg:flex-row gap-5">
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
            v-model="tempRoomType.account_name"
          />
          <p class="text-xs">เช่น ปกติ สตูดิโอ</p>
        </div>

        <div>
          <label class="label">
            <span class="text-base label-text"
              >หมายเลขบัญชี
              <span class="text-red-500">*</span>
            </span>
          </label>
          <input
            type="text"
            placeholder="หมายเลขบัญชี"
            class="input input-bordered bg-white input-sm rounded-sm"
            v-model="tempRoomType.account_number"
          />
        </div>

        <div class="flex items-end">
          <button
            class="btn btn-primary btn-sm"
            @click="addPayment"
            :disabled="props.viewOnly"
          >
            เพิ่ม
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div
          v-for="(payment, index) in childData.payments"
          :key="index"
          class="grid grid-cols-5 gap-4 items-center justify-between bg-gray-100 p-4 rounded-md"
        >
          <p><BankIcon :bank="findBank(payment.bankId)?.bank" size="xxxl" /></p>
          <p>{{ findBank(payment.bankId)?.thai_name }}</p>
          <p>{{ payment.account_name }}</p>
          <p>{{ payment.account_number }}</p>
          <button
            v-if="!props.viewOnly"
            @click="removePayment(index)"
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
