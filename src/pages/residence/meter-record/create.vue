<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import Button from '@/components/common/button.vue';
import MeterRecordService from '@/services/MeterRecordService';
import { AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const data = reactive({
  meterRecordName: '',
  record_date: new Date(),
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
        @click="router.push({ name: 'meter-record', params: { residenceId } })"
      >
        กลับหน้ามิเตอร์ทั้งหมด
      </Button>

      <div class="grid grid-cols-4 gap-2">
        <!-- col 1 -->
        <div class="card w-full bg-base-100 shadow-xl mt-5">
          <div class="card-body">
            <h2 class="card-title text-center">สร้างใบจดบันทึกใหม่</h2>
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
          </div>
        </div>

        <!-- col 2 -->
        <div class="card w-full bg-base-100 shadow-xl mt-5 col-span-3">
          <div class="card-body">
            <h2 class="card-title text-center">บันทึกค่าน้ำ</h2>
            <AdjustmentsHorizontalIcon class="w-10 h-10 text-blue-500" />

            <!-- List all room -->

            <div class="overflow-x-auto">
              <table class="table">
                <!-- head -->
                <thead>
                  <tr>
                    <th>ชื่อห้อง</th>
                    <th>มิเตอร์น้ำรอบที่แล้ว</th>
                    <th>มิเตอร์น้ำรอบปัจจุบัน</th>
                    <th>จำนวนหน่วย</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- row 1 -->
                  <tr>
                    <th>101</th>
                    <td>
                      <input
                        type="number"
                        placeholder="Type here"
                        class="input input-bordered w-full max-w-xs disabled input-sm"
                        value="20"
                        disabled
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="มิเตอร์น้ำรอบปัจจุบัน"
                        class="input input-bordered w-full max-w-xs input-sm"
                      />
                    </td>
                    <td>20</td>
                  </tr>
                  <!-- row 2 -->
                  <tr class="hover">
                    <th>2</th>
                    <td>Hart Hagerty</td>
                    <td>Desktop Support Technician</td>
                    <td>Purple</td>
                  </tr>
                  <!-- row 3 -->
                  <tr>
                    <th>3</th>
                    <td>Brice Swyre</td>
                    <td>Tax Accountant</td>
                    <td>Red</td>
                  </tr>
                </tbody>
              </table>
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
  </div>
</template>

<style scoped></style>
