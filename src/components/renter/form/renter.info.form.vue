<script setup>
import Button from '@/components/common/button.vue';
import { onMounted, reactive, watch } from 'vue';
import { generatePassword } from '@/utils/password';
import Divider from '@/components/common/divider.vue';

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

const renterInfo = reactive({
  firstname: '',
  lastname: '',
  username: '',
  phone: '',
  password: '',
});

const emitData = () => {
  emit('getData', renterInfo);
};

const setDataFromProps = () => {
  for (const key in props.renterData) {
    if (key in renterInfo) renterInfo[key] = props.renterData[key];
  }
};

const generateAndSetPassword = () => {
  const password = generatePassword(6);
  renterInfo.password = password;
};

onMounted(() => {
  setDataFromProps();
});

watch(renterInfo, () => {
  emitData();
});
</script>

<template>
  <div class="relative bg-white p-10 space-y-4 shadow-md rounded">
    <h1 class="text-xl font-semibold text-dark-blue-200">ข้อมูลผู้เช่า</h1>
    <p class="text-xs">กรุณาป้อนข้อมูลพื้นฐานของผู้เช่า</p>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >ชื่อผู้เช่า <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="ชื่อ"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="renterInfo.firstname"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >นามสกุล <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="นามสกุล"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="renterInfo.lastname"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >หมายเลขโทรศัพท์ <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="หมายเลขโทรศัพท์"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="renterInfo.phone"
        :disabled="viewOnly"
      />
    </div>

    <h1 class="text-xl mt-5 font-semibold text-dark-blue-200">ข้อมูลบัญชีของผู้เช่า</h1>
    <p class="text-xs">สร้างข้อมูลบัญชีของผู้เช่า เพื่อให้ผู้เช่าสามาถเข้าสู่ระบบของคุณ </p>
    <div>
      <label class="label">
        <span class="text-base label-text"
          >ชื่อผู้ใช้ <span class="text-red-500">*</span>
        </span>
      </label>
      <input
        type="text"
        placeholder="ชื่อผู้ใช้"
        class="w-full input input-bordered bg-white input-sm rounded-sm"
        v-model="renterInfo.username"
        :disabled="viewOnly"
      />
    </div>

    <div>
      <label class="label">
        <span class="text-base label-text"
          >รหัสผ่าน <span class="text-red-500">*</span>
        </span>
      </label>
      <div class="flex gap-2">
        <input
          type="text"
          placeholder="รหัสผ่าน"
          class="w-full input input-bordered bg-white input-sm rounded-sm"
          v-model="renterInfo.password"
          :disabled="viewOnly"
        />
        <Button
          v-if="!viewOnly"
          btnType="primary-pill"
          @click="generateAndSetPassword"
          >สุ่มรหัสผ่าน</Button
        >
      </div>
      <p class="text-xs text-gray-500 mt-2">
        * ชื่อผู้ใช้และรหัสผ่านของผู้เช่าที่ใช้ในการเข้าสู่ระบบระบบผู้เช่าของคุณ
      </p>
    </div>
  </div>
</template>

<style scoped></style>