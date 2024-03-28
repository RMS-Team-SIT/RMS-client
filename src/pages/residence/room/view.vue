<script setup>
import Badge from '@/components/common/badge.vue';
import Breadcrumb from '@/components/common/breadcrumb.vue';
import Button from '@/components/common/button.vue';
import Divider from '@/components/common/divider.vue';
import RoomInfoForm from '@/components/room/form/room.info.form.vue';
import RoomService from '@/services/RoomService';
import {
  ArrowTopRightOnSquareIcon,
  ShareIcon,
} from '@heroicons/vue/24/outline';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ImagePreview from '@/components/common/image.preview.vue';
import FileService from '@/services/FileService';
import back from '@/components/common/back.vue';
import ImageUploadForm from '@/components/form/image.form.vue';
import BillService from '@/services/BillService';
import Alert from '@/components/common/alert.vue';
import ModernAlert from '@/components/common/modern-alert.vue';

const router = useRouter();
const route = useRoute();
const room = ref(null);
const roomId = route.params.roomId;
const residenceId = route.params.residenceId;
const isLoading = ref(true);
const { notify } = useNotification();
const isRenter = ref(route.query.renter === 'true');

const fetchRoom = async () => {
  try {
    const response = await RoomService.fetchOneRoomInResidence(
      residenceId,
      route.params.roomId
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
    residenceId,
    roomId,
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

onMounted(() => {
  fetchRoom();
  resetPayload();
  isLoading.value = false;
});

const removePaidEvidence = async (billRoomId) => {
  const response = await BillService.updateBillRoomPaidEvidence(
    residenceId,
    roomId,
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
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div v-if="room" class="min-h-screen">
    <div class="py-10 px-10 md:px-20 w-full">
      <Breadcrumb
        v-if="!isRenter"
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการ', pathName: 'manage' },
          {
            name: `แดชบอร์ด`,
            pathName: 'dashboard',
            params: { residenceId },
          },
          { name: 'จัดการห้องพัก', pathName: 'room', params: { residenceId } },
          { name: 'ดูข้อมูลห้องพัก' },
        ]"
      />
      <back v-if="!isRenter" :to="{ name: 'room', params: { residenceId } }" />

      <div
        v-if="
          isRenter && room.billRooms.filter((b) => b.status === 'UNPAID').length
        "
      >
        <Alert>
          มีบิลค้างชำระจำนวน
          {{ room.billRooms.filter((b) => b.status === 'UNPAID').length }}
          รายการ กรุณาจ่ายบิลให้เสร็จโดยเร็วที่สุด
        </Alert>
      </div>
      <ModernAlert
        v-else-if="isRenter"
        class="mt-2"
        title="คำแนะนำ"
        text="หากมีปัญหาหรือข้อสงสัยใด ๆ กรุณาติดต่อผู้ดูแลห้องพัก"
        type="info"
      />

      <div class="bg-white mt-5 rounded-lg border p-5">
        <!-- Head -->
        <div class="flex justify-between">
          <h1
            class="text-2xl font-semibold text-dark-blue-200 flex items-center gap-2"
          >
            <p>ห้องพัก: {{ room.name }}</p>
            <div v-if="!isRenter">
              <Badge
                badgeType="success"
                size="lg"
                v-if="room.status === 'AVAILABLE'"
                >ว่าง</Badge
              >
              <Badge badgeType="error" size="lg" v-else>ไม่ว่าง</Badge>
            </div>
          </h1>
        </div>
        <!-- Body -->
        <div class="mt-5 grid grid-cols-2 gap-10">
          <!-- ข้อมูลห้องพัก -->
          <div class="space-y-3 rounded-lg">
            <div class="flex justify-between">
              <h1 class="text-lg font-semibold text-dark-blue-200">
                ข้อมูลห้องพัก
              </h1>
            </div>
            <p>ชื่อห้อง: {{ room.name }}</p>
            <p>คำอธิบาย: {{ room.description || 'ไม่มีคำอธิบาย' }}</p>
            <p>ชั้น: {{ room.floor }}</p>
            <p>
              อัตราค่าเช่าต่อเดือน:
              {{ room.roomRentalPrice.toLocaleString() }} บาท
            </p>
            <p v-if="!isRenter">
              สถานะ:
              <Badge badgeType="success" v-if="room.status === 'AVAILABLE'"
                >ว่าง</Badge
              >
              <Badge badgeType="error" v-else>ไม่ว่าง</Badge>
            </p>
            <p>
              ค่าน้ำ:
              {{ room.residence.defaultWaterPriceRate.toLocaleString() }}
              บาท/หน่วย
            </p>
            <p>
              ค่าไฟ:
              {{ room.residence.defaultElectricPriceRate.toLocaleString() }}
              บาท/หน่วย
            </p>

            <p>ค่าบริการอื่น ๆ :</p>
            <li v-for="fee in room.fees" :key="fee._id">
              {{ fee.feename }}: {{ fee.feeprice.toLocaleString() }} บาท
            </li>
          </div>

          <!-- ข้อมูลประเภทห้อง -->
          <div class="space-y-3 rounded-lg bg-white border p-5">
            <div class="flex justify-between">
              <h1 class="text-lg font-semibold text-dark-blue-200">
                ประเภทห้องพัก
              </h1>
            </div>
            <p>ประเภทห้อง: {{ room.type.name }}</p>
            <p>รูปแบบห้อง: {{ room.type.category }}</p>
            <p>ขนาดห้อง: {{ room.type.size }} ตร.ม.</p>
            <p>คำอธิบาย: {{ room.type.description || 'ไม่มีคำอธิบาย' }}</p>
            <!-- <p>
              อัตราค่าเช่าต่อเดือน: {{ room.type.price.toLocaleString() }} บาท
            </p> -->
            <ImagePreview
              :imageUrls="room.type.images.map((i) => FileService.getFile(i))"
              preview-from="url"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <!-- ข้อมูลผู้เช่า -->
        <div class="space-y-3 rounded-lg bg-white mt-5 border p-5">
          <div class="flex justify-between">
            <h1 class="text-lg font-semibold text-dark-blue-200">
              ข้อมูลผู้เช่าในปัจจุบัน
            </h1>
            <router-link
              target="_blank"
              v-if="room.currentRenter && !isRenter"
              class="text-dark-blue-200 underline"
              :to="{
                name: 'view-renter',
                params: {
                  residenceId: $route.params.residenceId,
                  renterId: room.currentRenter._id,
                },
              }"
            >
              <ArrowTopRightOnSquareIcon class="h-6 w-6" />
            </router-link>
          </div>
          <div v-if="!room.currentRenter">ไม่มีผู้เช่าห้องในขณะนี้</div>
          <div v-else>
            <p>
              ชื่อผู้เช่า:
              {{
                room.currentRenter
                  ? room.currentRenter.firstname +
                    ' ' +
                    room.currentRenter.lastname
                  : 'ไม่มีผู้เช่า'
              }}
            </p>
            <p>
              อีเมล:
              {{
                room.currentRenter ? room.currentRenter.email : 'ไม่มีผู้เช่า'
              }}
            </p>
            <p>
              เบอร์โทร:
              {{
                room.currentRenter ? room.currentRenter.phone : 'ไม่มีผู้เช่า'
              }}
            </p>
            <h1 class="text-base font-semibold mt-5 text-dark-blue-200">
              ข้อมูลบัญชีผู้เช่า
            </h1>
            <p>
              ชื่อผู้ใช้:
              {{
                room.currentRenter
                  ? room.currentRenter.username
                  : 'ไม่มีผู้เช่า'
              }}
            </p>
            <p>รหัสผ่าน: ******</p>

            <div v-if="!isRenter">
              <h1 class="text-base font-semibold mt-5 text-dark-blue-200">
                ไฟล์เอกสาร
              </h1>
              <div class="flex gap-2">
                สำเนาบัตรประชาชน:
                <div v-if="room.currentRenter?.copyOfIdCard" class="underline">
                  <router-link
                    target="_blank"
                    class="flex items-center gap-2"
                    :to="{
                      name: 'pdf-preview',
                      query: {
                        filename: room.currentRenter.copyOfIdCard,
                      },
                    }"
                  >
                    ดูไฟล์
                    <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                  </router-link>
                </div>
                <div v-else>
                  <span class="text-red-500">ไม่มีไฟล์ในระบบ</span>
                </div>
              </div>
              <div class="flex gap-2">
                สัญญาเช่า:
                <div
                  v-if="room.currentRenter?.renterContract"
                  class="underline"
                >
                  <router-link
                    target="_blank"
                    class="flex items-center gap-2"
                    :to="{
                      name: 'pdf-preview',
                      query: {
                        filename: room.currentRenter.renterContract,
                      },
                    }"
                  >
                    ดูไฟล์
                    <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                  </router-link>
                </div>
                <div v-else>
                  <span class="text-red-500">ไม่มีไฟล์ในระบบ</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!isRenter">
            <Divider></Divider>
            <div class="flex justify-between">
              <h1 class="text-lg font-semibold text-dark-blue-200">
                ข้อมูลผู้เช่าในอดีต
              </h1>
            </div>
            <div v-if="!room.renterHistory.length">
              ไม่มีผู้เช่าในอดีตในระบบ
            </div>
            <div
              class="collapse collapse-arrow shadow-sm border mt-5"
              v-for="(renter, index) in room.renterHistory.toReversed()"
              :key="index"
            >
              <input type="checkbox" />
              <div
                class="collapse-title text-lg font-bold gap-2 flex items-center"
              >
                {{ renter.firstname }} {{ renter.lastname }}
              </div>
              <div class="collapse-content">
                <p>
                  ชื่อผู้เช่า:
                  {{ renter.firstname }} {{ renter.lastname }}
                </p>
                <p>เบอร์โทร: {{ renter.phone }}</p>
                <router-link
                  class="underline text-dark-blue-200 font-bold cursor-pointer"
                  target="_blank"
                  :to="{
                    name: 'view-renter',
                    params: {
                      residenceId: $route.params.residenceId,
                      renterId: renter._id,
                    },
                  }"
                >
                  <p>ดูข้อมูลเพิ่มเติม</p>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- ข้อมูลบิล -->
        <div class="space-y-3 rounded-lg bg-white mt-5 border p-5">
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
            <div
              class="collapse-title text-lg font-bold gap-2 flex items-center"
            >
              บิลรอบมิเตอร์
              {{ dayjs(billRoom.meterRecord.record_date).format('MM/YYYY') }}
              <Badge badgeType="success" v-if="index == 0" size="md"
                >บิลล่าสุด</Badge
              >
              <Badge v-if="billRoom.status === 'PAID'" size="md"
                >จ่ายแล้ว</Badge
              >
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
                          billRoom.waterPriceRate *
                          billRoom.totalWaterMeterUsage
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
                <Badge v-if="billRoom.status === 'PAID'" size="md"
                  >จ่ายแล้ว</Badge
                >
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
                  class="w-1/2"
                />
                <Button
                  @click="removePaidEvidence(billRoom._id)"
                  v-if="isRenter && billRoom.status === 'UPLOADED'"
                  class="btn-xs mt-2"
                  btnType="secondary"
                  >ลบหลักฐานการชำระเงิน</Button
                >
                <p>* หากต้องการเปลี่ยนรูปหลักฐานการชำระเงิน กรุณาลบหลักฐานการชำระเงินแล้วอัพโหลดใหม่</p>
              </div>
              <div v-else>
                <p>
                  ยังไม่ได้อัพโหลดหลักฐานการชำระเงิน กรุณาอัพโหลดหลักฐานด้านล่าง
                </p>
                <div
                  class="mt-5"
                  v-if="isRenter && billRoom.status === 'UNPAID'"
                >
                  <p class="text-lg font-bold">อัพโหลดหลักฐานการชำระเงิน</p>
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
                <router-link
                  target="_blank"
                  class="text-dark-blue-200 underline"
                  :to="{
                    name: 'view-renter',
                    params: {
                      residenceId: $route.params.residenceId,
                      renterId: billRoom.renter._id,
                    },
                  }"
                >
                  {{
                    billRoom.renter
                      ? billRoom.renter.firstname +
                        ' ' +
                        billRoom.renter.lastname
                      : 'ไม่มีผู้เช่า'
                  }}
                </router-link>
              </p>
              <p v-else>ไม่มีผู้เช่า</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
