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
const { notify } = useNotification();
const isLoading = ref(true);
const isFirstTime = ref(false);

const payload = reactive({
  record_date: '',
  meterRecordItems: [],
});

const rooms = ref([]);
const fetchRooms = async () => {
  const response = await RoomService.fetchAllRoomByResidence(residenceId);
  if (response.status === 200) {
    const data = await response.json();
    console.log('rooms', data);
    rooms.value = data;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลห้องพักได้',
      type: 'error',
    });
  }
};

const findIndex = (id) => {
  return rooms.value.findIndex((room) => room._id === id);
};

const latestRecord = ref(null);

const fetchLastPrevMeterRecord = async () => {
  // const response = await MeterRecordService.findAllByResidenceId(residenceId);
  const response = await MeterRecordService.findLatest(residenceId);
  if (response.status === 200) {
    const result = await response.json();
    if (!result.latestdMeterRecord) {
      isFirstTime.value = true;
      return;
    }

    latestRecord.value = result.latestdMeterRecord;
    console.log('latestRecord', result.latestdMeterRecord);
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลมิเตอร์เก่าได้',
      type: 'error',
    });
  }
};

const findRecord = (roomId) => {
  if (isFirstTime.value) return null;
  return latestRecord.value.meterRecordItems.find(
    (item) => item.room === roomId
  );
};

const calcualteTotalWaterMeterUsage = (roomId) => {
  if (isFirstTime.value) return 0;
  if (!findRecord(roomId)) return 0;
  return (
    payload.meterRecordItems[findIndex(roomId)].currentWaterMeter -
    findRecord(roomId)?.currentWaterMeter
  );
};

const calcualteTotalElectricMeterUsage = (roomId) => {
  if (isFirstTime.value) return 0;
  if (!findRecord(roomId)) return 0;
  return (
    payload.meterRecordItems[findIndex(roomId)].currentElectricMeter -
    findRecord(roomId)?.currentElectricMeter
  );
};

const setDefaultMeterRecordItems = async () => {
  payload.meterRecordItems = rooms.value.map((room) => {
    return {
      room: room._id,
      currentWaterMeter: findRecord(room._id)?.currentWaterMeter || 0,
      currentElectricMeter: findRecord(room._id)?.currentElectricMeter || 0,
      previousWaterMeter: findRecord(room._id)?.currentWaterMeter || 0,
      previousElectricMeter: findRecord(room._id)?.currentElectricMeter || 0,
    };
  });
};

