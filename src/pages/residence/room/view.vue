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
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ImagePreview from '@/components/common/image.preview.vue';
import FileService from '@/services/FileService';
import back from '@/components/common/back.vue';

const router = useRouter();
const route = useRoute();
const room = ref(null);
const roomId = route.params.roomId;
const residenceId = route.params.residenceId;
const isLoading = ref(true);
const { notify } = useNotification();

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

onMounted(() => {
  fetchRoom();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div v-if="room" class="min-h-screen">
    <div class="py-10 px-10 md:px-40">
      <Breadcrumb
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
      <back :to="{ name: 'room', params: { residenceId } }" />

      <div class="bg-white mt-5 rounded-lg border p-5">
        <!-- Head -->
        <div class="flex justify-between">
          <h1
            class="text-2xl font-semibold text-dark-blue-200 flex items-center"
          >
            ห้องพัก: {{ room.name }}
            <Badge
              badgeType="success"
              size="lg"
              v-if="room.status === 'AVAILABLE'"
              >ว่าง</Badge
            >
            <Badge badgeType="error" size="lg" v-else>ไม่ว่าง</Badge>
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
            <p>
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
            <ul>
              <li v-for="fee in room.fees" :key="fee._id">
                {{ fee.feename }}: {{ fee.feeprice.toLocaleString() }} บาท
              </li>
            </ul>
          </div>

          <!-- ข้อมูลผู้เช่า -->
          <div class="space-y-3 rounded-lg">
            <div class="flex justify-between">
              <h1 class="text-lg font-semibold text-dark-blue-200">
                ข้อมูลผู้เช่า
              </h1>
              <router-link
                target="_blank"
                v-if="room.currentRenter"
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
        </div>
      </div>

      <!-- ข้อมูลประเภทห้อง -->
      <div class="space-y-3 rounded-lg bg-white mt-5 border p-5">
        <div class="flex justify-between">
          <h1 class="text-lg font-semibold text-dark-blue-200">
            ประเภทห้องพัก
          </h1>
        </div>
        <p>ประเภทห้อง: {{ room.type.name }}</p>
        <p>รูปแบบห้อง: {{ room.type.category }}</p>
        <p>ขนาดห้อง: {{ room.type.size }} ตร.ม.</p>
        <p>คำอธิบาย: {{ room.type.description || 'ไม่มีคำอธิบาย' }}</p>
        <p>อัตราค่าเช่าต่อเดือน: {{ room.type.price.toLocaleString() }} บาท</p>
        <ImagePreview
          :imageUrls="room.type.images.map((i) => FileService.getFile(i))"
          preview-from="url"
        />
      </div>

      <!-- ข้อมูลบิล -->
      <div class="space-y-3 rounded-lg bg-white mt-5 border p-5">
        <div class="flex justify-between">
          <h1 class="text-lg font-semibold text-dark-blue-200">
            ข้อมูลบิลในอดีตทั้งหมด
          </h1>
        </div>
        <div v-if="!room.billRooms.length">ไม่มีบิลในอดีตในระบบ</div>
        <div
          class="collapse collapse-arrow shadow-sm border"
          v-for="(bill, index) in room.billRooms"
          :key="index"
        >
          <input
            type="checkbox"
            :checked="index == room.billRooms.length - 1"
          />
          <div class="collapse-title text-lg font-bold underline gap-2">
            บิลรอบมิเตอร์
            {{ dayjs(bill.meterRecord.record_date).format('MM/YYYY') }}
            <Badge
              badgeType="success"
              v-if="index == room.billRooms.length - 1"
              size="md"
              >บิลล่าสุด</Badge
            >
            <Badge v-if="bill.isPaid" size="md">จ่ายแล้ว</Badge>
            <Badge v-else badgeType="error" size="md">ยังไม่ได้จ่าย</Badge>
          </div>
          <div class="collapse-content">
            <div class="flex w-full">
              <div class="w-full">
                <p class="text-lg font-bold">ค่าน้ำ</p>
                <p>
                  มิเตอร์น้ำครั้งก่อน:
                  {{ bill.previousWaterMeter }}
                </p>
                <p>
                  มิเตอร์น้ำครั้งนี้:
                  {{ bill.currentWaterMeter }}
                </p>
                <p>
                  จำนวนหน่วย:
                  {{ bill.totalWaterMeterUsage }} หน่วย
                </p>
                <p>
                  อัตราค่าน้ำต่อหน่วย:
                  {{ bill.waterPriceRate.toLocaleString() }} บาท
                </p>
                <p>
                  บิลค่าน้ำ :
                  <b
                    >{{
                      (
                        bill.waterPriceRate * bill.totalWaterMeterUsage
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
                  {{ bill.previousElectricMeter }}
                </p>
                <p>
                  มิเตอร์ไฟครั้งนี้:
                  {{ bill.currentElectricMeter }}
                </p>
                <p>
                  จำนวนหน่วย:
                  {{ bill.totalElectricMeterUsage }}
                </p>
                <p>
                  อัตราค่าไฟต่อหน่วย:
                  {{ bill.electricPriceRate.toLocaleString() }}
                </p>
                <p>
                  บิลค่าไฟ :
                  <b
                    >{{
                      (
                        bill.electricPriceRate * bill.totalElectricMeterUsage
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
                  <b>{{ bill.roomRentalPrice.toLocaleString() }}</b> บาท
                </p>
                <p class="text-lg font-bold mt-2">ค่าบริการอื่น ๆ</p>
                {{ bill.room }}
                <!-- <span>
                  <p
                    v-for="(fee, index) in bill.room.fees"
                    :key="index"
                  >
                    {{ fee.feename }}:
                    <b>{{ fee.feeprice.toLocaleString() }}</b> บาท
                  </p>
                  <p v-if="!bill.room.fees.length">
                    ไม่มีค่าบริการอื่น ๆ
                  </p>
                </span> -->
              </div>
            </div>
            <Divider />
            <p class="text-lg font-bold mt-5 rounded-full">
              รวม:
              {{ bill.totalPrice.toLocaleString() }}
              บาท
            </p>
            <p>
              สถานะการจ่าย :
              <Badge v-if="bill.isPaid" size="md">จ่ายแล้ว</Badge>
              <Badge v-else badgeType="error" size="md">ยังไม่ได้จ่าย</Badge>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
