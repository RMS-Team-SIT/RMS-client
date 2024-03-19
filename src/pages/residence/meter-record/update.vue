<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import Button from '@/components/common/button.vue';
import MeterRecordService from '@/services/MeterRecordService';
import { AdjustmentsHorizontalIcon, BellIcon, UsersIcon } from '@heroicons/vue/24/outline';
import Loading from '@/components/common/loading.vue';
import RoomService from '@/services/RoomService';
import dayjs from 'dayjs';
import Badge from '@/components/common/badge.vue';
import Alert from '@/components/common/alert.vue';
import back from '@/components/common/back.vue';
import NoUserImg from '@/assets/img/nouser.png';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const meterRecordId = route.params.meterRecordId;
const { notify } = useNotification();
const isLoading = ref(true);

const meterRecord = reactive({
  record_date: '',
  meterRecordItems: [],
  isLocked: false,
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
    meterRecord.isLocked = result.isLocked;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลมิเตอร์เก่าได้',
      type: 'error',
    });
  }
};

const submit = async () => {
  isLoading.value = true;
  // change room to room._id
  const payload = {
    record_date: meterRecord.record_date,
    meterRecordItems: meterRecord.meterRecordItems.map((item) => {
      return {
        room: item.room._id,
        previousWaterMeter: item.previousWaterMeter,
        currentWaterMeter: item.currentWaterMeter,
        totalWaterMeterUsage: item.totalWaterMeterUsage,
        previousElectricMeter: item.previousElectricMeter,
        currentElectricMeter: item.currentElectricMeter,
        totalElectricMeterUsage: item.totalElectricMeterUsage,
      };
    }),
  };

  const response = await MeterRecordService.update(
    residenceId,
    meterRecordId,
    payload
  );

  if (response.status === 200) {
    notify({
      group: 'tr',
      title: 'แก้ไขข้อมูลใบจดบันทึกสำเร็จ',
      text: 'ข้อมูลใบจดบันทึกได้รับการแก้ไขเรียบร้อยแล้ว',
      type: 'success',
    });
    router.push({ name: 'meter-record', params: { residenceId } });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถแก้ไขข้อมูลใบจดบันทึกได้: ' + data.message,
      type: 'error',
    });
  }
  isLoading.value = false;
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
  if (meterRecord.isLocked) {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถแก้ไขข้อมูลใบจดบันทึกได้: ใบจดบันทึกถูกล็อคแล้ว',
      type: 'error',
    });
    router.push({
      name: 'view-meter-record',
      params: { residenceId, meterRecordId },
    });
  }
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div class="py-10 px-10 md:px-40" v-else>
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
          name: 'ระบบบันทึกค่าน้ำ ค่าไฟ และค่าบริการอื่น ๆ',
          pathName: 'meter-record',
          params: { residenceId },
        },
        {
          name: 'แก้ไขข้อมูลใบจดบันทึก',
          pathName: 'update-meter-record',
          params: { residenceId, meterRecordId },
        },
      ]"
    />
    <back :to="{ name: 'meter-record', params: { residenceId } }" />
    <div class="grid grid-cols-4 gap-2">
      <!-- col 1 -->
      <div class="card w-full bg-base-100 shadow mt-5 border">
        <div class="card-body">
          <h2 class="card-title text-center">แก้ไขข้อมูลใบจดบันทึก</h2>
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
          <div class="flex justify-start gap-2">
            <div class="flex gap-2 text-gray-500">
              <UsersIcon class="w-5 h-5" />
              <p class="text-sm">ห้องที่มีคนเช่าอยู่</p>
            </div>
            <div class="flex gap-2 text-gray-500">
              <img :src="NoUserImg" class="w-5 h-5 flex mx-auto" />
              <p class="text-sm">ห้องที่ไม่มีคนเช่า</p>
            </div>
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
                  <th>สถานะห้อง</th>
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
                  v-for="(
                    meterRecordItem, index
                  ) in meterRecord.meterRecordItems"
                  :key="index"
                >
                  <td>
                    {{ meterRecordItem.room.name }}
                  </td>
                  <td>
                      <UsersIcon
                        class="w-5 h-5"
                        v-if="meterRecordItem.room.status !== 'AVAILABLE'"
                      />
                      <img :src="NoUserImg" class="w-5 h-5 flex mx-auto" v-else />
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
                      v-model="
                        meterRecord.meterRecordItems[index].currentWaterMeter
                      "
                    />
                  </td>
                  <td>
                    {{
                      (meterRecordItem.totalWaterMeterUsage =
                        meterRecordItem.currentWaterMeter -
                        meterRecordItem.previousWaterMeter)
                    }}
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
                      v-model="
                        meterRecord.meterRecordItems[index].currentElectricMeter
                      "
                    />
                  </td>
                  <td>
                    {{
                      (meterRecordItem.totalElectricMeterUsage =
                        meterRecordItem.currentElectricMeter -
                        meterRecordItem.previousElectricMeter)
                    }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex gap-2 justify-end">
            <Button
              btnType="secondary"
              class="mt-5"
              @click="
                router.push({ name: 'meter-record', params: { residenceId } })
              "
              :loading="isLoading"
            >
              ยกเลิก
            </Button>
            <Button
              btnType="primary"
              class="mt-5"
              @click="submit"
              :loading="isLoading"
            >
              แก้ไขใบจดบันทึก
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
