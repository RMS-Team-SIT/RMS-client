import { sendRequest } from '@/utils/index.js';
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
}

export default new UserService();
