<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNotification } from '@kyvg/vue3-notification';
import Loading from '@/components/common/loading.vue';
import {
  BanknotesIcon,
  ChartPieIcon,
  CreditCardIcon,
  HomeIcon,
  LinkIcon,
  UserIcon,
  AdjustmentsHorizontalIcon,
  CheckIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/outline';
import QuickLinkCard from '@/components/common/quick-link-card.vue';
import Stats from '@/components/common/stats.vue';
import UserServices from '@/services/UserServices';
import ResidenceServices from '@/services/ResidenceServices';
import BlankprofileImg from '@/assets/img/bp.webp';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const userStats = reactive({
  totalPendingUsers: {
    title: 'จำนวนผู้ใช้งานที่ขอการอนุมัติ',
    val: 0,
    desc: 'จำนวนผู้ใช้งานที่รอการอนุมัติ',
    icon: ClockIcon,
    route: 'admin-manage-residence',
  },
  totalUsers: {
    title: 'จำนวนผู้ใช้งานทั้งหมด',
    val: 0,
    desc: 'จำนวนผู้ใช้งานทั้งหมดที่ผ่านการยืนยันตัวตนแล้ว',
    icon: UserIcon,
    route: 'admin-manage-user',
  },
  totalAdmins: {
    title: 'จำนวนผู้ดูแลระบบทั้งหมด',
    val: 0,
    desc: 'จำนวนผู้ดูแลระบบทั้งหมด',
    icon: UserIcon,
    route: 'admin-manage-user',
  },
});
const residenceStats = reactive({
  totalPendingResidences: {
    title: 'จำนวนหอพักที่รอการอนุมัติ',
    val: 0,
    desc: 'จำนวนหอพักที่รอการอนุมัติ',
    icon: ClockIcon,
    route: 'admin-manage-user',
  },
  totalApprovedResidences: {
    title: 'จำนวนหอพักที่ผ่านการอนุมัติ',
    val: 0,
    desc: 'จำนวนหอพักที่ผ่านการอนุมัติทั้งหมด',
    icon: HomeIcon,
    route: 'admin-manage-residence',
  },
});

const mapUserStatsToArray = computed(() => {
  return Object.values(userStats);
});
const mapResidenceStatsToArray = computed(() => {
  return Object.values(residenceStats);
});

const fetchStats = async () => {
  try {
    const response = await UserServices.overAllStats();
    if (response.status === 200) {
      const stats = await response.json();
      const { totalAdmins, totalUsers, totalPendingUsers } = stats;
      userStats.totalAdmins.val = totalAdmins;
      userStats.totalUsers.val = totalUsers;
      userStats.totalPendingUsers.val = totalPendingUsers;
    }
  } catch (error) {}
  try {
    const response = await ResidenceServices.overAllStats();
    if (response.status === 200) {
      const stats = await response.json();
      console.log('residenceStats', stats);
      const { totalApprovedResidences, totalPendingResidences } = stats;
      residenceStats.totalApprovedResidences.val = totalApprovedResidences;
      residenceStats.totalPendingResidences.val = totalPendingResidences;
      log;
    }
  } catch (error) {}
};

const pendingKYCUser = ref([]);
const fetchPendingKYCUser = async () => {
  try {
    const response = await UserServices.pendingKYC();
    if (response.status === 200) {
      pendingKYCUser.value = await response.json();
    } else {
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        title: 'ไม่สามารถดึงข้อมูลผู้ใช้งานที่รอการอนุมัติได้',
        type: 'error',
      });
    }
  } catch (error) {}
};
const approveUser = async (userId) => {
  try {
    const response = await UserServices.approveUser(userId);
    if (response.status === 200) {
      notify({
        group: 'tr',
        title: 'อนุมัติผู้ใช้งานสำเร็จ',
        text: 'อนุมัติผู้ใช้งานสำเร็จแล้ว',
        type: 'success',
      });
      await fetchAll();
    } else {
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถอนุมัติผู้ใช้งานได้',
        type: 'error',
      });
    }
  } catch (error) {}
};

