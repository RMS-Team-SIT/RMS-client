import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class UserService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  signUp = async (data) => sendRequest(this.baseUrl, '/users/signup', 'POST', data);

  signIn = async (data) => sendRequest(this.baseUrl, '/auth/signin', 'POST', data);

  me = async () => sendRequest(this.baseUrl, '/users/me', 'GET');

  update = async (id, data) => sendRequest(this.baseUrl, `/users/${id}`, 'PUT', data);

  updatePassword = async (id, data) => sendRequest(this.baseUrl, `/users/${id}/update-password`, 'PUT', data);

  forgetPassword = async (data) => sendRequest(this.baseUrl, '/users/forget-password', 'POST', data);

  resetPassword = async (token, data) => sendRequest(this.baseUrl, `/users/reset-password/${token}`, 'POST', data);

  checkValidResetPasswordToken = async (token) => sendRequest(this.baseUrl, `/users/reset-password/${token}`, 'GET');

  verifyEmail = async (token) => sendRequest(this.baseUrl, `/users/verify-email/${token}`, 'POST');
  
  resendVerifyEmail = async (id) => sendRequest(this.baseUrl, `/users/resend-verify-email/${id}`, 'GET');

  acceptPolicy = async (id) => sendRequest(this.baseUrl, `/users/accept-policy/${id}`, 'GET');

  uploadIdCard = async (id, data) => sendRequest(this.baseUrl, `/users/${id}/upload-id-card`, 'POST', data);

  overAllStats = async () => sendRequest(this.baseUrl, `/users/overall-stats`, 'GET');

  pendingKYC = async () => sendRequest(this.baseUrl, `/users/pending-kyc`, 'GET');

  approveUser = async (id) => sendRequest(this.baseUrl, `/users/approve-kyc/${id}`, 'GET');
}

export default new UserService();
