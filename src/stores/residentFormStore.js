import { defineStore } from 'pinia';

export const useResidentFormStore = defineStore({
  id: 'residentForm',
  state: () => ({
    name: '',
    description: '',
    images: [],
    address: '',
    contact: {
      facebook: '',
      line: '',
      phone: '',
      email: '',
    },
    defaultWaterPriceRate: 0.0,
    defaultLightPriceRate: 0.0,
    rooms: [],
  }),
  getters: {
    getResident: (state) => {
      return {
        name: state.name,
        description: state.description,
        images: state.images,
        address: state.address,
        contact: state.contact,
        defaultWaterPriceRate: state.defaultWaterPriceRate,
        defaultLightPriceRate: state.defaultLightPriceRate,
        rooms: state.rooms,
      };
    },
  },
  actions: {
    setName(name) {
      this.name = name;
    },
    setAddress(address) {
      this.address = address;
    },
    setDescription(description) {
      this.description = description;
    },
    setImages(images) {
      this.images = images;
    },
    setContact(contact) {
      this.contact = contact;
    },
    setDefaultWaterPriceRate(defaultWaterPriceRate) {
      this.defaultWaterPriceRate = defaultWaterPriceRate;
    },
    setDefaultLightPriceRate(defaultLightPriceRate) {
      this.defaultLightPriceRate = defaultLightPriceRate;
    },
    setRooms(rooms) {
      this.rooms = rooms;
    },
    reset() {
      this.name = '';
      this.description = '';
      this.images = [];
      this.contact = {
        facebook: '',
        line: '',
        phone: '',
        email: '',
        address: '',
      };
      this.defaultWaterPriceRate = 0.0;
      this.defaultLightPriceRate = 0.0;
      this.rooms = [];
    },
  },
});
