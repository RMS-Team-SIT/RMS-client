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
import { projectFullName } from '@/utils/constants';

const router = useRouter();
const route = useRoute();
const residenceId = route.params.residenceId;
const { notify } = useNotification();
const isLoading = ref(true);

const stats = reactive({
  totalBill: {
    title: 'จำนวนบิลทั้งหมด',
    val: 0,
    desc: 'จำนวนบิลทั้งหมดที่ออกในระบบ',
    icon: BanknotesIcon,
    // route: 'admin-manage-bill',
  },
  totalPaidBill: {
    title: 'จำนวนบิลที่ชำระแล้ว',
    val: 0,
    desc: 'จำนวนบิลที่ชำระแล้วทั้งหมด',
    icon: CheckCircleIcon,
  },
  totalUnpaidBill: {
    title: 'จำนวนบิลที่ยังไม่ได้ชำระ',
    val: 0,
    desc: 'จำนวนบิลที่ยังไม่ได้ชำระทั้งหมด',
    icon: ClockIcon,
  },
});

const statsToArray = computed(() => {
  return Object.values(stats);
});

const fetchStats = async () => {
  try {
    const response = await UserServices.overAllStats();
    if (response.status === 200) {
      const stats = await response.json();
      const { totalAdmins, totalUsers, totalPendingUsers } = stats;
      stats.totalAdmins.val = totalAdmins;
      stats.totalUsers.val = totalUsers;
      stats.totalPendingUsers.val = totalPendingUsers;
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
    <div class="py-10 px-10 md:px-20">
      <!-- <h1
        class="text-xl font-semibold text-dark-blue-200 my-5 flex items-center gap-2"
      >
        <ChartPieIcon class="h-8 w-8 inline-block" /> สวัสดี {{ projectFullName }}
      </h1> -->

      <h1 class="text-xl font-semibold text-dark-blue-200">ข้อมูลบิล</h1>
      <Stats :stats="statsToArray" class="mt-5" />

      <div
        class="relative bg-white p-5 mt-5 space-y-4 rounded border border-gray-200"
      >
        <h1
          class="text-base font-semibold text-dark-blue-200 flex gap-2 items-center"
        >
          บิลทั้งหมด
          <BanknotesIcon class="h-6 w-6" />
        </h1>
        <p class="text-sm" v-if="!pendingKYCUser.length">
          ไม่มีผู้ใช้งานที่รอการอนุมัติในขณะนี้
        </p>
        <div
          v-for="(user, index) in pendingKYCUser"
          :key="index"
          class="flex items-center gap-2 justify-between border p-2 rounded-lg border-gray-200 hover:border-primary transition-all cursor-pointer"
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
      <div
        class="relative bg-white p-5 mt-5 space-y-4 rounded border border-gray-200"
      >
        <h1
          class="text-base font-semibold text-dark-blue-200 flex gap-2 items-center"
        >
          ข้อมูลห้องพัก
          <BanknotesIcon class="h-6 w-6" />
        </h1>
        <p class="text-sm" v-if="!pendingKYCUser.length">
          ไม่มีผู้ใช้งานที่รอการอนุมัติในขณะนี้
        </p>
        <div
          v-for="(user, index) in pendingKYCUser"
          :key="index"
          class="flex items-center gap-2 justify-between border p-2 rounded-lg border-gray-200 hover:border-primary transition-all cursor-pointer"
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
    </div>
  </div>
</template>

<style scoped></style>
