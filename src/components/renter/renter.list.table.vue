<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';

const props = defineProps({
  renters: {
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

const computedrenters = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return props.renters
    .filter((renter) => renter.isActive !== showDeactive.value)
    .filter((renter) => {
      return (
        renter.firstname.toLowerCase().includes(search.value.toLowerCase()) ||
        renter.lastname.toLowerCase().includes(search.value.toLowerCase()) ||
        renter.username.toLowerCase().includes(search.value.toLowerCase()) ||
        renter.phone.toLowerCase().includes(search.value.toLowerCase())
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
  return Math.ceil(props.renters.length / perPage.value);
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
    <p class="text-base mt-5" v-if="!props.renters.length">
      ไม่พบผู้เช่าในระบบ กรุณาสร้าง
    </p>
    <div v-else>
      <!-- show number of renter -->
      <p class="text-xs text-gray-500">
        มีผู้เช่าในระบบทั้งหมด:
        {{ props.renters?.filter((r) => r.isActive).length }} ข้อมูล
      </p>
      <div class="w-full flex align-middle items-center justify-end">
        <label class="label">
          <span class="label-text">ค้นหาผู้เช่า:</span>
        </label>
        <input
          type="text"
          placeholder="ค้นหาผู้เช่า"
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
            <th>ชื่อ</th>
            <th>ชื่อผู้ใช้</th>
            <th>โทรศัพท์</th>
            <th>สถานะ</th>
            <th>ห้องปัจจุบัน</th>
            <th>สำเนาบัตรประชาชน</th>
            <th>สัญญาเช่า</th>
            <th>สร้างเมื่อ</th>
            <th>อัปเดตเมื่อ</th>
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          <tr v-for="(renter, index) in computedrenters" :key="index">
            <td>
              {{ index + 1 }}
            </td>
            <td class="">
              <span> {{ renter.firstname }} {{ renter.lastname }}</span>
            </td>
            <td>
              {{ renter.username }}
            </td>
            <td>{{ renter.phone }}</td>
            <td>
              <Badge v-if="renter.isActive" badgeType="success">Active</Badge>
              <Badge v-else badgeType="error">Deactive</Badge>
            </td>
            <td>
              <div v-if="renter.room" class="underline">
                <router-link
                  :to="{
                    name: 'update-room',
                    params: {
                      roomId: renter.room._id,
                      residenceId: residenceId,
                    },
                  }"
                >
                  {{ renter.room.name }}
                </router-link>
              </div>
              <div v-else>
                <span class="text-red-500">ไม่พบ</span>
              </div>
            </td>
            <td>
              <div v-if="renter.copyOfIdCard" class="underline">
                <router-link
                  target="_blank"
                  :to="{
                    name: 'pdf-preview',
                    query: {
                      filename: renter.copyOfIdCard,
                    },
                  }"
                >
                  ดูไฟล์
                </router-link>
              </div>
              <div v-else>
                <span class="text-red-500">ไม่พบ</span>
              </div>
            </td>
            <td>
              <div v-if="renter.renterContract" class="underline">
                <router-link
                  target="_blank"
                  :to="{
                    name: 'pdf-preview',
                    query: {
                      filename: renter.renterContract,
                    },
                  }"
                >
                  Preview
                </router-link>
              </div>
              <div v-else>
                <span class="text-red-500">ไม่พบ</span>
              </div>
            </td>
            <td>
              {{ dayjs(renter.created_at).format('MM-DD-YYYY HH:mm:ss') }}
            </td>
            <td>
              {{ dayjs(renter.updated_at).format('MM-DD-YYYY HH:mm:ss') }}
            </td>
            <th>
              <router-link
                :to="{
                  name: 'update-renter',
                  params: {
                    renterId: renter._id,
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
