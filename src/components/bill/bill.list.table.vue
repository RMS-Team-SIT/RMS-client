<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import Divider from '../common/divider.vue';
import FileService from '@/services/FileService';
import BillService from '@/services/BillService';

const emits = defineEmits(['refetch']);
const props = defineProps({
  bills: {
    type: Array,
    default: () => [],
  },
  residenceId: {
    type: String,
    default: '',
  },
});

const swal = inject('$swal');
const currentPage = ref(1);
const perPage = ref(10);
const showDeactive = ref(false);
const { notify } = useNotification();
const search = ref('');
const selectedDateMeterRecord = ref('');
const selectedStatus = ref('');

const currentBillRooms = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  const currentBill = props.bills.filter((bill) =>
    selectedDateMeterRecord
      ? bill.meterRecord.record_date === selectedDateMeterRecord.value
      : true
  );
  const billRooms = currentBill[0]?.billRooms || [];
  const showed = billRooms
    .filter(
      (billRoom) =>
        (selectedStatus.value
          ? billRoom.status === selectedStatus.value
          : true) &&
        (search.value
          ? billRoom.room.name
              .toLowerCase()
              .includes(search.value.toLowerCase()) ||
            billRoom.billNo.toLowerCase().includes(search.value.toLowerCase())
          : true)
    )
    .slice(start, end);
  return showed;
});

