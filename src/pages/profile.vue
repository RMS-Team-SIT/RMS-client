<script setup>
import Breadcrumb from '@/components/common/breadcrumb.vue';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { me } from '@/services/userServices';
import Loading from '@/components/common/loading.vue';
import blankprofileImg from '@/assets/img/blank-profile.webp';
import { useNotification } from '@kyvg/vue3-notification';
import UserInfoForm from '@/components/form/user.info.form.vue';
import UserPasswordFormVue from '@/components/form/user.password.form.vue';
import { getDate } from '@/utils';

const isLoading = ref(true);
const { notify } = useNotification();

const userData = reactive({
  data: {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
  },
});

const updateUser = async (data) => {
  console.log(data);
};


onMounted(async () => {
  const response = await me();
  if (response.status === 200) {
    let user = await response.json();
    userData.data = user;
  } else {
    notify({
      group: 'tr',
      title: 'Error',
      text: 'Failed to fetch user data',
      type: 'error',
    });
  }
  isLoading.value = false;
});
</script>

<template>
  <Loading v-if="isLoading" />
  <div v-else class="card w-full glass">
    <div class="card-body px-40">
      <div class="flex flex-row justify-between">
        <Breadcrumb
          :pathList="[
            { name: 'Home', pathName: 'home' },
            { name: 'Profile', pathName: 'profile' },
          ]"
        />
      </div>

      <div class="flex gap-4 mb-2">
        <div class="bg-white basis-1/3 p-10 shadow-lg rounded-lg">
          <p class="text-center font-bold text-lg">Siriwat Jaiyungyuen</p>
          <div class="avatar">
            <div class="w-[50%] rounded-full">
              <img :src="blankprofileImg" />
            </div>
          </div>
          <p>Member since : {{ getDate(userData.data.created_at) }}</p>
        </div>
        <div class="basis-2/3">
          <UserInfoForm :userData="userData.data" @submit-data="updateUser" />
          <UserPasswordFormVue @submit-data="updateUser" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
