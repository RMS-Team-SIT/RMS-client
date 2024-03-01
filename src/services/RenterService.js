import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class RenterService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  signIn = async (data) =>
    sendRequest(this.baseUrl, '/auth/renter-signin', 'POST', data);
}

export default new RenterService();