const pendingResidence = ref([]);
const fetchPendingResidence = async () => {
  try {
    const response = await ResidenceServices.pendingApprove();
    if (response.status === 200) {
      pendingResidence.value = await response.json();
      console.log('pendingResidence', pendingResidence.value);
    } else {
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        title: 'ไม่สามารถดึงข้อมูลหอพักที่รอการอนุมัติได้',
        type: 'error',
      });
    }
  } catch (error) {}
};
const approveResidence = async (id) => {
  try {
    const response = await ResidenceServices.approveResidence(id);
    if (response.status === 200) {
      notify({
        group: 'tr',
        title: 'อนุมัติผู้ใช้งานสำเร็จ',
        text: 'อนุมัติผู้ใช้งานสำเร็จแล้ว',
        type: 'success',
      });
      await fetchAll();
    } else {
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถอนุมัติผู้ใช้งานได้',
        type: 'error',
      });
    }
  } catch (error) {}
};

const fetchAll = async () => {
  await fetchStats();
  await fetchPendingKYCUser();
  await fetchPendingResidence();
  isLoading.value = false;
};
onMounted(async () => {
  await fetchAll();
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen" />
  <div class="min-h-screen">
    <div class="py-10 px-10 md:px-40">
      <Breadcrumb
        :pathList="[
          { name: 'หน้าแรก', pathName: 'home' },
          { name: 'จัดการระบบ', pathName: 'manage' },
        ]"
      />
      <Stats :stats="mapUserStatsToArray" class="mt-5" />

      <div
        class="relative bg-white p-10 mt-5 space-y-4 rounded border border-gray-200"
      >
        <h1
          class="text-2xl font-semibold text-dark-blue-200 flex gap-2 items-center"
        >
          ผู้ใช้งานที่รอการอนุมัติ
          <UserIcon class="h-8 w-8 text-primary" />
          <ClockIcon class="h-8 w-8 text-primary" />
        </h1>
        <!-- <p class="text-xs">ผู้ใช้งานที่รอการอนุมัติทั้งหมด</p> -->
        <p class="text-sm" v-if="!pendingKYCUser.length">
          ไม่มีผู้ใช้งานที่รอการอนุมัติในขณะนี้
        </p>
        <div
          v-for="(user, index) in pendingKYCUser"
          :key="index"
          class="flex items-center gap-2 justify-between border-2 p-2 rounded-lg border-gray-200 hover:border-primary transition-all cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <img
              :src="BlankprofileImg"
              alt="user profile"
              class="h-10 w-10 rounded-full"
            />
            <div>
              <h1 class="text-sm font-semibold">
                {{ user.firstname }} {{ user.lastname }}
              </h1>
              <p class="text-xs">{{ user.email }}</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="btn btn-primary btn-sm"
              :onclick="`kyc_modal_${index}.showModal()`"
            >
              ดูข้อมูลเพิ่มเติม
            </button>
          </div>

          <!-- Modal -->

          <dialog :id="`kyc_modal_${index}`" class="modal">
            <div class="modal-box space-y-2">
              <h3 class="font-bold text-lg">รายละเอียดผู้ใช้งาน</h3>

              <p>ชื่อผู้ใช้งาน : {{ user.firstname }} {{ user.lastname }}</p>
              <p>อีเมล : {{ user.email }} (ยืนยันแล้ว)</p>
              <p>เบอร์โทร : {{ user.phone }}</p>
              <p>หมายเลขบัตรประชาชน : {{ user.idcardNumber }}</p>

              <div class="modal-action flex">
                <form method="dialog">
                  <!-- if there is a button in form, it will close the modal -->
                  <button class="btn btn-sm">ปิด</button>
                </form>
                <button
                  class="btn btn-success btn-sm"
                  @click="approveUser(user._id)"
                >
                  อนุมัติบัญชีผู้ใช้
                </button>
              </div>
            </div>
          </dialog>
        </div>
      </div>

      <Stats :stats="mapResidenceStatsToArray" class="mt-5" />

      <div
        class="relative bg-white p-10 mt-5 space-y-4 rounded border border-gray-200"
      >
        <h1
          class="text-2xl font-semibold text-dark-blue-200 flex gap-2 items-center"
        >
          หอพักที่รอการอนุมัติ
          <HomeIcon class="h-8 w-8 text-primary" />
          <ClockIcon class="h-8 w-8 text-primary" />
        </h1>
        <p class="text-sm" v-if="!pendingResidence.length">
          ไม่มีหอพักที่รอการอนุมัติในขณะนี้
        </p>
        <div
          v-for="(residence, index) in pendingResidence"
          :key="index"
          class="flex items-center gap-2 justify-between border-2 p-2 rounded-lg border-gray-200 hover:border-primary transition-all cursor-pointer"
        >
          <div class="flex items-center gap-2">
            <HomeIcon class="h-10 w-10 text-primary" />

            <div>
              <h1 class="text-sm font-semibold">
                {{ residence.name }}
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="btn btn-primary btn-sm"
              :onclick="`res_modal_${index}.showModal()`"
            >
              ดูข้อมูลเพิ่มเติม
            </button>
          </div>

          <!-- Modal -->

          <dialog :id="`res_modal_${index}`" class="modal">
            <div class="modal-box space-y-2">
              <h3 class="font-bold text-lg">รายละเอียดหอพัก</h3>
              <p>
                เจ้าของหอพัก: {{ residence.owner.firstname }}
                {{ residence.owner.lastname }}
              </p>
              <p class="flex gap-2">
                ใบประกอบการหอพัก :
                <router-link
                  target="_blank"
                  class="flex items-center gap-2 underline text-light-red"
                  :to="{
                    name: 'pdf-preview',
                    query: {
                      filename: residence.residenceBusinessLicense,
                    },
                  }"
                >
                  ดูไฟล์ <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                </router-link>
              </p>
              <p>ชื่อหอพัก : {{ residence.name }}</p>
              <p>ที่อยู่ : {{ residence.address }}</p>
              <p>รายละเอียดหอพัก : {{ residence.description }}</p>
              <p>ค่าน้ำ: {{ residence.defaultWaterPriceRate }} บาท/หน่วย</p>
              <p>ค่าไฟ: {{ residence.defaultElectricPriceRate }} บาท/หน่วย</p>
              <p>
                ค่าบริการอื่น ๆ :
                {{
                  residence.fees
                    .map((i) => `${i.feename}: ${i.feeprice} บาท`)
                    .join(', ')
                }}
              </p>
              <p>จำนวนห้อง : {{ residence.rooms.length }} ห้อง</p>
              <p>
                สิ่งอำนวยความสะดวก:
                {{ residence.facilities.map((f) => f.name).join(', ') }}
              </p>
              <div class="modal-action flex">
                <form method="dialog">
                  <!-- if there is a button in form, it will close the modal -->
                  <button class="btn btn-sm">ปิด</button>
                </form>
                <button
                  class="btn btn-success btn-sm"
                  @click="approveResidence(residence._id)"
                >
                  อนุมัติหอพัก
                </button>
              </div>
            </div>
          </dialog>
        </div>
      </div>

      <!-- Quick link Section -->
      <section class="mt-5">
        <!-- <h1
          class="text-2xl font-semibold text-dark-blue-200 my-5 flex items-center gap-2"
        >
          <LinkIcon class="h-8 w-8 inline-block" /> Quick Links
        </h1> -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2"
        >
          <QuickLinkCard
            :router-path="{ name: 'room', params: { residenceId } }"
            title="จัดการผู้ใช้งานทั้งหมด"
            text="เข้าสู่หน้าจัดการผู้ใช้งานทั้งหมด"
            :icon="UserIcon"
          />

          <QuickLinkCard
            :router-path="{ name: 'info', params: { residenceId } }"
            title="จัดการหอพักทั้งหมด"
            text="เข้าสู่หน้าจัดการหอพักทั้งหมด"
            :icon="HomeIcon"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped></style>
