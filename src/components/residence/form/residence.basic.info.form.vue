<script setup>
import { onMounted, reactive, watch } from 'vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  residenceData: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
});

const residenceInfo = reactive({
  name: '',
  description: '',
  address: '',
});

const emitData = () => {
  emit('getData', residenceInfo);
};

const setDataFromProps = () => {
  for (const key in props.residenceData) {
    if (key in residenceInfo) residenceInfo[key] = props.residenceData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(residenceInfo, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">
      Residence Information
    </h1>
    <p class="text-xs">Please input residence basic information.</p>
    <div>
      <label class="label">
        <span class="text-base label-text"
          >Residence Name <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Residence Name"
        class="w-full input input-bordered bg-white  input-sm rounded-sm"
        v-model="residenceInfo.name"
        :disabled="viewOnly"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Residence Description</span>
      </label>
      <textarea
        type="text"
        placeholder="Residence Description"
        class="w-full textarea textarea-bordered rounded-sm bg-white"
        v-model="residenceInfo.description"
        :disabled="viewOnly"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Address</span>
      </label>
      <textarea
        type="text"
        placeholder="Address"
        class="w-full textarea textarea-bordered rounded-sm bg-white"
        v-model="residenceInfo.address"
        :disabled="viewOnly"
      />
    </div>
  </div>
</template>

<style scoped></style>
