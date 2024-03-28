<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import Button from '@/components/common/button.vue';
import MeterRecordService from '@/services/MeterRecordService';
import { AdjustmentsHorizontalIcon, BellIcon } from '@heroicons/vue/24/outline';
import Loading from '@/components/common/loading.vue';
import RoomService from '@/services/RoomService';
import dayjs from 'dayjs';
import Badge from '@/components/common/badge.vue';
import Alert from '@/components/common/alert.vue';
import back from '@/components/common/back.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const meterRecordId = route.params.meterRecordId;
const { notify } = useNotification();
const isLoading = ref(true);

const meterRecord = reactive({
  record_date: '',
  meterRecordItems: [],
});

const fetchMeterRecord = async () => {
  const response = await MeterRecordService.findById(
    residenceId,
    meterRecordId
  );
  if (response.status === 200) {
    let result = await response.json();
    console.log('result', result);
    meterRecord.record_date = result.record_date;
    meterRecord.meterRecordItems = result.meterRecordItems;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลมิเตอร์เก่าได้',
      type: 'error',
    });
  }
};

const search = ref('');
const showedMeterRecord = computed(() => {
  return meterRecord.meterRecordItems.filter((meterRecordItem) => {
    return meterRecordItem.room.name
      .toLowerCase()
      .includes(search.value.toLowerCase());
  });
});

onMounted(async () => {
  await fetchMeterRecord();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" />
  <div class="py-10 px-10 md:px-20" v-else>
    <Breadcrumb
      :pathList="[
        { name: 'หน้าแรก', pathName: 'home' },
        { name: 'จัดการ', pathName: 'manage' },
        {
          name: 'แดชบอร์ด',
          pathName: 'dashboard',
          params: { residenceId },
        },
        {
          name: 'ระบบบันทึกค่าน้ำ ค่าไฟ และค่าบริการอื่น ๆ',
          pathName: 'meter-record',
          params: { residenceId },
        },
        {
          name: 'ดูข้อมูลใบจดบันทึก',
          pathName: 'view-meter-record',
          params: { residenceId, meterRecordId },
        },
      ]"
    />
    <back :to="{ name: 'meter-record', params: { residenceId } }" />
    <div class="grid grid-cols-4 gap-2">
      <!-- col 1 -->
      <div class="card w-full bg-base-100 shadow mt-5 border">
        <div class="card-body">
          <h2 class="card-title text-center">ดูข้อมูลใบจดบันทึก</h2>
          <div>
            <label class="label">
              <span class="text-base label-text"
                >วันที่จด:
                <Badge badgeType="neutral" size="lg">
                  {{
                    dayjs(meterRecord.record_date).format('DD/MM/YYYY')
                  }}</Badge
                >
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- col 2 -->
      <div class="card w-full bg-base-100 shadow mt-5 col-span-3 border">
        <div class="card-body">
          <div class="flex gap-2">
            <AdjustmentsHorizontalIcon class="w-10 h-10 text-blue-500" />
            <h2 class="card-title text-center">มิเตอร์น้ำและค่าไฟ</h2>
          </div>

          <div class="w-full flex align-middle items-center justify-end">
            <label class="label">
              <span class="label-text">ค้นหาห้อง:</span>
            </label>
            <input
              type="text"
              placeholder="ค้นหาห้อง"
              class="input input-xs input-bordered bg-white rounded"
              v-model="search"
            />
          </div>

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
                  <th>มิเตอร์ไฟฟ้ารอบที่แล้ว</th>
                  <th>มิเตอร์ไฟฟ้ารอบปัจจุบัน</th>
                  <th>จำนวนหน่วย</th>
                </tr>
              </thead>
              <tbody>
                <!-- row 1 -->
                <tr
                  v-for="(meterRecordItem, index) in showedMeterRecord"
                  :key="index"
                >
                  <td>
                    {{ meterRecordItem.room.name }}
                  </td>

                  <td>
                    <input
                      type="number"
                      placeholder="มิเตอร์น้ำรอบที่แล้ว"
                      class="input input-bordered w-full max-w-xs disabled input-sm"
                      :value="meterRecordItem.previousWaterMeter"
                      disabled
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      placeholder="มิเตอร์น้ำรอบที่แล้ว"
                      class="input input-bordered w-full max-w-xs disabled input-sm"
                      :value="meterRecordItem.currentWaterMeter"
                      disabled
                    />
                  </td>
                  <td>
                    {{ meterRecordItem.totalWaterMeterUsage }}
                  </td>

                  <td>
                    <input
                      type="number"
                      placeholder="มิเตอร์น้ำรอบที่แล้ว"
                      class="input input-bordered w-full max-w-xs disabled input-sm"
                      :value="meterRecordItem.previousElectricMeter"
                      disabled
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="มิเตอร์น้ำรอบที่แล้ว"
                      class="input input-bordered w-full max-w-xs disabled input-sm"
                      :value="meterRecordItem.currentElectricMeter"
                      disabled
                    />
                  </td>
                  <td>
                    {{ meterRecordItem.totalElectricMeterUsage }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
