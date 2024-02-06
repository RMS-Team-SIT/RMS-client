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
    
}

export default new MeterRecordService();
