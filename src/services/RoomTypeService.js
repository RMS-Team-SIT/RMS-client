import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class RoomTypeService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  fetchByResidence = async (residenceId) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}/room-type`, 'GET');

  fetchOneResidence = async (residenceId, roomTypeId) =>
    sendRequest(
      this.baseUrl,
      `/room-type/${roomTypeId}`,
      'GET'
    );

  create = async (residenceId, room) =>
    sendRequest(
      this.baseUrl,
      `/room-type`,
      'POST',
      room
    );

  update = async (residenceId, id, data) =>
    sendRequest(
      this.baseUrl,
      `/room-type/${id}`,
      'PUT',
      data
    );

  deleteRoom = async (residenceId, id) =>
    sendRequest(
      this.baseUrl,
      `/room-type/${id}`,
      'DELETE'
    );
}

export default new RoomTypeService();
