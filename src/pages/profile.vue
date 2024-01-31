<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import Loading from '@/components/common/loading.vue';
import blankprofileImg from '@/assets/img/bp.webp';
import { useNotification } from '@kyvg/vue3-notification';
import UserInfoForm from '@/components/form/user.info.form.vue';
import UserPasswordFormVue from '@/components/form/user.password.form.vue';
import { getDate } from '@/utils';
import UserService from '@/services/UserServices.js';
import { CameraIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

const isLoading = ref(true);
const router = useRouter();
const { notify } = useNotification();

const userData = reactive({
  data: {
    _id: '',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    oldPassword: '',
    newPassword: '',
  },
});

const updateUser = async (data) => {
  const { _id } = userData.data;

  try {
    const response = await UserService.update(_id, data);

    if (response.ok) {
      const result = await response.json();
      userData.data = result;
      notify({
        group: 'tr',
        title: 'สำเร็จ',
        text: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
        type: 'success',
      });
    } else {
      const result = await response.json();
      console.log(result);
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: `ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้`,
        type: 'error',
      });
    }
  } catch (error) {
    console.error('An error occurred during the update:', error);
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'An unexpected error occurred during the update',
      type: 'error',
    });
  }
};

const updatePassword = async (data) =>{
  console.log(data);
  console.log('upd pass');
  const { _id } = userData.data;

  try {
    const response = await UserService.updatePassword(_id, data);

    if (response.ok) {
      const result = await response.json();
      userData.data = result;
      notify({
        group: 'tr',
        title: 'สำเร็จ',
        text: 'Update user password successful',
        type: 'success',
      });
      // TODO: refresh page
      router.go();
    } else {
      const result = await response.json();
      notify({
        group: 'tr',
        title: 'เกิดข้อผิดพลาด',
        text: `Update user password failed (${response.status}), ${result.message}`,
        type: 'error',
      });
    }
  } catch (error) {
    console.error('An error occurred during the update:', error);
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'An unexpected error occurred during the update',
      type: 'error',
    });
  }
}

onMounted(async () => {
  const response = await UserService.me();
  if (response.status === 200) {
    let user = await response.json();
    userData.data = user;
  } else {
    notify({
      group: 'tr',
      title: 'เกิดข้อผิดพลาด',
      text: 'Failed to fetch user data',
      type: 'error',
    });
  }
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" />
  <div v-else class="card w-full">
    <div class="card-body px-10 md:px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Profile', pathName: 'profile' },
          ]"
        />
      </div>

      <div class="flex gap-4 mb-2">
        <div class="bg-white basis-1/3 p-10 shadow-lg rounded-lg space-y-4">
          <p class="text-center font-bold text-lg">
            {{ userData.data.firstname }} {{ userData.data.lastname }}
          </p>
          <div class="flex justify-center relative" id="profile-img">
            <button
              class="absolute bottom-0 right-10 bg-dark-blue-200 rounded-full p-2 text-white"
            >
              <CameraIcon class="w-6 h-6" />
            </button>
            <img :src="blankprofileImg" class="w-44 rounded-full" />
          </div>
          <p class="text-center text-gray-500">
            เป็นสมาชิกตั้งแต่ : {{ getDate(userData.data.created_at) }}
          </p>
        </div>
        <div class="basis-2/3">
          <UserInfoForm :userData="userData.data" @submit-data="updateUser" />
          <UserPasswordFormVue @submit-data="updatePassword" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
