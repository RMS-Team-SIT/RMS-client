<script setup>
import Badge from '../common/badge.vue';
import Button from '@/components/common/button.vue';
import { computed, inject, onMounted, reactive, ref } from 'vue';
import ResidenceServices from '@/services/ResidenceServices';
import { useNotification } from '@kyvg/vue3-notification';
import dayjs from 'dayjs';
import BankIcon from '@/components/common/bank-icon.vue';
import { useRouter } from 'vue-router';
import RoomService from '@/services/RoomService';
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  rooms: {
    type: Array,
    default: () => [],
  },
  roomTypes: {
    type: Array,
    default: () => [],
  },
  residenceId: {
    type: String,
    default: '',
  },
  residenceData: {
    type: Object,
    default: () => ({}),
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
  return props.rooms
    .filter((room) => room.isActive !== showDeactive.value)
    .filter((room) => {
      return (
        room.name.toLowerCase().includes(search.value.toLowerCase()) ||
        room.description.toLowerCase().includes(search.value.toLowerCase())
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name))
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

const editingRoom = reactive({
  roomId: '',
  room: {},
});

const setEditingRoom = (roomId) => {
  editingRoom.roomId = roomId;
  editingRoom.room = { ...props.rooms.find((room) => room._id === roomId) };
  editingRoom.room.type = editingRoom.room.type._id;
};
const setEditingRoomRentalPriceByRoomType = () => {
  editingRoom.room.roomRentalPrice = props.roomTypes.find(
    (t) => t._id === editingRoom.room.type
  ).price;
};

const resetEditingRoom = () => {
  editingRoom.roomId = '';
  editingRoom.room = {};
};

const updateRoom = async () => {
  const response = await RoomService.updateRoomDetail(
    props.residenceId,
    editingRoom.roomId,
    { ...editingRoom.room }
  );

  if (response.status !== 200) {
    const data = await response.json();
    notify({
      group: 'tr',
      title: 'แก้ไขข้อมูลไม่สำเร็จ',
      text: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูลห้องพัก,' + data.message,
      type: 'error',
    });
  } else {
    notify({
      group: 'tr',
      title: 'แก้ไขข้อมูลสำเร็จ',
      text: 'ข้อมูลห้องพักได้รับการแก้ไขเรียบร้อยแล้ว',
      type: 'success',
    });
    props.rooms[props.rooms.findIndex((r) => r._id === editingRoom.roomId)] = {
      ...editingRoom.room,
      type: props.roomTypes.find((t) => t._id === editingRoom.room.type),
    };
  }

  resetEditingRoom();
  editRoom.close();
};
</script>

<template>
  <div class="overflow-x-auto">
    <p class="text-base mt-5" v-if="!props.rooms.length">
      ไม่มีห้องในระบบ กรุณาสร้างห้องใหม่
    </p>
    <div v-else>
      <!-- show number of renter -->
      <p class="text-xs text-gray-500">
        จำนวนห้องทั้งหมด:
        {{ props.rooms?.filter((r) => r.isActive).length }} (เปิดใช้งาน),
        {{ props.rooms?.filter((r) => !r.isActive).length }} (ปิดใช้งาน)
      </p>
      <div class="w-full flex align-middle items-center justify-end">
        <label class="label">
          <span class="label-text">ค้นหาห้องพัก:</span>
        </label>
        <input
          type="text"
          placeholder="ค้นหาห้องพัก"
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
            <th>คำอธิบาย</th>
            <th>ชั้น</th>
            <th>ประเภทห้อง</th>
            <th>ค่าเช่า</th>
            <th>สถานะห้อง</th>
            <th>ผู้เช่า</th>
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
            <td>{{ room.floor }}</td>
            <td>
              {{ room.type.name }}
            </td>
            <td>{{ room.roomRentalPrice }} บาท</td>

            <td>
              <Badge badgeType="success" v-if="!room.currentRenter">ว่าง</Badge>
              <Badge badgeType="error" v-else>ไม่ว่าง</Badge>
            </td>
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
            <th>
              <router-link
                :to="{
                  name: 'view-room',
                  params: {
                    residenceId: $route.params.residenceId,
                    roomId: room._id,
                  },
                }"
              >
                <Button btnType="ghost-pill"
                  >ดูข้อมูล
                  <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                </Button>
              </router-link>
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
              >
                <Button btnType="ghost-pill">แก้ไข</Button>
              </router-link> -->

              <Button
                btnType="ghost-pill"
                onclick="editRoom.showModal()"
                @click="setEditingRoom(room._id)"
                >แก้ไข</Button
              >
              <!-- Modal -->
            </th>
          </tr>
        </tbody>
      </table>

      <dialog :id="`editRoom`" class="modal">
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
                  v-for="roomType in props.roomTypes"
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
      </dialog>

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
