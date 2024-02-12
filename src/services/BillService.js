import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class BillService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  create = async (residenceId, payload) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/bill`,
      'POST',
      payload
    );

  findAllByResidenceId = async (residenceId) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}/bill`, 'GET');

  findById = async (residenceId, billId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/bill/${billId}`,
      'GET'
    );
}

export default new BillService();
