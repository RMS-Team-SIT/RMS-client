<script setup>
import { useNotification } from '@kyvg/vue3-notification';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import BankIcon from '@/components/common/bank-icon.vue';
import { HomeIcon } from '@heroicons/vue/24/outline';
import { generateRandomObjectId } from '@/utils/mongo';
import Badge from '@/components/common/badge.vue';
import Button from '@/components/common/button.vue';
import Divider from '@/components/common/divider.vue';

const emit = defineEmits(['getData']);
const { notify } = useNotification();
const props = defineProps({
  viewOnly: {
    type: Boolean,
    default: false,
  },
  residenceData: {
    type: Object,
    default: () => ({}),
  },
});

const roomsToEdit = reactive({
  rooms: [],
  toType: '',
  toPrice: null,
  toFees: [],
});

const saveEditRoom = () => {
  if (!roomsToEdit.toType) {
    notify({
      title: 'กรุณาเลือกประเภทห้อง',
      type: 'error',
    });
    return;
  }
  if (!roomsToEdit.toPrice) {
    notify({
      title: 'กรุณาใส่ค่าเช่าของห้อง',
      type: 'error',
    });
    return;
  }

  roomsToEdit.rooms.forEach((roomId) => {
    const room = findRoom(roomId);
    room.type = roomsToEdit.toType;
    room.roomRentalPrice = roomsToEdit.toPrice;
    room.fees = roomsToEdit.toFees;
  });

  resetRoomToEdit({ isResetRoom: true });
};
const resetRoomToEdit = ({ isResetRoom = false }) => {
  if (isResetRoom) roomsToEdit.rooms = [];
  roomsToEdit.toPrice = null;
  roomsToEdit.toType = '';
  roomsToEdit.toFees = [];
};

// Watch for the room type change and update the price accordingly
watch(
  () => roomsToEdit.toType,
  () => {
    roomsToEdit.toPrice = getRoomType(roomsToEdit.toType)?.price ?? 0;
  },
  { deep: true }
);

const toggleSelectAllRooms = () => {
  if (roomsToEdit.rooms.length === showedRoom.value.length)
    roomsToEdit.rooms = [];
  else roomsToEdit.rooms = showedRoom.value.map((room) => room._id);
};

const toggleSelectAllRoomInFloor = (floor) => {
  const roomsInFloor = showedRoom.value.filter((room) => room.floor === floor);
  if (roomsToEdit.rooms.length === roomsInFloor.length) {
    roomsToEdit.rooms = roomsToEdit.rooms.filter(
      (roomId) => !roomsInFloor.map((room) => room._id).includes(roomId)
    );
  } else {
    roomsToEdit.rooms = [
      ...new Set([
        ...roomsToEdit.rooms,
        ...roomsInFloor.map((room) => room._id),
      ]),
    ];
  }
};

const findRoom = (roomId) => {
  return childData.rooms.find((room) => room._id === roomId);
};

const childData = reactive({
  rooms: [],
});

const toggleCheckbox = (roomId) => {
  // Toggle the checkbox state
  const index = roomsToEdit.rooms.indexOf(roomId);
  if (index === -1) {
    roomsToEdit.rooms.push(roomId);
  } else {
    roomsToEdit.rooms.splice(index, 1);
  }
};

const generateRoomFromNumberOfRoomEachFloor = () => {
  let rooms = [];
  for (let i = 0; i < props.residenceData.numberOfFloor; i++) {
    for (let j = 0; j < props.residenceData.numberOfRoomEachFloor[i]; j++) {
      rooms.push({
        _id: generateRandomObjectId(),
        name: `${i + 1}${(j + 1).toString().padStart(2, '0')}`,
        description: '',
        floor: i + 1,
        type: '',
        roomRentalPrice: '',
        fees: [],
      });
    }
  }
  childData.rooms = rooms;
};

const emitData = () => {
  emit('getData', childData);
};

const setDataFromProps = () => {
  for (const key in props.residenceData) {
    if (key in childData) childData[key] = props.residenceData[key];
  }
};

const searchKeyword = ref('');
const showedRoom = computed(() => {
  return childData.rooms.filter((room) => {
    return room.name.toLowerCase().includes(searchKeyword.value.toLowerCase());
  });
});

onMounted(() => {
  setDataFromProps();
  if (!props.viewOnly) generateRoomFromNumberOfRoomEachFloor();
});

watch(
  childData,
  () => {
    emitData();
  },
  { deep: true }
);

