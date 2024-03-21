<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import MeterRecordService from '@/services/MeterRecordService';
import { BanknotesIcon, UsersIcon } from '@heroicons/vue/24/outline';
import dayjs from 'dayjs';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BillService from '@/services/BillService';
import { notify } from '@kyvg/vue3-notification';
import Divider from '@/components/common/divider.vue';
import back from '@/components/common/back.vue';
import ResidenceServices from '@/services/ResidenceServices';
import NoUserImg from '@/assets/img/nouser.png';

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

const residence = ref(null);
const fetchResidence = async () => {
  const response = await ResidenceServices.fetchResidence(residenceId);
  if (response.status === 200) {
    residence.value = await response.json();
    console.log('residence', residence.value);
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลหอพักได้',
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

watch(payload, (newVal, oldVal) => {
  console.log('payload', newVal);
});

onMounted(async () => {
  await fetchMeterRecord();
  await fetchResidence();
  isLoading.value = false;
});

const currentModalBillRoom = reactive({
  room: null,
  meterRecordItem: null,
});

const setCurrentModalBillRoom = (meterRecordItem) => {
  currentModalBillRoom.meterRecordItem = meterRecordItem;
};

const resetCurrentModalBillRoom = () => {
  currentModalBillRoom.room = null;
  currentModalBillRoom.meterRecordItem = null;
};

const showOnlyRentedRoom = ref(false);
const selectedMeterRecordForBillCreation = ref([]);
const resetSelectedMeterRecordForBillCreation = () => {
  selectedMeterRecordForBillCreation.value = [];
};
const selectAllMeterRecordForBillCreation = () => {
  selectedMeterRecordForBillCreation.value =
    currentMeterRecord.value.meterRecordItems.map((item) => item._id);
};
const selectAllRentedMeterRecordForBillCreation = () => {
  selectedMeterRecordForBillCreation.value =
    currentMeterRecord.value.meterRecordItems
      .filter((item) => item.room.status !== 'AVAILABLE')
      .map((item) => item._id);
};
const toggleSelectAllMeterRecordForBillCreation = () => {
  if (
    selectedMeterRecordForBillCreation.value.length ===
    currentMeterRecord.value.meterRecordItems.length
  ) {
    resetSelectedMeterRecordForBillCreation();
  } else {
    selectAllMeterRecordForBillCreation();
  }
};
</script>

<template>
  <Loading v-if="isLoading" />
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

    <back :to="{ name: 'bill', params: { residenceId } }" />

    <div class="grid grid-cols-4 gap-2">
      <!-- col 1 -->
      <div class="card w-full bg-base-100 shadow border mt-5">
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
              สร้างบิลของห้องที่เลือก
            </Button>
          </div>
        </div>
      </div>

      <!-- col 2 -->
      <div class="card w-full bg-base-100 shadow border mt-5 col-span-3">
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

            <div class="flex items-center justify-between">
              <div class="flex gap-2">
                <div class="flex gap-2 text-gray-500">
                  <UsersIcon class="w-5 h-5" />
                  <p class="text-sm">ห้องที่มีคนเช่าอยู่</p>
                </div>
                <div class="flex gap-2 text-gray-500">
                  <img :src="NoUserImg" class="w-5 h-5 flex mx-auto" />
                  <p class="text-sm">ห้องที่ไม่มีคนเช่า</p>
                </div>
              </div>
              <div class="flex gap-2 items-center">
                <div class="flex gap-2 items-center">
                  <label class="label">
                    <span class="label-text">ค้นหาห้อง:</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ค้นหาห้อง"
                    class="input input-sm input-bordered bg-white rounded"
                    v-model="search"
                  />
                </div>
                <div class="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    class="checkbox checkbox-primary"
                    v-model="showOnlyRentedRoom"
                  />
                  <p class="text-sm">แสดงเฉพาะห้องที่มีผู้เช่า</p>
                </div>
              </div>
            </div>

            <div class="flex gap-2 items-center">
              <div class="flex gap-2 items-center">
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  @click="toggleSelectAllMeterRecordForBillCreation"
                  :checked="
                    selectedMeterRecordForBillCreation.length ===
                    currentMeterRecord.meterRecordItems.length
                  "
                />
                <p class="text-sm">เลือกทุกห้อง</p>
              </div>
              <div class="flex gap-2 items-center">
                <input
                  type="checkbox"
                  class="checkbox checkbox-primary"
                  @click="selectAllRentedMeterRecordForBillCreation"
                  :checked="
                    selectedMeterRecordForBillCreation.length &&
                    selectedMeterRecordForBillCreation.length ===
                      currentMeterRecord.meterRecordItems.filter(
                        (item) => item.room.status !== 'AVAILABLE'
                      ).length
                  "
                />
                <p class="text-sm">เลือกทุกห้องที่มีคนเช่า</p>
              </div>
            </div>

            {{ selectedMeterRecordForBillCreation }}
            <div class="grid grid-cols-3 gap-2 mt-5">
              <div
                class="border border-base-300 shadow-sm rounded cursor-pointer"
                v-for="(
                  meterRecordItem, index
                ) in currentMeterRecord.meterRecordItems.filter((item) =>
                  item.room.name.toLowerCase().includes(search.toLowerCase()) &&
                  showOnlyRentedRoom
                    ? item.room.status !== 'AVAILABLE'
                    : true
                )"
                :key="index"
              >
                <div class="text-lg font-medium p-5">
                  <div class="flex gap-2 justify-start items-center">
                    <!-- check box -->
                    <input
                      type="checkbox"
                      class="checkbox checkbox-primary"
                      v-model="selectedMeterRecordForBillCreation"
                      :value="meterRecordItem._id"
                    />
                    <span
                      >ห้อง <b>{{ meterRecordItem.room.name }}</b></span
                    >
                    <UsersIcon
                      class="w-5 h-5"
                      v-if="meterRecordItem.room.status !== 'AVAILABLE'"
                    />
                    <img :src="NoUserImg" class="w-5 h-5" v-else />
                  </div>

                  <p
                    class="text-sm text-gray-500"
                    onclick="billDetail.showModal()"
                    @click="setCurrentModalBillRoom(meterRecordItem)"
                  >
                    กดเพื่อดูรายละเอียดเพิ่ม
                  </p>
                </div>
              </div>
            </div>

            <p class="text-sm text-gray-500">
              หมายเหตุ: กดเพื่อดูรายละเอียดเพิ่ม *
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <dialog :id="`billDetail`" class="modal z-50">
      <div class="modal-box space-y-2 w-11/12 max-w-3xl border">
        <div v-if="currentModalBillRoom.meterRecordItem">
          <h3 class="font-bold text-lg">
            ดูข้อมูลบิลห้อง:
            {{ currentModalBillRoom.meterRecordItem.room.name }}
          </h3>
          <div class="mt-5">
            <div class="flex w-full">
              <div class="w-full">
                <p class="text-lg font-bold">ค่าน้ำ</p>
                <p>
                  มิเตอร์น้ำครั้งก่อน:
                  {{ currentModalBillRoom.meterRecordItem.previousWaterMeter }}
                </p>
                <p>
                  มิเตอร์น้ำครั้งนี้:
                  {{ currentModalBillRoom.meterRecordItem.currentWaterMeter }}
                </p>
                <p>
                  จำนวนหน่วย:
                  {{
                    currentModalBillRoom.meterRecordItem.totalWaterMeterUsage
                  }}
                  หน่วย
                </p>
                <p>
                  อัตราค่าน้ำต่อหน่วย:
                  {{ residence.defaultWaterPriceRate }} บาท
                </p>
                <p>
                  บิลค่าน้ำ :
                  <b
                    >{{
                      residence.defaultWaterPriceRate *
                      currentModalBillRoom.meterRecordItem.totalWaterMeterUsage
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
                  {{
                    currentModalBillRoom.meterRecordItem.previousElectricMeter
                  }}
                </p>
                <p>
                  มิเตอร์ไฟครั้งนี้:
                  {{
                    currentModalBillRoom.meterRecordItem.currentElectricMeter
                  }}
                </p>
                <p>
                  จำนวนหน่วย:
                  {{
                    currentModalBillRoom.meterRecordItem.totalElectricMeterUsage
                  }}
                  หน่วย
                </p>
                <p>
                  อัตราค่าไฟต่อหน่วย:
                  {{ residence.defaultElectricPriceRate }}
                  บาท
                </p>
                <p>
                  บิลค่าไฟ :
                  <b
                    >{{
                      residence.defaultElectricPriceRate *
                      currentModalBillRoom.meterRecordItem
                        .totalElectricMeterUsage
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
                  <b>{{
                    currentModalBillRoom.meterRecordItem.room.roomRentalPrice.toLocaleString()
                  }}</b>
                  บาท
                </p>
                <p class="text-lg font-bold mt-2">ค่าบริการอื่น ๆ</p>
                <span>
                  <p
                    v-for="(fee, index) in currentModalBillRoom.meterRecordItem
                      .room.fees"
                    :key="index"
                  >
                    {{ fee.feename }}:
                    <b>{{ fee.feeprice.toLocaleString() }}</b> บาท
                  </p>
                  <p
                    v-if="
                      !currentModalBillRoom.meterRecordItem.room.fees.length
                    "
                  >
                    ไม่มีค่าบริการอื่น ๆ
                  </p>
                </span>
              </div>
            </div>
            <Divider />
            <p class="text-lg font-bold mt-5 rounded-full">
              รวม:
              {{
                (
                  currentModalBillRoom.meterRecordItem.room.roomRentalPrice +
                  residence.defaultElectricPriceRate *
                    currentModalBillRoom.meterRecordItem
                      .totalElectricMeterUsage +
                  residence.defaultWaterPriceRate *
                    currentModalBillRoom.meterRecordItem.totalWaterMeterUsage +
                  currentModalBillRoom.meterRecordItem.room.fees.reduce(
                    (acc, curr) => acc + parseFloat(curr.feeprice),
                    0
                  )
                ).toLocaleString()
              }}
              บาท
            </p>
          </div>
        </div>
        <div class="modal-action flex">
          <form method="dialog">
            <button class="btn btn-sm mr-2" @click="resetEditingFee">
              ปิด
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>
