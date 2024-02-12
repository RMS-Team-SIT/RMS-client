import { sendRequest } from '@/utils/request.js';
import { baseUrl } from './constants.js';

class MeterRecordService {
  constructor() {
    this.baseUrl = baseUrl;
  }

  create = async (residenceId, meterRecord) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/meter-record`,
      'POST',
      meterRecord
    );

  findAllByResidenceId = async (residenceId) =>
    sendRequest(this.baseUrl, `/residence/${residenceId}/meter-record`, 'GET');

  findById = async (residenceId, meterRecordId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/meter-record/${meterRecordId}`,
      'GET'
    );

  findLatest = async (residenceId) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/meter-record/latest`,
      'GET'
    );

  update = async (residenceId, meterRecordId, meterRecord) =>
    sendRequest(
      this.baseUrl,
      `/residence/${residenceId}/meter-record/${meterRecordId}`,
      'PUT',
      meterRecord
    );
}

export default new MeterRecordService();
