import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class RoomService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  fetchAllRoomByResidence = async (residenceId) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}/room`, 'GET');

  fetchOneRoomInResidence = async (residenceId, roomId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room/${roomId}`,
      'GET'
    );

  createRoom = async (residenceId, room) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}/room`, 'POST', room);

  createManyRoom = async (residenceId, rooms) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room/many`,
      'POST',
      rooms
    );

  updateRoom = async (residenceId, roomId, room) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room/${roomId}`,
      'PUT',
      room
    );

  updateRoomDetail = async (residenceId, roomId, room) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room/${roomId}/detail`,
      'PUT',
      room
    );

  updateRoomRenter = async (residenceId, roomId, room) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room/${roomId}/renter`,
      'PUT',
      room
    );

  deleteRoomRenter = async (residenceId, roomId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room/${roomId}/renter`,
      'DELETE'
    );

  deleteRoom = async (residenceId, roomId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room/${roomId}`,
      'DELETE'
    );
}

export default new RoomService();
