<script setup>
import { reactive } from 'vue';

const residentInfo = reactive({
  name: '',
  description: '',
  address: '',
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-3xl font-semibold text-dark-blue-200">
      Resident Information
    </h1>
    <p class="text-xs">Please input resident basic information.</p>
    {{ residentInfo }}
    <div>
      <label class="label">
        <span class="text-base label-text">Resident Name</span>
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
  </div>
</template>

<style scoped></style>
