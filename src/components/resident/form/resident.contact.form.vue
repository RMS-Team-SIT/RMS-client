<script setup>
import { onMounted, reactive, watch } from 'vue';

const emit = defineEmits(['getData']);

const props = defineProps({
  residentData: {
    type: Object,
    default: () => ({}),
  },
  viewOnly: {
    type: Boolean,
    default: false,
  },
});

const residentContact = reactive({
  contact: {
    facebook: '',
    line: '',
    phone: '',
    email: '',
  },
});

const emitData = () => {
  emit('getData', residentContact);
  console.log('Emitted residentContact', residentContact);
};

const setDataFromProps = () => {
  for (const key in props.residentData) {
    if (key in residentContact) residentContact[key] = props.residentData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(residentContact, () => {
  emitData();
});
</script>

<template>
  <form
    class="relative bg-white p-10 space-y-4 shadow-md rounded"
  >
    <h1 class="text-3xl font-semibold text-dark-blue-200">Resident Contact</h1>
    <p class="text-xs">Please input resident contact information.</p>
    {{ residentContact }}
    <div>
      <label class="label">
        <span class="text-base label-text">Facebook</span>
      </label>
      <input
        type="text"
        placeholder="Facebook"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="residentContact.contact.facebook"
        :disabled="viewOnly"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Line</span>
      </label>
      <input
        type="text"
        placeholder="Line"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="residentContact.contact.line"
        :disabled="viewOnly"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Phone</span>
      </label>
      <input
        type="text"
        placeholder="Phone"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="residentContact.contact.phone"
        :disabled="viewOnly"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">Email</span>
      </label>
      <input
        type="email"
        placeholder="Email Address"
        class="w-full input input-bordered input-sm rounded-sm"
        v-model="residentContact.contact.email"
        :disabled="viewOnly"
      />
    </div>
  </form>
</template>

<style scoped></style>
