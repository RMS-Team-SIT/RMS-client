export const fetchResidents = () => {
  return fetch(`${baseUrl}/residents`, {
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  });
};