const submit = async () => {
  isLoading.value = true;

  const response = await MeterRecordService.create(residenceId, {
    ...payload,
    record_date: isFirstTime.value
      ? dayjs(0).format('YYYY-MM-DD')
      : payload.record_date,
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
  isLoading.value = false;
};

const canSubmit = computed(() => {
  if (isFirstTime.value) return true;
  return (
    payload.record_date &&
    payload.meterRecordItems.every(
      (item) =>
        item.currentWaterMeter &&
        item.currentElectricMeter &&
        item.currentWaterMeter >= item.previousWaterMeter &&
        item.currentElectricMeter >= item.previousElectricMeter
    ) &&
    !isSameMonth.value &&
    !isBefore.value
  );
});

const isSameMonth = computed(() => {
  console.log(
    'latestRecord',
    latestRecord.record_date,
    'payload',
    payload.record_date
  );
  if (isFirstTime.value) return false;
  return dayjs(latestRecord.value.record_date).isSame(
    payload.record_date,
    'month'
  );
});

const isBefore = computed(() => {
  if (isFirstTime.value) return false;
  return dayjs(payload.record_date).isBefore(latestRecord.value.record_date);
});

onMounted(async () => {
  await fetchLastPrevMeterRecord();
  await fetchRooms();
  await setDefaultMeterRecordItems();
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
            name: 'ระบบบันทึกค่าน้ำ ค่าไฟ และค่าบริการอื่น ๆ',
            pathName: 'meter-record',
            params: { residenceId },
          },
          {
            name: 'เพิ่มข้อมูลใบจดบันทึก',
            pathName: 'create-meter-record',
            params: { residenceId, meterRecordId },
          },
        ]"
      />
      <back :to="{ name: 'meter-record', params: { residenceId } }" />
      <div class="grid grid-cols-4 gap-2">
        <!-- col 1 -->
        <div class="card w-full bg-base-100 shadow-xl mt-5">
          <div class="card-body">
            <h2 class="card-title text-center">สร้างใบจดบันทึกใหม่</h2>
            <div v-if="!isFirstTime">
              <label class="label">
                <span class="text-base label-text"
                  >วันที่จด <span class="text-red-500">*</span>
                </span>
              </label>
              <input
                type="date"
                placeholder="วันที่จด"
                class="w-full input input-bordered bg-white"
                v-model="payload.record_date"
              />
              <p class="text-red-500 text-sm" v-if="!payload.record_date">
                * กรุณากรอกวันที่จดมิเตอร์
              </p>
            </div>
            <div v-else>
              <p class="text-red-500 font-bold text-base" v-if="isFirstTime">
                เป็นการบันทึกรอบแรกในระบบ<br />
                ให้บันทึกมิเตอร์รอบก่อนหน้าในช่องปัจจุบัน <br />
                จากนั้นสร้างบันทึกใหม่
              </p>
            </div>

            <p>
              การจดมิเตอร์ครั้งล่าสุด :
              <Badge badgeType="neutral" size="lg"  v-if="isFirstTime">
                ยังไม่มีประวัติการจด
              </Badge>
              <Badge type="info" class="text-sm" v-else>
                {{ dayjs(latestRecord.record_date).format('DD/MM/YYYY') }}
              </Badge>
              <Alert class="mt-2" v-if="isSameMonth">
                คุณได้ทำการบันทึกค่าน้ำและค่าไฟไปแล้วในเดือนนี้
              </Alert>
              <Alert class="mt-2" v-if="isBefore">
                คุณได้ทำการบันทึกค่าน้ำและค่าไฟไปแล้วในอดีต
              </Alert>
            </p>
          </div>
        </div>

        <!-- col 2 -->
        <div class="card w-full bg-base-100 shadow-xl mt-5 col-span-3">
          <div class="card-body">
            <div class="flex gap-2">
              <AdjustmentsHorizontalIcon class="w-10 h-10 text-blue-500" />
              <h2 class="card-title text-center">บันทึกค่าน้ำและค่าไฟ</h2>
            </div>

            <!-- List all room -->
            <div v-if="rooms.length">
              <div class="overflow-x-auto" v-if="rooms.length">
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
                    <tr v-for="(room, index) in rooms" :key="index">
                      <th>{{ room.name }}</th>
                      <td>
                        <input
                          type="number"
                          placeholder="มิเตอร์น้ำรอบที่แล้ว"
                          class="input input-bordered w-full max-w-xs disabled input-sm"
                          :value="findRecord(room._id)?.currentWaterMeter"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="มิเตอร์น้ำรอบปัจจุบัน"
                          class="input input-bordered w-full max-w-xs input-sm"
                          v-model="
                            payload.meterRecordItems[findIndex(room._id)]
                              .currentWaterMeter
                          "
                        />
                      </td>
                      <td>
                        {{
                          (payload.meterRecordItems[
                            findIndex(room._id)
                          ].totalWaterMeterUsage =
                            calcualteTotalWaterMeterUsage(room._id))
                        }}
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="มิเตอร์ไฟฟ้ารอบที่แล้ว"
                          class="input input-bordered w-full max-w-xs disabled input-sm"
                          :value="findRecord(room._id)?.currentElectricMeter"
                          disabled
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="มิเตอร์ไฟฟ้ารอบปัจจุบัน"
                          class="input input-bordered w-full max-w-xs input-sm"
                          v-model="
                            payload.meterRecordItems[findIndex(room._id)]
                              .currentElectricMeter
                          "
                        />
                      </td>
                      <td>
                        {{
                          (payload.meterRecordItems[
                            findIndex(room._id)
                          ].totalElectricMeterUsage =
                            calcualteTotalElectricMeterUsage(room._id))
                        }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="flex gap-2 items-center mt-5">
                <Button
                  btnType="primary"
                  @click="submit"
                  :loading="isLoading"
                  :disabled="!canSubmit"
                >
                  สร้างใบจดบันทึกใหม่
                </Button>
                <p class="text-red-500" v-if="!isFirstTime">
                  * หากคุณสร้างใบจดบันทึกใหม่
                  คุณจะไม่สามารถแก้ไขใบจดบันทึกครั้งก่อนได้อีก
                </p>
              </div>
            </div>
            <div v-else>
              <p class="text-red-500 font-bold text-base mt-5">
                ไม่มีห้องพักในระบบ กรุณาสร้างห้องพักในหอ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
