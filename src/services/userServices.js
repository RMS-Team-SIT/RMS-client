export const baseUrl = 'http://localhost:3000/api';

export const signUp = (data) => {
  return fetch(`${baseUrl}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const signIn = (data) => {
  return fetch(`${baseUrl}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const me = (token) => {
  return fetch(`${baseUrl}/users/me`, {
    headers: {
      Authorization: token,
    },
  });
};