const recordDates = computed(() => {
  return Array.from(
    new Set(props.bills.map((bill) => bill.meterRecord.record_date))
  );
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const totalPages = computed(() => {
  return Math.ceil(props.bills.length / perPage.value);
});

const visiblePages = computed(() => {
  const range = 3;

  let start = Math.max(1, currentPage.value - range);
  let end = Math.min(totalPages.value, currentPage.value + range);

  if (currentPage.value <= range) {
    end = Math.min(range * 2 + 1, totalPages.value);
  }

  if (currentPage.value >= totalPages.value - range) {
    start = Math.max(totalPages.value - range * 2, 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

watch(
  () => props.bills,
  (newVal) => {
    if (newVal.length) {
      selectedDateMeterRecord.value = recordDates.value[0];
    }
  }
);

const updateBillRoomStatus = async () => {
  try {
    const payloadData = {
      status: payload.status,
    };
    
    if(payload.status === 'UNPAID') {
      payloadData.paidEvidenceImage = null;
    }
   
    const response = await BillService.updateBillRoomStatus(
      props.residenceId,
      selectedBillRoomForModal.value.bill,
      selectedBillRoomForModal.value._id,
      payloadData
    );

    if (response.status === 200) {
      notify({
        group: 'tr',
        title: 'แก้ไขสถานะบิลสำเร็จ',
        type: 'success',
      });
    } else {
      const error = response.data.error;
      notify({
        group: 'tr',
        title: 'แก้ไขสถานะบิลไม่สำเร็จ',
        text: 'กรุณาลองใหม่อีกครั้ง, ' + error.message,
        type: 'error',
      });
    }
  } catch (error) {
    notify({
      title: 'แก้ไขสถานะบิลไม่สำเร็จ',
      type: 'error',
    });
  }
  emits('refetch');
  payload.status = null;
  selectedBillRoomForModal.value = null;
};

const selectedBillRoomForModal = ref(null);
const isEditing = ref(false);

const payload = reactive({
  paidEvidenceImage: null,
  status: null,
});
</script>

<template>
  <div class="overflow-x-auto">
    <p class="text-base mt-5" v-if="!props.bills.length">
      ไม่พบบิลในระบบ กรุณาสร้าง
    </p>
    <div v-else>
      <div class="w-full flex align-middle items-center justify-start mt-5">
        <label class="label">
          <span class="label-text">บิลของรอบมิเตอร์​:</span>
        </label>
        <select
          class="select select-bordered select-xs bg-white rounded"
          v-model="selectedDateMeterRecord"
        >
          <option
            v-for="(date, index) in recordDates"
            :key="index"
            :value="date"
          >
            {{ dayjs(date).format('DD/MM/YYYY') }}
          </option>
        </select>

        <label class="label ml-2">
          <span class="label-text">สถานะบิล:</span>
        </label>
        <select
          class="select select-bordered select-xs bg-white rounded"
          v-model="selectedStatus"
        >
          <option value="" selected>ทั้งหมด</option>
          <option value="PAID">ชำระแล้ว</option>
          <option value="UPLOADED">อัพโหลดหลักฐานแล้ว</option>
          <option value="UNPAID">ยังไม่ชำระ</option>
        </select>

        <div class="flex gap-2 items-center">
          <label class="label">
            <span class="label-text">ค้นหา:</span>
          </label>
          <input
            type="text"
            placeholder="ค้นหาห้อง/เลขที่บิล"
            class="input input-xs input-bordered bg-white rounded"
            v-model="search"
          />
        </div>
      </div>

      <p class="text-xs text-gray-500">
        มีบิลทั้งหมดทั้งหมด:
        {{ currentBillRooms.length }} รายการ (ชำระแล้ว:
        {{
          currentBillRooms.filter((billRoom) => billRoom.status === 'PAID')
            .length
        }}
        รายการ, อัพโหลดหลักฐานแล้ว:
        {{
          currentBillRooms.filter((billRoom) => billRoom.status === 'UPLOADED')
            .length
        }}, ยังไม่ชำระ:
        {{
          currentBillRooms.filter((billRoom) => billRoom.status === 'UNPAID')
            .length
        }}
        รายการ)
      </p>
      <div v-if="currentBillRooms.length" class="mt-2">
        <table class="table table-xs">
          <!-- head -->
          <thead>
            <tr>
              <th>#</th>
              <th>เลขที่บิล</th>
              <th>เลขที่ห้อง</th>
              <th>ค่าน้ำ</th>
              <th>ค่าไฟ</th>
              <th>ค่าเช่า</th>
              <th>ค่าอื่นๆ</th>
              <th>รวม</th>
              <th>สถานะ</th>
              <th>ดูข้อมูล</th>
              <th>แก้ไข</th>
            </tr>
          </thead>
          <tbody>
            <!-- row 1 -->
            <tr v-for="(billRoom, index) in currentBillRooms" :key="index">
              <td>
                {{ index + 1 }}
              </td>
              <td>
                {{ billRoom.billNo }}
              </td>
              <td>
                {{ billRoom.room.name }}
              </td>
              <td>{{ billRoom.waterTotalPrice.toLocaleString() }} บาท</td>
              <td>{{ billRoom.electricTotalPrice.toLocaleString() }} บาท</td>
              <td>{{ billRoom.roomRentalPrice.toLocaleString() }} บาท</td>
              <td>{{ billRoom.totalFeesPrice.toLocaleString() }} บาท</td>
              <td>{{ billRoom.totalPrice.toLocaleString() }} บาท</td>
              <td>
                <Badge v-if="billRoom.status === 'PAID'">จ่ายแล้ว</Badge>
                <Badge
                  v-else-if="billRoom.status === 'UPLOADED'"
                  badgeType="secondary"
                  >อัพโหลดหลักฐานแล้ว</Badge
                >
                <Badge v-else badgeType="error">ยังไม่ได้จ่าย</Badge>
              </td>
              <td>
                <Button
                  btnType="ghost-pill"
                  onclick="modal_1.showModal()"
                  @click="selectedBillRoomForModal = billRoom"
                  >ดูข้อมูล</Button
                >
              </td>
              <td
                v-if="
                  billRoom.status === 'UPLOADED' || billRoom.status === 'PAID'
                "
              >
                <Button
                  btnType="ghost-pill"
                  onclick="modal_2.showModal()"
                  @click="
                    selectedBillRoomForModal = billRoom;
                    isEditing = true;
                    payload.status = billRoom.status;
                  "
                  >แก้ไขสถานะ</Button
                >
              </td>
            </tr>
          </tbody>
        </table>

        <div class="join">
          <button
            class="join-item btn btn-xs"
            :class="{ disabled: currentPage === 1 }"
            @click="changePage(currentPage - 1)"
          >
            &laquo;
          </button>

          <button
            class="join-item btn btn-xs"
            v-for="page in visiblePages"
            :key="page"
            :class="{ 'btn-active': page === currentPage }"
            @click="changePage(page)"
          >
            {{ page }}
          </button>

          <button
            class="join-item btn btn-xs"
            :class="{ disabled: currentPage === totalPages }"
            @click="changePage(currentPage + 1)"
          >
            &raquo;
          </button>
        </div>

        <!-- Modal -->
        <dialog :id="`modal_1`" class="modal z-50">
          <div class="modal-box space-y-2 w-11/12 max-w-3xl border">
            <div v-if="selectedBillRoomForModal">
              <h3 class="font-bold text-lg items-center flex gap-2">
                ข้อมูลบิลห้อง
                {{ selectedBillRoomForModal.room.name }}
                รอบมิเตอร์วันที่
                {{ dayjs(selectedDateMeterRecord).format('DD/MM/YYYY') }}
                <Badge v-if="selectedBillRoomForModal.status === 'PAID'"
                  >จ่ายแล้ว</Badge
                >
                <Badge
                  v-else-if="selectedBillRoomForModal.status === 'UPLOADED'"
                  badgeType="secondary"
                  >อัพโหลดหลักฐานแล้ว</Badge
                >
                <Badge v-else badgeType="error">ยังไม่ได้จ่าย</Badge>
              </h3>
              <div class="mt-5">
                <div class="flex w-full">
                  <div class="w-full">
                    <p class="text-lg font-bold">ค่าน้ำ</p>
                    <p>
                      มิเตอร์น้ำครั้งก่อน:
                      {{ selectedBillRoomForModal.previousWaterMeter }}
                    </p>
                    <p>
                      มิเตอร์น้ำครั้งนี้:
                      {{ selectedBillRoomForModal.currentWaterMeter }}
                    </p>
                    <p>
                      จำนวนหน่วย:
                      {{ selectedBillRoomForModal.totalWaterMeterUsage }}
                      หน่วย
                    </p>
                    <p>
                      อัตราค่าน้ำต่อหน่วย:
                      {{ selectedBillRoomForModal.waterPriceRate }} บาท
                    </p>
                    <p>
                      บิลค่าน้ำ :
                      <b
                        >{{
                          selectedBillRoomForModal.waterTotalPrice.toLocaleString()
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
                        selectedBillRoomForModal.previousElectricMeter.toLocaleString()
                      }}
                    </p>
                    <p>
                      มิเตอร์ไฟครั้งนี้:
                      {{
                        selectedBillRoomForModal.currentElectricMeter.toLocaleString()
                      }}
                    </p>
                    <p>
                      จำนวนหน่วย:
                      {{
                        selectedBillRoomForModal.totalElectricMeterUsage.toLocaleString()
                      }}
                      หน่วย
                    </p>
                    <p>
                      อัตราค่าไฟต่อหน่วย:
                      {{
                        selectedBillRoomForModal.electricPriceRate.toLocaleString()
                      }}
                      บาท
                    </p>
                    <p>
                      บิลค่าไฟ :
                      <b
                        >{{
                          selectedBillRoomForModal.electricTotalPrice.toLocaleString()
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
                        selectedBillRoomForModal.roomRentalPrice.toLocaleString()
                      }}</b>
                      บาท
                    </p>
                    <p class="text-lg font-bold mt-2">ค่าบริการอื่น ๆ</p>

                    <span>
                      <p
                        v-for="(fee, index) in selectedBillRoomForModal.feesCache"
                        :key="index"
                      >
                        {{ fee.feename }}:
                        <b>{{ fee.feeprice.toLocaleString() }}</b> บาท
                      </p>
                      <p v-if="!selectedBillRoomForModal.feesCache.length">
                        ไม่มีค่าบริการอื่น ๆ
                      </p>
                    </span>
                  </div>
                </div>
                <p class="text-lg font-bold mt-5 rounded-full">
                  รวม:
                  {{ selectedBillRoomForModal.totalPrice.toLocaleString() }}
                  บาท
                </p>
                <Divider />

                <p class="text-lg font-bold">หลักฐานการชำระเงิน</p>
                <div v-if="selectedBillRoomForModal.paidEvidenceImage">
                  <img
                    :src="
                      FileService.getFile(
                        selectedBillRoomForModal.paidEvidenceImage
                      )
                    "
                    alt="หลักฐานการชำระเงิน"
                    class="w-1/2"
                  />
                  <p class="text-red-500">
                    * กรุณาตรวจสอบหลักฐานการชำระเงินให้ถี่ถ้วน
                  </p>
                </div>

                <p v-else>ยังไม่ได้อัพโหลดหลักฐานการชำระเงิน</p>
              </div>
            </div>
            <div class="modal-action flex">
              <form method="dialog">
                <button
                  class="btn btn-sm mr-2"
                  @click="selectedBillRoomForModal = null"
                >
                  ปิด
                </button>
              </form>
            </div>
          </div>
        </dialog>

        <dialog :id="`modal_2`" class="modal z-50">
          <div class="modal-box space-y-2 w-11/12 max-w-3xl border">
            <div v-if="selectedBillRoomForModal">
              <h3 class="font-bold text-lg items-center flex gap-2">
                ข้อมูลบิลห้อง
                {{ selectedBillRoomForModal.room.name }}
                รอบมิเตอร์วันที่
                {{ dayjs(selectedDateMeterRecord).format('DD/MM/YYYY') }}
                <Badge v-if="selectedBillRoomForModal.status === 'PAID'"
                  >จ่ายแล้ว</Badge
                >
                <Badge
                  v-else-if="selectedBillRoomForModal.status === 'UPLOADED'"
                  badgeType="secondary"
                  >อัพโหลดหลักฐานแล้ว</Badge
                >
                <Badge v-else badgeType="error">ยังไม่ได้จ่าย</Badge>
              </h3>
              <div class="mt-5">
                <p class="text-lg font-bold">หลักฐานการชำระเงิน</p>
                <div v-if="selectedBillRoomForModal.paidEvidenceImage">
                  <img
                    :src="
                      FileService.getFile(
                        selectedBillRoomForModal.paidEvidenceImage
                      )
                    "
                    alt="หลักฐานการชำระเงิน"
                    class="w-1/2"
                  />
                  <p class="text-red-500">
                    * กรุณาตรวจสอบหลักฐานการชำระเงินให้ถี่ถ้วน
                  </p>
                </div>

                <p v-else>ยังไม่ได้อัพโหลดหลักฐานการชำระเงิน</p>
                <!-- <Divider /> -->
                <p class="text-lg font-bold mt-5 rounded-full">
                  ที่ต้องชำระรวม:
                  {{ selectedBillRoomForModal.totalPrice.toLocaleString() }}
                  บาท
                </p>
                <Divider />
                <div class="flex gap-2 items-center">
                  <p class="text-lg font-bold">เปลี่ยนสถานะบิล:</p>

                  <select
                    class="select select-bordered bg-white rounded select-sm"
                    v-model="payload.status"
                  >
                    <option value="PAID">ชำระแล้ว</option>
                    <option value="UPLOADED">อัพโหลดหลักฐานแล้ว</option>
                    <option value="UNPAID">ยังไม่ชำระ</option>
                  </select>
                </div>
                <p class="text-sm text-gray-500">
                  * หากทำการตรวจสอบหลักฐานการชำระเงินแล้ว <b class="text-green-500">ถูกต้อง</b> 
                  ให้ทำการเปลี่ยนสถานะบิลเป็น <b class="text-green-500">ชำระแล้ว</b> แล้ว
                </p>
                <p class="text-sm text-gray-500">
                  * หากทำการตรวจสอบหลักฐานการชำระเงินแล้ว <b class="text-red-500">ไม่ถูกต้อง</b>
                  ให้ทำการเปลี่ยนสถานะบิลเป็น <b class="text-red-500">ยังไม่ชำระ</b> แล้ว
                </p>
              </div>
            </div>
            <div class="modal-action flex">
              <form method="dialog">
                <button
                  class="btn btn-sm mr-2"
                  @click="selectedBillRoomForModal = null"
                >
                  ปิด
                </button>
                <button
                  class="btn btn-sm btn-secondary"
                  @click="
                    updateBillRoomStatus();
                    selectedBillRoomForModal = null;
                  "
                >
                  บันทึกข้อมูล
                </button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
      <p v-else class="mt-5">ไม่พบข้อมูล</p>
    </div>
  </div>
</template>

<style scoped></style>
