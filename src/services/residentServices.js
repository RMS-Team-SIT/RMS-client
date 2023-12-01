import { sendRequest } from '@/utils';
import { baseUrl } from './constants';

class ResidentService {
  constructor() {
    this.baseUrl = baseUrl;
  }

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
}

export default new ResidentService();
