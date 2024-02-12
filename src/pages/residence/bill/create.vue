<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const isLoading = ref(true);
const router = useRouter();

onMounted(() => {
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" />
  <div class="bg-gray-50" v-else>
    <div class="py-10 px-10 md:px-40">
      {{ canSubmit }}
      {{ isFirstTime }}
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
        @click="router.push({ name: 'meter-record', params: { residenceId } })"
      >
        กลับหน้ามิเตอร์ทั้งหมด
      </Button>

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
                * กรุณากรอกวันที่จดบิล
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
              รอบบิลที่แล้ว จดครั้งล่าสุด :
              <Badge type="info" class="text-sm" v-if="isFirstTime">
                ยังไม่มีประวัติการจด
              </Badge>
              <Badge type="info" class="text-sm" v-else>
                {{ dayjs(latestRecord.record_date).format('DD/MM/YYYY') }}
              </Badge>
              <Alert
                class="mt-2"
                v-if="
                  latestRecord &&
                  dayjs(latestRecord.record_date).isSame(
                    payload.record_date,
                    'month'
                  )
                "
              >
                คุณได้ทำการบันทึกค่าน้ำและค่าไฟไปแล้วในเดือนนี้
              </Alert>
              <Alert
                class="mt-2"
                v-if="
                  latestRecord &&
                  dayjs(payload.record_date).isBefore(latestRecord.record_date)
                "
              >
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

              <Button
                btnType="primary"
                class="mt-5"
                @click="submit"
                :loading="isLoading"
                :disabled="!canSubmit"
              >
                สร้างใบจดบันทึกใหม่
              </Button>
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
