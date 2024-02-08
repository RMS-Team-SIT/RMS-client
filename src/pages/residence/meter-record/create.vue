<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { computed, onMounted, reactive, ref } from 'vue';
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

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);
const isFirstTime = ref(true);

const payload = reactive({
  record_date: '',
  meterRecordItems: [],
});

const submit = async () => {
  const response = await MeterRecordService.create(residenceId, {
    ...payload,
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
const rooms = ref([]);
const fetchRooms = async () => {
  const response = await RoomService.fetchAllRoomByResidence(residenceId);
  if (response.status === 200) {
    const data = await response.json();
    console.log('rooms', data);
    rooms.value = data;
    payload.meterRecordItems = data.map((room) => {
      return {
        room: room._id,
        currentWaterMeter: 0,
        currentElectricMeter: 0,
      };
    });
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

const prevMeterRecordList = ref([]);
const lastPrevMeterRecord = ref(null);

const fetchPrevMeterRecord = async () => {
  const response = await MeterRecordService.findAllByResidenceId(residenceId);
  if (response.status === 200) {
    let result = await response.json();
    prevMeterRecordList.value = result;

    console.log('Previous Meter Record List', result);

    if (prevMeterRecordList.value.length > 0) {
      isFirstTime.value = false;
    }
    lastPrevMeterRecord.value =
      prevMeterRecordList.value[prevMeterRecordList.value.length - 1];

    console.log('lastPrevMeterRecord', lastPrevMeterRecord.value);
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
  return lastPrevMeterRecord.value.meterRecordItems.find(
    (item) => item.room === roomId
  );
};

onMounted(async () => {
  await fetchRooms();
  await fetchPrevMeterRecord();
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
                v-model="payload.record_date"
              />
            </div>

            <p>
              รอบบิลที่แล้ว จดครั้งล่าสุด :
              <Badge type="info" class="text-sm">
                {{
                  dayjs(lastPrevMeterRecord.record_date).format('DD/MM/YYYY')
                }}
              </Badge>
              <Alert
                v-if="
                  dayjs(lastPrevMeterRecord.record_date).isSame(
                    payload.record_date,
                    'month'
                  )
                "
              >
                คุณได้ทำการบันทึกค่าน้ำและค่าไฟไปแล้วในเดือนนี้
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

            <p class="text-red-500 font-bold">เป็นการบันทึกรอบแรกในระบบ *</p>

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
                  <tr v-for="(room, index) in rooms" :key="index">
                    <th>{{ room.name }}</th>
                    <td>
                      <input
                        type="number"
                        placeholder="Type here"
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
                          payload.meterRecordItems[findIndex(room._id)]
                            .currentWaterMeter -
                          findRecord(room._id)?.currentWaterMeter)
                      }}
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="Type here"
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
                          payload.meterRecordItems[findIndex(room._id)]
                            .currentElectricMeter -
                          findRecord(room._id)?.currentElectricMeter)
                      }}
                    </td>
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
              บันทึกข้อมูล
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
