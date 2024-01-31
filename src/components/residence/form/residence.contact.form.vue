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
  userPersonalData: {
    type: Object,
    default: () => ({
      email: 'test@test.com',
      phone: '0812345678',
    }),
    required: false,
  },
});

const residenceContact = reactive({
  contact: {
    facebook: '',
    line: '',
    phone: '',
    email: '',
  },
});

const emitData = () => {
  emit('getData', residenceContact);
};

const setDataFromProps = () => {
  for (const key in props.residenceData) {
    if (key in residenceContact)
      residenceContact[key] = props.residenceData[key];
  }
};

onMounted(() => {
  setDataFromProps();
});

watch(residenceContact, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">ข้อมูลการติดต่อ</h1>
    <p class="text-xs">โปรดใส่ข้อมูลการติดต่อ</p>
    <div>
      <label class="label">
        <span class="text-base label-text">Facebook</span>
      </label>
      <input
        type="text"
        placeholder="Facebook"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="residenceContact.contact.facebook"
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
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="residenceContact.contact.line"
        :disabled="viewOnly"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">เบอร์โทรศัพท์</span>
      </label>
      <input
        type="text"
        placeholder="เบอร์โทรศัพท์"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="residenceContact.contact.phone"
        :disabled="viewOnly"
      />
    </div>
    <div>
      <label class="label">
        <span class="text-base label-text">อีเมล</span>
      </label>
      <input
        type="email"
        placeholder="อีเมล"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="residenceContact.contact.email"
        :disabled="viewOnly"
      />
    </div>
  </div>
</template>

<style scoped></style>
