<script setup>
import Button from '@/components/common/button.vue';
import { validatePDFFile } from '@/utils/file';
import { onMounted, reactive, watch } from 'vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  renterData: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
});

const renterFiles = reactive({
  image: { fileName: null, file: null, isEdited: false },
  copyOfIdCard: { fileName: null, file: null, isEdited: false },
  renterContract: { fileName: null, file: null, isEdited: false },
});

const resetRenterFile = (field) => {
  renterFiles[field] = { fileName: null, file: null, isEdited: false };
};

const emitData = () => {
  emit('getData', renterFiles);
};

const setDataFromProps = () => {
  for (const key in props.renterData) {
    if (key in renterFiles) renterFiles[key] = props.renterData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(renterFiles, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">
      ไฟล์เกี่ยวกับผู้เช่า
    </h1>
    <p class="text-xs">กรุณาป้อนข้อมูลไฟล์ของผู้เช่า</p>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >สำเนาบัตรประชาชน
          <span class="text-red-500">(นามสกุลไฟล์ pdf เท่านั้น)</span>
        </span>
      </label>
      <input
        v-if="!viewOnly"
        type="file"
        @change="
          (e) => {
            if (validatePDFFile(e.target.files[0]))
              renterFiles.copyOfIdCard.file = e.target.files[0];
          }
        "
        multiple
        class="file-input-sm file-input file-input-bordered bg-white w-full max-w-xs file-input-ghost"
      />
      <!-- Preview file name if exist -->
      <div
        v-if="
          renterFiles.copyOfIdCard?.file || renterFiles.copyOfIdCard?.fileName
        "
        class="mt-2"
      >
        <span class="text-sm text-gray-500">
          {{
            renterFiles.copyOfIdCard.file?.name ||
            renterFiles.copyOfIdCard?.fileName
          }}
          <Button
            btn-type="ghost"
            class="font-xs"
            @click="resetRenterFile('copyOfIdCard')"
            v-if="!viewOnly"
            >ลบไฟล์</Button
          >
        </span>
      </div>
      <div v-else>
        <span class="text-sm text-gray-500">ยังไม่มีไฟล์ที่ถูกเลือก</span>
      </div>
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >สัญญาเช่า
          <span class="text-red-500">(นามสกุลไฟล์ pdf เท่านั้น)</span>
        </span>
      </label>
      <input
        v-if="!viewOnly"
        type="file"
        @change="
          (e) => {
            if (validatePDFFile(e.target.files[0]))
              renterFiles.renterContract.file = e.target.files[0];
          }
        "
        multiple
        class="file-input-sm file-input file-input-bordered bg-white w-full max-w-xs file-input-ghost"
      />
      <!-- Preview file name if exist -->
      <div
        v-if="
          renterFiles.renterContract?.file ||
          renterFiles.renterContract?.fileName
        "
        class="mt-2"
      >
        <span class="text-sm text-gray-500">
          {{
            renterFiles.renterContract.file?.name ||
            renterFiles.renterContract?.fileName
          }}
          <Button
            btn-type="ghost"
            class="font-xs"
            v-if="!viewOnly"
            @click="resetRenterFile('renterContract')"
            >ลบไฟล์</Button
          >
        </span>
      </div>
      <div v-else>
        <span class="text-sm text-gray-500">ยังไม่มีไฟล์ที่ถูกเลือก</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
