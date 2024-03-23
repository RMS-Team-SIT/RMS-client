import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class FeeService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  fetchFees = async (residenceId) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}/fees`, 'GET');

  fetchFee = async (residenceId, feeId) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}/fees/${feeId}`, 'GET');

  update = async (residenceId, feeId, fee) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/fees/${feeId}`,
      'PUT',
      fee
    );

  create = async (residenceId, fee) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}/fees`, 'POST', fee);

  createMany = async (residenceId, fees) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/fees/bulk`,
      'POST',
      fees
    );

  delete = async (residenceId, feeId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/fees/${feeId}`,
      'DELETE'
    );
}

export default new FeeService();
