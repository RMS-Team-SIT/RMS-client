import { authHeader } from '@/utils';
import { baseUrl } from './constants';

export const signUp = async (data) => {
  let response = await fetch(`${baseUrl}/users/signup`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  });
  return response;
};

export const signIn = async (data) => {
  let response = await fetch(`${baseUrl}/auth/signin`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(data),
  });
  return response;
};

export const me = async () => {
  let response = await fetch(`${baseUrl}/users/me`, {
    headers: authHeader(),
  });
  return response;
};
