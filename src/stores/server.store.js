import ServerService from '@/services/ServerService';
import { defineStore } from 'pinia';

export const useServerStore = defineStore({
  id: 'server',
  state: () => ({
    up: true,
  }),
  getters: {
    getStatus: (state) => {
      return { up: state.up };
    },
  },
  actions: {
    async fetch() {
      try {
        const response = await ServerService.fetchServerStatus();
        if (response.status === 200) {
          this.up = true;
        }
      } catch (error) {
        this.up = false;
      }
    },
  },
});
