import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class ServerService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  fetchServerStatus = async () => sendRequest(this.baseUrl, '/health', 'GET');
}

export default new ServerService();
