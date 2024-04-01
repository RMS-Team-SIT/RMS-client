import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class RMSConfigService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  fetchConfig = async () =>
    sendRequest(this.baseUrl, `/configs`, 'GET');

}

export default new RMSConfigService();
