<script setup>
import { onMounted, reactive } from 'vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  residentData: {
    type: Object,
    default: () => ({}),
  },
});

const residentInfo = reactive({
  name: '',
  description: '',
  address: '',
});

const emitData = () => {
  emit('getData', residentInfo);
  console.log('Emitted residentInfo', residentInfo);
};

const setDataFromProps = () => {
  for (const key in props.residentData) {
    if (key in residentInfo) residentInfo[key] = props.residentData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});
</script>

<template>
  <form
    @change="emitData"
    class="relative bg-white p-10 space-y-4 shadow-md rounded"
  >
    <h1 class="text-3xl font-semibold text-dark-blue-200">
      Resident Information
    </h1>
    <p class="text-xs">Please input resident basic information.</p>
    {{ residentInfo }}
    <div>
      <label class="label">
        <span class="text-base label-text"
          >Resident Name <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="Resident Name"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="residentInfo.name"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Resident Description</span>
      </label>
      <textarea
        type="text"
        placeholder="Resident Description"
        class="w-full textarea textarea-bordered rounded-sm"
        v-model="residentInfo.description"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Address</span>
      </label>
      <textarea
        type="text"
        placeholder="Address"
        class="w-full textarea textarea-bordered rounded-sm"
        v-model="residentInfo.address"
      />
    </div>
  </form>
</template>

<style scoped></style>
