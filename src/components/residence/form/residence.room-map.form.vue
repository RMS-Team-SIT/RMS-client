<script setup>
import { useNotification } from '@kyvg/vue3-notification';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import BankIcon from '@/components/common/bank-icon.vue';
import { HomeIcon } from '@heroicons/vue/24/outline';
import { generateRandomObjectId } from '@/utils/mongo';
import Badge from '@/components/common/badge.vue';

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

const childData = reactive({
  rooms: [],
});

const temp = reactive({
  name: '',
  type: '',
  description: '',
  floor: 1,
  roomRentalPrice: 0,
  fees: [],
});

const add = () => {};

const remove = (index) => {
  childData.rooms.splice(index, 1);
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
  generateRoomFromNumberOfRoomEachFloor();
});

watch(
  childData,
  () => {
    setRentalPrice();
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
  <div class="shadow-md rounded">
    <div class="bg-white p-10 space-y-4">
      <h1 class="text-xl font-semibold text-dark-blue-200">ตั้งค่าห้องพัก</h1>
      <!-- <p class="text-xs">ตั้งค่าห้องพักโดยการกดที่การ์ด</p> -->

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
      <!-- Rooms -->
      <div class="grid grid-cols-3 gap-2 w-full">
        <p v-if="!showedRoom.length" class="text-center w-full col-span-3">
          ไม่มีห้องพักในระบบ
        </p>
        <div v-for="(room, index) in showedRoom" :key="index">
          <!-- Card -->
          <div
            :onclick="`room_modal_${index}.showModal()`"
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer border border-gray-200 w-full"
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
                  ค่าเช่า: {{ room.roomRentalPrice }} บาท/เดือน
                </p>
                <p class="text-sm">
                  ค่าบริการ:
                  <span v-if="room.fees.length">{{
                    room.fees.map((fee) => getFee(fee).feename).join(', ')
                  }}</span>
                  <span v-else
                    >ไม่มีค่าบริการอื่น ๆ</span
                  >
                </p>
              </div>
              <HomeIcon class="h-5 w-5 inline-block" />
            </div>
          </div>

          <!-- Modal -->
          <dialog :id="`room_modal_${index}`" class="modal">
            <div class="modal-box space-y-2">
              <h3 class="font-bold text-lg">
                รายละเอียดห้อง : {{ room.name }}
              </h3>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="label">
                    <span class="text-base label-text"
                      >ชื่อห้อง <span class="text-red-500">*</span>
                    </span>
                  </label>
                  <input
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
                      >เพิ่มลดค่าบริการ <span class="text-red-500">*</span>
                    </span>
                  </label>
                  <p class="p-2" v-if="!props.residenceData.fees.length">
                    ไม่มีค่าบริการเพิ่มเติมในหอพัก
                  </p>
                  <div class="grid grid-cols-1 md:grid-cols-2">
                    <div
                      v-for="(fee, index) in props.residenceData.fees"
                      :key="index"
                      class="flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        :id="fee._id"
                        :value="fee._id"
                        v-model="room.fees"
                        class="checkbox checkbox-primary"
                      />
                      <label :for="fee._id" class="label text-sm">
                        {{ fee.feename }} : {{ fee.feeprice }} บาท
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div class="modal-action flex">
                <form method="dialog">
                  <!-- if there is a button in form, it will close the modal -->
                  <button class="btn btn-success btn-sm">บันทึกข้อมูล</button>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
