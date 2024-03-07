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
  roomTypes: {
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
const search = ref('');

const computedRooms = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return props.roomTypes
    .filter((room) => room.isActive !== showDeactive.value)
    .filter((room) => {
      return (
        room.name.toLowerCase().includes(search.value.toLowerCase())
      );
    })
    .slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const totalPages = computed(() => {
  return Math.ceil(props.roomTypes.length / perPage.value);
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
    <p class="text-base mt-5" v-if="!props.roomTypes.length">
      ไม่มีประเภทห้องในระบบ กรุณาสร้างประเภทห้องใหม่
    </p>
    <div v-else>
      <!-- show number of renter -->
      <p class="text-xs text-gray-500">
        จำนวนประเภทห้องทั้งหมด:
        {{ props.roomTypes?.filter((r) => r.isActive).length }} (เปิดใช้งาน),
        {{ props.roomTypes?.filter((r) => !r.isActive).length }} (ปิดใช้งาน)
      </p>
      <div class="w-full flex align-middle items-center justify-end">
        <label class="label">
          <span class="label-text">ค้นหา:</span>
        </label>
        <input
          type="text"
          placeholder="ค้นหา"
          class="input input-xs input-bordered bg-white rounded"
          v-model="search"
        />
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
            <th>ชื่อประเภท</th>
            <th>รายละเอียด</th>
            <th>รูปแบบห้อง</th>
            <th>ขนาดห้อง</th>
            <th>ค่าเช่า</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, index) in computedRooms" :key="index">
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
            <td>
              {{ room.category }}
            </td>
            <td>
              {{ room.size }} ตร.ม.
            </td>
            <td>
              {{ room.price }} บาท/เดือน
            </td>
            
            
            <th>
              <!-- <router-link
                :to="{
                  name: 'view-room',
                  params: {
                    residenceId: $route.params.residenceId,
                    roomId: room._id,
                  },
                }"
              > -->
                <Button btnType="ghost-pill">ดูข้อมูล</Button>
              <!-- </router-link> -->
            </th>
            <th>
              <!-- <router-link
                :to="{
                  name: 'update-room',
                  params: {
                    residenceId: $route.params.residenceId,
                    roomId: room._id,
                  },
                }"
              > -->
                <Button btnType="ghost-pill">แก้ไข</Button>
              <!-- </router-link> -->
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
