import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost/identitiyhos/backend/api.php';
const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authHeaders = () => {
  const token = localStorage.getItem('identity-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const get = (path, auth = false) =>
  client.get(path, auth ? { headers: authHeaders() } : {});

export const post = (path, data, auth = false) =>
  client.post(path, data, auth ? { headers: authHeaders() } : {});

export const put = (path, data, auth = false) =>
  client.put(path, data, auth ? { headers: authHeaders() } : {});

export const del = (path, auth = false) =>
  client.delete(path, auth ? { headers: authHeaders() } : {});

export const login = (credentials) =>
  client.post('/login', credentials);
