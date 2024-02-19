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
import Divider from '@/components/common/divider.vue';

const isLoading = ref(true);
const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const payload = reactive({
  meterRecord: '', // MeterRecordId
});

const canSubmit = computed(() => {
  return !!payload.meterRecord;
});

const search = ref('');
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
    meterRecords.value = result.filter(
      (record) =>
        record.isBillGenerated === false && record.isFirstInitRecord === false
    );
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
                * กรุณากรอกรอบมิเตอร์
              </p>
            </div>

            <div class="mt-5">
              <Button
                btnType="primary"
                class="w-full"
                :disabled="!canSubmit"
                @click="submit"
              >
                สร้างบิลของทุกห้อง
              </Button>
            </div>
          </div>
        </div>

        <!-- col 2 -->
        <div class="card w-full bg-base-100 shadow-xl mt-5 col-span-3">
          <div class="card-body">
            <div class="flex gap-2">
              <BanknotesIcon class="w-10 h-10 text-blue-500" />
              <h2 class="card-title text-center">สรุปบิลของทุกห้อง</h2>
            </div>
            <p class="mt-5" v-if="!payload.meterRecord">
              กรุณาเลือกรอบมิเตอร์ที่ต้องการสร้างบิล
            </p>
            <div v-else>
              <p>
                รอบมิเตอร์ :
                {{ dayjs(currentMeterRecord.record_date).format('DD/MM/YYYY') }}
              </p>
              <p class="flex items-center">
                <label class="label">
                  <span class="label-text">ค้นหาห้อง:</span>
                </label>
                <input
                  type="text"
                  placeholder="ค้นหาห้อง"
                  class="input input-sm input-bordered bg-white rounded"
                  v-model="search"
                />
              </p>
              <div
                class="collapse collapse-arrow border border-base-300 shadow-sm m-2"
                v-for="(
                  meterRecordItem, index
                ) in currentMeterRecord.meterRecordItems.filter((item) =>
                  item.room.name.toLowerCase().includes(search.toLowerCase())
                )"
                :key="index"
              >
                <input type="checkbox" />
                <div class="collapse-title text-lg font-medium">
                  ห้อง {{ meterRecordItem.room.name }}
                </div>
                <div class="collapse-content">
                  <div class="flex w-full">
                    <div class="w-full">
                      <p class="text-lg font-bold">ค่าน้ำ</p>
                      <p>
                        มิเตอร์น้ำครั้งก่อน:
                        {{ meterRecordItem.previousWaterMeter }}
                      </p>
                      <p>
                        มิเตอร์น้ำครั้งนี้:
                        {{ meterRecordItem.currentWaterMeter }}
                      </p>
                      <p>
                        จำนวนหน่วย:
                        {{ meterRecordItem.totalWaterMeterUsage }} หน่วย
                      </p>
                      <p>
                        อัตราค่าน้ำต่อหน่วย:
                        {{ meterRecordItem.room.waterPriceRate }} บาท
                      </p>
                      <p>
                        บิลค่าน้ำ :
                        <b
                          >{{
                            meterRecordItem.room.waterPriceRate *
                            meterRecordItem.totalWaterMeterUsage
                          }}
                          บาท</b
                        >
                      </p>
                    </div>
                    <div class="divider divider-horizontal"></div>
                    <div class="w-full">
                      <p class="text-lg font-bold">ค่าไฟ</p>
                      <p>
                        มิเตอร์ไฟครั้งก่อน:
                        {{ meterRecordItem.previousElectricMeter }}
                      </p>
                      <p>
                        มิเตอร์ไฟครั้งนี้:
                        {{ meterRecordItem.currentElectricMeter }}
                      </p>
                      <p>
                        จำนวนหน่วย:
                        {{ meterRecordItem.totalElectricMeterUsage }}
                      </p>
                      <p>
                        อัตราค่าไฟต่อหน่วย:
                        {{ meterRecordItem.room.electricPriceRate }}
                      </p>
                      <p>
                        บิลค่าไฟ :
                        <b
                          >{{
                            meterRecordItem.room.electricPriceRate *
                            meterRecordItem.totalElectricMeterUsage
                          }}
                          บาท</b
                        >
                      </p>
                    </div>
                    <div class="divider divider-horizontal"></div>
                    <div class="w-full">
                      <p class="text-lg font-bold">ค่าเช่า</p>
                      <p>
                        ค่าเช่าห้อง:
                        <b>{{ meterRecordItem.room.roomRentalPrice }}</b> บาท
                      </p>
                    </div>
                  </div>
                  <Divider />
                  <p class="text-lg font-bold mt-5 rounded-full">
                    รวม:
                    {{
                      meterRecordItem.room.roomRentalPrice +
                      meterRecordItem.room.electricPriceRate *
                        meterRecordItem.totalElectricMeterUsage +
                      meterRecordItem.room.waterPriceRate *
                        meterRecordItem.totalWaterMeterUsage
                    }}
                    บาท
                  </p>
                </div>
              </div>
              <p class="text-sm text-gray-500">
                หมายเหตุ: กดเพื่อดูรายละเอียดเพิ่ม *
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
