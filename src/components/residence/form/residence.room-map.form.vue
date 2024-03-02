<script setup>
import { useNotification } from '@kyvg/vue3-notification';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import BankIcon from '@/components/common/bank-icon.vue';
import { HomeIcon } from '@heroicons/vue/24/outline';
import { generateRandomObjectId } from '@/utils/mongo';

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
        name: `ห้อง ${i + 1}${(j + 1).toString().padStart(2, '0')}`,
        description: '',
        floor: i + 1,
        type: '',
        roomRentalPrice: props.residenceData.roomRentalPrice,
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

watch(childData, () => {
  emitData();
});
</script>

<template>
  <div class="shadow-md rounded">
    <div class="bg-white p-10 space-y-4">
      <h1 class="text-xl font-semibold text-dark-blue-200">ตั้งค่าห้องพัก</h1>
      <p class="text-xs">ตั้งค่าห้องพักโดยการกดที่การ์ด</p>

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
      <!-- Floor -->
      <div class="grid grid-cols-3 gap-2 w-full">
        <div v-for="(room, index) in showedRoom" :key="index">
          <!-- Card -->
          <div
            :onclick="`room_modal_${index}.showModal()`"
            class="p-6 bg-white rounded-lg shadow-md hover:bg-light-red hover:text-white hover:cursor-pointer border border-gray-200 w-full"
          >
            <div class="flex flex-between items-center">
              <div class="flex-1">
                <h3 class="text-xl font-semibold mb-2">{{ room.name }}</h3>
                <p class="text-sm">กดเพื่อแก้ไขห้อง</p>
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
                  <input
                    type="text"
                    placeholder="ประเภทห้อง"
                    class="input input-bordered bg-white input-sm rounded-sm"
                    v-model="room.type"
                  />
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

                <div>
                  <label class="label">
                    <span class="text-base label-text"
                      >บริการต่าง ๆ ที่ใช้ <span class="text-red-500">*</span>
                    </span>
                  </label>
                  <div
                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2"
                  >
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
                        {{ fee.feename }} {{ fee.feeprice }} บาท
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