const setRentalPrice = () => {
  console.log('set rental price');
  childData.rooms.forEach((room) => {
    console.log('roomtype', room.type);
    console.log('room prce', getRoomType(room.type));
    room.roomRentalPrice = getRoomType(room.type)?.price ?? 0;
  });
};

const getRoomType = (id) => {
  return props.residenceData.roomTypes.find((roomType) => roomType._id === id);
};

const getFee = (id) => {
  return props.residenceData.fees.find((fee) => fee._id === id);
};
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-lg rounded w-full">
    <div class="">
      <h1 class="text-xl font-semibold text-dark-blue-200">ตั้งค่าห้องพัก</h1>
      <div class="w-full flex align-middle items-center justify-end">
        <label class="label">
          <span class="label-text">ค้นหาห้องพัก:</span>
        </label>
        <input
          type="text"
          placeholder="ค้นหาห้องพัก"
          class="input input-xs input-bordered bg-white rounded"
          v-model="searchKeyword"
        />
      </div>
      <div
        class="flex items-center gap-2 text-sm justify-between"
        v-if="!viewOnly"
      >
        <div class="flex items-center gap-2 text-sm">
          <input
            :checked="roomsToEdit.rooms.length === childData.rooms.length"
            type="checkbox"
            id="selectAll"
            class="checkbox checkbox-primary"
            @change="toggleSelectAllRooms"
          />
          <label for="selectAll" class="label">เลือกทั้งหมด</label>
        </div>

        <Button
          class="btn btn-primary"
          onclick="edit_room_modal.showModal()"
          :disabled="!roomsToEdit.rooms.length"
        >
          แก้ไขห้องที่เลือก
        </Button>
      </div>
      <!-- Rooms -->

      <p v-if="!showedRoom.length" class="text-center w-full col-span-3">
        ไม่มีห้องพักในระบบ
      </p>
      <!-- Floor -->
      <div
        v-for="(_, index) in props.residenceData.numberOfFloor"
        :key="index"
        class="grid grid-cols-3 gap-2 w-full"
      >
        <div class="col-span-3">
          <h2
            class="text-lg font-semibold mb-2"
            v-if="(searchKeyword && showedRoom.length) || !searchKeyword"
          >
            <Divider>ชั้น {{ index + 1 }}</Divider>
            <div class="flex items-center gap-2 text-sm" v-if="!viewOnly">
              <input
                :checked="
                  roomsToEdit.rooms.filter(
                    (roomId) => findRoom(roomId).floor === index + 1
                  ).length ===
                  showedRoom.filter((room) => room.floor === index + 1).length
                "
                type="checkbox"
                :id="`selectAllRoomInFloor${index + 1}`"
                class="checkbox checkbox-primary"
                @change="toggleSelectAllRoomInFloor(index + 1)"
              />
              <label :for="`selectAllRoomInFloor${index + 1}`" class="label"
                >เลือกทั้งชั้น</label
              >
            </div>
          </h2>
        </div>
        <!-- Room in floor -->
        <div
          v-for="(room, index2) in showedRoom.filter(
            (room) => room.floor === index + 1
          )"
          :key="index2"
          class=""
        >
          <div
            :onclick="viewOnly ? `room_modal_${index2}.showModal()` : ''"
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer border border-gray-200 w-full"
            @click="toggleCheckbox(room._id)"
          >
            <div class="flex flex-between items-center">
              <div class="flex-1">
                <h3 class="text-xl font-semibold mb-2">ห้อง {{ room.name }}</h3>
                <p class="text-sm">ชั้น {{ room.floor }}</p>
                <p class="text-sm">
                  ประเภทห้อง:
                  <span v-if="room.type">{{
                    getRoomType(room.type)?.name
                  }}</span>
                  <Badge badgeType="error" class="" v-else
                    >ยังไม่ได้กำหนดประเภทห้อง</Badge
                  >
                </p>
                <p class="text-sm">
                  ค่าเช่า: {{ room.roomRentalPrice || 'ยังไม่ได้กำหนด' }} บาท/เดือน
                </p>
                <p class="text-sm">
                  ค่าบริการ:
                  <span v-if="room.fees.length">{{
                    room.fees.map((fee) => getFee(fee).feename).join(', ')
                  }}</span>
                  <span v-else>ไม่มีค่าบริการอื่น ๆ</span>
                </p>
              </div>
              <input
                v-if="!viewOnly"
                :id="room._id"
                v-model="roomsToEdit.rooms"
                :value="room._id"
                type="checkbox"
                class="checkbox checkbox-primary"
              />
            </div>
          </div>

          <!-- Modal -->
          <dialog :id="`room_modal_${index2}`" class="modal">
            <div class="modal-box space-y-2">
              <h3 class="font-bold text-lg">
                รายละเอียดห้อง : {{ room.name }}
              </h3>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="label">
                    <span class="text-base label-text">ชื่อห้อง </span>
                  </label>
                  <input
                    :disabled="true"
                    type="text"
                    placeholder="ชื่อห้อง"
                    class="input input-bordered bg-white input-sm rounded-sm"
                    v-model="room.name"
                  />
                </div>

                <div>
                  <label class="label">
                    <span class="text-base label-text"
                      >ประเภทห้อง <span class="text-red-500">*</span>
                    </span>
                  </label>
                  <select
                    :disabled="viewOnly"
                    class="select select-bordered w-full max-w-xs select-sm bg-white input-sm rounded-sm"
                    v-model="room.type"
                  >
                    <option value="">เลือกประเภทห้อง</option>
                    <option
                      v-for="roomType in props.residenceData.roomTypes"
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
                    :disabled="viewOnly"
                    type="number"
                    min="0"
                    placeholder="ชั้น"
                    class="input input-bordered bg-white input-sm rounded-sm"
                    v-model="room.floor"
                  />
                </div>

                <div>
                  <label class="label">
                    <span class="text-base label-text"
                      >ค่าเช่าบาท/เดือน <span class="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    :disabled="viewOnly"
                    type="number"
                    min="0"
                    placeholder="ค่าเช่าบาท/เดือน"
                    class="input input-bordered bg-white input-sm rounded-sm"
                    v-model="room.roomRentalPrice"
                  />
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
                        :disabled="viewOnly"
                        type="checkbox"
                        :id="index + fee._id"
                        :value="fee._id"
                        v-model="room.fees"
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
                  <!-- if there is a button in form, it will close the modal -->
                  <button class="btn btn-sm btn-secondary" v-if="!viewOnly">
                    บันทึกข้อมูล
                  </button>
                  <button class="btn btn-sm" v-else>ปิด</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>

    <!-- Button to edit -->
    <div class="flex justify-between mt-5" v-if="!viewOnly">
      <p class="text-gray-500 text-sm">กรุณาตั้งประเภทห้องให้ครบทุกห้อง</p>
      <Button
        class="btn btn-primary"
        onclick="edit_room_modal.showModal()"
        :disabled="!roomsToEdit.rooms.length"
      >
        แก้ไขห้องที่เลือก
      </Button>
    </div>

    <!-- Modal to edit -->
    <dialog id="edit_room_modal" class="modal">
      <div class="modal-box space-y-2">
        <h3 class="font-bold text-lg">ตั้งค่าห้องพัก</h3>
        <div class="grid grid-cols-1 gap-2">
          <div>
            <label class="label">
              <span class="text-base label-text"
                >ห้องที่เลือกทั้งหมด:
                {{
                  roomsToEdit.rooms.map((id) => findRoom(id).name).join(', ')
                }}
              </span>
            </label>
          </div>

          <div>
            <label class="label">
              <span class="text-base label-text"
                >ประเภทห้อง <span class="text-red-500">*</span>
              </span>
            </label>
            <select
              v-model="roomsToEdit.toType"
              :disabled="viewOnly"
              class="select select-bordered w-full max-w-xs select-sm bg-white input-sm rounded-sm"
            >
              <option value="">เลือกประเภทห้อง</option>
              <option
                v-for="roomType in props.residenceData.roomTypes"
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
                >ค่าเช่าบาท/เดือน <span class="text-red-500">*</span>
              </span>
            </label>
            <input
              v-model="roomsToEdit.toPrice"
              :disabled="viewOnly"
              type="number"
              min="0"
              placeholder="ค่าเช่าบาท/เดือน"
              class="input input-bordered bg-white input-sm rounded-sm"
            />
          </div>

          <div>
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
                  :disabled="viewOnly"
                  type="checkbox"
                  v-model="roomsToEdit.toFees"
                  :id="index + fee._id"
                  :value="fee._id"
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
          <button
            class="btn btn-sm"
            onclick="edit_room_modal.close()"
            @click="resetRoomToEdit"
          >
            ยกเลิก
          </button>
          <button
            class="btn btn-sm btn-secondary"
            onclick="edit_room_modal.close()"
            @click="saveEditRoom"
          >
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped></style>
