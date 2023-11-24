import { sendRequest } from '@/utils/index';
import { baseUrl } from './constants';

class UserService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  signUp = async (data) => sendRequest(this.baseUrl, '/users/signup', 'POST', data);

  signIn = async (data) => sendRequest(this.baseUrl, '/auth/signin', 'POST', data);

  me = async () => sendRequest(this.baseUrl, '/users/me', 'GET');

  update = async (id, data) => sendRequest(this.baseUrl, `/users/${id}`, 'PUT', data);

  forgetPassword = async (data) => sendRequest(this.baseUrl, '/users/forget-password', 'POST', data);

  resetPassword = async (token, data) => sendRequest(this.baseUrl, `/users/reset-password/${token}`, 'POST', data);
}

export default new UserService();
