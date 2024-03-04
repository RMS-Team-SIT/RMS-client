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
  payments: [],
  paymentNotes: '',
});

const tempPayment = reactive({
  bankId: '',
  account_name: '',
  account_number: '',
  type: 'bank_transfer',
});

const addPayment = () => {
  if (tempPayment.bankId === '') {
    notify({
      group: 'tr',
      title: 'ไม่สามารถเพิ่มช่องทางการชำระเงินได้',
      text: `กรุณาเลือกธนาคาร`,
      type: 'error',
    });
    return;
  }
  if (tempPayment.account_name === '') {
    notify({
      group: 'tr',
      title: 'ไม่สามารถเพิ่มช่องทางการชำระเงินได้',
      text: `กรุณากรอกชื่อบัญชี`,
      type: 'error',
    });
    return;
  }
  if (tempPayment.account_number === '') {
    notify({
      group: 'tr',
      title: 'ไม่สามารถเพิ่มช่องทางการชำระเงินได้',
      text: `กรุณากรอกหมายเลขบัญชี`,
      type: 'error',
    });
    return;
  }
  childData.payments.push({ _id: generateRandomObjectId(), ...tempPayment });
  tempPayment.bankId = '';
  tempPayment.account_name = '';
  tempPayment.account_number = '';
};

const removePayment = (index) => {
  childData.payments.splice(index, 1);
};

const findBank = (bankId) => {
  console.log('bankId', bankId);
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
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">
      ตั้งค่าช่องทางการชำระเงิน
    </h1>
    <p class="text-xs">โปรดใส่ข้อมูลช่องทางการชำระเงิน</p>

    <div class="flex flex-col lg:flex-row gap-5" v-if="!viewOnly">
      <div>
        <label class="label">
          <span class="text-base label-text"
            >ธนาคาร <span class="text-red-500">*</span>
          </span>
        </label>
        <select
          class="select select-bordered w-full max-w-xs select-sm bg-white input-sm rounded-sm"
          v-model="tempPayment.bankId"
        >
          <option value="">เลือกธนาคาร</option>
          <option v-for="bank in banks" :key="bank._id" :value="bank._id">
            {{ bank.thai_name }}
          </option>
        </select>
      </div>

      <div>
        <label class="label">
          <span class="text-base label-text"
            >ชื่อบัญชี <span class="text-red-500">*</span>
          </span>
        </label>
        <input
          type="text"
          placeholder="ชื่อบัญชี"
          class="input input-bordered bg-white input-sm rounded-sm"
          v-model="tempPayment.account_name"
        />
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
          v-model="tempPayment.account_number"
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

    <h1 class="text-xl font-semibold text-dark-blue-200">ข้อความเพิ่มเติม</h1>
    <p class="text-xs">ข้อความเพิ่มเติมจะแสดงพร้อมกับช่องทางการชำระเงิน</p>
    <textarea
      placeholder="ข้อความเพิ่มเติม"
      class="w-full textarea textarea-bordered rounded-sm bg-white"
      v-model="childData.paymentNotes"
      :disabled="viewOnly"
    ></textarea>
  </div>
</template>

<style scoped></style>
