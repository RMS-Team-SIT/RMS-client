import { authHeader } from '@/utils';
import { baseUrl } from './constants';

export const fetchResidents = async () => {
  let response = await fetch(`${baseUrl}/resident`, {
    headers: authHeader(),
  });
  return response;
};

export const fetchMyResidents = async () => {
  let response = await fetch(`${baseUrl}/resident/my`, {
    headers: authHeader(),
  });
  return response;
};

export const fetchResident = async (id) => {
  let response = await fetch(`${baseUrl}/resident/${id}`, {
    headers: authHeader(),
  });
  return response;
};

export const createResident = async (resident) => {
  let response = await fetch(`${baseUrl}/resident`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(resident),
  });
  return response;
};

export const updateResident = async (id, resident) => {
  let response = await fetch(`${baseUrl}/resident/${id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(resident),
  });
  return response;
};
