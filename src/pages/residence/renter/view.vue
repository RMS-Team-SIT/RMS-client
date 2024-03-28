<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import ResidenceServices from '@/services/ResidenceServices';
import FileService from '@/services/FileService';
import Loading from '@/components/common/loading.vue';
import { ChartPieIcon, HomeIcon, UserIcon } from '@heroicons/vue/24/outline';
import Button from '@/components/common/button.vue';
import RenterListTable from '@/components/renter/renter.list.table.vue';
import back from '@/components/common/back.vue';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const renterId = route.params.renterId;
const { notify } = useNotification();
const isLoading = ref(true);

const renter = ref(null);

const fetchRenter = async () => {
  const response = await ResidenceServices.fetchOneRenter(
    residenceId,
    renterId
  );
  if (response.status === 200) {
    renter.value = await response.json();
    console.log(renter.value);
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      title: 'ไม่สามารถดึงข้อมูลหอพักได้',
      type: 'error',
    });
    router.push({ name: 'manage' });
  }
};

onMounted(async () => {
  console.log('1');
  await fetchRenter();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div class="min-h-screen">
    <div class="py-10 px-10 md:px-20 w-full">
      <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการ', pathName: 'manage' },
          {
            name: `แดชบอร์ด`,
            pathName: 'dashboard',
            params: { residenceId },
          },
          {
            name: 'จัดการผู้เช่า',
            pathName: 'renter',
            params: { residenceId },
          },
          { name: 'ดูข้อมูลผู้เช่า' },
        ]"
      />

      <back :to="{ name: 'renter', params: { residenceId } }" />

      <div class="grid grid-cols-1">
        <div class="bg-white p-10 mt-2 shadow rounded-lg border">
          <div>
            <h1 class="text-2xl font-semibold text-dark-blue-200">
              ดูข้อมูลผู้เช่า
            </h1>

            <p class="mt-5">
              ชื่อผู้เช่า:
              {{
                renter
                  ? renter.firstname + ' ' + renter.lastname
                  : 'ไม่มีผู้เช่า'
              }}
            </p>
            <p>
              เบอร์โทร:
              {{ renter ? renter.phone : 'ไม่มีผู้เช่า' }}
            </p>
            <p>
              อีเมล:
              {{ renter ? renter.email : 'ไม่มีผู้เช่า' }}
            </p>
            <h1 class="text-base font-semibold mt-5 text-dark-blue-200">
              ข้อมูลบัญชีผู้เช่า
            </h1>
            <p>
              ชื่อผู้ใช้:
              {{ renter ? renter.username : 'ไม่มีผู้เช่า' }}
            </p>
            <p>
              รหัสผ่าน:
              <!-- {{ renter ? renter.password : 'ไม่มีผู้เช่า' }} -->
              ********
            </p>
            <h1 class="text-base font-semibold mt-5 text-dark-blue-200">
              ไฟล์เอกสาร
            </h1>
            <div class="flex gap-2">
              สำเนาบัตรประชาชน:
              <div v-if="renter?.copyOfIdCard" class="underline">
                <router-link
                  target="_blank"
                  class="flex items-center gap-2"
                  :to="{
                    name: 'pdf-preview',
                    query: {
                      filename: renter.copyOfIdCard,
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
              <div v-if="renter?.renterContract" class="underline">
                <router-link
                  target="_blank"
                  class="flex items-center gap-2"
                  :to="{
                    name: 'pdf-preview',
                    query: {
                      filename: renter.renterContract,
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
</template>

<style scoped></style>
