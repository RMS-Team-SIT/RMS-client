import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class BankService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  // Residence
  fetchBanks = async () => sendRequest(this.baseUrl, '/bank', 'GET');
}

export default new BankService();
