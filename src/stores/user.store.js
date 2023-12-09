import { defineStore } from 'pinia';
import UserService from '@/services/UserServices.js';

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
    async fetchUserData() {
      let token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const response = await UserService.me();
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
