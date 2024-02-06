<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import Button from '@/components/common/button.vue';
import MeterRecordService from '@/services/MeterRecordService';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const data = reactive({
  meterRecordName: '',
  record_date: '',
});

const submit = async () => {
  const response = await MeterRecordService.create(residenceId, {
    ...data,
  });
  if (response.status == 201) {
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'สร้างใบบันทึกเลขมิเตอร์สำเร็จ',
      type: 'success',
    });
    router.push({ name: 'meter-record', params: { residenceId: residenceId } });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'สร้างใบบันทึกเลขมิเตอร์ไม่สำเร็จ: ' + data?.message,
      type: 'error',
    });
  }
};
</script>

<template>
  <div class="bg-gray-50">
    <div class="py-10 px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการ', pathName: 'manage' },
          {
            pathName: 'dashboard',
            params: { residenceId },
          },
          { name: 'ระบบบันทึกค่าน้ำ ค่าไฟ และค่าบริการอื่น ๆ' },
        ]"
      />
      <Button
        btnType="primary"
        class="mt-5"
        @click="router.push({ name: 'dashboard', params: { residenceId } })"
      >
        กลับหน้าแดชบอร์ด
      </Button>
      <div class="grid grid-cols-1">
        <div class="bg-white p-10 mt-2 shadow rounded-lg">
          <h1 class="text-2xl font-semibold text-dark-blue-200">
            ระบบบันทึกค่าน้ำ ค่าไฟ และค่าบริการอื่น ๆ
          </h1>
        </div>
      </div>

      <div class="card w-full bg-base-100 shadow-xl mt-5">
        <div class="card-body">
          <h2 class="card-title text-center">สร้างใบจดบันทึกใหม่</h2>

          <div>
            <label class="label">
              <span class="text-base label-text"
                >ชื่อบิล <span class="text-red-500">*</span>
              </span>
            </label>
            <input
              type="text"
              placeholder="ชื่อบิล"
              class="w-full input input-bordered bg-white"
              v-model="data.meterRecordName"
            />
          </div>
          <div>
            <label class="label">
              <span class="text-base label-text"
                >วันที่จด <span class="text-red-500">*</span>
              </span>
            </label>
            <input
              type="date"
              placeholder="วันที่จด"
              class="w-full input input-bordered bg-white"
              v-model="data.record_date"
            />
          </div>

          <Button
            btnType="primary"
            class="mt-5"
            @click="submit"
            :loading="isLoading"
          >
            สร้างใบบันทึก
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
