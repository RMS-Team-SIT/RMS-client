import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class PaymentService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  findAllPaymentInResidence = async (residenceId) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}/payment`, 'GET');

  // payment
  createPayment = async (residenceId, payment) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/payment`,
      'POST',
      payment
    );

  findOnePaymentInResidence = async (residenceId, paymentId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/payment/${paymentId}`,
      'GET'
    );

  updatePayment = async (residenceId, paymentId, payment) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/payment/${paymentId}`,
      'PUT',
      payment
    );
}

export default new PaymentService();
