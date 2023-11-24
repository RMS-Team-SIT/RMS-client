import { sendRequest } from '@/utils/index';
import { baseUrl } from './constants';

class UserService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  signUp = async (data) => sendRequest(this.baseUrl, '/users/signup', 'POST', data);

  signIn = async (data) => sendRequest(this.baseUrl, '/auth/signin', 'POST', data);

  me = async () => sendRequest(this.baseUrl, '/users/me', 'GET');

  update = async (data) => sendRequest(this.baseUrl, '/users', 'PUT', data);
}

export default new UserService();
