<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import ResidenceServices from '@/services/ResidenceServices';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import BankIcon from '@/components/common/bank-icon.vue';
import { useRouter } from 'vue-router';
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  fees: {
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
  return props.fees
    .filter((f) => {
      return f.feename.toLowerCase().includes(search.value.toLowerCase());
    })
    .slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const totalPages = computed(() => {
  return Math.ceil(props.fees.length / perPage.value);
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
    <p class="text-base mt-5" v-if="!props.fees.length">
      ไม่มีค่าบริการเพิ่มเติมในหอพัก กรุณาเพิ่มข้อมูลค่าบริการเพิ่มเติม
    </p>
    <div v-else>
      <!-- show number of renter -->
      <p class="text-xs text-gray-500">
        จำนวนค่าบริการเพิ่มเติมทั้งหมด:
        {{ props.fees.length }}
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
      </div>
      <table class="table table-xs">
        <!-- head -->
        <!-- show number of renter -->
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อค่าใช้จ่ายเพิ่มเติม</th>
            <th>ราคา</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(fee, index) in computedRooms" :key="index">
            <td>
              {{ index + 1 }}
            </td>
            <td>
              {{ fee.feename }}
            </td>
            <td>{{ fee.feeprice }} บาท</td>
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

      <!-- Modal -->
      <!-- <dialog :id="`editRoom`" class="modal">
        <div class="modal-box space-y-2">
          <h3 class="font-bold text-lg">
            รายละเอียดห้อง : {{ editingRoom.room.name }}
          </h3>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="label">
                <span class="text-base label-text">ชื่อห้อง </span>
              </label>
              <input
                type="text"
                placeholder="ชื่อห้อง"
                class="input input-bordered bg-white input-sm rounded-sm"
                v-model="editingRoom.room.name"
              />
            </div>

            <div>
              <label class="label">
                <span class="text-base label-text"
                  >ประเภทห้อง <span class="text-red-500">*</span>
                </span>
              </label>
              <select
                class="select select-bordered w-full max-w-xs select-sm bg-white input-sm rounded-sm"
                v-model="editingRoom.room.type"
                @change="setEditingRoomRentalPriceByRoomType"
              >
                <option value="">เลือกประเภทห้อง</option>
                <option
                  v-for="roomType in props.fees"
                  :key="roomType._id"
                  :value="roomType._id"
                >
                  {{ roomType.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="label">
                <span class="text-base label-text"
                  >ชั้น <span class="text-red-500">*</span>
                </span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="ชั้น"
                class="input input-bordered bg-white input-sm rounded-sm"
                v-model="editingRoom.room.floor"
              />
            </div>

            <div>
              <label class="label">
                <span class="text-base label-text"
                  >ค่าเช่าบาท/เดือน
                  <span class="text-red-500">*</span>
                </span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="ค่าเช่าบาท/เดือน"
                class="input input-bordered bg-white input-sm rounded-sm"
                v-model="editingRoom.room.roomRentalPrice"
              />
            </div>

            <div class="col-span-2">
              <label class="label">
                <span class="text-base label-text">คำอธิบาย</span>
              </label>
              <textarea
                class="w-full textarea textarea-bordered rounded-sm bg-white"
                v-model="editingRoom.room.description"
              ></textarea>
            </div>

            <div class="col-span-2">
              <label class="label">
                <span class="text-base label-text"
                  >ค่าบริการ <span class="text-red-500">*</span>
                </span>
              </label>
              <p class="p-2" v-if="!props.residenceData.fees.length">
                ไม่มีค่าบริการเพิ่มเติมในหอพัก
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2">
                <div
                  v-for="(fee, feeIndex) in props.residenceData.fees"
                  :key="feeIndex"
                  class="flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    :id="index + fee._id"
                    :value="fee._id"
                    v-model="editingRoom.room.fees"
                    class="checkbox checkbox-primary"
                  />
                  <label :for="index + fee._id" class="label text-sm">
                    {{ fee.feename }} : {{ fee.feeprice }} บาท
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-action flex">
            <form method="dialog">
              <button class="btn btn-sm" @click="resetEditingRoom">ปิด</button>
              <button class="btn btn-sm btn-secondary" @click="updateRoom">
                บันทึกข้อมูล
              </button>
            </form>
          </div>
        </div>
      </dialog> -->

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
