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
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const room = ref(null);
const roomId = route.params.roomId;
const residenceId = route.params.residenceId;
const isLoading = ref(true);

const fetchRoom = async () => {
  try {
    const response = await RoomService.fetchOneRoomInResidence(
      residenceId,
      route.params.roomId
    );
    if (response.status === 200) {
      let result = await response.json();
      room.value = result;
      console.log(result);
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
  <div v-if="room" class="bg-gray-50 min-h-screen">
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
      <Button
        btnType="primary"
        class="mt-5"
        @click="router.push({ name: 'room', params: { residenceId } })"
      >
        กลับหน้าจัดการห้องพัก
      </Button>
      <div class="grid grid-cols-1">
        <div class="bg-white p-10 mt-2 shadow rounded-lg">
          <!-- Head -->
          <div class="flex justify-between">
            <h1 class="text-2xl font-semibold text-dark-blue-200">
              ห้องพัก: {{ room.name }}
            </h1>
            <Button
              btnType="primary"
              @click="
                router.push({
                  name: 'update-room',
                  params: { residenceId, roomId: room.id },
                })
              "
            >
              แก้ไขข้อมูล
            </Button>
          </div>
          <!-- Body -->
          <div class="mt-5 grid grid-cols-2 gap-4">
            <div class="space-y-3 border border-base-300 rounded-lg m-2 p-5">
              <div class="flex justify-between">
                <h1 class="text-base font-semibold text-dark-blue-200">
                  ข้อมูลห้องพัก
                </h1>
                <router-link
                  v-if="room.currentRenter"
                  class="text-dark-blue-200 underline"
                  :to="{
                    name: 'update-room',
                    params: {
                      residenceId: $route.params.residenceId,
                      roomId,
                    },
                  }"
                >
                  <ArrowTopRightOnSquareIcon class="h-6 w-6" />
                </router-link>
              </div>
              <p>ชื่อห้อง: {{ room.name }}</p>
              <p>คำอธิบาย: {{ room.description || 'ไม่มีคำอธิบาย' }}</p>
              <p>ชั้น: {{ room.floor }}</p>
              <p>อัตราค่าเช่า: {{ room.roomRentalPrice }}</p>
              <p>
                สถานะ:
                <Badge badgeType="success" v-if="!room.currentRenter"
                  >ว่าง</Badge
                >
                <Badge badgeType="error" v-else>ไม่ว่าง</Badge>
              </p>
              <p>
                ค่าน้ำ: {{ room.waterPriceRate }} บาท/หน่วย
                <Badge badgeType="ghost" v-if="room.isUseDefaultWaterPriceRate"
                  >ค่าเริ่มต้น</Badge
                >
                <Badge badgeType="primary" v-else>กำหนดเอง</Badge>
              </p>
              <p>
                ค่าไฟ: {{ room.lightPriceRate }} บาท/หน่วย
                <Badge badgeType="ghost" v-if="room.isUseDefaultLightPriceRate"
                  >ค่าเริ่มต้น</Badge
                >
                <Badge badgeType="primary" v-else>กำหนดเอง</Badge>
              </p>

              <p>
                วันที่สร้าง: {{ dayjs(room.created_at).format('DD/MM/YYYY') }}
              </p>
              <p>
                แก้ไขล่าสุด: {{ dayjs(room.updated_at).format('DD/MM/YYYY') }}
              </p>
            </div>
            <div class="space-y-3 border border-base-300 rounded-lg m-2 p-5">
              <div class="flex justify-between">
                <h1 class="text-base font-semibold text-dark-blue-200">
                  ข้อมูลผู้เช่า
                </h1>
                <router-link
                  v-if="room.currentRenter"
                  class="text-dark-blue-200 underline"
                  :to="{
                    name: 'update-renter',
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
                  เบอร์โทร:
                  {{
                    room.currentRenter
                      ? room.currentRenter.phone
                      : 'ไม่มีผู้เช่า'
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
                <p>
                  รหัสผ่าน:
                  {{
                    room.currentRenter
                      ? room.currentRenter.password
                      : 'ไม่มีผู้เช่า'
                  }}
                </p>
                <h1 class="text-base font-semibold mt-5 text-dark-blue-200">
                  ไฟล์เอกสาร
                </h1>
                <div class="flex gap-2">
                  สำเนาบัตรประชาชน:
                  <div
                    v-if="room.currentRenter.renterContract"
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
                <div class="flex gap-2">
                  สัญญาเช่า:
                  <div
                    v-if="room.currentRenter.renterContract"
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
      </div>
    </div>
  </div>
</template>

<style scoped></style>
