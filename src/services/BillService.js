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

  findBillRoom = async (residenceId, billId, billRoomId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/bill/${billId}/bill-room/${billRoomId}`,
      'GET'
    );

  updateBillRoomStatus = async (residenceId, billId, billRoomId, payload) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/bill/${billId}/bill-room/${billRoomId}`,
      'PUT',
      payload
    );
}

export default new BillService();
