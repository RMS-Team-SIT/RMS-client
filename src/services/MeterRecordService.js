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
  
}

export default new MeterRecordService();
