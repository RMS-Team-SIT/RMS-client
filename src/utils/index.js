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

export const sendRequest = async (
  baseUrl,
  endpoint,
  method,
  data,
  useFormData = false
) => {
  const url = `${baseUrl}${endpoint}`;
  // note: headers are not needed for FormData
  const headers = !useFormData ? authHeader() : undefined;

  const body = data ? (!useFormData ? JSON.stringify(data) : data) : undefined;

  const response = await fetch(url, { method, headers, body });

  return response;
};
