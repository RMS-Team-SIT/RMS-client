import { sendRequest } from '@/utils/request.js';
import { baseGetFileUrl, baseUrl } from './constants.js';

class FileService {
  constructor() {
    this.baseUrl = baseUrl;
    this.baseGetUrl = baseGetFileUrl;
  }

  getFile = (fileName) => `${this.baseGetUrl}/${fileName}`;

  uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return await sendRequest(
      this.baseUrl,
      '/files/upload-image',
      'POST',
      formData,
      true
    );
  };

  uploadImages = async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return await sendRequest(
      this.baseUrl,
      '/files/upload-images',
      'POST',
      formData,
      true
    );
  };

  uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    return await sendRequest(
      this.baseUrl,
      '/files/upload-pdf',
      'POST',
      formData,
      true
    );
  };

  uploadPdfWatermark = async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    return await sendRequest(
      this.baseUrl,
      '/files/upload-pdf-watermark',
      'POST',
      formData,
      true
    );
  };

  uploadPdfs = async (file) => {
    const formData = new FormData();
    formData.append('pdfs', file);
    return await sendRequest(
      this.baseUrl,
      '/files/upload-pdfs',
      'POST',
      formData,
      true
    );
  };
}

export default new FileService();
