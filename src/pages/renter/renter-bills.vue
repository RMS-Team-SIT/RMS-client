div
<script setup>
import Badge from '@/components/common/badge.vue';
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import Divider from '@/components/common/divider.vue';
import RoomInfoForm from '@/components/room/form/room.info.form.vue';
import RoomService from '@/services/RoomService';
import CountUp from 'vue-countup-v3';
import {
  ArrowTopRightOnSquareIcon,
  ChartPieIcon,
  ShareIcon,
} from '@heroicons/vue/24/outline';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ImagePreview from '@/components/common/image.preview.vue';
import ImageUploadForm from '@/components/form/image.form.vue';
import FileService from '@/services/FileService';
import back from '@/components/common/back.vue';
import IncomeChart from '@/components/residence/charts/income.vue';
import { useUserStore } from '@/stores/user.store';
import Loading from '@/components/common/loading.vue';
import BillService from '@/services/BillService';

const router = useRouter();
const userStore = useUserStore();

const room = ref(null);
const route = useRoute();
const isLoading = ref(true);
const { notify } = useNotification();
const residenceId = ref('');
const roomId = ref('');

const fetchRoom = async () => {
  try {
    const response = await RoomService.fetchOneRoomInResidence(
      residenceId.value,
      roomId.value
    );
    if (response.status === 200) {
      let result = await response.json();
      room.value = result;
      console.log('room,', result);
    } else {
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        title: 'ไม่สามารถดึงข้อมูลห้องพักได้',
        type: 'error',
      });
      router.push({ name: 'room', params: { residenceId: residenceId } });
    }
  } catch (error) {
    console.error(error);
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลห้องพักได้',
      type: 'error',
    });
    router.push({ name: 'room', params: { residenceId: residenceId } });
  } finally {
    isLoading.value = false;
  }
};
const payload = reactive({
  paidEvidenceImage: [],
  status: 'UPLOADED',
  imageFiles: [],
});

const resetPayload = () => {
  payload.paidEvidenceImage = [];
  payload.status = 'UPLOADED';
  payload.imageFiles = [];
};

const getChildData = (data) => {
  for (const key in data) {
    payload[key] = data[key];
  }
};

const uploadPaidEvidence = async (billRoomId) => {
  if (payload.imageFiles.length) {
    const response = await FileService.uploadImages(payload.imageFiles);
    if (response.status == 201) {
      const data = await response.json();
      Array.from(data.files).forEach((file) => {
        payload.paidEvidenceImage.push(file.fileName);
      });
    } else {
      const data = await response.json();
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามาถอัปโหลดรูปภาพได้' + data?.message,
        type: 'error',
      });
      return;
    }
  }

  const response = await BillService.updateBillRoomPaidEvidence(
    residenceId.value,
    roomId.value,
    billRoomId,
    { paidEvidenceImage: payload.paidEvidenceImage[0] }
  );
  if (response.status == 200) {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'อัพโหลดหลักฐานการชำระเงินสำเร็จ',
      type: 'success',
    });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามาถอัพโหลดรูปภาพได้' + data?.message,
      type: 'error',
    });
    return;
  }
  fetchRoom();
  resetPayload();
};
const removePaidEvidence = async (billRoomId) => {
  const response = await BillService.updateBillRoomPaidEvidence(
    residenceId.value,
    roomId.value,
    billRoomId,
    { paidEvidenceImage: null }
  );
  if (response.status == 200) {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'ลบหลักฐานการชำระเงินสำเร็จ',
      type: 'success',
    });
  } else {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามาถลบหลักฐานการชำระเงินได้' + data?.message,
      type: 'error',
    });
    return;
  }
  fetchRoom();
  resetPayload();
};

