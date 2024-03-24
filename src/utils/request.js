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
