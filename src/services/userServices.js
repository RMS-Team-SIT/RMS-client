export const baseUrl = 'http://localhost:3000/api/v1';

export const signup = (data) => {
  return fetch(`${baseUrl}/user/signup`, {
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
  return fetch(`${baseUrl}/user/me`, {
    headers: {
      Authorization: token,
    },
  });
};
