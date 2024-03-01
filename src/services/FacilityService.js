import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class FacilityService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  fetchFacilities = async () => sendRequest(this.baseUrl, '/facility', 'GET');
}

export default new FacilityService();
