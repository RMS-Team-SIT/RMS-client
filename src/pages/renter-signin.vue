<script setup>
import SigninForm from '@/components/form/signin.form.vue';
import { useNotification } from '@kyvg/vue3-notification';
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref, computed, onMounted } from 'vue';
import useVuelidate from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import Button from '@/components/common/button.vue';
import ResidenceServices from '@/services/ResidenceServices';
import { ArrowRightIcon } from '@heroicons/vue/24/outline';
import RenterService from '@/services/RenterService';
import FileService from '@/services/FileService';
import { useUserStore } from '@/stores/user.store';

const store = useUserStore();
const router = useRouter();
const route = useRoute();
const { notify } = useNotification();
const residenceId = route.params.residenceId;
const isLoading = ref(true);
const residence = ref({
  name: '',
});

const formData = reactive({
  username: '',
  password: '',
  residenceId: residenceId,
});

const rules = computed(() => {
  const requiredMsg = helpers.withMessage('กรุณากรอกข้อมูล', required);
  return {
    username: {
      required: requiredMsg,
    },
    password: {
      required: requiredMsg,
    },
  };
});
const validator = useVuelidate(rules, formData);

const validateErrorMsg = (field) => {
  return validator.value[field].$error
    ? '* ' + validator.value[field].$errors[0].$message
    : '';
};

const handleFormData = async () => {
  isLoading.value = true;
  const result = await validator.value.$validate();
  console.log('result', result);
  if (!result) {
    isLoading.value = false;
    return;
  }
  const response = await RenterService.signIn(formData);
  if (response.status === 200) {
    let data = await response.json();

    localStorage.setItem('token', data.access_token);
    store.fetchUserData();

    notify({
      group: 'tr',
      title: 'สำเร็จ',
      text: 'เข้าสู่ระบบสำเร็จ',
      type: 'success',
    });

    router.push({ name: 'renter-dashboard' });
  } else {
    let data = await response.json();
    console.log(data);
    notify({
      group: 'tr',
      title: 'ไม่สามารถเข้าสู่ระบบได้',
      text: data?.message,
      type: 'error',
    });
    store.clearUser();
  }
  isLoading.value = false;
};

const fetchResidence = async () => {
  const response = await ResidenceServices.fetchResidencePublic(residenceId);
  if (response.status === 200) {
    const data = await response.json();
    residence.value = data;
    console.log('residence', residence.value);
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถดึงข้อมูลหอพักได้',
      type: 'error',
    });
    router.push({ name: 'home' });
  }
};

onMounted(async () => {
  await fetchResidence();
  setBgImg();
  isLoading.value = false;
});

const bgImg = ref('');
const setBgImg = () => {
  if (residence.value && residence.value?.images?.length > 0)
    bgImg.value = FileService.getFile(residence.value.images[0]);
  else bgImg.value = '/5.jpg';
};
</script>

<template>
  <Loading v-if="isLoading" class="min-h-screen w-full" />
  <div v-else class="flex h-screen">
    <div
      class="flex-1 bg-cover flex flex-row"
      :style="`background-image: url(${bgImg});`"
    >
      <div class="w-full md:w-1/3 lg:w-1/2">
        <div
          class="relative flex flex-col justify-center min-h-screen overflow-hidden bg-white font-nato"
        >
          <div class="w-full p-20 m-auto bg-white rounded-md lg:max-w-xl">
            <h1 class="text-3xl font-semibold text-dark-blue-200 mb-5">
              เข้าสู่ระบบผู้เช่าของหอพัก {{ residence.name }}<br />
            </h1>
            <form @submit.prevent="handleFormData" class="space-y-4 mb-5">
              <div>
                <label class="label">
                  <span class="text-base label-text">ชื่อผู้ใช้</span>
                </label>
                <input
                  name="text"
                  roles="required"
                  type="text"
                  placeholder="ใส่ชื่อผู้ใช้ของคุณ"
                  class="w-full input input-bordered bg-white input-sm rounded-sm"
                  v-model="formData.username"
                />
                <span class="text-xs text-red-500">
                  {{ validateErrorMsg('username') }}</span
                >
              </div>
              <div>
                <label class="label">
                  <span class="text-base label-text">รหัสผ่าน</span>
                </label>
                <input
                  type="password"
                  placeholder="ใส่รหัสผ่านของคุณ"
                  class="w-full input input-bordered bg-white input-sm rounded-sm"
                  v-model="formData.password"
                />
                <span class="text-xs text-red-500">
                  {{ validateErrorMsg('password') }}</span
                >
              </div>

              <div>
                <p
                  class="text-dark-blue-200 hover:underline hover:cursor-pointer"
                >
                  ลืมรหัสผ่าน ?
                </p>
              </div>
              <div v-if="!isLoading">
                <Button btn-type="primary" class="btn btn-block" type="submit">
                  <ArrowRightIcon class="w-5 h-5" />
                  เข้าสู่ระบบ
                </Button>
              </div>
              <div v-else>
                <Button
                  class="btn btn-block mt-2 disabled"
                  type="disable"
                  disabled
                >
                  กำลังลงชื่อเข้าใช้...
                  <span class="loading loading-dots loading-xs"></span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-cover {
  background-position: center;
}
</style>
