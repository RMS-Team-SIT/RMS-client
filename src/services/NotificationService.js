import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class NotificationService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  fetchNotifications = async () =>
    sendRequest(this.baseUrl, '/notification/my', 'GET');

  markAsRead = async (id) =>
    sendRequest(this.baseUrl, '/notification/read/' + id, 'GET');
}

export default new NotificationService();
