import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class ResidenceService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  // Residence
  fetchResidences = async () => sendRequest(this.baseUrl, '/residence', 'GET');

  fetchMyResidences = async () =>
    sendRequest(this.baseUrl, '/residence/my', 'GET');

  fetchResidence = async (residenceId) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}`, 'GET');

  createResidence = async (residence) =>
    sendRequest(this.baseUrl, '/residence', 'POST', residence);

  updateResidence = async (id, residence) =>
    sendRequest(this.baseUrl, `/residence/${id}`, 'PUT', residence);

  fetchResidenceRenters = async (residenceId) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}/renter`, 'GET');

  // Renter

  updateRenter = async (residenceId, renterId, renter) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/renter/${renterId}`,
      'PUT',
      renter
    );

  createRenter = async (residenceId, renter) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/renter`,
      'POST',
      renter
    );

  fetchOneRenter = async (residenceId, renterId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/renter/${renterId}`,
      'GET'
    );

  reactiveRenter = async (residenceId, renterId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/renter/${renterId}/reactive`,
      'PUT'
    );

  deactiveRenter = async (residenceId, renterId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/renter/${renterId}`,
      'DELETE'
    );

  // room
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

  updateRoom = async (residenceId, roomId, room) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room/${roomId}`,
      'PUT',
      room
    );

  deleteRoom = async (residenceId, roomId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/room/${roomId}`,
      'DELETE'
    );
}

export default new ResidenceService();
