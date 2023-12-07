<script setup>
import Button from '@/components/common/button.vue';
import { onMounted, reactive, watch } from 'vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  rentalData: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
});

const rentalFiles = reactive({
  image: { fileName: null, file: null, isEdited: false },
  copyOfIdCard: { fileName: null, file: null, isEdited: false },
  rentalContract: { fileName: null, file: null, isEdited: false },
});

const resetRentalFile = (field) => {
  rentalFiles[field] = { fileName: null, file: null, isEdited: false };
};

const emitData = () => {
  emit('getData', rentalFiles);
};

const setDataFromProps = () => {
  for (const key in props.rentalData) {
    if (key in rentalFiles) rentalFiles[key] = props.rentalData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(rentalFiles, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-3xl font-semibold text-dark-blue-200">
      Rental Information
    </h1>
    <p class="text-xs">Please input rental basic information.</p>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Rental Copy Of Id Card <span class="text-red-500">(pdf only)</span>
        </span>
      </label>
      <input
        v-if="!viewOnly"
        type="file"
        @change="(e) => (rentalFiles.copyOfIdCard.file = e.target.files[0])"
        multiple
        class="file-input file-input-bordered w-full max-w-xs file-input-ghost"
      />
      <!-- Preview file name if exist -->
      <div
        v-if="
          rentalFiles.copyOfIdCard?.file || rentalFiles.copyOfIdCard?.fileName
        "
        class="mt-2"
      >
        <span class="text-sm text-gray-500">
          {{
            rentalFiles.copyOfIdCard.file?.name ||
            rentalFiles.copyOfIdCard?.fileName
          }}
          <Button
            btn-type="ghost"
            class="font-xs"
            @click="resetRentalFile('copyOfIdCard')"
            v-if="!viewOnly"
            >Remove file</Button
          >
        </span>
      </div>
      <div v-else>
        <span class="text-sm text-gray-500">No file selected.</span>
      </div>
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >Rental Contract <span class="text-red-500">(pdf only)</span>
        </span>
      </label>
      <input
        v-if="!viewOnly"
        type="file"
        @change="(e) => (rentalFiles.rentalContract.file = e.target.files[0])"
        multiple
        class="file-input file-input-bordered w-full max-w-xs file-input-ghost"
      />
      <!-- Preview file name if exist -->
      <div
        v-if="
          rentalFiles.rentalContract?.file ||
          rentalFiles.rentalContract?.fileName
        "
        class="mt-2"
      >
        <span class="text-sm text-gray-500">
          {{
            rentalFiles.rentalContract.file?.name ||
            rentalFiles.rentalContract?.fileName
          }}
          <Button
            btn-type="ghost"
            class="font-xs"
            v-if="!viewOnly"
            @click="resetRentalFile('rentalContract')"
            >Remove file</Button
          >
        </span>
      </div>
      <div v-else>
        <span class="text-sm text-gray-500">No file selected.</span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
