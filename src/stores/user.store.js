import { defineStore } from 'pinia';
import { me } from '@/services/userServices';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    isLoggedIn: false,
    user: {
      id: '',
      email: '',
      firstname: '',
      lastname: '',
      phone: '',
      role: '',
    },
  }),
  getters: {
    getUser: (state) => {
      return {
        ...state.user,
        fullname: `${state.user.firstname} ${state.user.lastname}`,
        isLoggedIn: state.isLoggedIn,
      };
    },
  },
  actions: {
    async fetchMe() {
      const response = await me();
      if (response.status === 200) {
        const data = await response.json();
        this.user = data;
        this.isLoggedIn = true;
      }
    },
    async clearUser() {
      this.isLoggedIn = false;
      this.user = {
        id: '',
        email: '',
        firstname: '',
        lastname: '',
        phone: '',
        role: '',
      };
    },
  },
});