onMounted(async () => {
  userStore.fetchUserData();
  const renter = userStore.getUser;
  console.log('renter', renter);
  // Set residenceId
  residenceId.value = renter.residence._id;
  roomId.value = renter.room._id;
  await fetchRoom();
  resetPayload();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div v-else class="py-10 px-10 md:px-5 w-full min-h-screen">
    <Breadcrumb
      :pathList="[
        { name: 'หน้าแรก', pathName: 'home' },
        { name: 'ข้อมูลบิลทั้งหมด', pathName: 'renter-bills' },
      ]"
    />

    <!-- ข้อมูลบิล -->
    <div class="space-y-3 rounded-lg bg-white mt-5">
      <div class="flex justify-between">
        <h1 class="text-lg font-semibold text-dark-blue-200">
          ข้อมูลบิลทั้งหมด
        </h1>
      </div>
      <div v-if="!room.billRooms.length">ไม่มีบิลในอดีตในระบบ</div>
      <div
        class="collapse collapse-arrow shadow-sm border"
        v-for="(billRoom, index) in room.billRooms.toReversed()"
        :key="index"
      >
        <input type="checkbox" :checked="index == 0" />
        <div class="collapse-title text-lg font-bold gap-2 flex items-center">
          บิลรอบมิเตอร์
          {{ dayjs(billRoom.meterRecord.record_date).format('MM/YYYY') }}
          <Badge badgeType="success" v-if="index == 0" size="md"
            >บิลล่าสุด</Badge
          >
          <Badge v-if="billRoom.status === 'PAID'" size="md">จ่ายแล้ว</Badge>
          <Badge
            v-else-if="billRoom.status === 'UPLOADED'"
            badgeType="secondary"
            size="md"
            >อัพโหลดหลักฐานแล้ว</Badge
          >
          <Badge v-else badgeType="error" size="md">ยังไม่ได้จ่าย</Badge>
        </div>
        <div class="collapse-content">
          <div class="flex w-full">
            <div class="w-full">
              <p class="text-lg font-bold">ค่าน้ำ</p>
              <p>
                มิเตอร์น้ำครั้งก่อน:
                {{ billRoom.previousWaterMeter }}
              </p>
              <p>
                มิเตอร์น้ำครั้งนี้:
                {{ billRoom.currentWaterMeter }}
              </p>
              <p>
                จำนวนหน่วย:
                {{ billRoom.totalWaterMeterUsage }} หน่วย
              </p>
              <p>
                อัตราค่าน้ำต่อหน่วย:
                {{ billRoom.waterPriceRate.toLocaleString() }} บาท
              </p>
              <p>
                บิลค่าน้ำ :
                <b
                  >{{
                    (
                      billRoom.waterPriceRate * billRoom.totalWaterMeterUsage
                    ).toLocaleString()
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
                {{ billRoom.previousElectricMeter }}
              </p>
              <p>
                มิเตอร์ไฟครั้งนี้:
                {{ billRoom.currentElectricMeter }}
              </p>
              <p>
                จำนวนหน่วย:
                {{ billRoom.totalElectricMeterUsage }}
              </p>
              <p>
                อัตราค่าไฟต่อหน่วย:
                {{ billRoom.electricPriceRate.toLocaleString() }}
              </p>
              <p>
                บิลค่าไฟ :
                <b
                  >{{
                    (
                      billRoom.electricPriceRate *
                      billRoom.totalElectricMeterUsage
                    ).toLocaleString()
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
                <b>{{ billRoom.roomRentalPrice.toLocaleString() }}</b> บาท
              </p>
              <p class="text-lg font-bold mt-2">ค่าบริการอื่น ๆ</p>
              <span>
                <p v-for="(fee, index) in billRoom.fees" :key="index">
                  {{ fee.feename }}:
                  <b>{{ fee.feeprice.toLocaleString() }}</b> บาท
                </p>
                <p v-if="!billRoom.fees.length">ไม่มีค่าบริการอื่น ๆ</p>
              </span>
            </div>
          </div>
          <p class="text-lg font-bold mt-5 rounded-full">
            รวม:
            {{ billRoom.totalPrice.toLocaleString() }}
            บาท
          </p>
          <p>
            สถานะ :
            <Badge v-if="billRoom.status === 'PAID'" size="md">จ่ายแล้ว</Badge>
            <Badge
              v-else-if="billRoom.status === 'UPLOADED'"
              badgeType="secondary"
              size="md"
              >อัพโหลดหลักฐานแล้ว</Badge
            >
            <Badge v-else badgeType="error" size="md">ยังไม่ได้จ่าย</Badge>
          </p>
          <p>
            {{
              billRoom.status !== 'PAID'
                ? 'พิมพ์ใบแจ้งหนี้'
                : 'พิมพ์ใบเสร็จรับเงิน'
            }}:
            <router-link
              class="text-dark-blue-200 underline font-bold cursor-pointer"
              :to="{
                name: 'print-bill-room',
                params: {
                  billId: billRoom.bill,
                  billRoomId: billRoom._id,
                  residenceId,
                },
              }"
              target="_blank"
            >
              กดที่นี่
            </router-link>
          </p>

          <Divider />
          <p class="text-lg font-bold">หลักฐานการชำระเงิน</p>
          <div v-if="billRoom.paidEvidenceImage">
            <img
              :src="FileService.getFile(billRoom.paidEvidenceImage)"
              alt="หลักฐานการชำระเงิน"
              class="max-w-80 max-h-80"
            />
            <Button
              @click="removePaidEvidence(billRoom._id)"
              v-if="billRoom.status === 'UPLOADED'"
              class="btn-xs mt-2"
              btnType="secondary"
              >ลบหลักฐานการชำระเงิน</Button
            >
            <p v-if="billRoom.status === 'UPLOADED'">
              * หากต้องการเปลี่ยนรูปหลักฐานการชำระเงิน
              กรุณาลบหลักฐานการชำระเงินแล้วอัพโหลดใหม่
            </p>
          </div>
          <div v-else>
            <p>ยังไม่ได้อัพโหลดหลักฐานการชำระเงิน</p>
            <div class="mt-5" v-if="billRoom.status === 'UNPAID'">
              <p class="font-bold">อัพโหลดหลักฐานการชำระเงิน</p>
              <div class="relative bg-white space-y-4 rounded basis-full">
                <ImageUploadForm
                  @getImageFiles="getChildData"
                  :imageFiles="payload.imageFiles"
                  :max-files="1"
                />
                <Button
                  @click="uploadPaidEvidence(billRoom._id)"
                  :disabled="!payload.imageFiles.length"
                  class="btn-xs"
                  btnType="success"
                  >บันทึกข้อมูล</Button
                >
              </div>
            </div>
          </div>
          <Divider />
          <p class="text-lg font-bold">ผู้เช่าที่เรียกเก็บ</p>
          <p v-if="billRoom.renter">
            ชื่อผู้เช่า:

            {{
              billRoom.renter
                ? billRoom.renter.firstname + ' ' + billRoom.renter.lastname
                : 'ไม่มีผู้เช่า'
            }}
          </p>
          <p v-else>ไม่มีผู้เช่า</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
