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

export const getDate = (str) => {
  const originalDate = new Date(str);

  const day = originalDate.getDate().toString().padStart(2, '0');
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
  const year = originalDate.getFullYear();

  return `${day}/${month}/${year}`;
};
