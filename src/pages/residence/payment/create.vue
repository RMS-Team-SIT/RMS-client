<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '@/components/common/button.vue';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/24/outline';
import { useNotification } from '@kyvg/vue3-notification';
import BankService from '@/services/BankService';
import PaymentService from '@/services/PaymentService';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const banks = ref([]);

const data = reactive({
  bankId: '',
  account_number: '',
  account_name: '',
  type: 'bank_transfer',
});

const canSubmit = ref(false);

const submitData = async () => {
  // Create renter
  const response = await PaymentService.createPayment(residenceId, {
    ...data,
  });
  if (response.status == 201) {
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'สร้างช่องทางการชำระเงินสำเร็จ',
      type: 'success',
    });
    router.push({ name: 'payment', params: { residenceId: residenceId } });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to create payment: ' + data?.message,
      type: 'error',
    });
  }
};

const fetchData = async () => {
  const response = await BankService.fetchBanks();
  if (response.status === 200) {
    let result = await response.json();
    console.log(result);
    banks.value = result;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to fetch banks data',
      type: 'error',
    });
  }
};
onMounted(async () => {
  await fetchData();
});

watch(data, () => {
  if (data.bankId && data.account_number && data.account_name) {
    canSubmit.value = true;
  } else {
    canSubmit.value = false;
  }
});
</script>

<template>
  <div class="card w-full min-h-screen">
    <div class="card-body px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการ', pathName: 'manage' },
          { name: 'แดชบอร์ด', pathName: 'dashboard', params: { residenceId } },
          {
            name: 'ช่องทางการชำระเงิน',
            pathName: 'payment',
            params: { residenceId },
          },
          { name: 'สร้างช่องทางการชำระเงิน' },
        ]"
      />
      <div class="flex gap-4 shadow-md rounded">
        <div class="bg-white p-10 space-y-4">
          <h1 class="text-xl font-semibold text-dark-blue-200">
            ตั้งค่าช่องทางการชำระเงิน
          </h1>
          <p class="text-xs">โปรดใส่ข้อมูลช่องทางการชำระเงิน</p>

          <div class="flex flex-col lg:flex-row gap-5">
            <div>
              <label class="label">
                <span class="text-base label-text"
                  >ธนาคาร <span class="text-red-500">*</span>
                </span>
              </label>
              <select
                class="select select-bordered w-full max-w-xs"
                v-model="data.bankId"
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
                class="w-full input input-bordered bg-white"
                v-model="data.account_name"
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
                class="w-full input input-bordered bg-white"
                v-model="data.account_number"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- button control -->
      <div class="flex justify-end gap-2 mt-10">
        <Button
          btn-type="secondary"
          @click="router.push({ name: 'payment', params: { residenceId } })"
          class="rounded-badge"
        >
          ยกเลิก
        </Button>

        <Button
          @click="submitData"
          class="rounded-badge"
          btnType="primary"
          :disabled="!canSubmit"
        >
          บันทึกข้อมูล
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
