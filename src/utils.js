export const isImage = (file) => file.type.startsWith('image/');

export const authHeader = () => {
  const token = localStorage.getItem('token');
  let headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = 'Bearer ' + token;
  }
  return headers;
};
