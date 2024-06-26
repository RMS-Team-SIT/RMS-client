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
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/24/outline';
import Divider from '../common/divider.vue';

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

const emits = defineEmits(['refetch']);
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
        room.description.toLowerCase().includes(search.value.toLowerCase()) ||
        (room.currentRenter &&
          (room.currentRenter.firstname
            .toLowerCase()
            .includes(search.value.toLowerCase()) ||
            room.currentRenter.lastname
              .toLowerCase()
              .includes(search.value.toLowerCase())))
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

const availableRenters = computed(() => {
  return props.residenceData.renters.filter((r) => !r.room && r.isActive);
});

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

const editingRoomRenter = reactive({
  roomId: '',
  room: '',
  renterId: '',
  renter: '',
});

const currentEditingRenter = computed(() => {
  return props.residenceData.renters.find(
    (r) => r._id === editingRoomRenter.renterId
  );
});

const setEditingRoomRenter = (roomId) => {
  editingRoomRenter.roomId = roomId;
  editingRoomRenter.room = props.rooms.find((r) => r._id === roomId);
};

const resetEditingRoomRenter = () => {
  editingRoomRenter.roomId = '';
  editingRoomRenter.renterId = '';
};

const updateRoom = async () => {
  const response = await RoomService.updateRoomRenter(
    props.residenceId,
    editingRoomRenter.roomId,
    { renterId: editingRoomRenter.renterId }
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
      title: 'เพิ่มผู้เช่าเข้าห้องสำเร็จ',
      text: 'ข้อมูลผู้เช่าถูกเพิ่มเข้าห้องพักเรียบร้อยแล้ว',
      type: 'success',
    });
    emits('refetch');
  }
  resetEditingRoomRenter();
  editRoom.close();
};

const moveOutRoom = async (roomId) => {
  const response = await RoomService.deleteRoomRenter(
    props.residenceId,
    editingRoomRenter.roomId
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
      title: 'ย้ายผู้เช่าออกจากห้องสำเร็จ',
      text: 'ข้อมูลผู้เช่าถูกย้ายออกจากห้องพักเรียบร้อยแล้ว',
      type: 'success',
    });
    emits('refetch');
  }
  resetEditingRoomRenter();
  leaveRoom.close();
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
        {{ props.rooms?.filter((r) => r.isActive).length }}, ห้องว่าง:
        {{
          props.rooms?.filter((r) => r.isActive && r.status === 'AVAILABLE')
            .length
        }}, ห้องไม่ว่าง:
        {{
          props.rooms?.filter((r) => r.isActive && r.status === 'OCCUPIED')
            .length
        }}
      </p>
      <div class="w-full flex align-middle items-center justify-end">
        <label class="label">
          <span class="label-text">ค้นหา:</span>
        </label>
        <input
          type="text"
          placeholder="ค้นหาห้องพัก/ผู้เช่า"
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
            <th>ชื่อห้อง</th>
            <th>สถานะห้อง</th>
            <th>ผู้เช่า</th>
            <th>ย้ายเข้า/ย้ายออก</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(room, index) in computedRooms" :key="index">
            <td>
              {{ index + 1 }}
            </td>
            <td>
              <router-link
                class="text-dark-blue-200 underline"
                :to="{
                  name: 'view-room',
                  params: {
                    residenceId: $route.params.residenceId,
                    roomId: room._id,
                  },
                }"
              >
                {{ room.name }}
              </router-link>
            </td>

            <td>
              <Badge badgeType="success" v-if="room.status === 'AVAILABLE'"
                >ว่าง</Badge
              >
              <Badge badgeType="error" v-else>ไม่ว่าง</Badge>
            </td>
            <td>
              <router-link
                v-if="room.currentRenter"
                class="text-dark-blue-200 underline"
                target="_blank"
                :to="{
                  name: 'view-renter',
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
              <Button
                btnType="success-pill"
                onclick="editRoom.showModal()"
                @click="setEditingRoomRenter(room._id)"
                v-if="!room.currentRenter"
              >
                <ArrowLeftCircleIcon class="h-5 w-5" />
                ย้ายเข้า
              </Button>
              <Button
                v-else
                btnType="secondary-pill"
                onclick="leaveRoom.showModal()"
                @click="setEditingRoomRenter(room._id)"
                >ย้ายออก
                <ArrowRightCircleIcon class="h-5 w-5" />
              </Button>
            </th>
          </tr>
        </tbody>
      </table>

      <dialog :id="`editRoom`" class="modal">
        <div class="modal-box space-y-2">
          <h3 class="font-bold text-lg">
            ห้อง : {{ editingRoomRenter.room.name }}
          </h3>

          <div class="grid grid-cols-1 gap-2">
            <div class="col-span-1">
              <label class="label">
                <span class="text-base label-text"
                  >ผู้เช่า: <span class="text-red-500">*</span>
                </span>
              </label>
              <select
                class="select select-bordered w-full max-w-xs select-sm bg-white input-sm rounded-sm"
                v-model="editingRoomRenter.renterId"
              >
                <option value="">เลือกผู้เช่า</option>
                <option
                  v-for="renter in availableRenters"
                  :key="renter._id"
                  :value="renter._id"
                >
                  {{ renter.firstname }} {{ renter.lastname }}
                </option>
              </select>
            </div>
            <div class="divider divider-start">รายละเอียดผู้เช่า</div>
            <p v-if="!editingRoomRenter.renterId">
              กรุณาเลือกผู้เช่าที่จะเข้าพักห้องนี้
            </p>
            <div v-else>
              <p>
                ชื่อ:
                <b>
                  {{ currentEditingRenter.firstname }}
                  {{ currentEditingRenter.lastname }}</b
                >
              </p>
              <p>
                เบอร์โทร: <b> {{ currentEditingRenter.phone }}</b>
              </p>
              <p>
                อีเมล: <b> {{ currentEditingRenter.email }}</b>
              </p>
              <div class="flex gap-2">
                <p>สัญญาเช่า:</p>
                <div
                  v-if="currentEditingRenter.renterContract"
                  class="underline"
                >
                  <router-link
                    target="_blank"
                    class="flex items-center gap-2"
                    :to="{
                      name: 'pdf-preview',
                      query: {
                        filename: currentEditingRenter.renterContract,
                      },
                    }"
                  >
                    ดูไฟล์ <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                  </router-link>
                </div>
                <div v-else>
                  <span class="text-red-500">ไม่มีไฟล์</span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-action flex mt-5">
            <form method="dialog">
              <button class="btn btn-sm mr-2" @click="resetEditingRoomRenter">
                ปิด
              </button>
              <button
                class="btn btn-sm btn-secondary"
                @click="updateRoom"
                v-if="editingRoomRenter.renterId"
              >
                ยืนยันการเพิ่มผู้เช่าเข้าห้อง
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog :id="`leaveRoom`" class="modal">
        <div class="modal-box space-y-2">
          <h3 class="font-bold text-lg">ย้ายออกจากห้อง</h3>
          <p>
            ต้องการย้ายผู้เช่า
            <b>
              {{ editingRoomRenter.room.currentRenter?.firstname }}
              {{ editingRoomRenter.room.currentRenter?.lastname }}</b
            >
            ออกจากห้อง <b> {{ editingRoomRenter.room.name }}</b> หรือไม่?
          </p>
          <div class="modal-action flex mt-5">
            <form method="dialog">
              <button class="btn btn-sm mr-2">ปิด</button>
              <button @click="moveOutRoom" class="btn btn-sm btn-secondary">
                ยืนยันการย้ายออกจากห้อง
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
