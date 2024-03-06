<script setup>
import { useNotification } from '@kyvg/vue3-notification';
import { onMounted, reactive, ref, watch } from 'vue';
import BankIcon from '@/components/common/bank-icon.vue';
import { generateRandomObjectId } from '@/utils/mongo';
import ImageUploadForm from '@/components/form/image.form.vue';
import ImagePreview from '@/components/common/image.preview.vue';
import FileService from '@/services/FileService';

const emit = defineEmits(['getData']);
const { notify } = useNotification();
const props = defineProps({
  viewOnly: {
    type: Boolean,
    default: false,
  },
  banks: {
    type: Array,
    default: () => [],
  },
  residenceData: {
    type: Object,
    default: () => ({}),
  },
});

const childData = reactive({
  roomTypes: [],
});
const temp = reactive({
  name: '',
  type: '',
  size: '',
  price: '',
  description: '',
  images: [],
  imageFiles: [],
});

const shouldRenderUploadForm = ref(false);
function forceImageUploadFormRerender() {
  shouldRenderUploadForm.value = !shouldRenderUploadForm.value; // Toggle the value to trigger re-render
}

const add = async () => {
  if (!temp.name || !temp.size || !temp.price || !temp.description) {
    console.log('error');
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'โปรดกรอกข้อมูลให้ครบถ้วน',
      type: 'error',
    });
    return;
  }
  if(temp.size <= 0 || temp.price <= 0) {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ขนาดห้องและราคาต้องมากกว่า 0',
      type: 'error',
    });
    return;
  }
  if (childData.roomTypes.find((roomType) => roomType.name === temp.name)) {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ชื่อประเภทห้องพักซ้ำกับที่มีอยู่แล้ว',
      type: 'error',
    });
    return;
  }

  // TODO: upload image
  // Upload images if imageFiles not empty
  if (temp.imageFiles.length) {
    const response = await FileService.uploadImages(temp.imageFiles);
    if (response.status == 201) {
      const data = await response.json();
      Array.from(data.files).forEach((file) => {
        temp.images.push(file.fileName);
      });
    } else {
      const data = await response.json();
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามาถอัปโหลดรูปภาพได้' + data?.message,
        type: 'error',
      });
      return;
    }
  }
  forceImageUploadFormRerender();
  childData.roomTypes.push({
    _id: generateRandomObjectId(),
    ...temp,
    imageFiles: null,
  });

  notify({
    group: 'tr',
    title: 'เพิ่มประเภทห้องพักสำเร็จ',
    text: 'เพิ่มประเภทห้องพักสำเร็จ',
    type: 'success',
  });

  temp.name = '';
  temp.size = '';
  temp.price = '';
  temp.description = '';
  (temp.images = []), (temp.imageFiles = []);
};

const remove = (index) => {
  childData.roomTypes.splice(index, 1);
  notify({
    group: 'tr',
    title: 'ลบประเภทห้องพักสำเร็จ',
    text: 'ลบประเภทห้องพักสำเร็จ',
    type: 'success',
  });
};

const findBank = (bankId) => {
  return props.banks.find((bank) => bank._id === bankId);
};

const emitData = () => {
  emit('getData', childData);
};

const setDataFromProps = () => {
  for (const key in props.residenceData) {
    if (key in childData) childData[key] = props.residenceData[key];
  }
};

const getChildData = (data) => {
  for (const key in data) {
    temp[key] = data[key];
  }
};

const getImageUrl = (fileName) => {
  return FileService.getFile(fileName);
};

onMounted(() => {
  setDataFromProps();
});

watch(childData, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">ประเภทห้องพัก</h1>
    <p class="text-xs">ประเภทห้องพักในหอพักของคุณ</p>
    <div class="flex flex-col lg:flex-row gap-5" v-if="!viewOnly">
      <div>
        <label class="label">
          <span class="text-base label-text"
            >ประเภท <span class="text-red-500">*</span>
          </span>
        </label>
        <input
          type="text"
          placeholder="ชื่อประเภท"
          class="input input-bordered bg-white input-sm rounded-sm"
          v-model="temp.name"
        />
        <p class="text-xs text-gray-500">เช่น สตูดิโอ, 1 ห้องนอน</p>
      </div>

      <div>
        <label class="label">
          <span class="text-base label-text"
            >ขนาดห้อง (ตร.ม.) <span class="text-red-500">*</span>
          </span>
        </label>
        <input
          type="number"
          min="0"
          placeholder="ขนาดห้อง (ตร.ม.)"
          class="input input-bordered bg-white input-sm rounded-sm"
          v-model="temp.size"
        />
        <p class="text-xs text-gray-500">เช่น 10 ตร.ม. (กรอกเฉพาะตัวเลข)</p>
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
          v-model="temp.price"
        />
      </div>
    </div>
    <div v-if="!viewOnly">
      <label class="label">
        <span class="text-base label-text"
          >รายละเอียด <span class="text-red-500">*</span>
        </span>
      </label>
      <textarea
        placeholder="รายละเอียดของห้อง"
        class="w-full textarea textarea-bordered rounded-sm bg-white"
        v-model="temp.description"
      ></textarea>
      <p class="text-xs text-gray-500">
        เช่น ขนาดเตียง, สัดส่วนภายในห้อง, จำนวนห้องน้ำ, จำนวนห้องนอน
      </p>
    </div>
    <div v-if="!viewOnly">
      <label class="label">
        <span class="text-base label-text">รูปภาพห้อง </span>
      </label>
      <ImageUploadForm
        @getImageFiles="getChildData"
        :imageFiles="temp?.imageFiles"
        maxFiles="5"
        maxSizeOfEachFile="5"
        :key="shouldRenderUploadForm"
      />
    </div>

    <div class="flex items-center justify-end" v-if="!viewOnly">
      <button
        class="btn btn-primary btn-sm"
        @click="add"
        :disabled="props.viewOnly"
      >
        เพิ่ม
      </button>
    </div>

    <div
      class="collapse bg-gray-100"
      v-for="(roomtype, index) in childData.roomTypes"
      :key="index"
    >
      <input type="checkbox" />
      <div class="collapse-title text-base font-semibold">
        ประเภทห้อง: {{ roomtype.name }}
        <p class="text-xs text-gray-500">กดเพื่อดู</p>
      </div>
      <div class="collapse-content">
        <p class="">รายละเอียด: {{ roomtype.description }}</p>
        <div class="">
          <p class="text-base">ขนาดห้อง: {{ roomtype.size }} ตร.ม.</p>
        </div>
        <div class="">
          <p class="text-base">ค่าเช่า: {{ roomtype.price }} บาท/เดือน</p>
        </div>
        <ImagePreview
          :imageUrls="roomtype.images.map((i) => getImageUrl(i))"
          preview-from="url"
        />

        <button
          v-if="!props.viewOnly"
          @click="remove(index)"
          class="btn btn-sm btn-secondary w-min"
        >
          ลบ
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
