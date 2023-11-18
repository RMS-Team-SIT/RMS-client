import { baseUrl } from './constants';

export const fetchResidents = async () => {
  let response = await fetch(`${baseUrl}/resident`, {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  });
  if (response.status === 200) {
    return await response.json();
  }
  return [];
};

export const fetchResident = async (id) => {
  let response = await fetch(`${baseUrl}/resident/${id}`, {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  });
  if (response.status === 200) {
    return await response.json();
  }
  return [];
};
