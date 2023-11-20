import { baseUrl } from './constants';

export const fetchResidents = async () => {
  let response = await fetch(`${baseUrl}/resident`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  });
  return response;
};

export const fetchMyResidents = async () => {
  let response = await fetch(`${baseUrl}/resident/my`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  });
  return response;
};

export const fetchResident = async (id) => {
  let response = await fetch(`${baseUrl}/resident/${id}`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  });
  return response;
};

export const createResident = async (resident) => {
  let response = await fetch(`${baseUrl}/resident`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify(resident),
  });
  return response;
};
