import { sendRequest } from '@/utils/index.js';
import { baseUrl } from './constants.js';

class ResidentService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  // Resident
  fetchResidents = async () => sendRequest(this.baseUrl, '/resident', 'GET');

  fetchMyResidents = async () =>
    sendRequest(this.baseUrl, '/resident/my', 'GET');

  fetchResident = async (id) =>
    sendRequest(this.baseUrl, `/resident/${id}`, 'GET');

  createResident = async (resident) =>
    sendRequest(this.baseUrl, '/resident', 'POST', resident);

  updateResident = async (id, resident) =>
    sendRequest(this.baseUrl, `/resident/${id}`, 'PUT', resident);

  fetchAllRentalByResident = async (id) =>
    sendRequest(this.baseUrl, `/resident/${id}/rental`, 'GET');

  // Rental

  updateRentalByResidentIdAndRentalId = async (residentId, rentalId, rental) =>
    sendRequest(
      this.baseUrl,
      `/resident/${residentId}/rental/${rentalId}`,
      'PUT',
      rental
    );

  createRental = async (residentId, rental) =>
    sendRequest(this.baseUrl, `/resident/${residentId}/rental`, 'POST', rental);

  fetchOneRentalInResident = async (residentId, rentalId) =>
    sendRequest(
      this.baseUrl,
      `/resident/${residentId}/rental/${rentalId}`,
      'GET'
    );

  deleteRentalInResident = async (residentId, rentalId) =>
    sendRequest(
      this.baseUrl,
      `/resident/${residentId}/rental/${rentalId}`,
      'DELETE'
    );

  // room
  fetchAllRoomByResident = async (residentId) =>
    sendRequest(this.baseUrl, `/resident/${residentId}/room`, 'GET');

  fetchOneRoomInResident = async (residentId, roomId) =>
    sendRequest(this.baseUrl, `/resident/${residentId}/room/${roomId}`, 'GET');

  createRoom = async (residentId, room) =>
    sendRequest(this.baseUrl, `/resident/${residentId}/room`, 'POST', room);

  updateRoom = async (residentId, roomId, room) =>
    sendRequest(
      this.baseUrl,
      `/resident/${residentId}/room/${roomId}`,
      'PUT',
      room
    );

  deleteRoom = async (residentId, roomId) =>
    sendRequest(
      this.baseUrl,
      `/resident/${residentId}/room/${roomId}`,
      'DELETE'
    );
}

export default new ResidentService();
