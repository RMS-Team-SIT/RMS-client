<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import ResidenceServices from '@/services/ResidenceServices';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import BankIcon from '@/components/common/bank-icon.vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  defaultWaterPriceRate: {
    type: Number,
    default: 0,
  },
  defaultElectricPriceRate: {
    type: Number,
    default: 0,
  },
  rooms: {
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
const router = useRouter();

const computedRooms = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return props.rooms
    .filter((room) => (showDeactive.value ? true : room.isActive))
    .slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const totalPages = computed(() => {
  return Math.ceil(props.rooms.length / perPage.value);
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
</script>

<template>
  <div class="overflow-x-auto">
    <p class="text-base mt-5" v-if="!props.rooms.length">
      ไม่มีช่องทางการชำระเงิน
    </p>
    <div v-else>
      <!-- show number of renter -->
      <p class="text-xs text-gray-500">
        ช่องทางการชำระเงินทั้งหมด:
        {{ props.rooms?.filter((r) => r.isActive).length }}
      </p>
      <div class="flex flex-row justify-end">
        <div class="form-control w-56">
          <label class="cursor-pointer label">
            <span class="label-text">แสดงข้อมูลที่โดนปิดใช้งาน</span>
            <input
              type="checkbox"
              class="toggle toggle-primary"
              v-model="showDeactive"
            />
          </label>
        </div>
      </div>
      <table class="table table-xs">
        <!-- head -->
        <!-- show number of renter -->
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อ</th>
            <th>คำอธิบาย</th>
            <th>ชั้น</th>
            <th>ผู้เช่า</th>
            <th>อัตราค่าน้ำ</th>
            <th>อัตราค่าไฟ</th>
            <th>สถานะ</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, index) in rooms" :key="index">
            <td>
              {{ index + 1 }}
            </td>
            <td>
              {{ room.name }}
            </td>
            <td>
              <span :class="{ 'text-gray-500': !room.description }">
                {{ room.description || 'ไม่มีข้อมูล' }}
              </span>
            </td>
            <td>{{ room.floor }}</td>
            <td>
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
                {{ room.currentRenter.firstname }}
                {{ room.currentRenter.lastname }}
              </router-link>
              <span v-else class="text-red-500"> ไม่มีผู้เช่า </span>
            </td>
            <td>
              {{
                room.isUseDefaultWaterPriceRate
                  ? defaultWaterPriceRate
                  : room.waterPriceRate
              }}
              <Badge badgeType="ghost" v-if="room.isUseDefaultWaterPriceRate"
                >ค่าเริ่มต้น</Badge
              >
              <Badge badgeType="primary" v-else>กำหนดเอง</Badge>
            </td>
            <td>
              {{
                room.isUseDefaultElectricPriceRate
                  ? defaultElectricPriceRate
                  : room.electricPriceRate
              }}
              <Badge badgeType="ghost" v-if="room.isUseDefaultElectricPriceRate"
                >ค่าเริ่มต้น</Badge
              >
              <Badge badgeType="primary" v-else>กำหนดเอง</Badge>
            </td>
            <td>
              <Badge badgeType="success" v-if="!room.currentRenter">ว่าง</Badge>
              <Badge badgeType="error" v-else>ไม่ว่าง</Badge>
            </td>
            <!-- <td>
            <Badge badgeType="success">Paid</Badge>
            <Badge badgeType="error">Not Paid</Badge>
          </td> -->
            <th>
              <router-link
                :to="{
                  name: 'update-room',
                  params: {
                    residenceId: $route.params.residenceId,
                    roomId: room._id,
                  },
                }"
              >
                <Button btnType="ghost-pill">แก้ไข</Button>
              </router-link>
            </th>
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
    </div>
  </div>
</template>

<style scoped></style>
