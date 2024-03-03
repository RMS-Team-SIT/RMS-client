import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class RoomTypeService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  fetchByResidence = async (residenceId) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}/room-type`, 'GET');

  fetchOneResidence = async (residenceId, roomId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room-type/${roomId}`,
      'GET'
    );

  create = async (residenceId, room) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room-type`,
      'POST',
      room
    );

  update = async (residenceId, id, data) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room-type/${id}`,
      'PUT',
      data
    );

  deleteRoom = async (residenceId, id) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room-type/${id}`,
      'DELETE'
    );
}

export default new RoomTypeService();
