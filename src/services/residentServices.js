import { sendRequest } from '@/utils';
import { baseUrl } from './constants';

class ResidentService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  fetchResidents = async () => sendRequest(this.baseUrl, '/resident', 'GET');

  fetchMyResidents = async () => sendRequest(this.baseUrl, '/resident/my', 'GET');

  fetchResident = async (id) => sendRequest(this.baseUrl, `/resident/${id}`, 'GET');

  createResident = async (resident) => sendRequest(this.baseUrl, '/resident', 'POST', resident);

  updateResident = async (id, resident) => sendRequest(this.baseUrl, `/resident/${id}`, 'PUT', resident);
}

export default new ResidentService();
