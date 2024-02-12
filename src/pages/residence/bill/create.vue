<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import MeterRecordService from '@/services/MeterRecordService';
import { BanknotesIcon } from '@heroicons/vue/24/outline';
import dayjs from 'dayjs';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BillService from '@/services/BillService';
import { notify } from '@kyvg/vue3-notification';

const isLoading = ref(true);
const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const payload = reactive({
  record_date: '',
  meterRecord: '', // MeterRecordId
});

const canSubmit = computed(() => {
  return payload.record_date && payload.meterRecord;
});

const meterRecords = ref([]);
const currentMeterRecord = computed(() => {
  return meterRecords.value.find(
    (record) => record._id === payload.meterRecord
  );
});

const fetchMeterRecord = async () => {
  //fetch meter record
  const response = await MeterRecordService.findAllByResidenceId(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    console.log('meter record', result);
    meterRecords.value = result;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to fetch meter record data',
      type: 'error',
    });
  }
};

const submit = async () => {
  console.log('submit', payload);
  const response = await BillService.create(residenceId, payload);
  if (response.status === 201) {
    notify({
      group: 'tr',
      title: 'สร้างบิลสำเร็จ',
      text: 'บิลถูกสร้างเรียบร้อยแล้ว',
      type: 'success',
    });
    router.push({ name: 'bill', params: { residenceId } });
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถสร้างบิลได้',
      type: 'error',
    });
  }
};

onMounted(async () => {
  await fetchMeterRecord();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" />
  <div class="bg-gray-50" v-else>
    <div class="py-10 px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการ', pathName: 'manage' },
          {
            name: 'dashboard',
            pathName: 'dashboard',
            params: { residenceId },
          },
          {
            name: 'ระบบจัดการบิล',
            pathName: 'bill',
            params: { residenceId },
          },
          {
            name: 'สรา้งบิล',
            pathName: 'create-bill',
            params: { residenceId },
          },
        ]"
      />
      <Button
        btnType="primary"
        class="mt-5"
        @click="router.push({ name: 'bill', params: { residenceId } })"
      >
        กลับหน้าบิลทั้งหมด
      </Button>

      <div class="grid grid-cols-4 gap-2">
        <!-- col 1 -->
        <div class="card w-full bg-base-100 shadow-xl mt-5">
          <div class="card-body">
            <h2 class="card-title text-center">สร้างบิล</h2>

            <div>
              <label class="label">
                <span class="text-base label-text"
                  >วันที่สร้าง <span class="text-red-500">*</span>
                </span>
              </label>
              <input
                type="date"
                placeholder="วันที่จด"
                class="w-full input input-bordered bg-white"
                v-model="payload.record_date"
              />
              <p class="text-red-500 text-sm" v-if="!payload.record_date">
                * กรุณากรอกวันที่จดบิล
              </p>
            </div>

            <div>
              <label class="label">
                <span class="text-base label-text"
                  >เลือกรอบมิเตอร์ <span class="text-red-500">*</span>
                </span>
              </label>
              <select
                class="select select-bordered w-full"
                v-model="payload.meterRecord"
              >
                <option value="">เลือกรอบมิเตอร์</option>
                <option
                  v-for="meterRecord in meterRecords"
                  :key="meterRecord._id"
                  :value="meterRecord._id"
                >
                  {{ dayjs(meterRecord.record_date).format('DD/MM/YYYY') }}
                </option>
              </select>
              <p class="text-red-500 text-sm" v-if="!payload.meterRecord">
                * กรุณากรอกวันที่จดบิล
              </p>
            </div>

            <div class="mt-5">
              <Button
                btnType="primary"
                class="w-full"
                :disabled="!canSubmit"
                @click="submit"
              >
                สร้างบิล
              </Button>
            </div>
          </div>
        </div>

        <!-- col 2 -->
        <div class="card w-full bg-base-100 shadow-xl mt-5 col-span-3">
          <div class="card-body">
            <div class="flex gap-2">
              <BanknotesIcon class="w-10 h-10 text-blue-500" />
              <h2 class="card-title text-center">บันทึกบิล</h2>
            </div>
            <p class="mt-5" v-if="!payload.meterRecord">
              กรุณาเลือกรอบมิเตอร์ที่ต้องการสร้างบิล
            </p>
            <div v-else>
              {{ currentMeterRecord }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
