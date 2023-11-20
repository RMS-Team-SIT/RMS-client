import { baseUrl } from './constants';

export const signUp = async (data) => {
  let response = await fetch(`${baseUrl}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const signIn = async (data) => {
  let response = await fetch(`${baseUrl}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const me = async () => {
  let response = await fetch(`${baseUrl}/auth/me`, {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  });
  return response;
};
