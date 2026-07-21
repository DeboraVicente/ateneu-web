import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── REQUEST: attach token ─────────────────────────────────
api.interceptors.request.use(config => {
  const token = localStorage.getItem('ateneu_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── RESPONSE: refresh on 401 ─────────────────────────────
let refreshing = false;
let queue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (refreshing) {
        return new Promise(resolve => {
          queue.push(token => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      refreshing = true;
      try {
        const refreshToken = localStorage.getItem('ateneu_refresh');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        localStorage.setItem('ateneu_token', data.token);
        localStorage.setItem('ateneu_refresh', data.refreshToken);
        queue.forEach(cb => cb(data.token));
        queue = [];
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch {
        localStorage.removeItem('ateneu_token');
        localStorage.removeItem('ateneu_refresh');
        window.location.href = '/auth';
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
