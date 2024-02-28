import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class NotificationService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  fetchNotifications = async () =>
    sendRequest(this.baseUrl, '/notification/my', 'GET');
}

export default new NotificationService();
