import axios from 'axios';

// Use environment variable or production domain without the /api.php suffix
const baseURL = "https://server.identityphysiocare.in/api";

const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Ensure CORS works properly
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
  client.post('/login.php', credentials);

